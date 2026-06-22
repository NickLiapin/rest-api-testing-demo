import { defineConfig } from '@playwright/test';

/**
 * API testing with Playwright - no browser is launched, only the request context.
 * A bundled mock service is started via `webServer` so the suite is hermetic.
 */
export default defineConfig({
  testDir: './tests',
  // Shared in-memory state in the mock -> run serially for deterministic results.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4000',
    extraHTTPHeaders: { Accept: 'application/json' },
  },
  webServer: {
    command: 'node server/index.js',
    url: 'http://localhost:4000/health',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
