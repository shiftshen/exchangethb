#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-https://www.exchangethb.com}"
MAX_TIME="${MAX_TIME:-15}"

endpoints=(
  "/"
  "/en"
  "/robots.txt"
  "/sitemap.xml"
  "/api/health"
)

failures=0

echo "Checking production health for ${BASE_URL}"

for path in "${endpoints[@]}"; do
  url="${BASE_URL}${path}"
  result="$(curl -L --max-time "${MAX_TIME}" -s -o /tmp/exchangethb-health.out -w '%{http_code} %{time_starttransfer} %{time_total}' "${url}" || true)"
  code="$(printf '%s' "${result}" | awk '{print $1}')"
  ttfb="$(printf '%s' "${result}" | awk '{print $2}')"
  total="$(printf '%s' "${result}" | awk '{print $3}')"

  if [[ "${code}" != "200" ]]; then
    echo "FAIL ${path} code=${code:-000} ttfb=${ttfb:-n/a}s total=${total:-n/a}s"
    failures=$((failures + 1))
    continue
  fi

  echo "OK   ${path} code=${code} ttfb=${ttfb}s total=${total}s"
done

if (( failures > 0 )); then
  echo "Production health check failed: ${failures} endpoint(s) unhealthy."
  exit 1
fi

echo "Production health check passed."
