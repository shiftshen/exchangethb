/**
 * exchangethb worker watchdog (fujane 2026-10-07 要求).
 *
 * 为什么存在：2026-10-07 03:30-03:56 宿主磁盘写满，worker 03:51:33 以 ENOSPC 退出后没人发现，
 * 停机 5 小时 10 分；且 `docker ps` 与 `docker inspect` 状态会不一致（退出事件未落盘），
 * 所以判据必须取 inspect 的 State.Running + 容器内心跳文件的新鲜度，不能只看 docker ps。
 *
 * 行为：worker 退出超过 GRACE_MIN（默认 5）分钟仍未拉起，或心跳超过 STALE_MIN（默认 25）分钟没更新，
 * 就往 fujane 收件箱（/Users/shift/LocalEnv/logs/supervisor/for-fujane.md）写一条；恢复后清状态，
 * 下一次故障会再报。同一故障 REALERT_HOURS（默认 6）小时内不重复。
 *
 * 只读：不重启、不改配置、不切版本。手动跑 `npm run health:worker`。
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const HOST = process.env.WORKER_WATCH_HOST || '1panel-happy';
const CONTAINER = process.env.WORKER_WATCH_CONTAINER || 'exchangethb-worker-1';
const GRACE_MIN = Number(process.env.GRACE_MIN || 5);
const STALE_MIN = Number(process.env.STALE_MIN || 25);
const REALERT_HOURS = Number(process.env.REALERT_HOURS || 6);

const STATE_DIR = path.join(os.homedir(), 'Library', 'Logs', 'ExchangeTHB');
const STATE = path.join(STATE_DIR, 'worker-watch.state.json');
const LAST_OK = path.join(STATE_DIR, 'worker-watch.lastok');
const LOG = path.join(STATE_DIR, 'worker-watch.log');
const INBOX_TOOL = '/Users/shift/LocalEnv/bin/fujane-inbox.py';

fs.mkdirSync(STATE_DIR, { recursive: true });
const log = (message: string) => fs.appendFileSync(LOG, `${new Date().toISOString()} ${message}\n`);
const readNumber = (file: string) => {
  try { return Number(fs.readFileSync(file, 'utf8').trim()) || 0; } catch { return 0; }
};

function remoteProbe(): { running: string; started: string; finished: string; heartbeatUpdatedAt: string | null } | null {
  // 远端命令一律以 0 退出：容器不存在/已停止要被判成「故障」，不能被当成「连不上宿主」而静默跳过。
  // ssh 本身失败（exit 255）仍会抛错，那才是真的连不上。
  const remote = [
    `docker inspect -f '{{.State.Running}}|{{.State.StartedAt}}|{{.State.FinishedAt}}' ${CONTAINER} 2>/dev/null || echo MISSING`,
    `docker exec ${CONTAINER} sh -c 'cat /tmp/exchangethb-worker-heartbeat.json 2>/dev/null' 2>/dev/null || true`,
  ].join('; ');
  try {
    const out = execFileSync('ssh', ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', HOST, remote],
      { encoding: 'utf8', timeout: 40_000 });
    const lines = out.split('\n').filter(Boolean);
    if (!lines.length) return { running: 'MISSING', started: '', finished: '', heartbeatUpdatedAt: null };
    const [running, started, finished] = lines[0].split('|');
    let heartbeatUpdatedAt: string | null = null;
    for (const line of lines.slice(1)) {
      try { heartbeatUpdatedAt = JSON.parse(line).updatedAt ?? null; } catch { /* keep looking */ }
    }
    return { running: running || 'MISSING', started: started ?? '', finished: finished ?? '', heartbeatUpdatedAt };
  } catch (error) {
    log(`WARN cannot reach ${HOST}: ${error instanceof Error ? error.message : 'unknown'}`);
    return null;
  }
}

const probe = remoteProbe();
if (!probe) process.exit(0);

