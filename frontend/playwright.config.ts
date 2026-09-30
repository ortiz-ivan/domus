import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

/**
 * Tests de punta a punta (pnpm e2e): recorren la demo en un Chromium real contra el build
 * de producción con todos los roles habilitados, como se ve el día de la presentación.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'es-PY',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm build && pnpm preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    env: { VITE_DEMO_SCOPE: 'full' },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
