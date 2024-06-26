ARG APP_GROUP=apps
ARG APP_NAME=web
ARG APP_PKG_NAME=@technifit/$APP_NAME

# base node image
FROM node:20.15.0-bookworm-slim as node

# set the environment to bash
ENV SHELL=/bin/bash

# install dependencies using npm or pnpm
# TODO: remove pinned version when pnpm > 9 stops breaking turborepo in docker -- feature/task-81-remove-pinned-pnpm-version-in-dockerfile
RUN npm install -g pnpm
RUN pnpm setup
RUN pnpm config set global-bin-dir /usr/local/bin
RUN pnpm add turbo --global

# pruner
FROM node as pruner
ARG APP_PKG_NAME
WORKDIR /app
COPY . .
RUN turbo prune $APP_PKG_NAME --docker
# RUN rm -rf ./out/full/*/*/node_modules

# base node image
FROM node as base
WORKDIR /app
COPY --from=pruner /app/out/json/ .

FROM base AS dev-deps
WORKDIR /app
RUN pnpm install

FROM base AS production-deps
WORKDIR /app
ENV NODE_ENV production
RUN pnpm install --production

FROM base AS builder
ARG APP_PKG_NAME
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV SENTRY_ORG=$SENTRY_ORG
ENV SENTRY_PROJECT=$SENTRY_PROJECT
WORKDIR /app
ENV NODE_ENV production
COPY --from=pruner /app/out/full/ .
COPY --from=dev-deps /app/ .
COPY turbo.json turbo.json
RUN turbo build --filter=$APP_PKG_NAME...

# Final image
FROM base AS runner
ARG APP_GROUP
ARG APP_NAME
ENV PORT 8080
ENV TZ UTC
ENV NODE_ENV production
WORKDIR /app

COPY --from=production-deps /app .
COPY --from=builder /app/$APP_GROUP/$APP_NAME/package.json ./$APP_GROUP/$APP_NAME/package.json
COPY --from=builder /app/$APP_GROUP/$APP_NAME/build ./$APP_GROUP/$APP_NAME/build

WORKDIR /app/$APP_GROUP/$APP_NAME

# It is the app package.json
CMD [ "pnpm", "start" ]
