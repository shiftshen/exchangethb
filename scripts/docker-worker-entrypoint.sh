#!/bin/sh
set -eu

# prisma CLI is not installed in the slim runtime; schema pushes are a separate job.
if [ "${PRISMA_PUSH_ON_BOOT:-0}" = "1" ]; then
  echo "PRISMA_PUSH_ON_BOOT=1 is not supported by the slim worker image." >&2
  echo "Run 'prisma db push' from a one-off container instead." >&2
  exit 1
fi

# The worker TypeScript graph is bundled to worker-dist/index.js at image build.
exec env WORKER_LOOP=1 node worker-dist/index.js
