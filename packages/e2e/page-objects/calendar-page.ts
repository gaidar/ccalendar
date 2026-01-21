import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Calendar Page
 */
export class CalendarPage {
  readonly page: Page;

  // Locators
  readonly welcomeMessage: Locator;
  readonly calendarGrid: Locator;
  readonly prevMonthButton: Locator;
  readonly nextMonthButton: Locator;
  readonly monthYearHeader: Locator;
  readonly selectRangeButton: Locator;
  readonly signOutButton: Locator;
  readonly profileLink: Locator;

  // Country Picker Dialog
  readonly countryPickerDialog: Locator;
  readonly countrySearchInput: Locator;
  readonly countryList: Locator;
  readonly saveCountriesButton: Locator;
  readonly clearCountriesButton: Locator;
  readonly selectedCountriesCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByRole('heading', { name: /Welcome back/i });
    this.calendarGrid = page.locator('[role="grid"]').first();
    this.prevMonthButton = page.getByRole('button', { name: /previous month/i });
    this.nextMonthButton = page.getByRole('button', { name: /next month/i });
    this.monthYearHeader = page.locator('h2').filter({ hasText: /\w+ \d{4}/ });
    this.selectRangeButton = page.getByRole('button', { name: /Range/i });
    this.signOutButton = page.getByRole('button', { name: /Sign Out/i });
    this.profileLink = page.getByRole('link', { name: /Profile/i });

    // Country Picker - using dialog and sheet patterns
    this.countryPickerDialog = page.locator('[role="dialog"]');
    this.countrySearchInput = page.getByPlaceholder('Search countries...');
    this.countryList = page.locator('[role="dialog"] label');
    this.saveCountriesButton = page.getByRole('button', { name: 'Save' });
    this.clearCountriesButton = page.getByRole('button', { name: 'Clear' });
    this.selectedCountriesCount = page.getByText(/\d+ selected/);
  }

  /**
   * Navigate to the calendar page
   */
  async goto(): Promise<void> {
    await this.page.goto('/calendar');
  }

  /**
   * Wait for the calendar to load
   */
  async waitForLoad(): Promise<void> {
    await expect(this.welcomeMessage).toBeVisible();
  }

  /**
   * Navigate to the previous month
   */
  async goToPreviousMonth(): Promise<void> {
    await this.prevMonthButton.click();
  }

  /**
   * Navigate to the next month
   */
  async goToNextMonth(): Promise<void> {
    await this.nextMonthButton.click();
  }

  /**
   * Get the current month/year displayed
   */
  async getCurrentMonthYear(): Promise<string> {
    return (await this.monthYearHeader.textContent()) || '';
  }

  /**
   * Click on a specific day in the calendar
   */
  async clickDay(day: number): Promise<void> {
    const dayButton = this.page.locator(`button:has-text("${day}")`).first();
    await dayButton.click();
  }

  /**
   * Click on a specific date (finds the day cell by its number)
   */
  async clickDate(date: Date): Promise<void> {
    const day = date.getDate();
    // Find the button with the day number in the calendar grid
    const dayCell = this.page.locator('button').filter({ hasText: new RegExp(`^${day}$`) }).first();
    await dayCell.click();
  }

  /**
   * Wait for the country picker to open
   */
  async waitForCountryPicker(): Promise<void> {
    await expect(this.countryPickerDialog).toBeVisible();
  }

  /**
   * Close the country picker
   */
  async closeCountryPicker(): Promise<void> {
    // Click outside or press Escape
    await this.page.keyboard.press('Escape');
    await expect(this.countryPickerDialog).not.toBeVisible();
  }

  /**
   * Search for a country in the picker
   */
  async searchCountry(searchTerm: string): Promise<void> {
    await this.countrySearchInput.fill(searchTerm);
  }

  /**
   * Select a country by name
   */
  async selectCountry(countryName: string): Promise<void> {
    const countryLabel = this.page.locator('[role="dialog"] label').filter({ hasText: countryName }).first();
    await countryLabel.click();
  }

  /**
   * Toggle a country selection by code (for recent countries)
   */
  async toggleCountryByCode(countryCode: string): Promise<void> {
    const countryChip = this.page.locator(`button:has-text("${countryCode}")`).first();
    await countryChip.click();
  }

  /**
   * Save the selected countries
   */
  async saveCountries(): Promise<void> {
    await this.saveCountriesButton.click();
    // Wait for dialog to close
    await expect(this.countryPickerDialog).not.toBeVisible();
  }

  /**
   * Clear all selected countries
   */
  async clearSelectedCountries(): Promise<void> {
    await this.clearCountriesButton.click();
  }

  /**
   * Get the number of selected countries
   */
  async getSelectedCountryCount(): Promise<number> {
    const text = await this.selectedCountriesCount.textContent();
    const match = text?.match(/(\d+) selected/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Check if a date has country indicators
   */
  async dateHasCountryIndicators(day: number): Promise<boolean> {
    // Look for the day cell and check if it has country color indicators
    const dayCell = this.page.locator('button').filter({ hasText: new RegExp(`^${day}$`) }).first();
    const indicators = dayCell.locator('.rounded-full');
    return (await indicators.count()) > 0;
  }

  /**
   * Sign out from the calendar page
   */
  async signOut(): Promise<void> {
    await this.signOutButton.click();
    await this.page.waitForURL('/');
  }

  /**
   * Navigate to profile page
   */
  async goToProfile(): Promise<void> {
    await this.profileLink.click();
    await this.page.waitForURL('**/profile');
  }

  /**
   * Toggle range selection mode
   */
  async toggleRangeMode(): Promise<void> {
    await this.selectRangeButton.click();
  }

  /**
   * Verify the calendar page is displayed correctly
   */
  async verifyPageContent(): Promise<void> {
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.monthYearHeader).toBeVisible();
    await expect(this.prevMonthButton).toBeVisible();
    await expect(this.nextMonthButton).toBeVisible();
  }

  /**
   * Add a country to a specific day
   */
  async addCountryToDay(day: number, countryName: string): Promise<void> {
    await this.clickDay(day);
    await this.waitForCountryPicker();
    await this.searchCountry(countryName);
    await this.selectCountry(countryName);
    await this.saveCountries();
  }

  /**
   * Remove a country from a specific day
   */
  async removeCountryFromDay(day: number, countryName: string): Promise<void> {
    await this.clickDay(day);
    await this.waitForCountryPicker();
    // The country should already be selected, clicking it will deselect it
    await this.selectCountry(countryName);
    await this.saveCountries();
  }
}
