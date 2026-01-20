## 1. Project Scaffolding

- [x] 1.1 Create root `package.json` with npm workspaces configuration
- [x] 1.2 Create `packages/api/package.json` with backend dependencies
- [x] 1.3 Create `packages/web/package.json` with frontend dependencies
- [x] 1.4 Create root configuration files (`.gitignore`, `.nvmrc`, `.prettierrc`, `eslint.config.js`)
- [x] 1.5 Create API directory structure (`src/config/`, `src/controllers/`, `src/middleware/`, etc.)
- [x] 1.6 Create Web directory structure (`src/components/`, `src/hooks/`, `src/pages/`, etc.)
- [x] 1.7 Create TypeScript configurations (`tsconfig.json`) for both packages

## 2. Docker Development Environment

- [x] 2.1 Create `docker/Dockerfile.api` for backend container
- [x] 2.2 Create `docker/Dockerfile.web` for frontend container
- [x] 2.3 Create `docker-compose.yml` with all services (api, web, db, redis)
- [x] 2.4 Configure health checks for all services
- [x] 2.5 Configure volume mounts for live code reloading
- [x] 2.6 Test `docker compose up` starts all services successfully

## 3. Database Schema (Prisma)

- [x] 3.1 Create `packages/api/prisma/schema.prisma` with datasource configuration
- [x] 3.2 Define User model with all fields and constraints
- [x] 3.3 Define TravelRecord model with indexes and unique constraints
- [x] 3.4 Define OAuth model with unique constraint
- [x] 3.5 Define SupportTicket model with all fields
- [x] 3.6 Configure table name mappings (snake_case)
- [x] 3.7 Run initial migration (`npx prisma migrate dev`)
- [x] 3.8 Generate Prisma client

## 4. Express.js API Boilerplate

- [x] 4.1 Create `packages/api/src/index.ts` entry point with Express server
- [x] 4.2 Configure body parsing middleware (JSON, URL-encoded)
- [x] 4.3 Configure CORS middleware with environment-based origins
- [x] 4.4 Configure Helmet.js security headers
- [x] 4.5 Create health check endpoint (`GET /api/v1/health`)
- [x] 4.6 Create centralized error handling middleware
- [x] 4.7 Configure Winston logger for request logging
- [x] 4.8 Initialize Prisma client with graceful shutdown
- [x] 4.9 Configure dotenv for environment variable loading
- [x] 4.10 Add npm scripts for `dev`, `build`, `start`, `lint`, `test`

## 5. Vite + React Frontend Setup

- [x] 5.1 Initialize Vite project with React and TypeScript template
- [x] 5.2 Configure `vite.config.ts` with path aliases and build options
- [x] 5.3 Install and configure Tailwind CSS with PostCSS
- [x] 5.4 Initialize shadcn/ui with "new-york" style
- [x] 5.5 Install base shadcn/ui components (Button, Input, Card, Dialog, Sheet, Form, Toast)
- [x] 5.6 Create Zustand auth store skeleton
- [x] 5.7 Configure TanStack Query with QueryClientProvider
- [x] 5.8 Configure React Router with initial routes (/, /login, /register, /calendar, 404)
- [x] 5.9 Create base API client with auth token handling
- [x] 5.10 Create global styles with CSS variables for theming
- [x] 5.11 Add npm scripts for `dev`, `build`, `preview`, `lint`

## 6. Environment Configuration

- [x] 6.1 Create `.env.example` with all required variables documented
- [x] 6.2 Create `.env.development` for local development
- [x] 6.3 Create `packages/api/src/config/index.ts` with Zod validation
- [x] 6.4 Export typed configuration object
- [x] 6.5 Add startup validation that fails on missing required variables
- [x] 6.6 Update `.gitignore` to exclude `.env*` except `.env.example`

## 7. Countries Data Seeding

- [x] 7.1 Create `packages/api/data/countries.json` with all 249 countries
- [x] 7.2 Assign unique colors to each country
- [x] 7.3 Create countries service to load and cache data at startup
- [x] 7.4 Create `GET /api/v1/countries` endpoint
- [x] 7.5 Add cache headers to countries response
- [x] 7.6 Create country code validation utility
- [x] 7.7 Create `useCountries` hook in frontend
- [x] 7.8 Add Fuse.js for fuzzy country search

## 8. Integration Testing

- [x] 8.1 Verify `docker compose up` starts all services
- [x] 8.2 Verify API health endpoint responds at `http://localhost:3001/api/v1/health`
- [x] 8.3 Verify Web app loads at `http://localhost:3000`
- [x] 8.4 Verify database migrations apply successfully
- [x] 8.5 Verify countries endpoint returns all 249 countries
- [x] 8.6 Verify both TypeScript codebases compile without errors
- [x] 8.7 Verify ESLint passes for both packages
