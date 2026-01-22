# Development Guide

This document covers development setup, workflows, and best practices for Country Calendar.

## Prerequisites

- **Node.js:** 20 LTS (use nvm: `nvm use`)
- **Docker:** Docker Desktop or Docker Engine + Compose
- **pnpm:** Package manager (npm also works)

## Quick Start

### Option A: Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd ccalendar

# Start all services
docker compose up

# In another terminal, run migrations
docker compose exec api npx prisma migrate dev

# Access the application
# Web: http://localhost:3000
# API: http://localhost:3001
```

### Option B: Local Development

```bash
# Install dependencies
npm install

# Start database services only
docker compose up db redis

# Run migrations
cd packages/api && npx prisma migrate dev

# Start development servers (from root)
npm run dev
```

## Development Ports

| Service | Port | URL |
|---------|------|-----|
| Web (React) | 3000 | http://localhost:3000 |
| API (Express) | 3001 | http://localhost:3001 |
| PostgreSQL | 5434 | localhost:5434 |
| Redis | 6379 | localhost:6379 |

## Environment Variables

### API Environment (packages/api/.env)

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/ccalendar"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets
JWT_SECRET="your-jwt-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"

# OAuth (optional for local dev)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_APP_ID=""
FACEBOOK_APP_SECRET=""
APPLE_CLIENT_ID=""
APPLE_TEAM_ID=""
APPLE_KEY_ID=""

# Email (optional for local dev)
MAILGUN_API_KEY=""
MAILGUN_DOMAIN=""
EMAIL_FROM="noreply@localhost"

# Sentry (optional)
SENTRY_DSN=""

# Environment
NODE_ENV="development"
```

### Web Environment (packages/web/.env)

```env
VITE_API_URL="http://localhost:3001/api/v1"
VITE_SENTRY_DSN=""
```

## Common Commands

### Root Level

```bash
# Install all dependencies
npm install

# Start all development servers
npm run dev

# Run all tests
npm test

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Build for production
npm run build
```

### API Package

```bash
cd packages/api

# Start API server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Database commands
npx prisma migrate dev    # Create/apply migrations
npx prisma studio         # Open database GUI
npx prisma db seed        # Seed database
npx prisma generate       # Regenerate Prisma client
```

### Web Package

```bash
cd packages/web

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### E2E Tests

```bash
cd packages/e2e

# Run E2E tests
npm test

# Run with UI
npm run test:ui

# Run headed (visible browser)
npm run test:headed
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout main
git pull
git checkout -b feature/my-feature
```

### 2. Make Changes

Follow these guidelines:
- Write tests first (TDD)
- Keep changes focused
- Run linting before committing

### 3. Run Quality Checks

```bash
# Run all checks
npm run lint
npm run typecheck
npm test
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add feature description"
```

Commit message format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance

### 5. Push and Create PR

```bash
git push -u origin feature/my-feature
# Create PR on GitHub
```

## Database Management

### Migrations

```bash
# Create new migration
cd packages/api
npx prisma migrate dev --name add_user_preferences

# Apply migrations
npx prisma migrate deploy

# Reset database (deletes all data)
npx prisma migrate reset
```

### Prisma Studio

Visual database browser:

```bash
cd packages/api
npx prisma studio
# Opens at http://localhost:5555
```

### Direct Database Access

```bash
# Connect to PostgreSQL
docker compose exec db psql -U postgres -d ccalendar

# Or using psql directly
psql -h localhost -p 5434 -U postgres -d ccalendar
```

## Debugging

### VS Code Launch Configurations

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/packages/api",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Web",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/packages/web/src"
    }
  ]
}
```

### Logging

API logs use Winston:

```typescript
import { logger } from '@/utils/logger';

logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message', { error });
```

View logs in development:
- Console output with colors
- Filter by level: `LOG_LEVEL=debug npm run dev`

### Network Debugging

Use browser DevTools Network tab for:
- API request/response inspection
- Auth token verification
- Error response details

## Testing

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- path/to/test.ts

# Run with coverage
npm run test:coverage
```

### Writing Tests

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('should handle edge cases', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

### E2E Tests

```bash
cd packages/e2e

# Run all E2E tests
npm test

# Run specific test
npm test -- tests/auth.spec.ts

# Debug mode
npm run test:debug
```

## Code Style

### TypeScript

- Use strict mode
- Define explicit return types for functions
- Prefer interfaces over types for objects
- Use `const` assertions where appropriate

### React

- Use functional components
- Prefer hooks over class components
- Keep components focused (single responsibility)
- Extract reusable logic into custom hooks

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Tests: `*.test.ts` or `*.spec.ts`
- Styles: `*.css` or inline with Tailwind

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Docker Issues

```bash
# Rebuild containers
docker compose down
docker compose build --no-cache
docker compose up

# Reset volumes (deletes data)
docker compose down -v
docker compose up
```

### Database Connection Issues

```bash
# Check if database is running
docker compose ps

# View database logs
docker compose logs db

# Restart database
docker compose restart db
```

### Prisma Issues

```bash
# Regenerate client
cd packages/api
npx prisma generate

# Reset database
npx prisma migrate reset
```

## IDE Setup

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript Vue Plugin (Volar)

### Settings

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```
