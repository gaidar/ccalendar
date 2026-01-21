import { FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Global setup runs once before all tests.
 * Used to prepare the test environment.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  // Load environment variables for E2E tests
  dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

  console.log('E2E Global Setup: Starting...');

  // Verify required environment variables
  const requiredEnvVars = ['DATABASE_URL'];
  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

  if (missingVars.length > 0 && !process.env.CI) {
    console.warn(
      `Warning: Missing environment variables: ${missingVars.join(', ')}. ` +
        'Tests may fail if database access is required.'
    );
  }

  console.log('E2E Global Setup: Complete');
}

export default globalSetup;
