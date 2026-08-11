import type { PlaywrightTestConfig } from '@playwright/test';

const isCI = !!process.env.CI;

const webserverPort = parseInt(process.env.__WEBSERVER_PORT || '4173');

export default {
	webServer: {
		command: `yarn run preview -- --port '${webserverPort}'`,
		reuseExistingServer: !isCI,
		url: `http://localhost:${webserverPort}/`
	},
	use: {
		channel: 'chromium',
		launchOptions: {
			// Disable font rendering optimizations to avoid flakiness in screenshots
			args: [
				'--font-render-hinting=none',
				'--disable-skia-runtime-opts',
				'--disable-font-subpixel-positioning',
				'--disable-lcd-text'
			]
		},
		baseURL: `http://localhost:${webserverPort}`,
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		trace: 'retain-on-failure'
	},
	testDir: 'e2e',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,

	reporter: [
		['list'],
		[
			'html',
			{
				open: 'never' // Use show-report to open the report in the browser
			}
		],
		['junit', { outputFile: 'junit.xml' }]
	],
	projects: [
		{
			name: 'Mobile L',
			use: {
				viewport: { width: 425, height: 900 }
			}
		},
		{
			name: 'Tablet',
			use: {
				viewport: { width: 768, height: 1024 }
			}
		},
		{
			name: 'Desktop',
			use: {
				viewport: { width: 1280, height: 720 }
			}
		}
	],

	timeout: 15 * 1_000,
	retries: isCI ? 2 : 0,
	expect: {
		timeout: 15 * 1_000,
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.03, // 3%
			stylePath: './e2e/screenshot.css',
			animations: 'disabled'
		}
	}
} satisfies PlaywrightTestConfig;
