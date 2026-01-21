# Proposal: Production Deployment

## Summary

This change implements the production deployment infrastructure for the Country Calendar application, including Heroku configuration, GitHub Actions CI/CD pipelines, and the frontend build process.

## Motivation

The application needs a robust deployment pipeline to:
- Deploy to Heroku with proper configuration
- Run automated tests on pull requests
- Auto-deploy to production on merge to main
- Build and serve the frontend through the API server
- Run database migrations safely in production

## Scope

### In Scope
- Heroku configuration (Procfile, app.json)
- Production environment variables setup
- GitHub Actions CI workflow (test on PR)
- GitHub Actions CD workflow (deploy on merge)
- Database migration scripts for production
- Frontend build and static serving through Express
- Build scripts and npm commands

### Out of Scope
- Monitoring and alerting (covered in Security & Performance)
- Error tracking setup (covered in Security & Performance)
- Infrastructure scaling decisions
- Custom domain configuration

## Technical Approach

### Heroku Configuration
- Single `Procfile` for web dyno
- `app.json` for Heroku Button and environment setup
- Heroku Postgres (essential-0 plan) for database
- Heroku Redis (mini plan) for caching
- Node.js buildpack

### CI/CD Pipeline
- GitHub Actions workflow for testing on PR
- Postgres service container for integration tests
- Automatic deployment to Heroku on main branch
- Heroku Deploy action for seamless deployments

### Build Process
- Vite build for frontend production bundle
- Copy built assets to API public folder
- Express static file serving
- Prisma migration deploy for production

## Dependencies

- All previous phases must be implemented
- Test infrastructure (Phase 12) should be complete for CI
- Heroku account with appropriate add-ons
- GitHub repository with Actions enabled

## Risks

| Risk | Mitigation |
|------|------------|
| Database migration failures | Use `prisma migrate deploy` for safe production migrations |
| Build failures blocking deploy | Separate test and deploy jobs with dependencies |
| Environment variable leaks | Use GitHub Secrets and Heroku Config Vars |
| Downtime during deployment | Heroku's zero-downtime deployment |
