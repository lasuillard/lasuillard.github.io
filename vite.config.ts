import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		alias: [
			{ find: /^svelte$/, replacement: 'svelte/internal' } // BUG: https://github.com/vitest-dev/vitest/issues/2834
		],
		include: ['{src,tests}/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['tests/setup.ts'],
		coverage: {
			all: true,
			include: ['src/**'],
			exclude: ['src/**/__mocks__/*', 'src/**.d.ts'],
			reporter: ['text', 'clover', 'html']
		},
		api: {
			host: process.env.CONTAINER ? '0.0.0.0' : '127.0.0.1',
			port: 51204,
			strictPort: true
		}
	}
});
