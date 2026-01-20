# Change: Foundation & Infrastructure Setup

## Why

Country Calendar requires a complete development environment before any features can be implemented. This change establishes the monorepo structure, Docker-based development environment, database schema, and both backend and frontend foundations as specified in the technical specification.

## What Changes

- **NEW**: Monorepo project scaffolding with `packages/api` and `packages/web` workspaces
- **NEW**: Docker development environment with PostgreSQL, Redis, API, and Web services
- **NEW**: Prisma schema with User, TravelRecord, OAuth, and SupportTicket models
- **NEW**: Express.js API boilerplate with middleware, error handling, and logging
- **NEW**: Vite + React frontend setup with Tailwind CSS, shadcn/ui, and Zustand
- **NEW**: Environment configuration with `.env` files and config management
- **NEW**: Countries data seeding with ISO 3166-1 alpha-2 codes and display colors

## Impact

- Affected specs: All new capabilities (no existing specs)
  - `project-scaffolding`
  - `docker-environment`
  - `database-schema`
  - `api-boilerplate`
  - `frontend-setup`
  - `environment-config`
  - `countries-data`
- Affected code: Creates entire project foundation
  - `/packages/api/*`
  - `/packages/web/*`
  - `/docker/*`
  - Root configuration files

## Dependencies

None - this is the foundation that all other phases depend on.

## Success Criteria

1. `docker compose up` starts all services successfully
2. API server responds at `http://localhost:3001/api/v1/health`
3. Web app loads at `http://localhost:3000`
4. Database migrations apply without errors
5. Countries endpoint returns all 249 countries with colors
6. Both TypeScript codebases compile without errors
