# Testing Guide

This document covers the testing strategy, test organization, and best practices for Country Calendar.

## Testing Strategy

Country Calendar uses a three-tier testing approach:

| Level | Tool | Purpose | Location |
|-------|------|---------|----------|
| **Unit** | Vitest | Test individual functions/components | `packages/*/tests/` |
| **Integration** | Vitest + Supertest | Test API endpoints | `packages/api/tests/` |
| **E2E** | Playwright | Test user journeys | `packages/e2e/` |

## Running Tests

### All Tests

```bash
# From root directory
npm test

# With coverage
npm run test:coverage
```

### API Tests

```bash
cd packages/api

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific file
npm test -- tests/services/authService.test.ts
```

### Web Tests

```bash
cd packages/web

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific component
npm test -- src/components/Calendar.test.tsx
```

### E2E Tests

```bash
cd packages/e2e

# Run all E2E tests
npm test

# With UI
npm run test:ui

# Headed mode (visible browser)
npm run test:headed

# Debug mode
npm run test:debug

# Specific test file
npm test -- tests/auth.spec.ts
```

## Test Organization

### API Test Structure

```
packages/api/tests/
├── setup.ts                    # Test setup and utilities
├── controllers/
│   ├── authController.test.ts
│   ├── travelRecordsController.test.ts
│   └── ...
├── services/
│   ├── authService.test.ts
│   ├── travelRecordsService.test.ts
│   └── ...
├── middleware/
│   ├── authenticate.test.ts
│   └── rateLimit.test.ts
└── integration/
    ├── auth.integration.test.ts
    └── travelRecords.integration.test.ts
```

### Web Test Structure

```
packages/web/src/
├── components/
│   ├── features/
│   │   └── calendar/
│   │       ├── Calendar.tsx
│   │       └── Calendar.test.tsx    # Co-located
│   └── ui/
│       ├── Button.tsx
│       └── Button.test.tsx
├── stores/
│   ├── authStore.ts
│   └── authStore.test.ts
└── test/
    └── setup.ts                      # Test setup
```

### E2E Test Structure

```
packages/e2e/
├── tests/
│   ├── auth.spec.ts
│   ├── calendar.spec.ts
│   ├── reports.spec.ts
│   └── admin.spec.ts
├── page-objects/
│   ├── LoginPage.ts
│   ├── CalendarPage.ts
│   └── BasePage.ts
├── fixtures/
│   ├── users.json
│   └── travelRecords.json
└── utils/
    ├── testHelpers.ts
    └── apiHelpers.ts
```

## Writing Tests

### Unit Test Example (Service)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '@/services/authService';
import { prisma } from '@/utils/prisma';

// Mock dependencies
vi.mock('@/utils/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 'uuid',
        ...userData,
        passwordHash: 'hashed',
        isAdmin: false,
        isActive: true,
        emailConfirmed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await AuthService.register(userData);

      expect(result.email).toBe(userData.email);
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'existing-id',
      } as any);

      await expect(
        AuthService.register({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Test',
        })
      ).rejects.toThrow('Email already registered');
    });
  });
});
```

### Integration Test Example (API)

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/index';
import { prisma } from '@/utils/prisma';

describe('POST /api/v1/auth/login', () => {
  let testUser: { email: string; password: string };

  beforeAll(async () => {
    // Create test user
    testUser = {
      email: 'test@example.com',
      password: 'password123',
    };
    await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash: await hashPassword(testUser.password),
        name: 'Test User',
        emailConfirmed: true,
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  it('should return tokens for valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(testUser)
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(response.body.user.email).toBe(testUser.email);
  });

  it('should return 401 for invalid password', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      })
      .expect(401);

    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
```

### Component Test Example (React)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from './Calendar';
import { useCalendarStore } from '@/stores/calendarStore';

// Mock store
vi.mock('@/stores/calendarStore');

