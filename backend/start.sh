#!/bin/sh

# start.sh
# Wait for PostgreSQL to be ready
until pg_isready -h postgres -U postgres; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done


echo "Database is ready."

# Run Prisma migrations
npx prisma migrate deploy
# Generate Prisma client
npx prisma generate
# Seed the database
npx prisma db seed
# Start the application in development mode
yarn start:dev