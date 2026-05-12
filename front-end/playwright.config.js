import { defineConfig } from '@playwright/test';

const skipWebServer = process.env.PW_SKIP_WEBSERVER === '1';

export default defineConfig({
  testDir: './e2e',
  timeout: 180000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    headless: true,
  },
  webServer: skipWebServer
    ? undefined
    : [
        {
          command: 'bash ../back-end/scripts/run_e2e_backend.sh',
          url: 'http://127.0.0.1:8000/api/health/',
          reuseExistingServer: true,
          timeout: 180000,
        },
        {
          command: 'npm run dev -- --host 127.0.0.1 --port 5173',
          url: 'http://127.0.0.1:5173',
          reuseExistingServer: true,
          timeout: 180000,
        },
      ],
});
