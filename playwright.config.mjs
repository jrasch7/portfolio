import { defineConfig, devices } from "@playwright/test";
import { chromiumPath } from "./scripts/pipeline/lib.mjs";

// Os testes rodam sobre o artefato montado pela etapa "build" (_site/), não sobre o código-fonte.
const executablePath = chromiumPath();

export default defineConfig({
  testDir: "tests",
  timeout: 45_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "off",
    launchOptions: { args: ["--no-sandbox"], ...(executablePath ? { executablePath } : {}) },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "celular", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "node scripts/serve.mjs _site 4173",
    url: "http://127.0.0.1:4173/",
    reuseExistingServer: !process.env.CI,
  },
});
