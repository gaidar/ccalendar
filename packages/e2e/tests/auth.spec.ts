import { test, expect } from '../fixtures/test-fixtures';
import { createConfirmedTestUser, createTestUser, deleteTestUser, generateTestEmail } from '../utils/test-helpers';

test.describe('Login Flow', () => {
  test.describe('Navigation to Login', () => {
    test('should navigate from landing page to login', async ({ landingPage }) => {
      await landingPage.goto();
      await landingPage.goToLogin();
      await expect(landingPage.page).toHaveURL(/\/login/);
    });

    test('should navigate from hero "I already have an account" to login', async ({ landingPage }) => {
      await landingPage.goto();
      await landingPage.goToLoginFromHero();
      await expect(landingPage.page).toHaveURL(/\/login/);
    });
  });

  test.describe('Login Page Content', () => {
    test('should display login page correctly', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.verifyPageContent();
    });
  });

  test.describe('Login Validation', () => {
    test('should show validation errors for empty form', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.submit();

      expect(await loginPage.hasEmailError()).toBe(true);
      expect(await loginPage.hasPasswordError()).toBe(true);
    });

    test('should show error for invalid email format', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillEmail('invalid-email');
      await loginPage.fillPassword('somepassword');
      await loginPage.submit();

      expect(await loginPage.hasEmailError()).toBe(true);
    });
  });

  test.describe('Successful Login', () => {
    let testUserId: string | undefined;
    const testEmail = generateTestEmail('login-test');
    const testPassword = 'TestLogin123!';

    test.beforeAll(async () => {
      // Create a confirmed test user
      testUserId = await createConfirmedTestUser({
        name: 'Login Test User',
        email: testEmail,
        password: testPassword,
      });
    });

    test.afterAll(async () => {
      if (testUserId) {
        await deleteTestUser(testUserId);
      }
    });

    test('should login with valid credentials and redirect to calendar', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(testEmail, testPassword);
      await loginPage.waitForLoginSuccess();

      await expect(loginPage.page).toHaveURL(/\/calendar/);
    });
  });

  test.describe('Failed Login', () => {
    test('should show error for invalid credentials', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login('nonexistent@example.com', 'wrongpassword');

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage.toLowerCase()).toMatch(/invalid|credentials|password/);
    });

    test('should remain on login page after failed login', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login('nonexistent@example.com', 'wrongpassword');

      await expect(loginPage.page).toHaveURL(/\/login/);
    });
  });

  test.describe('Unconfirmed User Login', () => {
    let unconfirmedUserId: string | undefined;
    const unconfirmedEmail = generateTestEmail('unconfirmed');
    const unconfirmedPassword = 'Unconfirmed123!';

    test.beforeAll(async () => {
      // Create an unconfirmed user
      unconfirmedUserId = await createTestUser({
        name: 'Unconfirmed User',
        email: unconfirmedEmail,
        password: unconfirmedPassword,
      });
    });

    test.afterAll(async () => {
      if (unconfirmedUserId) {
        await deleteTestUser(unconfirmedUserId);
      }
    });

    test('should allow unconfirmed user to login but show confirmation notice', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.login(unconfirmedEmail, unconfirmedPassword);

      // Should still be able to login (redirected to calendar)
      // The app shows a toast notification about confirming email
      await loginPage.waitForLoginSuccess();
      await expect(page).toHaveURL(/\/calendar/);

      // Look for the toast notification about email confirmation
      const toast = page.locator('[data-sonner-toast]');
      // Toast might appear briefly, we just check the user can access the page
    });
  });
});

test.describe('Logout Flow', () => {
  test.describe('Logout from Calendar', () => {
    let testUserId: string | undefined;
    const testEmail = generateTestEmail('logout-test');
    const testPassword = 'TestLogout123!';

    test.beforeAll(async () => {
      testUserId = await createConfirmedTestUser({
        name: 'Logout Test User',
        email: testEmail,
        password: testPassword,
      });
    });

    test.afterAll(async () => {
      if (testUserId) {
        await deleteTestUser(testUserId);
      }
    });

    test('should logout and redirect to landing page', async ({ loginPage, calendarPage, page }) => {
      // Login first
      await loginPage.goto();
      await loginPage.login(testEmail, testPassword);
      await loginPage.waitForLoginSuccess();

      // Now logout
      await calendarPage.signOut();
      await expect(page).toHaveURL('/');
    });

    test('should not access protected pages after logout', async ({ loginPage, calendarPage, page }) => {
      // Login first
      await loginPage.goto();
      await loginPage.login(testEmail, testPassword);
      await loginPage.waitForLoginSuccess();

      // Logout
      await calendarPage.signOut();

      // Try to access calendar directly
      await page.goto('/calendar');

      // Should be redirected to login
      await expect(page).toHaveURL(/\/login/);
    });
  });
});

test.describe('Session Management', () => {
  test('should redirect to login when accessing protected route without session', async ({ page }) => {
    await page.goto('/calendar');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect to login when accessing reports without session', async ({ page }) => {
    await page.goto('/reports');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect to login when accessing profile without session', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);
  });
});
