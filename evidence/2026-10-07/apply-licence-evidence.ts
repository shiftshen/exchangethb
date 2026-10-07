/**
 * One-off: write the current BOT money-changer licence evidence for the three public cash providers.
 * Approved: fujane 2026-10-07 11:04 ("③licence 写入：写（证据条目，有快照即可；写完公网回读截图进 evidence）").
 * Rollback: restore /opt/exchangethb/runtime/backups/admin-config-state-20261007-1000.json into
 * AdminConfigState (key='global') - returns all three licences to unknown.
 * Only touches evidence[<slug>].license; every other config field is passed through untouched.
 */
import { readAdminConfig, writeAdminConfig } from '@/lib/content-store';

const sourceUrl = 'https://www.bot.or.th/th/our-roles/financial-markets/foreign-exchange-regulations/foreign-exchange-business/money-changer.html';
const checkedAt = '2026-10-07T03:50:00.000Z';
const expiresAt = '2026-11-21T03:50:00.000Z';

const notes: Record<string, string> = {
  'ratchada':
    'BOT authorized money changer list as of 31 Aug 2026 (published 23/9/2026), entry 172: licence MC125490056, Ratchada Exchange Co., Ltd., head office 78/13 Pracharat Bamphen Rd, Huai Khwang, Bangkok - identical to this site\'s Ratchada Exchange address. Head-office list only; branch licences are not itemised in this document.',
  'twelve-victory':
    'BOT list as of 31 Aug 2026 (published 23/9/2026), entry 60: licence 125470175, Twelve Victory Exchange Co., Ltd., head office 231 Pradipat Rd, Phaya Thai, Bangkok 10400 - identical to this site\'s Twelve Victory Pradipat address. The same brand also holds MC125500012 and numbered branch licences.',
  'superrich-thailand':
    'BOT list as of 31 Aug 2026 (published 23/9/2026), entry 54: licence 125470152, SuperRich (Thailand) Co., Ltd., head office 45-45/1-2 Soi Ratchadamri 1, Lumphini, Pathum Wan, Bangkok 10330 - matches the Ratchadamri operation this site prices. Entity-level match: the site branch card is a Pratunam-area reference, not a fixed address.',
};

async function main() {
  const before = await readAdminConfig();
  console.log('BEFORE ' + JSON.stringify(before.evidence));
  const evidence = { ...before.evidence };
  for (const slug of Object.keys(notes)) {
    evidence[slug] = {
      ...(evidence[slug] || {}),
      license: { status: 'verified' as const, sourceUrl, checkedAt, expiresAt, note: notes[slug] },
    };
  }
  if (process.argv.includes('--dry-run')) {
    console.log('DRY_RUN would write ' + JSON.stringify(Object.keys(notes)));
    return;
  }
  await writeAdminConfig({ ...before, evidence });
  const after = await readAdminConfig();
  console.log('AFTER ' + JSON.stringify(after.evidence));
  for (const slug of Object.keys(notes)) {
    const entry = after.evidence?.[slug]?.license;
    console.log(`CHECK ${slug} status=${entry?.status} checkedAt=${entry?.checkedAt} expiresAt=${entry?.expiresAt} noteLen=${entry?.note?.length}`);
  }
}

main().catch((error) => { console.error('FAILED ' + (error instanceof Error ? error.message : String(error))); process.exit(1); });
