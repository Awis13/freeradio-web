import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: false,
	workers: 1,
	timeout: 30_000,
	use: {
		baseURL: 'http://127.0.0.1:4173',
		headless: true
	},
	webServer: {
		command: 'npm run dev -- --port 4173 --host 127.0.0.1',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	},
	projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
