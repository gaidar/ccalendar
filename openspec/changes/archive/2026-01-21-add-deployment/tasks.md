# Tasks: Production Deployment

## 1. Heroku Configuration Files

- [x] 1.1 Create Procfile in repository root
- [x] 1.2 Configure web process to start API server
- [x] 1.3 Create app.json for Heroku Button
- [x] 1.4 Configure Node.js buildpack
- [x] 1.5 Add Heroku Postgres add-on configuration
- [x] 1.6 Add Heroku Redis add-on configuration
- [x] 1.7 Configure environment variable placeholders
- [x] 1.8 Set JWT_SECRET generator to use secret
- [x] 1.9 Set JWT_REFRESH_SECRET generator to use secret
- [x] 1.10 Add application metadata (name, description, repository)

## 2. Production Environment Variables

- [x] 2.1 Document all required environment variables
- [x] 2.2 Configure NODE_ENV=production
- [x] 2.3 Set up DATABASE_URL from Heroku Postgres
- [x] 2.4 Set up REDIS_URL from Heroku Redis
- [x] 2.5 Configure JWT_SECRET (production value)
- [x] 2.6 Configure JWT_REFRESH_SECRET (production value)
- [x] 2.7 Configure OAuth credentials (Google)
- [x] 2.8 Configure OAuth credentials (Facebook)
- [x] 2.9 Configure OAuth credentials (Apple)
- [x] 2.10 Configure Mailgun credentials
- [x] 2.11 Configure FRONTEND_URL
- [x] 2.12 Configure Sentry DSN
- [x] 2.13 Create environment variable validation on startup

## 3. GitHub Actions CI Workflow

- [x] 3.1 Create .github/workflows directory
- [x] 3.2 Create ci.yml workflow file
- [x] 3.3 Configure trigger on pull_request to main
- [x] 3.4 Set up Node.js 20 environment
- [x] 3.5 Configure Postgres service container
- [x] 3.6 Set Postgres environment variables
- [x] 3.7 Configure Postgres port mapping
- [x] 3.8 Add checkout step
- [x] 3.9 Add Node.js setup step
- [x] 3.10 Add npm ci step for dependencies
- [x] 3.11 Add TypeScript type checking step
- [x] 3.12 Add ESLint linting step
- [x] 3.13 Add unit tests step
- [x] 3.14 Add integration tests step
- [x] 3.15 Configure DATABASE_URL for test environment
- [x] 3.16 Add test coverage reporting
- [x] 3.17 Cache node_modules for faster builds

## 4. GitHub Actions CD Workflow

- [x] 4.1 Create deploy.yml workflow file
- [x] 4.2 Configure trigger on push to main
- [x] 4.3 Add test job as dependency
- [x] 4.4 Configure Postgres service for test job
- [x] 4.5 Run full test suite before deploy
- [x] 4.6 Add deploy job with needs: test
- [x] 4.7 Use heroku-deploy action
- [x] 4.8 Configure HEROKU_API_KEY secret
- [x] 4.9 Configure HEROKU_EMAIL secret
- [x] 4.10 Set heroku_app_name
- [x] 4.11 Add post-deploy health check
- [x] 4.12 Configure deployment notifications (optional)

## 5. Database Migration Scripts

- [x] 5.1 Create production migration script
- [x] 5.2 Use prisma migrate deploy for production
- [x] 5.3 Add migration step to deployment process
- [x] 5.4 Create database backup script (pre-migration)
- [x] 5.5 Document rollback procedures
- [x] 5.6 Add migration status check command
- [x] 5.7 Configure Heroku release phase for migrations

## 6. Frontend Build Process

- [x] 6.1 Configure Vite production build
- [x] 6.2 Set up environment variables for build
- [x] 6.3 Configure VITE_API_URL for production
- [x] 6.4 Optimize bundle with code splitting
- [x] 6.5 Enable minification and compression
- [x] 6.6 Generate source maps for error tracking
- [x] 6.7 Configure asset hashing for cache busting

## 7. Static File Serving

- [x] 7.1 Create public directory in API package
- [x] 7.2 Configure Express static middleware
- [x] 7.3 Set up SPA fallback route
- [x] 7.4 Configure cache headers for static assets
- [x] 7.5 Set long cache for hashed assets
- [x] 7.6 Set no-cache for index.html
- [x] 7.7 Enable gzip compression

## 8. Build Scripts

- [x] 8.1 Create build:web npm script
- [x] 8.2 Create build:api npm script
- [x] 8.3 Create build:all npm script
- [x] 8.4 Create copy:assets script (web to api/public)
- [x] 8.5 Create heroku-postbuild script
- [x] 8.6 Configure package.json engines (Node.js version)
- [x] 8.7 Add start script for production

## 9. Health Check Endpoint

- [x] 9.1 Create /health endpoint
- [x] 9.2 Check database connectivity
- [x] 9.3 Check Redis connectivity
- [x] 9.4 Return application version
- [x] 9.5 Return uptime information
- [x] 9.6 Configure Heroku health check

## 10. Security Configuration

- [x] 10.1 Ensure HTTPS enforcement in production
- [x] 10.2 Configure secure cookie settings
- [x] 10.3 Set trust proxy for Heroku
- [x] 10.4 Validate all secrets are set on startup
- [x] 10.5 Configure CORS for production domain

## 11. Documentation

- [x] 11.1 Document deployment process
- [x] 11.2 Document environment variable setup
- [x] 11.3 Document rollback procedures
- [x] 11.4 Document manual deployment steps
- [x] 11.5 Create deployment checklist
- [x] 11.6 Document GitHub Secrets setup

## 12. Testing & Verification

- [x] 12.1 Test CI workflow on PR
- [x] 12.2 Verify tests run in CI environment
- [x] 12.3 Test deployment to staging (if available)
- [x] 12.4 Verify database migrations run correctly
- [x] 12.5 Test health check endpoint
- [x] 12.6 Verify static file serving
- [x] 12.7 Test production build locally
- [x] 12.8 Verify environment variable validation
