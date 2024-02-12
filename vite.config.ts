import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		// @ts-expect-error This breaks tests, so omit the plugin while testing
		...(process.env.VITEST
			? []
			: sentrySvelteKit({
					sourceMapsUploadOptions: {
						org: 'lasuillard',
						project: 'lasuillard-github-io'
					}
				})),
		sveltekit()
	],
	define: {
		// For in-source testing Vitest
		'import.meta.vitest': 'undefined',
		// Inject metadata
		__APP_NAME__: JSON.stringify(process.env.npm_package_name),
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version)
	},
	server: {
		fs: {
			allow: process.env.VITEST ? ['tests/fixtures/posts'] : ['posts']
		}
	},
	test: {
		alias: [
			{ find: /^svelte$/, replacement: 'svelte/internal' } // BUG: https://github.com/vitest-dev/vitest/issues/2834
		],
		include: [
			'{src,tests}/**/*.{test,spec}.{js,ts}',
			'src/lib/**/*.{js,ts}' // In-source testing
		],
		setupFiles: ['tests/setup.ts'],
		coverage: {
			all: true,
			include: ['src/**'],
			exclude: ['src/**/__mocks__/*', 'src/**.d.ts'],
			reporter: ['text', 'clover', 'html']
		},
		api: {
			host: process.env.CONTAINER ? '0.0.0.0' : '127.0.0.1',
			port: 51204
		},
		// NOTE: Browser testing via Playwright
		css: false
	}
});
