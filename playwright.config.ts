import dotenv from "dotenv";
import { defineConfig, devices } from "@playwright/test";

dotenv.config({ quiet: true });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 45_000,
  expect: {
    timeout: 10_000
  },
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: !!process.env.CI,
  outputDir: "test-results",
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["allure-playwright", { outputFolder: "allure-results" }]
  ],
  use: {
    baseURL: process.env.APP_BASE_URL || "http://localhost:5173",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    testIdAttribute: "data-testid",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" }
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] }
    },
    {
      name: "iphone",
      use: { ...devices["iPhone 14"] }
    },
    {
      name: "pixel",
      use: { ...devices["Pixel 7"] }
    }
  ]
});
