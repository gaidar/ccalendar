## Context

Country Calendar is a greenfield project requiring complete development infrastructure setup. This design document captures key technical decisions for the foundation phase that will support all subsequent feature development.

**Stakeholders:** Solo developer, future contributors
**Constraints:** Must support Docker-based development, Heroku production deployment, mobile-first responsive design

## Goals / Non-Goals

**Goals:**
- Establish a maintainable monorepo structure with clear separation of concerns
- Create a reproducible development environment using Docker
- Set up type-safe database access with Prisma
- Configure modern React tooling with excellent developer experience
- Ensure all configuration is environment-driven for deployment flexibility

**Non-Goals:**
- Implementing authentication or business logic (Phase 2+)
- Production deployment configuration (Phase 13)
- CI/CD pipeline setup (Phase 13)
- Mobile app wrapper (Future)

## Decisions

### Decision 1: Monorepo with npm Workspaces

**What:** Use npm workspaces instead of Lerna, Nx, or Turborepo.

**Why:**
- npm workspaces is built-in, no additional tooling required
- Sufficient for a two-package monorepo
- Lower complexity and maintenance burden
- Can migrate to Turborepo later if build performance becomes an issue

**Alternatives considered:**
- Turborepo: Overkill for initial development, adds complexity
- Lerna: Declining community support, npm workspaces covers our needs
- Separate repos: Would complicate deployment and sharing types

### Decision 2: Docker Compose for Development

**What:** Use Docker Compose for all services including API and Web.

**Why:**
- Ensures consistent environment across developers
- Matches production database (PostgreSQL) exactly
- Redis available for caching without local installation
- Easy onboarding: single `docker compose up` command

**Alternatives considered:**
- Local Node.js with Docker only for DB: Inconsistent environments, "works on my machine" issues
- Devcontainers: Adds IDE dependency, Docker Compose is more universal

### Decision 3: Prisma ORM

**What:** Use Prisma for database access instead of TypeORM, Drizzle, or raw SQL.

**Why:**
- Excellent TypeScript integration with generated types
- Declarative schema with migrations
- Good documentation and community support
- Schema as single source of truth for database structure

**Alternatives considered:**
- TypeORM: More complex, decorator-heavy API
- Drizzle: Newer, less mature ecosystem
- Knex/raw SQL: More boilerplate, no generated types

### Decision 4: Vite over Create React App

**What:** Use Vite as the build tool and dev server.

**Why:**
- Significantly faster development server startup
- Native ES modules support
- Better hot module replacement
- More active development compared to CRA

**Alternatives considered:**
- Create React App: Deprecated, slow builds
- Next.js: Server-side features unnecessary, adds complexity
- Parcel: Less ecosystem support for React

### Decision 5: shadcn/ui over Headless Libraries

**What:** Use shadcn/ui with Tailwind CSS for UI components.

**Why:**
- Components are copied into project, fully customizable
- Built on Radix primitives (accessible by default)
- Consistent with Tailwind CSS approach
- No vendor lock-in, components become your code

**Alternatives considered:**
- Chakra UI: Heavier runtime, less flexibility
- Material UI: Opinionated design, harder to customize
- Headless UI: Would require more custom styling work

### Decision 6: Zustand for State Management

**What:** Use Zustand instead of Redux or Context.

**Why:**
- Minimal boilerplate compared to Redux
- Works seamlessly with React 18
- Simple API for stores
- Can be combined with TanStack Query for server state

**Alternatives considered:**
- Redux Toolkit: More boilerplate, overkill for this project size
- Context + useReducer: Prop drilling issues, performance concerns
- Jotai/Recoil: Atomic model less suited for auth/global state

### Decision 7: Zod for Configuration Validation

**What:** Use Zod to validate environment variables at startup.

**Why:**
- Fail fast on misconfiguration
- TypeScript types generated from schema
- Already using Zod for API validation (consistency)
- Clear error messages for missing/invalid config

**Alternatives considered:**
- env-var: Less TypeScript integration
- Manual validation: Error-prone, more code
- convict: Heavier, less TypeScript-native

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Docker adds startup overhead | Acceptable for consistent environment; production doesn't use Docker for app |
| Monorepo may complicate future scaling | npm workspaces can be migrated to Turborepo if needed |
| Prisma migrations can be tricky in production | Document migration process, test migrations in staging |
| shadcn/ui requires manual updates | Low update frequency, components are stable |

## Migration Plan

Not applicable - this is a greenfield setup with no existing code to migrate.

## Open Questions

1. **Calendar library selection:** react-big-calendar vs FullCalendar React - defer decision to Phase 5 when implementing calendar view
2. **Email provider:** Mailgun vs SendGrid vs SES - defer decision to Phase 10 when implementing email system
3. **Error tracking:** Sentry vs alternative - defer decision to Phase 11 when implementing monitoring

## File Structure Reference

```
ccalendar/
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── docker-compose.yml
├── packages/
│   ├── api/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   ├── validators/
│   │   │   └── index.ts
│   │   ├── data/
│   │   │   └── countries.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   ├── layout/
│       │   │   └── features/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── stores/
│       │   ├── styles/
│       │   ├── types/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── public/
│       ├── index.html
│       ├── package.json
│       ├── tailwind.config.js
│       └── vite.config.ts
├── .env.example
├── .gitignore
├── .nvmrc
├── package.json
└── README.md
```
