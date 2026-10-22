#!/bin/sh
set -eu

# The slim image ships only the Next.js standalone runtime, so the Prisma CLI is
# not available here. Schema pushes must run as an explicit one-off job.
if [ "${PRISMA_PUSH_ON_BOOT:-0}" = "1" ]; then
  echo "PRISMA_PUSH_ON_BOOT=1 is not supported by the standalone image." >&2
  echo "Run 'prisma db push' from a one-off container instead." >&2
  exit 1
fi

exec node server.js
