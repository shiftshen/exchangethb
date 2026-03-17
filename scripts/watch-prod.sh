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
echo "[${timestamp}] health check failed for ${health_url}; starting sequential service recovery" >> "${LOG_FILE}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"${SCRIPT_DIR}/deploy-prod.sh" --no-build --restart "${BASE_URL}" >> "${LOG_FILE}" 2>&1 || true
