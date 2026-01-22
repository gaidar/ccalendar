# Deployment Guide

This document describes how to deploy Country Calendar to production.

## Prerequisites

- Heroku account with billing enabled
- GitHub repository with Actions enabled
- Domain configured (optional)

## Heroku Setup

### 1. Create Heroku App

```bash
heroku create your-app-name
```

### 2. Add Required Add-ons

```bash
heroku addons:create heroku-postgresql:essential-0
heroku addons:create heroku-redis:mini
```

### 3. Configure Environment Variables

Required variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set FRONTEND_URL=https://your-app-name.herokuapp.com
```

Optional variables for full functionality:
```bash
# Email (Mailgun)
heroku config:set MAILGUN_API_KEY=your-mailgun-api-key
heroku config:set MAILGUN_DOMAIN=your-mailgun-domain
heroku config:set FROM_EMAIL=noreply@yourdomain.com
heroku config:set REPLY_TO_EMAIL=support@yourdomain.com

# Google OAuth
heroku config:set GOOGLE_CLIENT_ID=your-google-client-id
heroku config:set GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
heroku config:set FACEBOOK_APP_ID=your-facebook-app-id
heroku config:set FACEBOOK_APP_SECRET=your-facebook-app-secret

# Apple Sign In
heroku config:set APPLE_CLIENT_ID=your-apple-client-id
heroku config:set APPLE_TEAM_ID=your-apple-team-id
heroku config:set APPLE_KEY_ID=your-apple-key-id
heroku config:set APPLE_PRIVATE_KEY=your-apple-private-key-base64

# Error Tracking (Sentry)
heroku config:set SENTRY_DSN=your-sentry-dsn
heroku config:set APP_VERSION=1.0.0
```

## GitHub Actions Setup

### 1. Configure GitHub Secrets

Go to your repository Settings > Secrets and variables > Actions, and add:

- `HEROKU_API_KEY`: Your Heroku API key (from Account Settings)
- `HEROKU_EMAIL`: Your Heroku account email
- `HEROKU_APP_NAME`: Your Heroku app name

### 2. CI Workflow

The CI workflow (`ci.yml`) runs on every pull request:
- Runs linting and type checking
- Runs all unit and integration tests
- Verifies the build succeeds

### 3. CD Workflow

The CD workflow (`deploy.yml`) runs on every push to main:
- Runs the full test suite
- Deploys to Heroku on success
- Performs a health check after deployment

## Manual Deployment

If you prefer manual deployment:

```bash
# 1. Build the application
npm run build:production

# 2. Deploy to Heroku
git push heroku main

# 3. Run migrations (if needed)
heroku run npm run db:migrate:deploy --workspace=@ccalendar/api
```

## Database Migrations

Migrations run automatically during the Heroku release phase via the `Procfile`.

To run migrations manually:
```bash
heroku run npm run db:migrate:deploy --workspace=@ccalendar/api
```

To check migration status:
```bash
heroku run npx prisma migrate status --workspace=@ccalendar/api
```

## Health Check

The application exposes a health check endpoint at `/api/v1/health` that returns:

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

Heroku uses this endpoint to verify the application is healthy.

## Rollback Procedures

### Application Rollback

```bash
# List recent releases
heroku releases

# Rollback to a specific release
heroku rollback v123
```

### Database Rollback

**Warning**: Database rollbacks can cause data loss.

1. Create a backup before any migration:
   ```bash
   heroku pg:backups:capture
   ```

2. To rollback, restore from backup:
   ```bash
   heroku pg:backups:restore BACKUP_ID DATABASE_URL
   ```

## Monitoring

### Logs

```bash
# View real-time logs
heroku logs --tail

# View specific log types
heroku logs --tail --source app
heroku logs --tail --dyno web
```

### Metrics

View metrics in the Heroku Dashboard or use:
```bash
heroku ps
```

### Error Tracking

If Sentry is configured, errors are automatically reported to your Sentry dashboard.

## Troubleshooting

### Build Failures

1. Check the build logs:
   ```bash
   heroku builds:info
   ```

2. Verify all dependencies are in `package.json`

3. Ensure Node.js version matches `engines` in `package.json`

### Database Connection Issues

1. Verify DATABASE_URL is set:
   ```bash
   heroku config:get DATABASE_URL
   ```

2. Check connection from Heroku:
   ```bash
   heroku pg:info
   ```

### Redis Connection Issues

1. Verify REDIS_URL is set:
   ```bash
   heroku config:get REDIS_URL
   ```

2. Check Redis status:
   ```bash
   heroku redis:info
   ```

## Security Checklist

- [ ] JWT_SECRET is at least 32 characters
- [ ] All OAuth credentials are from production apps
- [ ] Sentry DSN is configured for error tracking
- [ ] HTTPS is enforced (automatic on Heroku)
- [ ] Custom domain has SSL certificate (if applicable)
