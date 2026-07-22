import type { PlaywrightTestConfig } from '@playwright/test';
import * as glob from 'glob';

const testDir = 'e2e';

// Test grouping for various device sizes; debug with `playwright test --list`.
const groupTests = (keys: string[]) => {
	const pattern = new RegExp(/.*?\.((.+)\.)?test\.ts/);
	const testFiles = glob.sync(`${testDir}/**/*.{test,spec}.ts`);
	const grouped: { [size: string]: string[] } = Object.fromEntries(keys.map((size) => [size, []]));

	for (let filename of testFiles) {
		// Escape some characters that might interfere with regex matching (`testMatch`)
		filename = filename.replaceAll('[', '\\[').replaceAll(']', '\\]');

		const match = filename.match(pattern) || [];
		const size: string | undefined = match[2];
		if (size) {
			grouped[size].push(filename);
		} else {
			Object.values(grouped).forEach((arr) => arr.push(filename));
		}
	}

	return grouped;
};

const testGroups = groupTests(['sm', 'md', 'lg']);

const commonOptions = {
	channel: 'chromium',
	launchOptions: {
		args: [
			'--font-render-hinting=none',
			'--disable-skia-runtime-opts',
			'--disable-font-subpixel-positioning',
			'--disable-lcd-text'
		]
	}
};

// BUG: Playwright seems not detecting file changes (create / delete)
export default {
	webServer: {
		command: 'yarn run preview',
		port: 4173,
		reuseExistingServer: true
	},
	use: {
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		trace: 'retain-on-failure'
	},
	testDir,
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	reporter: [
		['list'],
		[
			'html',
			{
				open: process.env.CI ? 'never' : 'on-failure',
				host: process.env.CONTAINER ? '0.0.0.0' : '127.0.0.1'
			}
		],
		['junit', { outputFile: 'junit.xml' }]
	],
	projects: [
		{
			// Phones
			name: 'Small devices',
			testMatch: testGroups['sm'],
			use: {
				...commonOptions,
				viewport: { width: 640, height: 1136 }
			}
		},
		{
			// Tablets
			name: 'Medium devices',
			testMatch: testGroups['md'],
			use: {
				...commonOptions,
				viewport: { width: 768, height: 1280 }
			}
		},
		{
			// Laptops
			name: 'Large devices',
			testMatch: testGroups['lg'],
			use: {
				...commonOptions,
				viewport: { width: 1024, height: 1366 }
			}
		}
	],
	timeout: 30 * 1000,
	retries: process.env.CI ? 2 : 0,
	expect: {
		timeout: 10 * 1000,
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.025, // 2.5%
			// ? Perhaps `fullPage` option is not supported here?
			stylePath: './e2e/screenshot.css'
		}
	}
} satisfies PlaywrightTestConfig;