describe('Calendar', () => {
  const mockStore = {
    currentMonth: new Date(2024, 0, 1),
    records: [],
    setCurrentMonth: vi.fn(),
    addRecord: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useCalendarStore).mockReturnValue(mockStore);
  });

  it('should render current month', () => {
    render(<Calendar />);

    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });

  it('should navigate to next month', () => {
    render(<Calendar />);

    fireEvent.click(screen.getByLabelText('Next month'));

    expect(mockStore.setCurrentMonth).toHaveBeenCalled();
  });

  it('should open country picker on day click', () => {
    render(<Calendar />);

    fireEvent.click(screen.getByText('15'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

### E2E Test Example (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { CalendarPage } from '../page-objects/CalendarPage';

test.describe('Calendar Flow', () => {
  let loginPage: LoginPage;
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    calendarPage = new CalendarPage(page);

    // Login before each test
    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');
  });

  test('should add travel record', async () => {
    await calendarPage.goto();

    // Click on a day
    await calendarPage.clickDay(15);

    // Select country
    await calendarPage.selectCountry('Japan');

    // Verify record appears
    await expect(calendarPage.getDayCell(15)).toContainText('JP');
  });

  test('should bulk update date range', async () => {
    await calendarPage.goto();

    // Select date range
    await calendarPage.selectDateRange(10, 15);

    // Set country for range
    await calendarPage.selectCountry('France');

    // Verify all days updated
    for (let day = 10; day <= 15; day++) {
      await expect(calendarPage.getDayCell(day)).toContainText('FR');
    }
  });
});
```

## Page Objects Pattern

```typescript
// packages/e2e/page-objects/CalendarPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CalendarPage extends BasePage {
  readonly monthTitle: Locator;
  readonly nextMonthButton: Locator;
  readonly prevMonthButton: Locator;
  readonly countryPicker: Locator;

  constructor(page: Page) {
    super(page);
    this.monthTitle = page.getByTestId('month-title');
    this.nextMonthButton = page.getByLabelText('Next month');
    this.prevMonthButton = page.getByLabelText('Previous month');
    this.countryPicker = page.getByTestId('country-picker');
  }

  async goto() {
    await this.page.goto('/calendar');
  }

  async clickDay(day: number) {
    await this.page.getByTestId(`day-${day}`).click();
  }

  async selectCountry(countryName: string) {
    await this.countryPicker.getByRole('combobox').click();
    await this.page.getByText(countryName).click();
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  getDayCell(day: number) {
    return this.page.getByTestId(`day-${day}`);
  }

  async selectDateRange(startDay: number, endDay: number) {
    await this.page.getByTestId(`day-${startDay}`).click();
    await this.page.keyboard.down('Shift');
    await this.page.getByTestId(`day-${endDay}`).click();
    await this.page.keyboard.up('Shift');
  }
}
```

## Mocking

### Mocking API Calls (Web)

```typescript
import { vi } from 'vitest';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// In test
vi.mocked(api.get).mockResolvedValue({
  data: { records: [] },
});
```

### Mocking Prisma (API)

```typescript
import { vi } from 'vitest';
import { prisma } from '@/utils/prisma';

vi.mock('@/utils/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    travelRecord: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));
```

### Mocking External Services

```typescript
// Mock email service
vi.mock('@/services/email/emailService', () => ({
  EmailService: {
    sendWelcomeEmail: vi.fn().mockResolvedValue(true),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
  },
}));

// Mock Redis
vi.mock('@/utils/redis', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));
```

## Test Data

### Fixtures

```typescript
// packages/e2e/fixtures/users.ts
export const testUsers = {
  standard: {
    email: 'user@example.com',
    password: 'password123',
    name: 'Test User',
  },
  admin: {
    email: 'admin@example.com',
    password: 'adminpass123',
    name: 'Admin User',
  },
};

export const testRecords = [
  {
    date: '2024-01-15',
    countryCode: 'JP',
    countryName: 'Japan',
  },
  {
    date: '2024-01-16',
    countryCode: 'JP',
    countryName: 'Japan',
  },
];
```

### Factories

```typescript
// packages/api/tests/factories/userFactory.ts
import { faker } from '@faker-js/faker';

export const createUser = (overrides = {}) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  passwordHash: 'hashed',
  isAdmin: false,
  isActive: true,
  emailConfirmed: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTravelRecord = (userId: string, overrides = {}) => ({
  id: faker.string.uuid(),
  userId,
  date: faker.date.past(),
  countryCode: faker.location.countryCode(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
```

## CI/CD Integration

### GitHub Actions Configuration

Tests run automatically on pull requests:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
```

## Best Practices

### Test Structure (AAA Pattern)

```typescript
it('should do something', async () => {
  // Arrange - Set up test data
  const input = { ... };

  // Act - Perform the action
  const result = await functionUnderTest(input);

  // Assert - Verify the result
  expect(result).toBe(expected);
});
```

### Naming Conventions

- Describe what is being tested
- Use "should" to describe expected behavior
- Be specific about conditions

```typescript
describe('AuthService.login', () => {
  it('should return tokens for valid credentials', ...);
  it('should throw UNAUTHORIZED for invalid password', ...);
  it('should throw ACCOUNT_LOCKED after 5 failed attempts', ...);
});
```

### Test Isolation

- Each test should be independent
- Clean up after tests (use afterEach/afterAll)
- Don't rely on test execution order
- Use fresh test data for each test

### Coverage Goals

- **Services:** 80%+ coverage
- **Controllers:** 70%+ coverage
- **Components:** 70%+ coverage
- **Critical paths:** 100% coverage
