#Dependencies
FROM node:18-alpine3.16 as deps
WORKDIR /backend

COPY ./package.json .
COPY ./yarn.lock .
#   Install deps
RUN yarn install --frozen-lockfile

#Build
FROM node:18-alpine3.16 as builder
WORKDIR /backend
#   Copy cached node_modules from deps
COPY --from=deps /backend/node_modules /backend/node_modules
#   Install python and medusa-cli
# RUN apk update
# RUN apk add python3
# RUN yarn start:dev
#   Copy app source code
COPY . /backend

# ENTRYPOINT [ "yarn", "start:dev" ]