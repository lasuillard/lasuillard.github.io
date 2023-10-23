import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

// https://kit.svelte.dev/docs/configuration
// eslint-disable-next-line jsdoc/check-tag-names
/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],

	// https://kit.svelte.dev/docs/integrations#preprocessors
	preprocess: [vitePreprocess()],

	kit: {
		// https://kit.svelte.dev/docs/adapters
		adapter: adapter(),
		alias: {
			'$components/*': './src/components/*',
			'$routes/*': './src/routes/*'
		}
	}
};

export default config;
