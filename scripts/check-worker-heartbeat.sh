#!/bin/sh
set -eu

HEARTBEAT_PATH="${WORKER_HEARTBEAT_PATH:-/tmp/exchangethb-worker-heartbeat.json}"
MAX_STALE_SECONDS="${WORKER_HEARTBEAT_MAX_STALE_SECONDS:-1200}"

[ -f "$HEARTBEAT_PATH" ] || exit 1

node -e '
const fs = require("node:fs");
const path = process.argv[1];
const maxStaleSeconds = Number(process.argv[2]);
const payload = JSON.parse(fs.readFileSync(path, "utf8"));
const updatedAt = Date.parse(payload.updatedAt || "");
if (!Number.isFinite(updatedAt)) process.exit(1);
const ageSeconds = Math.floor((Date.now() - updatedAt) / 1000);
if (ageSeconds > maxStaleSeconds) process.exit(1);
' "$HEARTBEAT_PATH" "$MAX_STALE_SECONDS"
