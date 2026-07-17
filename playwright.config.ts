import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4323",
    trace: "on-first-retry",
  },
  webServer: {
    // Dedicated port so this doesn't collide with a locally running `astro dev`/`preview` on 4321.
    command: "npm run build && npm run preview -- --port 4323",
    url: "http://localhost:4323",
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
