import type { PlaywrightTestConfig } from '@playwright/test';
import * as glob from 'glob';

const testDir = 'e2e';

const groupTests = (keys: string[]) => {
	const pattern = new RegExp(/.*?\.((.+)\.)?test\.ts/);
	const testFiles = glob.sync(`${testDir}/**/*.{test,spec}.ts`);
	const grouped: { [size: string]: string[] } = Object.fromEntries(keys.map((size) => [size, []]));

	for (const filename of testFiles) {
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

// BUG: Playwright seems not detecting file changes (create / delete)
export default {
	webServer: {
		// NOTE: This will trigger Codecov bundle analysis upload due to build
		command: 'yarn run preview',
		port: 8787,
		reuseExistingServer: true
	},
	use: {
		screenshot: 'only-on-failure'
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
				viewport: { width: 640, height: 1136 }
			}
		},
		{
			// Tablets
			name: 'Medium devices',
			testMatch: testGroups['md'],
			use: {
				viewport: { width: 768, height: 1280 }
			}
		},
		{
			// Laptops
			name: 'Large devices',
			testMatch: testGroups['lg'],
			use: {
				viewport: { width: 1024, height: 1366 }
			}
		}
	],
	expect: {
		timeout: 5000
	}
} satisfies PlaywrightTestConfig;
