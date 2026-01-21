import { FullConfig } from '@playwright/test';

/**
 * Global teardown runs once after all tests.
 * Used to clean up the test environment.
 */
async function globalTeardown(_config: FullConfig): Promise<void> {
  console.log('E2E Global Teardown: Starting...');

  // Any global cleanup can be added here

  console.log('E2E Global Teardown: Complete');
}

export default globalTeardown;
