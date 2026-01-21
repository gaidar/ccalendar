# Tasks: Production Deployment

## 1. Heroku Configuration Files

- [ ] 1.1 Create Procfile in repository root
- [ ] 1.2 Configure web process to start API server
- [ ] 1.3 Create app.json for Heroku Button
- [ ] 1.4 Configure Node.js buildpack
- [ ] 1.5 Add Heroku Postgres add-on configuration
- [ ] 1.6 Add Heroku Redis add-on configuration
- [ ] 1.7 Configure environment variable placeholders
- [ ] 1.8 Set JWT_SECRET generator to use secret
- [ ] 1.9 Set JWT_REFRESH_SECRET generator to use secret
- [ ] 1.10 Add application metadata (name, description, repository)

## 2. Production Environment Variables

- [ ] 2.1 Document all required environment variables
- [ ] 2.2 Configure NODE_ENV=production
- [ ] 2.3 Set up DATABASE_URL from Heroku Postgres
- [ ] 2.4 Set up REDIS_URL from Heroku Redis
- [ ] 2.5 Configure JWT_SECRET (production value)
- [ ] 2.6 Configure JWT_REFRESH_SECRET (production value)
- [ ] 2.7 Configure OAuth credentials (Google)
- [ ] 2.8 Configure OAuth credentials (Facebook)
- [ ] 2.9 Configure OAuth credentials (Apple)
- [ ] 2.10 Configure Mailgun credentials
- [ ] 2.11 Configure FRONTEND_URL
- [ ] 2.12 Configure Sentry DSN
- [ ] 2.13 Create environment variable validation on startup

## 3. GitHub Actions CI Workflow

- [ ] 3.1 Create .github/workflows directory
- [ ] 3.2 Create ci.yml workflow file
- [ ] 3.3 Configure trigger on pull_request to main
- [ ] 3.4 Set up Node.js 20 environment
- [ ] 3.5 Configure Postgres service container
- [ ] 3.6 Set Postgres environment variables
- [ ] 3.7 Configure Postgres port mapping
- [ ] 3.8 Add checkout step
- [ ] 3.9 Add Node.js setup step
- [ ] 3.10 Add npm ci step for dependencies
- [ ] 3.11 Add TypeScript type checking step
- [ ] 3.12 Add ESLint linting step
- [ ] 3.13 Add unit tests step
- [ ] 3.14 Add integration tests step
- [ ] 3.15 Configure DATABASE_URL for test environment
- [ ] 3.16 Add test coverage reporting
- [ ] 3.17 Cache node_modules for faster builds

## 4. GitHub Actions CD Workflow

- [ ] 4.1 Create deploy.yml workflow file
- [ ] 4.2 Configure trigger on push to main
- [ ] 4.3 Add test job as dependency
- [ ] 4.4 Configure Postgres service for test job
- [ ] 4.5 Run full test suite before deploy
- [ ] 4.6 Add deploy job with needs: test
- [ ] 4.7 Use heroku-deploy action
- [ ] 4.8 Configure HEROKU_API_KEY secret
- [ ] 4.9 Configure HEROKU_EMAIL secret
- [ ] 4.10 Set heroku_app_name
- [ ] 4.11 Add post-deploy health check
- [ ] 4.12 Configure deployment notifications (optional)

## 5. Database Migration Scripts

- [ ] 5.1 Create production migration script
- [ ] 5.2 Use prisma migrate deploy for production
- [ ] 5.3 Add migration step to deployment process
- [ ] 5.4 Create database backup script (pre-migration)
- [ ] 5.5 Document rollback procedures
- [ ] 5.6 Add migration status check command
- [ ] 5.7 Configure Heroku release phase for migrations

## 6. Frontend Build Process

- [ ] 6.1 Configure Vite production build
- [ ] 6.2 Set up environment variables for build
- [ ] 6.3 Configure VITE_API_URL for production
- [ ] 6.4 Optimize bundle with code splitting
- [ ] 6.5 Enable minification and compression
- [ ] 6.6 Generate source maps for error tracking
- [ ] 6.7 Configure asset hashing for cache busting

## 7. Static File Serving

- [ ] 7.1 Create public directory in API package
- [ ] 7.2 Configure Express static middleware
- [ ] 7.3 Set up SPA fallback route
- [ ] 7.4 Configure cache headers for static assets
- [ ] 7.5 Set long cache for hashed assets
- [ ] 7.6 Set no-cache for index.html
- [ ] 7.7 Enable gzip compression

## 8. Build Scripts

- [ ] 8.1 Create build:web npm script
- [ ] 8.2 Create build:api npm script
- [ ] 8.3 Create build:all npm script
- [ ] 8.4 Create copy:assets script (web to api/public)
- [ ] 8.5 Create heroku-postbuild script
- [ ] 8.6 Configure package.json engines (Node.js version)
- [ ] 8.7 Add start script for production

## 9. Health Check Endpoint

- [ ] 9.1 Create /health endpoint
- [ ] 9.2 Check database connectivity
- [ ] 9.3 Check Redis connectivity
- [ ] 9.4 Return application version
- [ ] 9.5 Return uptime information
- [ ] 9.6 Configure Heroku health check

## 10. Security Configuration

- [ ] 10.1 Ensure HTTPS enforcement in production
- [ ] 10.2 Configure secure cookie settings
- [ ] 10.3 Set trust proxy for Heroku
- [ ] 10.4 Validate all secrets are set on startup
- [ ] 10.5 Configure CORS for production domain

## 11. Documentation

- [ ] 11.1 Document deployment process
- [ ] 11.2 Document environment variable setup
- [ ] 11.3 Document rollback procedures
- [ ] 11.4 Document manual deployment steps
- [ ] 11.5 Create deployment checklist
- [ ] 11.6 Document GitHub Secrets setup

## 12. Testing & Verification

- [ ] 12.1 Test CI workflow on PR
- [ ] 12.2 Verify tests run in CI environment
- [ ] 12.3 Test deployment to staging (if available)
- [ ] 12.4 Verify database migrations run correctly
- [ ] 12.5 Test health check endpoint
- [ ] 12.6 Verify static file serving
- [ ] 12.7 Test production build locally
- [ ] 12.8 Verify environment variable validation
