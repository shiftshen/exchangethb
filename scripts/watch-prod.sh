#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-https://www.exchangethb.com}"
LOG_FILE="${LOG_FILE:-/opt/exchangethb/prod-watch.log}"
MAX_TIME="${MAX_TIME:-15}"

health_url="${BASE_URL}/api/health"

if curl -fsS -L --max-time "${MAX_TIME}" "${health_url}" >/dev/null; then
  exit 0
fi

timestamp="$(date '+%Y-%m-%dT%H:%M:%S%z')"
echo "[${timestamp}] health check failed for ${health_url}; restarting web/worker" >> "${LOG_FILE}"

cd /opt/exchangethb
docker compose up -d web worker >> "${LOG_FILE}" 2>&1 || true
