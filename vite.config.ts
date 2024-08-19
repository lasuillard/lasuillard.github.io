import { codecovVitePlugin } from '@codecov/vite-plugin';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		...(process.env.VITEST
			? []
			: [
					sentrySvelteKit({
						sourceMapsUploadOptions: {
							org: 'lasuillard',
							project: 'lasuillard-github-io',
							/* @ts-expect-error Unknown error, this property is documented */
							setCommits: {
								auto: true
							}
						}
					})
				]),
		sveltekit(),
		codecovVitePlugin({
			enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
			bundleName: 'lasuillard.github.io',
			uploadToken: process.env.CODECOV_TOKEN
		})
	],
	server: {
		fs: {
			allow: process.env.VITEST ? ['tests/fixtures/posts'] : ['posts']
		}
	},
	test: {
		alias: [
			{ find: /^svelte$/, replacement: 'svelte/internal' } // BUG: https://github.com/vitest-dev/vitest/issues/2834
		],
		include: ['{src,tests}/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['tests/setup.ts'],
		reporters: ['junit'],
		outputFile: {
			junit: './junit.xml'
		},
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
