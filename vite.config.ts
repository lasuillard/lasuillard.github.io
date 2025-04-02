import { codecovVitePlugin } from '@codecov/vite-plugin';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// @ts-expect-error Unknown error (Plugin is not assignable to type PluginOption)
	plugins: [
		...(process.env.VITEST
			? [svelteTesting()]
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
			enableBundleAnalysis: true,
			bundleName: 'lasuillard.github.io',
			oidc: {
				useGitHubOIDC: true
			}
		})
	],
	server: {
		fs: {
			allow: process.env.VITEST ? ['tests/fixtures/posts'] : ['posts']
		}
	},
	resolve: {
		// https://github.com/sveltejs/svelte/issues/11394
		conditions: process.env.VITEST ? ['browser'] : []
	},
	test: {
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['tests/setup.ts'],
		reporters: ['junit', 'default'],
		outputFile: {
			junit: './junit.xml'
		},
		coverage: {
			all: true,
			include: ['src/**'],
			exclude: ['src/**.d.ts'],
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
