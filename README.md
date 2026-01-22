# Country Calendar

Track your travels across the globe with a beautiful calendar interface.

**Live Demo:** [https://countrycalendar.app](https://countrycalendar.app)

## Overview

Country Calendar is a full-stack web application that enables users to visually track countries visited on specific dates. Using an interactive calendar interface, users can log their travel history, view statistics, and export reports.

### Key Features

- **Visual Calendar** - Track which countries you visited on each day with an intuitive calendar UI
- **249 Countries** - Full country database with unique colors for easy identification
- **Travel Reports** - Generate statistics and insights from your travel history
- **Data Export** - Export travel data to CSV or XLSX formats
- **OAuth Authentication** - Sign in with Google, Facebook, or Apple
- **Mobile-First Design** - Responsive interface optimized for all devices
- **Admin Panel** - User management and support ticket handling
- **Email Notifications** - Transactional emails for verification and password reset

## Tech Stack

### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js 4.x
- **Language:** TypeScript
- **Database:** PostgreSQL 15+
- **ORM:** Prisma 5.x
- **Caching:** Redis 7.x
- **Authentication:** Passport.js + JWT
- **Validation:** Zod
- **Email:** Nodemailer + Mailgun
- **Error Tracking:** Sentry

### Frontend
- **Framework:** React 18.x
- **Build Tool:** Vite 5.x
- **Styling:** Tailwind CSS 3.x
- **Component Library:** shadcn/ui (Radix UI)
- **State Management:** Zustand 4.x
- **Data Fetching:** TanStack Query 5.x
- **Routing:** React Router 6.x
- **Forms:** React Hook Form + Zod

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Production Hosting:** Heroku
- **CI/CD:** GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm 10+

### Development Setup

#### Option A: Full Docker Setup (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ccalendar.git
   cd ccalendar
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env.development
   ```

3. Start all services:
   ```bash
   docker compose up
   ```

4. In a separate terminal, run database migrations:
   ```bash
   docker compose exec api npx prisma migrate dev
   ```

5. Access the application:
   - **Web App:** http://localhost:3000
   - **API:** http://localhost:3001/api/v1
   - **Health Check:** http://localhost:3001/api/v1/health

#### Option B: Local Development (without Docker)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start database services via Docker:
   ```bash
   docker compose up db redis
   ```

3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

   Or start them separately:
   ```bash
   npm run dev:api      # API on port 3001
   npm run dev:web      # Web on port 3000 (in another terminal)
   ```

### Development Ports

| Service    | Port |
|------------|------|
| Web        | 3000 |
| API        | 3001 |
| PostgreSQL | 5434 |
| Redis      | 6379 |

## Project Structure

```
ccalendar/
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
│       ├── ci.yml              # Lint, test on PRs
│       ├── deploy.yml          # Deploy to Heroku
│       └── e2e.yml             # E2E tests
├── docker/
│   ├── Dockerfile.api          # Backend container
│   └── Dockerfile.web          # Frontend container
├── packages/
│   ├── api/                    # Express.js backend
│   │   ├── prisma/             # Database schema & migrations
│   │   ├── data/               # Static data (countries.json)
│   │   ├── tests/              # Unit & integration tests
│   │   └── src/
│   │       ├── config/         # Configuration management
│   │       ├── controllers/    # Request handlers
│   │       ├── middleware/     # Express middleware
│   │       ├── routes/         # API route definitions
│   │       ├── services/       # Business logic
│   │       ├── validators/     # Input validation (Zod)
│   │       ├── utils/          # Utilities (logger, prisma, redis)
│   │       └── jobs/           # Background jobs
│   ├── web/                    # React frontend
│   │   ├── public/             # Static assets
│   │   └── src/
│   │       ├── components/     # Reusable React components
│   │       ├── pages/          # Page components
│   │       ├── hooks/          # Custom React hooks
│   │       ├── stores/         # Zustand state stores
│   │       ├── services/       # API client services
│   │       ├── lib/            # Utility libraries
│   │       ├── styles/         # CSS/Tailwind styling
│   │       └── types/          # TypeScript definitions
│   └── e2e/                    # Playwright E2E tests
│       ├── tests/              # Test files
│       ├── page-objects/       # Page Object Models
│       └── fixtures/           # Test fixtures
├── openspec/                   # Specification & feature tracking
├── docker-compose.yml          # Development environment
├── Procfile                    # Heroku configuration
├── app.json                    # Heroku app manifest
└── package.json                # Root workspace config
```

## Available Scripts

### Root Level

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services in development mode |
| `npm run dev:api` | Start API only |
| `npm run dev:web` | Start Web only |
| `npm run build` | Build all packages |
| `npm run build:production` | Build for production with asset copying |
| `npm run lint` | Lint all packages |
| `npm run lint:fix` | Fix linting issues |
| `npm run test` | Run all unit/integration tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run E2E tests in UI mode |
| `npm run test:e2e:headed` | Run E2E tests with visible browser |
| `npm run db:migrate` | Run database migrations |
| `npm run db:migrate:deploy` | Deploy migrations (production) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with initial data |

## API Endpoints

### Health
- `GET /api/v1/health` - Health check with service status

### Countries
- `GET /api/v1/countries` - Get all countries
- `GET /api/v1/countries/:code` - Get country by ISO code

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/google` - Google OAuth
- `GET /api/v1/auth/facebook` - Facebook OAuth
- `GET /api/v1/auth/apple` - Apple Sign In

### Travel Records
- `GET /api/v1/travel-records` - Get user's travel records
- `POST /api/v1/travel-records` - Create travel record
- `PUT /api/v1/travel-records/:id` - Update travel record
- `DELETE /api/v1/travel-records/:id` - Delete travel record

### Reports
- `GET /api/v1/reports/summary` - Get travel summary
- `GET /api/v1/reports/by-year` - Get records by year
- `GET /api/v1/reports/by-country` - Get records by country

### User Profile
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update profile
- `DELETE /api/v1/users/me` - Delete account

## Environment Variables

Copy `.env.example` to `.env.development` and configure:

### Required Variables

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/ccalendar?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
FRONTEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:3001/api/v1
```

### Optional Variables (for full functionality)

```env
# Email (Mailgun)
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
FROM_EMAIL=noreply@countrycalendar.app
REPLY_TO_EMAIL=support@countrycalendar.app

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key

# Error Tracking
SENTRY_DSN=your-sentry-dsn

# reCAPTCHA
RECAPTCHA_PUBLIC_KEY=your-recaptcha-public-key
RECAPTCHA_PRIVATE_KEY=your-recaptcha-private-key
```

## Production Deployment

The application is configured for deployment on Heroku with automatic CI/CD via GitHub Actions.

### Prerequisites

- Heroku account with billing enabled
- GitHub repository with Actions enabled
- Domain configured (optional)

### Initial Heroku Setup

1. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Add required add-ons:**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   heroku addons:create heroku-redis:mini
   ```

3. **Configure required environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=$(openssl rand -base64 32)
   heroku config:set FRONTEND_URL=https://your-app-name.herokuapp.com
   ```

4. **Configure optional variables for full functionality:**
   ```bash
   # Email
   heroku config:set MAILGUN_API_KEY=your-key
   heroku config:set MAILGUN_DOMAIN=your-domain

   # OAuth
   heroku config:set GOOGLE_CLIENT_ID=your-id
   heroku config:set GOOGLE_CLIENT_SECRET=your-secret

   # Error tracking
   heroku config:set SENTRY_DSN=your-dsn
   ```

### GitHub Actions Setup

Add these secrets in your repository (Settings > Secrets and variables > Actions):

| Secret | Description |
|--------|-------------|
| `HEROKU_API_KEY` | Heroku API key (from Account Settings) |
| `HEROKU_EMAIL` | Heroku account email |
| `HEROKU_APP_NAME` | Heroku app name |

### Automatic Deployment

On every push to `main`:
1. CI tests run (lint, type check, unit tests)
2. If tests pass, automatic deployment to Heroku
3. Database migrations run via Procfile `release` phase
4. Health check verification

### Manual Deployment

```bash
# Build production version
npm run build:production

# Deploy to Heroku
git push heroku main

# Run migrations manually if needed
heroku run npm run db:migrate:deploy --workspace=@ccalendar/api
```

### Monitoring

```bash
# View real-time logs
heroku logs --tail

# Check app status
heroku ps

# Verify database
heroku pg:info

# Check Redis
heroku redis:info

# Create backup before migrations
heroku pg:backups:capture
```

### Rollback

```bash
# List recent releases
heroku releases

# Rollback to a specific release
heroku rollback v123
```

## Testing

### Unit & Integration Tests

```bash
# Run all tests
npm run test

# Run API tests only
npm run test -w packages/api

# Run Web tests only
npm run test -w packages/web
```

### End-to-End Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests with visible browser
npm run test:e2e:headed
```

## Health Check Response

The `/api/v1/health` endpoint returns:

```json
{
  "status": "ok",
  "timestamp": "2024-01-21T12:00:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600,
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

## Security Checklist

- [ ] JWT_SECRET is at least 32 characters
- [ ] All OAuth credentials are from production apps
- [ ] Sentry DSN is configured for error tracking
- [ ] HTTPS is enforced (automatic on Heroku)
- [ ] Custom domain has SSL certificate (if applicable)
- [ ] Rate limiting is enabled
- [ ] Input validation is in place

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT
