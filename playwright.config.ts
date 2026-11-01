import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  // 로컬(WSL) 자원 한계로 병렬 실행 시 시간 초과가 나서 순차 실행해요
  workers: 1,
  use: { baseURL: 'http://localhost:3100' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm build && pnpm start -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 420_000,
  },
});
