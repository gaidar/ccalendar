import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Registration Page
 */
export class RegisterPage {
  readonly page: Page;

  // Locators
  readonly logo: Locator;
  readonly title: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly signInLink: Locator;
  readonly errorAlert: Locator;
  readonly successTitle: Locator;
  readonly successMessage: Locator;
  readonly goToLoginButton: Locator;
  readonly passwordStrengthIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('a').filter({ hasText: 'Country Calendar' });
    this.title = page.getByRole('heading', { name: 'Create an account' });
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm Password');
    this.submitButton = page.getByRole('button', { name: 'Create Account' });
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
    this.errorAlert = page.locator('[role="alert"]').first();
    this.successTitle = page.getByRole('heading', { name: 'Registration Successful!' });
    this.successMessage = page.getByText('Please check your email to confirm your account');
    this.goToLoginButton = page.getByRole('button', { name: 'Go to Login' });
    this.passwordStrengthIndicator = page.getByText(/Password strength:/i);
  }

  /**
   * Navigate to the registration page
   */
  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  /**
   * Fill in the name field
   */
  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
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
   * Fill in the confirm password field
   */
  async fillConfirmPassword(confirmPassword: string): Promise<void> {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  /**
   * Submit the registration form
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Perform a complete registration
   */
  async register(name: string, email: string, password: string): Promise<void> {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
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
   * Navigate to the login page
   */
  async goToLogin(): Promise<void> {
    await this.signInLink.click();
    await this.page.waitForURL('**/login');
  }

  /**
   * Verify the registration page is displayed correctly
   */
  async verifyPageContent(): Promise<void> {
    await expect(this.title).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Verify registration success message is displayed
   */
  async verifySuccessMessage(): Promise<void> {
    await expect(this.successTitle).toBeVisible();
    await expect(this.successMessage).toBeVisible();
    await expect(this.goToLoginButton).toBeVisible();
  }

  /**
   * Click the "Go to Login" button after successful registration
   */
  async clickGoToLogin(): Promise<void> {
    await this.goToLoginButton.click();
    await this.page.waitForURL('**/login');
  }

  /**
   * Check if name validation error is displayed
   */
  async hasNameError(): Promise<boolean> {
    const nameError = this.page.locator('#name-error');
    return await nameError.isVisible();
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

  /**
   * Check if confirm password validation error is displayed
   */
  async hasConfirmPasswordError(): Promise<boolean> {
    const confirmPasswordError = this.page.locator('#confirmPassword-error');
    return await confirmPasswordError.isVisible();
  }

  /**
   * Get the name validation error message
   */
  async getNameErrorMessage(): Promise<string> {
    const nameError = this.page.locator('#name-error');
    return (await nameError.textContent()) || '';
  }

  /**
   * Get the email validation error message
   */
  async getEmailErrorMessage(): Promise<string> {
    const emailError = this.page.locator('#email-error');
    return (await emailError.textContent()) || '';
  }

  /**
   * Get the password validation error message
   */
  async getPasswordErrorMessage(): Promise<string> {
    const passwordError = this.page.locator('#password-error');
    return (await passwordError.textContent()) || '';
  }

  /**
   * Get the confirm password validation error message
   */
  async getConfirmPasswordErrorMessage(): Promise<string> {
    const confirmPasswordError = this.page.locator('#confirmPassword-error');
    return (await confirmPasswordError.textContent()) || '';
  }
}
