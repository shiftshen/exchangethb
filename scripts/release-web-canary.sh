#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

BASE_URL="${BASE_URL:-https://www.exchangethb.com}"
CANARY_URL="${CANARY_URL:-http://172.30.0.13:3000}"
WAIT_TIMEOUT="${WAIT_TIMEOUT:-300}"
WAIT_INTERVAL="${WAIT_INTERVAL:-5}"
ROLLBACK_REPOSITORY="${ROLLBACK_REPOSITORY:-exchangethb-web}"
DO_BUILD=1
PROMOTE=0
PROMOTION_STARTED=0
OLD_WEB_IMAGE_ID=""
WEB_IMAGE_NAME=""
ROLLBACK_TAG=""

usage() {
  cat <<'EOF'
Usage: release-web-canary.sh [--skip-build] [--promote] [base_url]

Builds and validates web_canary first. Production promotion only happens when
--promote is provided. PostgreSQL and worker are never restarted.

Options:
  --skip-build  Reuse the current web_canary image.
  --promote     Promote the exact validated canary image to web.
  -h, --help    Show this help message.

Environment:
  CANARY_URL          Internal canary URL (default: http://172.30.0.13:3000)
  WAIT_TIMEOUT        Health wait timeout in seconds (default: 300)
  WAIT_INTERVAL       Health polling interval in seconds (default: 5)
  ROLLBACK_REPOSITORY Repository used for timestamped rollback tags.
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
  local deadline=$(( $(date +%s) + WAIT_TIMEOUT ))

  while true; do
    local container_id=""
    local status=""

    container_id="$(container_for_service "${service}")"
    if [[ -n "${container_id}" ]]; then
      status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_id}" 2>/dev/null || true)"
      if [[ "${status}" == "healthy" ]]; then
        log "${service} is healthy"
        return 0
      fi
    fi

    if (( $(date +%s) >= deadline )); then
      log "Timed out waiting for ${service}; last status=${status:-missing}"
      if [[ -n "${container_id}" ]]; then
        docker inspect "${container_id}" --format '{{json .State.Health}}' || true
        docker logs --tail 100 "${container_id}" || true
      fi
      return 1
    fi

    sleep "${WAIT_INTERVAL}"
  done
}

assert_service_image() {
  local service="$1"
  local expected_image_id="$2"
  local container_id
  local actual_image_id

  container_id="$(container_for_service "${service}")"
  actual_image_id="$(docker inspect --format '{{.Image}}' "${container_id}" 2>/dev/null || true)"
  if [[ "${actual_image_id}" != "${expected_image_id}" ]]; then
    log "${service} image mismatch: actual=${actual_image_id:-missing} expected=${expected_image_id}"
    return 1
  fi

  log "${service} is running the validated image ${expected_image_id}"
}

validate_url() {
  local url="$1"
  log "Running health checks against ${url}"
  "${SCRIPT_DIR}/check-prod-health.sh" "${url}"

  log "Running SEO cluster checks against ${url}"
  node "${SCRIPT_DIR}/check-seo-cluster.mjs" "${url}"
}

rollback_production() {
  local exit_code=$?
  trap - ERR

  if (( PROMOTION_STARTED )) && [[ -n "${OLD_WEB_IMAGE_ID}" && -n "${WEB_IMAGE_NAME}" ]]; then
    log "Promotion failed; restoring ${WEB_IMAGE_NAME} from ${OLD_WEB_IMAGE_ID}"
    docker image tag "${OLD_WEB_IMAGE_ID}" "${WEB_IMAGE_NAME}" || true
    docker compose up -d --no-deps --no-build --force-recreate web || true
    wait_for_service_health web || true
    log "Automatic rollback attempted. Preserved rollback tag: ${ROLLBACK_TAG:-not-created}"
  fi

  exit "${exit_code}"
}

while (( $# > 0 )); do
  case "$1" in
    --skip-build)
      DO_BUILD=0
      ;;
    --promote)
      PROMOTE=1
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
trap rollback_production ERR

[[ -f .env ]] || {
  log "Missing production .env in ${PROJECT_DIR}"
  exit 1
}

docker compose config >/dev/null

postgres_container="$(container_for_service postgres)"
postgres_status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${postgres_container}" 2>/dev/null || true)"
if [[ "${postgres_status}" != "healthy" ]]; then
  log "PostgreSQL is not healthy; refusing web release (status=${postgres_status:-missing})"
  exit 1
fi

if (( DO_BUILD )); then
  log "Building web_canary only"
  docker compose build web_canary
fi

log "Starting web_canary without touching web, worker, or postgres"
docker compose up -d --no-deps --no-build web_canary
wait_for_service_health web_canary
validate_url "${CANARY_URL}"

canary_container="$(container_for_service web_canary)"
canary_image_id="$(docker inspect --format '{{.Image}}' "${canary_container}")"
log "Validated canary image: ${canary_image_id}"

if (( ! PROMOTE )); then
  log "Canary validation passed. Re-run with --skip-build --promote to promote this image."
  exit 0
fi

web_container="$(container_for_service web)"
[[ -n "${web_container}" ]] || {
  log "Production web container is missing; refusing promotion"
  exit 1
}

OLD_WEB_IMAGE_ID="$(docker inspect --format '{{.Image}}' "${web_container}")"
WEB_IMAGE_NAME="$(docker inspect --format '{{.Config.Image}}' "${web_container}")"
release_id="$(date '+%Y%m%d-%H%M%S')"
ROLLBACK_TAG="${ROLLBACK_REPOSITORY}:rollback-${release_id}"

log "Saving current production image ${OLD_WEB_IMAGE_ID} as ${ROLLBACK_TAG}"
docker image tag "${OLD_WEB_IMAGE_ID}" "${ROLLBACK_TAG}"

log "Promoting exact canary image ${canary_image_id} to ${WEB_IMAGE_NAME}"
PROMOTION_STARTED=1
docker image tag "${canary_image_id}" "${WEB_IMAGE_NAME}"
docker compose up -d --no-deps --no-build --force-recreate web
wait_for_service_health web
assert_service_image web "${canary_image_id}"
validate_url "${BASE_URL}"
PROMOTION_STARTED=0

log "Production promotion passed"
log "Rollback image: ${ROLLBACK_TAG}"
log "Manual rollback: docker image tag ${ROLLBACK_TAG} ${WEB_IMAGE_NAME} && docker compose up -d --no-deps --no-build --force-recreate web"
