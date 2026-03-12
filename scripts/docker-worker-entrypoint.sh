#!/bin/sh
set -eu

npx prisma generate

if [ "${PRISMA_PUSH_ON_BOOT:-1}" = "1" ]; then
  npx prisma db push
fi

npm run worker:daemon
