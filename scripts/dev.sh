#!/bin/bash

# Development script: starts database in Docker, application locally
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Load environment variables
set -a
source .env.development
set +a

echo "Starting database services in Docker..."
docker compose up -d db redis

echo "Waiting for PostgreSQL to be ready..."
until docker compose exec -T db pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL is ready."

echo "Waiting for Redis to be ready..."
until docker compose exec -T redis redis-cli ping > /dev/null 2>&1; do
  sleep 1
done
echo "Redis is ready."

echo "Checking for pending migrations..."
cd packages/api
PENDING=$(npx prisma migrate status 2>&1 || true)
cd "$PROJECT_ROOT"

if echo "$PENDING" | grep -q "Following migration"; then
  echo "Running database migrations..."
  pnpm -w db:migrate:deploy
else
  echo "No pending migrations."
fi

echo "Generating Prisma client..."
pnpm -w db:generate

echo "Starting development servers..."
pnpm -w dev
