import { test as base, Page, BrowserContext } from '@playwright/test';
import { LandingPage } from '../page-objects/landing-page';
import { LoginPage } from '../page-objects/login-page';
import { RegisterPage } from '../page-objects/register-page';
import { CalendarPage } from '../page-objects/calendar-page';
import { TestUser, createTestUser, deleteTestUser, getConfirmationToken, confirmUser } from '../utils/test-helpers';

/**
 * Extended test fixtures for E2E tests
 */
interface TestFixtures {
  // Page objects
  landingPage: LandingPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  calendarPage: CalendarPage;

  // Test data helpers
  testUser: TestUser;
  authenticatedPage: Page;
}

/**
 * Extended fixtures
 */
export const test = base.extend<TestFixtures>({
  landingPage: async ({ page }, use) => {
    const landingPage = new LandingPage(page);
    await use(landingPage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  calendarPage: async ({ page }, use) => {
    const calendarPage = new CalendarPage(page);
    await use(calendarPage);
  },

  testUser: async ({}, use) => {
    // Create a unique test user for this test
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const user: TestUser = {
      name: `Test User ${timestamp}`,
      email: `test-${timestamp}-${random}@e2e-test.local`,
      password: 'TestPass123!',
    };
    await use(user);
  },

  authenticatedPage: async ({ page, browser }, use) => {
    // Create a confirmed test user and log them in
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const userEmail = `auth-${timestamp}-${random}@e2e-test.local`;
    const userPassword = 'AuthPass123!';

    let userId: string | undefined;

    try {
      // Create and confirm user via API/database
      userId = await createTestUser({
        name: 'Authenticated User',
        email: userEmail,
        password: userPassword,
      });

      if (userId) {
        await confirmUser(userId);

        // Login via the UI
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(userEmail, userPassword);
        await page.waitForURL('**/calendar');
      }

      await use(page);
    } finally {
      // Cleanup: delete the test user
      if (userId) {
        await deleteTestUser(userId);
      }
    }
  },
});

export { expect } from '@playwright/test';
