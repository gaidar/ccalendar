## ADDED Requirements

### Requirement: Playwright Infrastructure

The system SHALL provide a Playwright-based E2E testing infrastructure configured for the Country Calendar application.

#### Scenario: Test environment isolation
- **WHEN** E2E tests execute
- **THEN** tests MUST run against an isolated test database
- **AND** each test MUST start with a clean database state
- **AND** tests MUST NOT affect development or production data

#### Scenario: Browser configuration
- **WHEN** Playwright is configured
- **THEN** tests MUST support Chromium, Firefox, and WebKit browsers
- **AND** tests MUST run in headless mode by default
- **AND** tests MUST support headed mode for debugging via CLI flag

#### Scenario: Test artifacts on failure
- **WHEN** a test fails
- **THEN** the system MUST capture a screenshot at the failure point
- **AND** the system MUST capture a video of the test execution
- **AND** artifacts MUST be stored in a configured output directory

### Requirement: Authentication Test Helpers

The system SHALL provide test utilities for managing authenticated user sessions in E2E tests.

#### Scenario: Test user creation
- **WHEN** a test requires an authenticated user
- **THEN** the test fixture MUST create a confirmed user with specified credentials
- **AND** the fixture MUST clean up the user after test completion

#### Scenario: Authentication bypass
- **WHEN** a test needs to start from an authenticated state
- **THEN** the system MUST provide a fixture that injects valid session tokens
- **AND** the fixture MUST skip the login UI flow for efficiency

#### Scenario: Multiple user roles
- **WHEN** tests require different user roles
- **THEN** fixtures MUST support creating regular users and admin users
- **AND** each user type MUST have appropriate permissions applied

### Requirement: Page Object Models

The system SHALL provide page object models encapsulating UI interactions for common pages.

#### Scenario: Landing page model
- **WHEN** tests interact with the landing page
- **THEN** the page model MUST expose methods for:
  - Navigating to login
  - Navigating to registration
  - Verifying page content

#### Scenario: Login page model
- **WHEN** tests interact with the login page
- **THEN** the page model MUST expose methods for:
  - Filling email and password fields
  - Submitting the login form
  - Retrieving validation error messages
  - Clicking OAuth provider buttons

#### Scenario: Registration page model
- **WHEN** tests interact with the registration page
- **THEN** the page model MUST expose methods for:
  - Filling all registration fields (name, email, password, confirm password)
  - Submitting the registration form
  - Retrieving validation error messages

#### Scenario: Calendar page model
- **WHEN** tests interact with the calendar page
- **THEN** the page model MUST expose methods for:
  - Navigating to previous/next month
  - Clicking on a specific date
  - Verifying country indicators on dates
  - Opening and using the country picker

### Requirement: Registration Flow E2E Tests

The system SHALL include E2E tests that verify the complete user registration journey.

#### Scenario: Successful registration
- **WHEN** a user navigates to the registration page
- **AND** fills in valid name, email, password, and password confirmation
- **AND** submits the form
- **THEN** the system MUST display a confirmation message about email verification
- **AND** a confirmation email MUST be recorded (or mocked in tests)

#### Scenario: Registration form validation
- **WHEN** a user submits the registration form with invalid data
- **THEN** appropriate validation errors MUST be displayed
- **AND** the errors MUST include:
  - Invalid email format
  - Password too short (less than 8 characters)
  - Passwords do not match
  - Email already registered

#### Scenario: Email confirmation
- **WHEN** a user clicks the confirmation link from email
- **THEN** the account MUST be marked as confirmed
- **AND** the user MUST be redirected to the login page
- **AND** a success message MUST be displayed

### Requirement: Login and Logout E2E Tests

The system SHALL include E2E tests that verify user authentication flows.

#### Scenario: Successful login
- **WHEN** a confirmed user navigates to the login page
- **AND** enters valid credentials
- **AND** submits the form
- **THEN** the user MUST be redirected to the calendar page
- **AND** the navigation MUST show the user as logged in

#### Scenario: Failed login
- **WHEN** a user enters invalid credentials
- **THEN** an error message MUST be displayed
- **AND** the user MUST remain on the login page

#### Scenario: Unconfirmed user login
- **WHEN** an unconfirmed user attempts to login
- **THEN** the system MUST display a message about email confirmation required
- **AND** the user MUST NOT be granted access to protected pages

#### Scenario: Logout
- **WHEN** a logged-in user clicks the logout button
- **THEN** the session MUST be terminated
- **AND** the user MUST be redirected to the landing page
- **AND** attempting to access protected pages MUST redirect to login

### Requirement: Travel Record Management E2E Tests

The system SHALL include E2E tests that verify travel record CRUD operations through the calendar UI.

#### Scenario: Add travel record
- **WHEN** a logged-in user clicks on a calendar date
- **AND** searches for and selects a country
- **THEN** the travel record MUST be saved
- **AND** the country indicator MUST appear on the selected date
- **AND** the UI MUST update without full page reload

#### Scenario: View existing travel records
- **WHEN** a logged-in user views the calendar
- **AND** travel records exist for the displayed month
- **THEN** country color indicators MUST be displayed on the appropriate dates
- **AND** clicking a date with records MUST show the assigned countries

#### Scenario: Remove travel record
- **WHEN** a logged-in user clicks on a date with travel records
- **AND** removes a country from that date
- **THEN** the travel record MUST be deleted
- **AND** the country indicator MUST be removed from the calendar

#### Scenario: Calendar navigation
- **WHEN** a logged-in user navigates to the previous or next month
- **THEN** the calendar MUST display the correct month
- **AND** travel records for that month MUST be loaded and displayed
- **AND** the month/year header MUST update accordingly

### Requirement: CI Pipeline Integration

The system SHALL execute E2E tests as part of the continuous integration pipeline.

#### Scenario: E2E tests in pull request checks
- **WHEN** a pull request is created or updated
- **THEN** E2E tests MUST run automatically
- **AND** the PR MUST be blocked from merging if E2E tests fail

#### Scenario: Test parallelization
- **WHEN** E2E tests execute in CI
- **THEN** tests MUST run with appropriate sharding for performance
- **AND** test results MUST be aggregated across shards

#### Scenario: Artifact retention
- **WHEN** E2E tests complete in CI
- **THEN** test reports MUST be uploaded as artifacts
- **AND** failure screenshots and videos MUST be available for download
- **AND** artifacts MUST be retained for at least 7 days
