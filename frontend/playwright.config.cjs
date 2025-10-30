const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '../test-data',
  use: {
    baseURL: 'http://localhost:5002',
    trace: 'on',
    // Добавьте таймауты
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  // Увеличьте общий таймаут тестов
  timeout: 60000,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Уберите webServer - запускайте вручную
});