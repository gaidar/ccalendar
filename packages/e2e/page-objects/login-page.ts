import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Login Page
 */
export class LoginPage {
  readonly page: Page;

  // Locators
  readonly logo: Locator;
  readonly title: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;
  readonly errorAlert: Locator;
  readonly googleOAuthButton: Locator;
  readonly facebookOAuthButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('a').filter({ hasText: 'Country Calendar' });
    this.title = page.getByRole('heading', { name: 'Welcome back' });
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.errorAlert = page.locator('[role="alert"]').first();
    this.googleOAuthButton = page.getByRole('button', { name: /Google/i });
    this.facebookOAuthButton = page.getByRole('button', { name: /Facebook/i });
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Fill in the email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill in the password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Submit the login form
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Perform a complete login
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    await expect(this.errorAlert).toBeVisible();
    return (await this.errorAlert.textContent()) || '';
  }

  /**
   * Navigate to the registration page
   */
  async goToRegister(): Promise<void> {
    await this.signUpLink.click();
    await this.page.waitForURL('**/register');
  }

  /**
   * Navigate to forgot password page
   */
  async goToForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL('**/forgot-password');
  }

  /**
   * Verify the login page is displayed correctly
   */
  async verifyPageContent(): Promise<void> {
    await expect(this.title).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Wait for successful login redirect
   */
  async waitForLoginSuccess(): Promise<void> {
    await this.page.waitForURL('**/calendar');
  }

  /**
   * Check if email validation error is displayed
   */
  async hasEmailError(): Promise<boolean> {
    const emailError = this.page.locator('#email-error');
    return await emailError.isVisible();
  }

  /**
   * Check if password validation error is displayed
   */
  async hasPasswordError(): Promise<boolean> {
    const passwordError = this.page.locator('#password-error');
    return await passwordError.isVisible();
  }
}
