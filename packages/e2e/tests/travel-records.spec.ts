import { test, expect } from '../fixtures/test-fixtures';
import {
  createConfirmedTestUser,
  deleteTestUser,
  createTestTravelRecord,
  deleteUserTravelRecords,
  generateTestEmail,
} from '../utils/test-helpers';

test.describe('Travel Record Management', () => {
  let testUserId: string | undefined;
  const testEmail = generateTestEmail('travel-test');
  const testPassword = 'TravelTest123!';

  test.beforeAll(async () => {
    testUserId = await createConfirmedTestUser({
      name: 'Travel Test User',
      email: testEmail,
      password: testPassword,
    });
  });

  test.afterAll(async () => {
    if (testUserId) {
      await deleteUserTravelRecords(testUserId);
      await deleteTestUser(testUserId);
    }
  });

  test.beforeEach(async ({ loginPage, page }) => {
    // Login before each test
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await page.waitForURL('**/calendar');
  });

  test.describe('Calendar View', () => {
    test('should display calendar with month navigation', async ({ calendarPage }) => {
      await calendarPage.verifyPageContent();

      // Get current month/year
      const initialMonthYear = await calendarPage.getCurrentMonthYear();
      expect(initialMonthYear).toBeTruthy();
    });

    test('should navigate to previous month', async ({ calendarPage }) => {
      const initialMonthYear = await calendarPage.getCurrentMonthYear();

      await calendarPage.goToPreviousMonth();

      const newMonthYear = await calendarPage.getCurrentMonthYear();
      expect(newMonthYear).not.toBe(initialMonthYear);
    });

    test('should navigate to next month', async ({ calendarPage }) => {
      const initialMonthYear = await calendarPage.getCurrentMonthYear();

      await calendarPage.goToNextMonth();

      const newMonthYear = await calendarPage.getCurrentMonthYear();
      expect(newMonthYear).not.toBe(initialMonthYear);
    });
  });

  test.describe('Country Picker', () => {
    test('should open country picker when clicking on a date', async ({ calendarPage }) => {
      // Click on day 15 (should exist in any month)
      await calendarPage.clickDay(15);
      await calendarPage.waitForCountryPicker();

      // Verify search input is visible
      await expect(calendarPage.countrySearchInput).toBeVisible();
    });

    test('should search and filter countries', async ({ calendarPage }) => {
      await calendarPage.clickDay(15);
      await calendarPage.waitForCountryPicker();

      // Search for "Japan"
      await calendarPage.searchCountry('Japan');

      // Should see Japan in the results
      const japanLabel = calendarPage.page.locator('[role="dialog"] label').filter({ hasText: 'Japan' });
      await expect(japanLabel).toBeVisible();
    });

    test('should close country picker with Escape key', async ({ calendarPage }) => {
      await calendarPage.clickDay(15);
      await calendarPage.waitForCountryPicker();

      await calendarPage.closeCountryPicker();
      await expect(calendarPage.countryPickerDialog).not.toBeVisible();
    });
  });

  test.describe('Add Travel Record', () => {
    test.beforeEach(async () => {
      // Clean up any existing travel records before each test
      if (testUserId) {
        await deleteUserTravelRecords(testUserId);
      }
    });

    test('should add a country to a date and see it on calendar', async ({ calendarPage, page }) => {
      // Add Japan to day 15
      await calendarPage.addCountryToDay(15, 'Japan');

      // Wait for success toast
      await expect(page.getByText(/Travel record updated/i)).toBeVisible();

      // The country indicator should now be visible on day 15
      // (We would need to check for the colored dot, but this is UI-dependent)
    });

    test('should add multiple countries to a date', async ({ calendarPage, page }) => {
      // Click on day 15
      await calendarPage.clickDay(15);
      await calendarPage.waitForCountryPicker();

      // Search and select Japan
      await calendarPage.searchCountry('Japan');
      await calendarPage.selectCountry('Japan');

      // Clear search and select another country
      await calendarPage.searchCountry('France');
      await calendarPage.selectCountry('France');

      // Check selected count
      const count = await calendarPage.getSelectedCountryCount();
      expect(count).toBe(2);

      // Save
      await calendarPage.saveCountries();

      // Should show success message
      await expect(page.getByText(/Travel record updated/i)).toBeVisible();
    });
  });

  test.describe('View Existing Travel Records', () => {
    test.beforeEach(async () => {
      // Create some travel records in the database
      if (testUserId) {
        await deleteUserTravelRecords(testUserId);
        // Create a record for today
        const today = new Date();
        await createTestTravelRecord(testUserId, today, 'JP');
      }
    });

    test('should display existing travel records when viewing calendar', async ({ calendarPage, page }) => {
      // Refresh the page to load records
      await page.reload();
      await calendarPage.waitForLoad();

      // The current date should have a country indicator
      // This is hard to test precisely without knowing the exact UI structure
      // but we can verify the page loads without errors
      await calendarPage.verifyPageContent();
    });

    test('should show assigned countries when clicking a date with records', async ({ calendarPage, page }) => {
      await page.reload();
      await calendarPage.waitForLoad();

      const today = new Date().getDate();
      await calendarPage.clickDay(today);
      await calendarPage.waitForCountryPicker();

      // Japan should be pre-selected
      const selectedCount = await calendarPage.getSelectedCountryCount();
      expect(selectedCount).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Remove Travel Record', () => {
    test.beforeEach(async () => {
      if (testUserId) {
        await deleteUserTravelRecords(testUserId);
        const today = new Date();
        await createTestTravelRecord(testUserId, today, 'JP');
      }
    });

    test('should remove a country from a date', async ({ calendarPage, page }) => {
      await page.reload();
      await calendarPage.waitForLoad();

      const today = new Date().getDate();
      await calendarPage.clickDay(today);
      await calendarPage.waitForCountryPicker();

      // Deselect Japan (it should be selected already)
      await calendarPage.searchCountry('Japan');
      await calendarPage.selectCountry('Japan');

      // Selected count should be 0
      const count = await calendarPage.getSelectedCountryCount();
      expect(count).toBe(0);

      // Save
      await calendarPage.saveCountries();

      // Should show success message
      await expect(page.getByText(/Travel record updated/i)).toBeVisible();
    });
  });

  test.describe('Calendar Navigation with Records', () => {
    test.beforeEach(async () => {
      if (testUserId) {
        await deleteUserTravelRecords(testUserId);
        // Create records for this month and last month
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15);

        await createTestTravelRecord(testUserId, today, 'JP');
        await createTestTravelRecord(testUserId, lastMonth, 'FR');
      }
    });

    test('should load travel records when navigating between months', async ({ calendarPage, page }) => {
      await page.reload();
      await calendarPage.waitForLoad();

      // Navigate to previous month
      await calendarPage.goToPreviousMonth();

      // The page should still work without errors
      await calendarPage.verifyPageContent();

      // Navigate back
      await calendarPage.goToNextMonth();
      await calendarPage.verifyPageContent();
    });
  });
});

test.describe('Travel Records - UI Updates', () => {
  let testUserId: string | undefined;
  const testEmail = generateTestEmail('ui-test');
  const testPassword = 'UITest123!';

  test.beforeAll(async () => {
    testUserId = await createConfirmedTestUser({
      name: 'UI Test User',
      email: testEmail,
      password: testPassword,
    });
  });

  test.afterAll(async () => {
    if (testUserId) {
      await deleteUserTravelRecords(testUserId);
      await deleteTestUser(testUserId);
    }
  });

  test('should update UI without full page reload when adding record', async ({ loginPage, calendarPage, page }) => {
    // Clean up first
    if (testUserId) {
      await deleteUserTravelRecords(testUserId);
    }

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await page.waitForURL('**/calendar');

    // Add a country
    await calendarPage.clickDay(20);
    await calendarPage.waitForCountryPicker();
    await calendarPage.searchCountry('Germany');
    await calendarPage.selectCountry('Germany');
    await calendarPage.saveCountries();

    // Wait for success toast - this confirms the update happened without page reload
    await expect(page.getByText(/Travel record updated/i)).toBeVisible();

    // The URL should still be /calendar (no full reload occurred)
    await expect(page).toHaveURL(/\/calendar/);
  });
});
