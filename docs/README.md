# Country Calendar Documentation

This folder contains technical documentation for developers and AI assistants working on the Country Calendar application.

## Documentation Index

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, design patterns, and component overview |
| [API.md](./API.md) | REST API endpoints, request/response formats, authentication |
| [DATABASE.md](./DATABASE.md) | Database schema, models, relationships, and migrations |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Development setup, environment configuration, and workflows |
| [TESTING.md](./TESTING.md) | Testing strategy, running tests, and writing new tests |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines and code standards |

## Quick Links

- **Production URL:** https://countrycalendar.app
- **Development URL:** http://localhost:3000
- **API Base URL:** http://localhost:3001/api/v1

## Project Overview

Country Calendar is a full-stack web application that enables users to visually track countries visited on specific dates using an interactive calendar interface.

### Tech Stack Summary

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand |
| **Backend** | Node.js 20, Express.js, TypeScript, Prisma ORM |
| **Database** | PostgreSQL 15+, Redis 7+ |
| **Testing** | Vitest, Testing Library, Playwright |
| **DevOps** | Docker, GitHub Actions, Heroku |

### Repository Structure

```
ccalendar/
├── packages/
│   ├── api/          # Backend Express.js API
│   ├── web/          # Frontend React SPA
│   └── e2e/          # End-to-end Playwright tests
├── openspec/         # Feature specifications
├── docs/             # Developer documentation (this folder)
├── docker/           # Docker build files
└── .github/          # CI/CD workflows
```

## For AI Assistants

When working on this codebase, please refer to:

1. **[CLAUDE.md](../CLAUDE.md)** - Development guidelines and coding standards
2. **[openspec/AGENTS.md](../openspec/AGENTS.md)** - Change proposal process
3. **[openspec/features.md](../openspec/features.md)** - Feature roadmap and status

### Key Conventions

- Follow SOLID principles rigorously
- Use Test-Driven Development (TDD)
- Maintain strong TypeScript typing
- Run linters before committing
- Create proposals for significant changes

## Getting Started

For setup instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md).

For API usage, see [API.md](./API.md).
