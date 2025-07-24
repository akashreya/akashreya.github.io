// playwright.config.js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
    // Threshold for visual comparisons (0-1)
    toHaveScreenshot: { threshold: 0.2 },
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    // Disable animations for consistent screenshots
    reducedMotion: "reduce",
    actionTimeout: 0,
    trace: "on-first-retry",
    // Disable CSS animations and transitions
    extraHTTPHeaders: {
      "User-Agent": "Playwright-Test",
    },
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Additional animation disabling
        reducedMotion: "reduce",
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
