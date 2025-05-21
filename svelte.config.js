import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// https://kit.svelte.dev/docs/configuration
// eslint-disable-next-line jsdoc/check-tag-names
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// https://kit.svelte.dev/docs/integrations#preprocessors
	preprocess: [vitePreprocess()],

	kit: {
		// https://kit.svelte.dev/docs/adapters
		adapter: adapter({
			fallback: 'spa',
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
		alias: {
			'^/*': './*',
			'~/*': './src/*',
			'$components/*': './src/components/*',
			'$routes/*': './src/routes/*',
			'$data/*': './src/data/*'
		}
	}
};

export default config;
