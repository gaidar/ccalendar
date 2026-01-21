import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from root .env.test if it exists
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const apiURL = process.env.E2E_API_URL || 'http://localhost:3001';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['list'], ['github']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  outputDir: './test-results',

  // Run local dev servers before starting tests
  webServer: process.env.CI
    ? undefined
    : [
        {
          command: 'npm run dev:api',
          url: apiURL,
          reuseExistingServer: true,
          cwd: path.resolve(__dirname, '../..'),
          timeout: 120000,
        },
        {
          command: 'npm run dev:web',
          url: baseURL,
          reuseExistingServer: true,
          cwd: path.resolve(__dirname, '../..'),
          timeout: 120000,
        },
      ],

  // Global setup and teardown for database isolation
  globalSetup: './fixtures/global-setup.ts',
  globalTeardown: './fixtures/global-teardown.ts',
});

// Export for use in tests
export { baseURL, apiURL };
