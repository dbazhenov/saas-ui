import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

dotenv.config({ path: '.env.local' });
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const uiTestFolder = './ui-tests/';

const config: PlaywrightTestConfig = {
  testDir: './ui-tests/tests',
  timeout: 120 * 1000,
  expect: {
    timeout: 5000,
  },

  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 6,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  use: {
    navigationTimeout: 30 * 1000,
    baseURL: process.env.PORTAL_BASE_URL || 'https://portal.localhost',
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'on',
    actionTimeout: 15 * 1000,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testDir: `${uiTestFolder}/tests`,
      use: {
        contextOptions: {
          ignoreHTTPSErrors: true,
        },
        launchOptions: {
          args: [`--host-rules=MAP portal.localhost ${process.env.PROXY_URL}`],
        },
        screenshot: 'on',
        ...devices['Desktop Chrome'],
      },
    },
  ],
};

export default config;
