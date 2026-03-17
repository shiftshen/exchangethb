#!/bin/sh
set -eu

if [ "${PRISMA_PUSH_ON_BOOT:-0}" = "1" ]; then
  npx prisma db push
fi

npm run worker:daemon
