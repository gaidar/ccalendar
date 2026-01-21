import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Landing Page
 */
export class LandingPage {
  readonly page: Page;

  // Locators
  readonly logo: Locator;
  readonly signInButton: Locator;
  readonly getStartedButton: Locator;
  readonly heroTitle: Locator;
  readonly startTrackingButton: Locator;
  readonly existingAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('header a').filter({ hasText: 'Country Calendar' });
    this.signInButton = page.locator('header').getByRole('button', { name: 'Sign In' });
    this.getStartedButton = page.locator('header').getByRole('button', { name: 'Get Started' });
    this.heroTitle = page.getByRole('heading', { name: /Track Your Travels/i });
    this.startTrackingButton = page.getByRole('button', { name: /Start Tracking Free/i });
    this.existingAccountButton = page.getByRole('button', { name: /I already have an account/i });
  }

  /**
   * Navigate to the landing page
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Navigate to the login page from the landing page
   */
  async goToLogin(): Promise<void> {
    await this.signInButton.click();
    await this.page.waitForURL('**/login');
  }

  /**
   * Navigate to the registration page from the landing page
   */
  async goToRegister(): Promise<void> {
    await this.getStartedButton.click();
    await this.page.waitForURL('**/register');
  }

  /**
   * Navigate to registration via the hero CTA button
   */
  async goToRegisterFromHero(): Promise<void> {
    await this.startTrackingButton.click();
    await this.page.waitForURL('**/register');
  }

  /**
   * Navigate to login via the "I already have an account" button
   */
  async goToLoginFromHero(): Promise<void> {
    await this.existingAccountButton.click();
    await this.page.waitForURL('**/login');
  }

  /**
   * Verify the landing page is displayed correctly
   */
  async verifyPageContent(): Promise<void> {
    await expect(this.logo).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
    await expect(this.signInButton).toBeVisible();
    await expect(this.getStartedButton).toBeVisible();
  }
}
