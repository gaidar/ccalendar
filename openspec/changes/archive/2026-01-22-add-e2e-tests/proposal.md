# Change: Add End-to-End Testing with Playwright

## Why

The application has comprehensive unit and integration tests but lacks end-to-end testing to validate complete user journeys through the browser. E2E tests catch integration issues between frontend and backend that lower-level tests miss, and provide confidence that critical user flows work correctly from a user's perspective.

## What Changes

- Install and configure Playwright for browser-based E2E testing
- Create test infrastructure with proper setup/teardown, test database isolation, and fixtures
- Implement critical journey tests covering:
  - User registration with email confirmation
  - User login/logout flows
  - Adding, viewing, and removing travel records
  - Calendar navigation and date selection
- Add CI integration for running E2E tests in GitHub Actions

## Impact

- Affected specs: Creates new `e2e-testing` capability specification
- Affected code:
  - `packages/e2e/` - New package for E2E tests
  - `playwright.config.ts` - Playwright configuration
  - `.github/workflows/` - CI workflow updates
  - Root `package.json` - Workspace addition
