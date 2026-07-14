#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FIXTURE_DIR="$(mktemp -d)"
trap 'rm -rf "${FIXTURE_DIR}"' EXIT

mkdir -p "${FIXTURE_DIR}/bin" "${FIXTURE_DIR}/project/scripts" "${FIXTURE_DIR}/state"
cp "${ROOT_DIR}/scripts/release-web-canary.sh" "${FIXTURE_DIR}/project/scripts/"
touch "${FIXTURE_DIR}/project/.env"

cat > "${FIXTURE_DIR}/project/scripts/check-prod-health.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${FAIL_PUBLIC:-0}" == "1" && "$1" == https://* ]]; then
  exit 1
fi
EOF

cat > "${FIXTURE_DIR}/project/scripts/check-seo-cluster.mjs" <<'EOF'
// The node executable is mocked by this test.
EOF

cat > "${FIXTURE_DIR}/bin/node" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${FAIL_PUBLIC:-0}" == "1" && "${2:-}" == https://* ]]; then
  exit 1
fi
EOF

cat > "${FIXTURE_DIR}/bin/docker" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

state_dir="${MOCK_DOCKER_STATE:?}"
command="${1:-}"
shift || true

service_from_args() {
  local service=""
  for arg in "$@"; do
    case "${arg}" in
      web|web_canary|worker|postgres)
        service="${arg}"
        ;;
    esac
  done
  printf '%s' "${service}"
}

case "${command}" in
  compose)
    subcommand="${1:-}"
    shift || true
    case "${subcommand}" in
      config|build)
        exit 0
        ;;
      ps)
        [[ "${1:-}" == "-q" ]] && shift
        printf '%s-container\n' "${1}"
        ;;
      up)
        service="$(service_from_args "$@")"
        if [[ "${service}" == "web" ]]; then
          cp "${state_dir}/web_tag_image" "${state_dir}/web_container_image"
        fi
        ;;
      *)
        printf 'unexpected docker compose command: %s\n' "${subcommand}" >&2
        exit 2
        ;;
    esac
    ;;
  inspect)
    format=""
    if [[ "${1:-}" == "--format" ]]; then
      format="$2"
      shift 2
    fi
    container="${1:-}"
    case "${format}:${container}" in
      *State.Health*:postgres-container|*State.Health*:web_canary-container|*State.Health*:web-container)
        printf 'healthy\n'
        ;;
      *Config.Image*:web-container)
        printf 'exchangethb-web:latest\n'
        ;;
      *Image*:web_canary-container)
        printf 'sha256:canary\n'
        ;;
      *Image*:web-container)
        cat "${state_dir}/web_container_image"
        ;;
      *)
        printf 'unexpected docker inspect: %s %s\n' "${format}" "${container}" >&2
        exit 2
        ;;
    esac
    ;;
  image)
    [[ "${1:-}" == "tag" ]] || exit 2
    source_image="$2"
    target_image="$3"
    if [[ "${target_image}" == "exchangethb-web:latest" ]]; then
      printf '%s\n' "${source_image}" > "${state_dir}/web_tag_image"
    fi
    ;;
  logs)
    exit 0
    ;;
  *)
    printf 'unexpected docker command: %s\n' "${command}" >&2
    exit 2
    ;;
esac
EOF

chmod +x \
  "${FIXTURE_DIR}/bin/docker" \
  "${FIXTURE_DIR}/bin/node" \
  "${FIXTURE_DIR}/project/scripts/check-prod-health.sh" \
  "${FIXTURE_DIR}/project/scripts/release-web-canary.sh"

export PATH="${FIXTURE_DIR}/bin:${PATH}"
export MOCK_DOCKER_STATE="${FIXTURE_DIR}/state"

reset_state() {
  printf 'sha256:old\n' > "${MOCK_DOCKER_STATE}/web_container_image"
  printf 'sha256:old\n' > "${MOCK_DOCKER_STATE}/web_tag_image"
}

reset_state
"${FIXTURE_DIR}/project/scripts/release-web-canary.sh" --skip-build >/dev/null
[[ "$(cat "${MOCK_DOCKER_STATE}/web_container_image")" == "sha256:old" ]]

reset_state
"${FIXTURE_DIR}/project/scripts/release-web-canary.sh" --skip-build --promote >/dev/null
[[ "$(cat "${MOCK_DOCKER_STATE}/web_container_image")" == "sha256:canary" ]]

reset_state
if FAIL_PUBLIC=1 "${FIXTURE_DIR}/project/scripts/release-web-canary.sh" --skip-build --promote >/dev/null 2>&1; then
  printf 'expected failed public validation to trigger rollback\n' >&2
  exit 1
fi
[[ "$(cat "${MOCK_DOCKER_STATE}/web_container_image")" == "sha256:old" ]]

printf 'release-web-canary tests passed\n'