type WatchState = { alerted_at?: number; first_seen_down?: number; reason?: string };
const readState = (): WatchState => { try { return JSON.parse(fs.readFileSync(STATE, 'utf8')) as WatchState; } catch { return {}; } };
const writeState = (state: WatchState) => fs.writeFileSync(STATE, JSON.stringify(state));

const now = Date.now();
const heartbeatMs = probe.heartbeatUpdatedAt ? Date.parse(probe.heartbeatUpdatedAt) : 0;
const state = readState();
let downSinceMs = 0;
let reason = '';

if (probe.running !== 'true') {
  reason = `container not running (State.Running=${probe.running}, FinishedAt=${probe.finished})`;
  const finishedMs = probe.finished && !probe.finished.startsWith('0001-01-01') ? Date.parse(probe.finished) : 0;
  // 容器被删掉时没有 FinishedAt：用首次发现故障的时间，否则每轮 (now - now) 永远到不了宽限期
  downSinceMs = finishedMs > 0 ? finishedMs : (state.first_seen_down || now);
  state.first_seen_down = downSinceMs;
  state.reason = reason;
  writeState(state);
} else if (heartbeatMs > 0 && now - heartbeatMs > STALE_MIN * 60_000) {
  reason = `container running but heartbeat stale for ${Math.round((now - heartbeatMs) / 60_000)} min`;
  downSinceMs = heartbeatMs + STALE_MIN * 60_000;
}

if (!reason) {
  if (fs.existsSync(STATE)) {
    fs.rmSync(STATE);
    log('RECOVERED worker healthy again; clearing alert state');
  }
  if (now - readNumber(LAST_OK) >= 3_600_000) {
    const hb = heartbeatMs > 0 ? `heartbeat ${Math.round((now - heartbeatMs) / 60_000)} min old` : 'no heartbeat file yet';
    log(`OK worker running, ${hb}`);
    fs.writeFileSync(LAST_OK, String(now));
  }
  process.exit(0);
}

const downMin = Math.floor((now - downSinceMs) / 60_000);
if (downMin < GRACE_MIN) {
  log(`down ${downMin} min (< grace ${GRACE_MIN}); not alerting yet: ${reason}`);
  process.exit(0);
}

const lastAlert = state.alerted_at || 0;
if (now - lastAlert < REALERT_HOURS * 3_600_000) {
  log(`down ${downMin} min but already alerted ${Math.round((now - lastAlert) / 60_000)} min ago; staying quiet`);
  process.exit(0);
}

state.alerted_at = now;
state.reason = reason;
writeState(state);
if (process.env.WORKER_WATCH_DRY_RUN === '1') {
  log(`DRY_RUN would alert after ${downMin} min: ${reason} (container=${CONTAINER})`);
  process.exit(0);
}
const body = [
  `exchangethb worker 故障：${reason}`,
  `已停机约 ${downMin} 分钟（探测周期 5 分钟，宽限 ${GRACE_MIN} 分钟，心跳过期阈值 ${STALE_MIN} 分钟）。`,
  '历史同类事件：2026-10-07 03:30-03:56 宿主磁盘写满，worker 03:51:33 ENOSPC 退出后未拉起，停机 5h10m。',
  `排查：ssh ${HOST} "docker inspect -f '{{.State.Status}} {{.State.FinishedAt}}' ${CONTAINER}; docker logs --tail 20 ${CONTAINER}"`,
  '恢复属生产变更，需 fujane/老板批准：cd /opt/exchangethb && docker compose -f docker-compose.yml -f compose.release-20261007c.yml up -d --force-recreate --no-build worker',
  `证据：evidence/2026-10-07/worker-outage-host-disk-20261007.json；日志 ${LOG}`,
].join('\n');
try {
  execFileSync(INBOX_TOOL, ['exchangethb worker 停机告警', body], { timeout: 30_000 });
  log(`ALERTED after ${downMin} min: ${reason}`);
} catch (error) {
  log(`ERROR fujane-inbox write failed: ${error instanceof Error ? error.message : 'unknown'}`);
}
process.exit(0);
