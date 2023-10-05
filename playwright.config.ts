import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		port: 4173
	},
	testDir: 'e2e',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	use: {
		screenshot: 'only-on-failure'
	},
	reporter: [['list'], ['html', { open: process.env.CI ? 'never' : 'on-failure' }]]
};

export default config;
