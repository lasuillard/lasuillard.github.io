import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeMermaid from 'rehype-mermaid';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkStringify)
	.use(remarkRehype, {
		// Currently there is no user uploaded documents might harmful
		allowDangerousHtml: true
	})
	.use(rehypeMermaid, { strategy: 'pre-mermaid' }) // Let client render it
	.use(rehypeStringify, {
		// Currently there is no user uploaded documents might harmful
		allowDangerousHtml: true
	})
	.use(rehypeSlug)
	.use(rehypeAutolinkHeadings, { behavior: 'wrap' })
	.use(rehypeHighlight);

/**
 * Parses given markdown string.
 * @param markdown Raw markdown string.
 * @returns Front matter and content converted into HTML.
 */
export async function parse(markdown: string): Promise<{ content: string }> {
	const result = await processor.process(markdown);
	return {
		content: result.toString()
	};
}
