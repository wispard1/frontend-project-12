const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '../test-data',
  use: {
    baseURL: 'http://localhost:5002/',
    trace: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
