# Architecture Overview

This document describes the system architecture, design patterns, and component organization of Country Calendar.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  React SPA (Vite) + Zustand State + TanStack Query          │
│  Tailwind CSS + shadcn/ui Components                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (axios)
                           │ JWT Authentication
┌──────────────────────────┴──────────────────────────────────┐
│                       API Layer                              │
│  Express.js + Passport.js Authentication                    │
│  Prisma ORM + Zod Validation                                │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                      Data Layer                              │
│  PostgreSQL (Primary)    │    Redis (Caching)               │
└─────────────────────────────────────────────────────────────┘
```

## Package Structure

### Monorepo Organization

The project uses npm workspaces with three packages:

```
packages/
├── api/      # Backend REST API
├── web/      # Frontend React application
└── e2e/      # End-to-end tests
```

### Backend Architecture (packages/api)

```
api/src/
├── index.ts              # Application entry point
├── config/               # Environment & OAuth configuration
├── controllers/          # HTTP request handlers
├── middleware/           # Express middleware
├── routes/               # Route definitions
├── services/             # Business logic layer
├── validators/           # Zod validation schemas
├── utils/                # Shared utilities
└── jobs/                 # Background jobs
```

#### Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| **Controllers** | Handle HTTP requests, extract parameters, return responses |
| **Services** | Business logic, database operations, external integrations |
| **Middleware** | Cross-cutting concerns (auth, logging, rate limiting, errors) |
| **Validators** | Input validation using Zod schemas |
| **Routes** | URL routing and controller mapping |

#### Design Patterns

- **Service Layer Pattern:** Business logic is separated from controllers
- **Middleware Pipeline:** Request processing through composable middleware
- **Repository Pattern:** Prisma ORM abstracts database operations
- **Factory Pattern:** Token generation and email template creation

### Frontend Architecture (packages/web)

```
web/src/
├── main.tsx              # React entry point
├── App.tsx               # Router configuration
├── components/
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── layout/           # Layout wrappers (Header, Footer)
│   ├── auth/             # Route protection components
│   └── features/         # Feature-specific components
├── pages/                # Page components
├── hooks/                # Custom React hooks
├── stores/               # Zustand state stores
├── lib/                  # Utilities and API client
└── types/                # TypeScript definitions
```

#### State Management

| Store | Purpose |
|-------|---------|
| **authStore** | User authentication state, tokens, user info |
| **calendarStore** | Calendar navigation, selected dates, travel records |

#### Data Fetching

- **TanStack Query:** Server state management with caching
- **Axios:** HTTP client with interceptors for auth
- **Optimistic Updates:** UI responds immediately to user actions

## Authentication Flow

### JWT Token Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│ Access Token│────▶│  API Call   │
│   Request   │     │ (15 min)    │     │  (w/ token) │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           │ Expired
                           ▼
┌─────────────┐     ┌─────────────┐
│  Refresh    │◀────│ Refresh     │
│  Endpoint   │     │ Token (7d)  │
└─────────────┘     └─────────────┘
```

### OAuth Integration

Supported providers:
- Google OAuth 2.0
- Facebook OAuth
- Apple Sign In

OAuth accounts can be linked to existing email accounts.

## Security Architecture

### Defense Layers

1. **Network:** HTTPS enforced, CORS origin validation
2. **Application:** Helmet.js security headers, rate limiting
3. **Input:** Zod validation, XSS sanitization
4. **Authentication:** JWT tokens, bcrypt password hashing
5. **Authorization:** Role-based access (user/admin)

### Security Headers (Helmet.js)

- Content-Security-Policy
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## Caching Strategy

### Redis Usage

| Use Case | TTL | Key Pattern |
|----------|-----|-------------|
| Rate limiting | Dynamic | `ratelimit:{ip}:{endpoint}` |
| Session data | 7 days | `session:{userId}` |
| Export rate limit | 1 hour | `export:{userId}` |

## Error Handling

### API Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Logging & Monitoring

### Winston Logger Configuration

- **Development:** Console output with colors
- **Production:** JSON format for log aggregation

### Sentry Integration

- Error tracking for both frontend and backend
- Performance monitoring
- Release tracking

## Background Jobs

### Token Cleanup Job

- **Schedule:** Runs periodically
- **Function:** Removes expired refresh tokens
- **Location:** `api/src/jobs/tokenCleanup.ts`

## Scalability Considerations

### Current Architecture Supports

- Horizontal scaling via Heroku dynos
- Database connection pooling via Prisma
- Redis for distributed caching/rate limiting
- Stateless API design

### Future Scaling Options

- Database read replicas
- CDN for static assets
- Message queues for async processing
- Microservices decomposition
