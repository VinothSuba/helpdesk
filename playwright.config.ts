import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

const testEnv =
  dotenv.config({ path: path.resolve(__dirname, ".env.test") }).parsed ?? {};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: 30_000,

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },

  globalSetup: "./e2e/global-setup.ts",

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: "bun src/index.ts",
      cwd: "./server",
      port: 3001,
      reuseExistingServer: !process.env.CI,
      env: { ...testEnv },
    },
    {
      command: "bunx --bun vite",
      cwd: "./client",
      port: 5173,
      reuseExistingServer: !process.env.CI,
      env: { ...testEnv },
    },
  ],
});
