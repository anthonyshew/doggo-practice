FROM node:lts-alpine AS builder

ENV YARN_VERSION 1.22.16
RUN yarn set version $YARN_VERSION

RUN apk add git
RUN apk update

# Set working directory
WORKDIR /app
COPY . .
RUN yarn global add turbo
RUN turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:lts-alpine AS installer

ENV YARN_VERSION 1.22.16
RUN yarn set version $YARN_VERSION

# RUN apk add gcc g++ git python2 make
RUN apk add git
RUN apk update

WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn install

FROM node:lts-alpine AS sourcer

ENV YARN_VERSION 1.22.16
RUN yarn set version $YARN_VERSION

# RUN apk add gcc g++ git python3
RUN apk add git
RUN apk update

WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN yarn turbo run build --scope=api --include-dependencies --no-deps

EXPOSE 5000
ENV PORT 5000

ENTRYPOINT ["yarn", "turbo", "run", "start", "--scope=api" ]