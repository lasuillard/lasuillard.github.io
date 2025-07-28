import { codecovVitePlugin } from '@codecov/vite-plugin';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vitest/config';

// @ts-expect-error Excessive stack depth blah blah
export default defineConfig({
	// @ts-expect-error Typed badly?
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'lasuillard',
				project: 'lasuillard-github-io'
			}
		}),
		tailwindcss(),
		sveltekit(),
		svelteTesting() as PluginOption,
		codecovVitePlugin({
			enableBundleAnalysis: true,
			bundleName: 'lasuillard.github.io',
			oidc: {
				useGitHubOIDC: true
			}
		})
	] as PluginOption[],
	server: {
		fs: {
			allow: ['static'],
			deny: ['**.md']
		}
	},
	ssr: {
		// FIXME: https://github.com/getsentry/sentry-javascript/issues/16586#issuecomment-2983269318
		external: ['@sentry/sveltekit']
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
			include: ['src/components/**', 'src/lib/**'],
			exclude: ['src/**.d.ts'],
			reporter: ['text', 'clover', 'html']
		},
		api: {
			host: process.env.CONTAINER ? '0.0.0.0' : '127.0.0.1'
		}
	}
});
