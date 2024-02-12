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

#   Copy app source code
COPY . .

# Runner
FROM node:18-alpine3.16 as runner
WORKDIR /backend

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

COPY --from=builder /backend ./
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD sh ./start.sh
