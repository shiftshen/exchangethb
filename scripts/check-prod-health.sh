#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-https://www.exchangethb.com}"
MAX_TIME="${MAX_TIME:-15}"

endpoints=(
  "/|200|"
  "/en|308|/"
  "/robots.txt|200|"
  "/sitemap.xml|200|"
  "/api/health|200|"
)

failures=0

echo "Checking production health for ${BASE_URL}"

for endpoint in "${endpoints[@]}"; do
  IFS='|' read -r path expected_code expected_location <<< "${endpoint}"
  url="${BASE_URL}${path}"
  result="$(curl --max-time "${MAX_TIME}" -s -o /tmp/exchangethb-health.out -D /tmp/exchangethb-health.headers -w '%{http_code} %{time_starttransfer} %{time_total}' "${url}" || true)"
  code="$(printf '%s' "${result}" | awk '{print $1}')"
  ttfb="$(printf '%s' "${result}" | awk '{print $2}')"
  total="$(printf '%s' "${result}" | awk '{print $3}')"
  location="$(awk 'BEGIN{IGNORECASE=1} /^location:/ {gsub(/\r/, "", $2); print $2}' /tmp/exchangethb-health.headers | tail -n 1)"

  if [[ "${code}" != "${expected_code}" ]]; then
    echo "FAIL ${path} code=${code:-000} expected=${expected_code} ttfb=${ttfb:-n/a}s total=${total:-n/a}s"
    failures=$((failures + 1))
    continue
  fi

  if [[ -n "${expected_location}" && "${location}" != "${expected_location}" ]]; then
    echo "FAIL ${path} code=${code} location=${location:-n/a} expected_location=${expected_location}"
    failures=$((failures + 1))
    continue
  fi

  if [[ -n "${expected_location}" ]]; then
    echo "OK   ${path} code=${code} location=${location} ttfb=${ttfb}s total=${total}s"
    continue
  fi

  echo "OK   ${path} code=${code} ttfb=${ttfb}s total=${total}s"
done

if (( failures > 0 )); then
  echo "Production health check failed: ${failures} endpoint(s) unhealthy."
  exit 1
fi

echo "Production health check passed."
