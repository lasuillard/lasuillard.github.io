import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

// https://mdsvex.com/docs
// eslint-disable-next-line jsdoc/check-tag-names
/** @type {import("mdsvex").MdsvexOptions} */
const mdsvexConfig = {
	extensions: ['.md'],
	layout: {
		_: 'src/components/Markdown.svelte' // NOTE: You can't use alias here
	},
	rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]
};

// https://kit.svelte.dev/docs/configuration
// eslint-disable-next-line jsdoc/check-tag-names
/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	// https://kit.svelte.dev/docs/integrations#preprocessors
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],

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
