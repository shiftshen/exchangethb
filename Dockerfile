# syntax=docker/dockerfile:1
# exchangethb clean multi-stage build (2026-10-22).
#
# History: releases up to v0.1.25 were built by layering `npm run build` on top of
# the previous release image ("overlay build"). That added one ~145MB layer per
# release and grew the image to 7.1GB / 127 layers, one layer short of Docker's
# 128-layer overlay2 limit.
#
# This file builds from source only. The web runtime ships the Next.js standalone
# output (.next/standalone + .next/static + public); nothing from a previous
# release image is reused as a build base.
#
#   web:    docker build -t exchangethb:<tag> .            (web is the final stage)
#   worker: docker build -t exchangethb:<tag>-worker --target worker .

ARG NODE_IMAGE=node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
WORKDIR /app
ARG NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-HHPM4E9QGY
ENV NEXT_PUBLIC_GA4_MEASUREMENT_ID=${NEXT_PUBLIC_GA4_MEASUREMENT_ID} \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS=--max-old-space-size=4096
COPY . .
RUN npm run prisma:generate && npm run build

# ---------------------------------------------------------------------------
# Worker runtime: the worker and its lib/ graph are bundled to one CJS file at
# build time (esbuild resolves the @/* tsconfig paths), so the runtime image
# needs only Node, the generated Prisma client and the health scripts.
# Bundling avoids shipping a 594MB production node_modules for a 10-minute loop.
# ---------------------------------------------------------------------------
FROM builder AS worker-build
RUN ./node_modules/.bin/esbuild worker/index.ts \
      --bundle --platform=node --target=node20 --format=cjs \
      --external:@prisma/client --external:'@prisma/client/*' \
      --outfile=worker-dist/index.js

FROM ${NODE_IMAGE} AS worker
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=worker-build /app/worker-dist ./worker-dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY scripts ./scripts
COPY content ./content
CMD ["sh", "./scripts/docker-worker-entrypoint.sh"]

# ---------------------------------------------------------------------------
# Web runtime (final stage): standalone only.
# app/components/lib/data are copied for the sitemap's lastmod lookup, which
# stats source files under process.cwd() at render time (~1.1MB total).
# content/ holds the runtime JSON config/audit files. .prisma is copied because
# Next's output tracing does not always pick up the generated query engine.
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS web
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content
COPY --from=builder /app/data ./data
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
RUN chmod +x ./scripts/docker-web-entrypoint.sh
EXPOSE 3000
CMD ["node", "server.js"]
