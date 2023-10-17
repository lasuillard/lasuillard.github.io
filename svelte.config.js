import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import hljs from 'highlight.js';
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
	rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
	highlight: {
		// https://github.com/pngwn/MDsveX/issues/514
		highlighter(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			const html = hljs.highlight(code, { language }).value;
			return `<pre class="language-${lang}">{@html \`<code class="language-${lang}">${html}</code>\`}</pre>`;
		}
	}
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
