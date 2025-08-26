import { defineConfig, devices } from '@playwright/test';

/**
 * Thai Auto Insurance App - Playwright Configuration
 * 
 * Comprehensive E2E testing configuration with support for:
 * - Multiple browsers (Chrome, Firefox, Safari)
 * - Mobile viewports
 * - Parallel execution
 * - Screenshots and video recording
 * - Thai localization testing
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'http://localhost:4200',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Record video for all tests */
    video: 'retain-on-failure',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Global timeout for each test */
    actionTimeout: 30000,
    
    /* Navigation timeout */
    navigationTimeout: 60000,
    
    /* Thai locale settings */
    locale: 'th-TH',
    timezoneId: 'Asia/Bangkok',
    
    /* Extra HTTP headers */
    extraHTTPHeaders: {
      'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  },

  /* Global setup and teardown */
  globalSetup: require.resolve('./fixtures/global-setup.ts'),
  globalTeardown: require.resolve('./fixtures/global-teardown.ts'),

  /* Configure projects for major browsers */
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    // Mobile devices - Thai market focus
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Tablet viewports
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 }
      },
    },
  ],

  /* Test match patterns */
  testMatch: [
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.test.ts'
  ],

  /* Test ignore patterns */
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**'
  ],

  /* Output directory for test artifacts */
  outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm run serve:backend',
      port: 8080,
      reuseExistingServer: !process.env.CI,
      cwd: '../backend'
    },
    {
      command: 'npm run serve',
      port: 4200,
      reuseExistingServer: !process.env.CI,
      cwd: '../frontend'
    }
  ],

  /* Global timeout for the entire test run */
  globalTimeout: 60 * 60 * 1000, // 60 minutes

  /* Timeout for each test */
  timeout: 5 * 60 * 1000, // 5 minutes

  /* Expect timeout */
  expect: {
    timeout: 10000, // 10 seconds
    toHaveScreenshot: { 
      threshold: 0.3,
      mode: 'strict',
      animations: 'disabled'
    }
  },

  /* Maximum failures before stopping test run */
  maxFailures: process.env.CI ? 5 : undefined
});