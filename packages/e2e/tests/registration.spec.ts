import { test, expect } from '../fixtures/test-fixtures';
import { deleteTestUserByEmail, getUserByEmail, getConfirmationToken, confirmUser } from '../utils/test-helpers';

test.describe('Registration Flow', () => {
  test.describe('Navigation to Registration', () => {
    test('should navigate from landing page to registration', async ({ landingPage }) => {
      await landingPage.goto();
      await landingPage.verifyPageContent();
      await landingPage.goToRegister();
      await expect(landingPage.page).toHaveURL(/\/register/);
    });

    test('should navigate from hero CTA to registration', async ({ landingPage }) => {
      await landingPage.goto();
      await landingPage.goToRegisterFromHero();
      await expect(landingPage.page).toHaveURL(/\/register/);
    });

    test('should navigate from login page to registration', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.goToRegister();
      await expect(loginPage.page).toHaveURL(/\/register/);
    });
  });

  test.describe('Registration Form Validation', () => {
    test('should show validation errors for empty form submission', async ({ registerPage }) => {
      await registerPage.goto();
      await registerPage.verifyPageContent();
      await registerPage.submit();

      // Check that validation errors appear
      expect(await registerPage.hasNameError()).toBe(true);
      expect(await registerPage.hasEmailError()).toBe(true);
      expect(await registerPage.hasPasswordError()).toBe(true);
    });

    test('should show error for invalid email format', async ({ registerPage }) => {
      await registerPage.goto();
      await registerPage.fillName('Test User');
      await registerPage.fillEmail('invalid-email');
      await registerPage.fillPassword('ValidPass123!');
      await registerPage.fillConfirmPassword('ValidPass123!');
      await registerPage.submit();

      expect(await registerPage.hasEmailError()).toBe(true);
      const emailError = await registerPage.getEmailErrorMessage();
      expect(emailError.toLowerCase()).toContain('email');
    });

    test('should show error for password too short', async ({ registerPage }) => {
      await registerPage.goto();
      await registerPage.fillName('Test User');
      await registerPage.fillEmail('test@example.com');
      await registerPage.fillPassword('short');
      await registerPage.fillConfirmPassword('short');
      await registerPage.submit();

      expect(await registerPage.hasPasswordError()).toBe(true);
      const passwordError = await registerPage.getPasswordErrorMessage();
      expect(passwordError.toLowerCase()).toMatch(/8|character/);
    });

    test('should show error for password mismatch', async ({ registerPage }) => {
      await registerPage.goto();
      await registerPage.fillName('Test User');
      await registerPage.fillEmail('test@example.com');
      await registerPage.fillPassword('ValidPass123!');
      await registerPage.fillConfirmPassword('DifferentPass123!');
      await registerPage.submit();

      expect(await registerPage.hasConfirmPasswordError()).toBe(true);
      const confirmError = await registerPage.getConfirmPasswordErrorMessage();
      expect(confirmError.toLowerCase()).toContain('match');
    });
  });

  test.describe('Successful Registration', () => {
    test('should register with valid data and show confirmation message', async ({ registerPage, testUser }) => {
      await registerPage.goto();
      await registerPage.register(testUser.name, testUser.email, testUser.password);

      // Wait for and verify success message
      await registerPage.verifySuccessMessage();

      // Cleanup
      const user = await getUserByEmail(testUser.email);
      if (user) {
        await deleteTestUserByEmail(testUser.email);
      }
    });

    test('should navigate to login after successful registration', async ({ registerPage, testUser }) => {
      await registerPage.goto();
      await registerPage.register(testUser.name, testUser.email, testUser.password);
      await registerPage.verifySuccessMessage();
      await registerPage.clickGoToLogin();

      await expect(registerPage.page).toHaveURL(/\/login/);

      // Cleanup
      await deleteTestUserByEmail(testUser.email);
    });
  });

  test.describe('Email Already Registered', () => {
    test('should show error when email is already registered', async ({ registerPage, testUser }) => {
      // First registration
      await registerPage.goto();
      await registerPage.register(testUser.name, testUser.email, testUser.password);
      await registerPage.verifySuccessMessage();

      // Navigate back to register page
      await registerPage.goto();

      // Try to register with the same email
      await registerPage.register('Another User', testUser.email, testUser.password);

      // Should show error
      const errorMessage = await registerPage.getErrorMessage();
      expect(errorMessage.toLowerCase()).toContain('already exists');

      // Cleanup
      await deleteTestUserByEmail(testUser.email);
    });
  });

  test.describe('Email Confirmation', () => {
    test('should confirm email via token and redirect to login', async ({ page, registerPage, testUser }) => {
      // Register user
      await registerPage.goto();
      await registerPage.register(testUser.name, testUser.email, testUser.password);
      await registerPage.verifySuccessMessage();

      // Get the user and confirmation token from database
      const user = await getUserByEmail(testUser.email);
      expect(user).toBeTruthy();

      if (user) {
        const token = await getConfirmationToken(user.id);
        expect(token).toBeTruthy();

        if (token) {
          // Navigate to confirmation URL
          await page.goto(`/confirm-email/${token}`);

          // Wait for confirmation success
          await expect(page.getByRole('heading', { name: /Email Confirmed/i })).toBeVisible();

          // Click go to login
          await page.getByRole('button', { name: 'Go to Login' }).click();
          await expect(page).toHaveURL(/\/login/);
        }

        // Cleanup
        await deleteTestUserByEmail(testUser.email);
      }
    });
  });
});
