## 1. Infrastructure Setup

- [x] 1.1 Create `packages/e2e/` directory with package.json
- [x] 1.2 Install Playwright and configure `playwright.config.ts`
- [x] 1.3 Set up test database isolation (separate test DB or transaction rollback)
- [x] 1.4 Create base fixtures for authentication, test data, and page objects
- [x] 1.5 Add npm scripts for running E2E tests locally and in CI
- [x] 1.6 Update root package.json workspaces

## 2. Test Utilities and Helpers

- [x] 2.1 Create page object models for common pages (Login, Register, Calendar)
- [x] 2.2 Implement authentication helpers for bypassing login in tests
- [x] 2.3 Create database seeding utilities for test data
- [x] 2.4 Set up screenshot and video capture for failed tests

## 3. Critical Journey: Registration Flow

- [x] 3.1 Test: Navigate to registration page from landing page
- [x] 3.2 Test: Fill and submit registration form with valid data
- [x] 3.3 Test: Verify email confirmation required message
- [x] 3.4 Test: Confirm email via token and verify redirect to login
- [x] 3.5 Test: Form validation errors display correctly

## 4. Critical Journey: Login/Logout Flow

- [x] 4.1 Test: Navigate to login page
- [x] 4.2 Test: Login with valid credentials redirects to calendar
- [x] 4.3 Test: Login with invalid credentials shows error
- [x] 4.4 Test: Logout clears session and redirects to landing

## 5. Critical Journey: Travel Record Management

- [x] 5.1 Test: View calendar with existing travel records
- [x] 5.2 Test: Click on a date to open country picker
- [x] 5.3 Test: Search and select a country
- [x] 5.4 Test: Verify travel record appears on calendar
- [x] 5.5 Test: Remove travel record and verify removal
- [x] 5.6 Test: Navigate between months

## 6. CI Integration

- [x] 6.1 Add Playwright browsers installation to CI
- [x] 6.2 Create GitHub Actions workflow for E2E tests
- [x] 6.3 Configure artifact uploads for test reports and videos
- [x] 6.4 Add E2E test execution to PR checks

## 7. Documentation and Review

- [x] 7.1 Document E2E test conventions in README
- [x] 7.2 Add instructions for running E2E tests locally
- [x] 7.3 Code review of all changes
