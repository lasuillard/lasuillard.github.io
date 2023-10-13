import type { PlaywrightTestConfig } from '@playwright/test';
import * as glob from 'glob';

const testDir = 'e2e';

// TODO: Default group should included in all matrix rather than standalone
const groupTests = (keys: string[]) => {
	const pattern = new RegExp(/.*?\.((.+)\.)?test\.ts/);
	const testFiles = glob.sync(`${testDir}/**/*.{test,spec}.ts`);
	const grouped = {
		default: [],
		...Object.fromEntries(keys.map((size) => [size, []]))
	};

	for (const filename of testFiles) {
		const match = filename.match(pattern) || [];
		const size = match[2] || 'default';
		grouped[size].push(filename);
	}

	return grouped;
};

const testGroups = groupTests(['sm', 'md', 'lg']);

export default {
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		port: 4173
	},
	use: {
		screenshot: 'only-on-failure'
	},
	testDir: 'e2e',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	reporter: [['list'], ['html', { open: process.env.CI ? 'never' : 'on-failure' }]],
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
		},
		{
			name: 'Default',
			testMatch: testGroups['default']
		}
	],
	expect: {
		timeout: 5000
	}
} satisfies PlaywrightTestConfig;
