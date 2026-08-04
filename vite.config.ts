import { codecovSvelteKitPlugin } from '@codecov/sveltekit-plugin';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'lasuillard',
				project: 'lasuillard-github-io'
			},
			telemetry: false
		}),
		tailwindcss(),
		sveltekit(),
		svelteTesting() as PluginOption,
		codecovSvelteKitPlugin({
			enableBundleAnalysis: true,
			bundleName: 'lasuillard.github.io',
			oidc: {
				useGitHubOIDC: true
			},
			telemetry: false
		})
	] as PluginOption[],
	define: {
		__PROJECT_ROOT__: JSON.stringify(import.meta.dirname)
	},
	server: {
		fs: {
			allow: ['static/**']
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
			include: ['src/components/**', 'src/lib/**'],
			exclude: ['src/**.d.ts'],
			reporter: ['text', 'clover', 'html']
		},
		api: {
			host: process.env.CONTAINER ? '0.0.0.0' : '127.0.0.1'
		}
	}
});
