#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

BASE_URL="https://www.exchangethb.com"
MAX_TIME="${MAX_TIME:-15}"
WAIT_TIMEOUT="${WAIT_TIMEOUT:-300}"
WAIT_INTERVAL="${WAIT_INTERVAL:-5}"
DO_BUILD=1
RESTART_MODE=0

usage() {
  cat <<'EOF'
Usage: deploy-prod.sh [--no-build] [--restart] [base_url]

Options:
  --no-build   Skip docker image builds and reuse current images.
  --restart    Restart each service in place instead of recreating it.
  -h, --help   Show this help message.
EOF
}

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$*"
}

container_for_service() {
  docker compose ps -q "$1" | head -n 1
}

wait_for_service_health() {
  local service="$1"
  local deadline
  deadline=$(( $(date +%s) + WAIT_TIMEOUT ))

  while true; do
    local container_id=""
    local status=""

    container_id="$(container_for_service "${service}")"
    if [[ -n "${container_id}" ]]; then
      status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_id}" 2>/dev/null || true)"
      if [[ "${status}" == "healthy" || "${status}" == "running" ]]; then
        log "${service} is ${status}"
        return 0
      fi
    fi

    if (( $(date +%s) >= deadline )); then
      log "Timed out waiting for ${service} to become healthy"
      if [[ -n "${container_id}" ]]; then
        docker inspect "${container_id}" --format '{{json .State.Health}}' || true
      fi
      return 1
    fi

    sleep "${WAIT_INTERVAL}"
  done
}

refresh_service() {
  local service="$1"

  if (( RESTART_MODE )); then
    log "Restarting ${service}"
    docker compose restart "${service}"
  else
    log "Refreshing ${service}"
    docker compose up -d --no-deps "${service}"
  fi

  wait_for_service_health "${service}"
}

while (( $# > 0 )); do
  case "$1" in
    --no-build)
      DO_BUILD=0
      ;;
    --restart)
      RESTART_MODE=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      BASE_URL="$1"
      ;;
  esac
  shift
done

cd "${PROJECT_DIR}"

if (( DO_BUILD )); then
  log "Building web, web_canary, and worker images"
  docker compose build web web_canary worker
fi

refresh_service web
refresh_service web_canary
refresh_service worker

log "Running production health checks against ${BASE_URL}"
MAX_TIME="${MAX_TIME}" "${SCRIPT_DIR}/check-prod-health.sh" "${BASE_URL}"
