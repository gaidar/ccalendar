# E2E Tests

End-to-end tests for Country Calendar using [Playwright](https://playwright.dev/).

## Prerequisites

- Node.js 20+
- PostgreSQL database running
- API and Web servers (can be started automatically in dev mode)

## Installation

From the root directory:

```bash
npm install
```

Install Playwright browsers:

```bash
cd packages/e2e
npx playwright install
```

## Running Tests

### From Root Directory

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

### From E2E Package

```bash
cd packages/e2e

# Run all tests
npm test

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run in UI mode
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Run in debug mode
npm run test:debug

# View test report
npm run test:report
```

## Test Structure

```
packages/e2e/
├── fixtures/           # Test fixtures and setup
│   ├── global-setup.ts    # Runs once before all tests
│   ├── global-teardown.ts # Runs once after all tests
│   └── test-fixtures.ts   # Custom test fixtures
├── page-objects/       # Page Object Models
│   ├── landing-page.ts
│   ├── login-page.ts
│   ├── register-page.ts
│   └── calendar-page.ts
├── tests/             # Test files
│   ├── auth.spec.ts       # Login/logout tests
│   ├── registration.spec.ts # Registration flow tests
│   └── travel-records.spec.ts # Calendar/travel record tests
├── utils/             # Test utilities
│   └── test-helpers.ts    # Database helpers
├── playwright.config.ts
└── package.json
```

## Writing Tests

### Using Page Objects

```typescript
import { test, expect } from '../fixtures/test-fixtures';

test('should login successfully', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await loginPage.waitForLoginSuccess();
});
```

### Using Test Fixtures

The test fixtures provide:

- `landingPage` - Landing page object
- `loginPage` - Login page object
- `registerPage` - Registration page object
- `calendarPage` - Calendar page object
- `testUser` - Unique test user credentials
- `authenticatedPage` - Pre-authenticated page

### Database Helpers

```typescript
import {
  createTestUser,
  deleteTestUser,
  createConfirmedTestUser,
  createTestTravelRecord,
} from '../utils/test-helpers';

// Create a confirmed user
const userId = await createConfirmedTestUser({
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
});

// Clean up after test
await deleteTestUser(userId);
```

## Environment Variables

Create `.env.test` in the project root for test configuration:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ccalendar_test
JWT_SECRET=test-secret-key
E2E_BASE_URL=http://localhost:3000
E2E_API_URL=http://localhost:3001
```

## CI/CD

E2E tests run automatically on pull requests via GitHub Actions. See `.github/workflows/e2e.yml`.

### Viewing CI Results

- Test reports are uploaded as artifacts
- Screenshots and videos are captured on failure
- Artifacts are retained for 7 days

## Debugging

### Visual Debugging

```bash
# Run with UI mode to step through tests
npm run test:ui

# Run in debug mode with DevTools
npm run test:debug
```

### Viewing Traces

When tests fail, Playwright captures traces. View them with:

```bash
npx playwright show-trace test-results/path/to/trace.zip
```

## Best Practices

1. **Use Page Objects** - Keep selectors and interactions in page objects
2. **Clean Up Test Data** - Always delete test users and records after tests
3. **Use Unique Data** - Generate unique emails for each test run
4. **Avoid Flaky Tests** - Use proper waits and assertions
5. **Keep Tests Independent** - Each test should work in isolation
