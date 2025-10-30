const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './__tests__',
  outputDir: 'tmp/artifacts',
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'http://localhost:5002',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5002',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
