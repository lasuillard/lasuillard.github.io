import type { Element, Root } from 'hast';
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
import { SKIP, visit } from 'unist-util-visit';

/**
 * Custom rehype plugin to wrap tables in a div with `overflow-x-auto`,
 * so that tables can scroll horizontally.
 * @returns A rehype plugin
 */
function rehypeTableScroll() {
	return (tree: Root) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName === 'table' && index && parent) {
				// Shallow-copy the original table node
				const tableNode: Element = {
					type: 'element',
					tagName: 'table',
					properties: node.properties,
					children: node.children
				};

				// Patch the current node to be a div and add the table as a child
				node.tagName = 'div';
				node.properties = { className: ['overflow-x-auto'] };
				node.children = [tableNode];

				// Return SKIP to not visit children of the current node to prevent infinite loop
				return [SKIP, index + 1];
			}
		});
	};
}

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkStringify)
	.use(remarkRehype, {
		// Currently there is no user uploaded documents might harmful
		allowDangerousHtml: true
	})
	.use(rehypeMermaid, { strategy: 'pre-mermaid' }) // Let client render it
	.use(rehypeTableScroll)
	.use(rehypeStringify, {
		// Currently there is no user uploaded documents might harmful
		allowDangerousHtml: true
	})
	.use(rehypeSlug)
	.use(rehypeAutolinkHeadings, { behavior: 'wrap' })
	.use(rehypeHighlight, { detect: true });

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
