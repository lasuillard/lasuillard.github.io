import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { parse as parseYaml } from 'yaml';

interface INode {
	type: string;
	tagName?: string;
	properties?: Record<string, string>;
	children: INode[];
}

/**
 * Visit nodes.
 * @param tree Tree node.
 * @param visitor Visitor function.
 */
function visit(tree: INode, visitor: (node: INode) => void) {
	if (!tree?.children?.length) {
		visitor(tree);
		return;
	}

	for (const child of tree.children) {
		visit(child, visitor);
	}
}

export const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkStringify)
	.use(remarkFrontmatter, ['yaml'])
	.use(() => (tree, file) => {
		// Frontmatter parser plugin
		// @ts-expect-error False-positive warning; BUG: `children` exists in node TS says it doesn't
		const frontMatter = tree.children.find((child) => child.type === 'yaml')?.value ?? null;
		if (frontMatter) {
			file.data.frontMatter = parseYaml(frontMatter);
		}
	})
	.use(remarkRehype)
	.use(rehypeStringify)
	.use(() => (tree) => {
		// Plugin to rewrite URLs starting with '/static' for compatibility with VS Code Markdown Preview
		// @ts-expect-error False-positive warning
		visit(tree, (node) => {
			if (node.type === 'element' && node.tagName) {
				if (node.properties?.src) {
					node.properties.src = node.properties.src.replace(/^\/static/, '');
				}
			}
		});
	})
	.use(rehypeSlug)
	.use(rehypeAutolinkHeadings, { behavior: 'wrap' })
	.use(rehypeHighlight);

/**
 * Parses given markdown string.
 * @param markdown Raw markdown string.
 * @returns Front matter and content converted into HTML.
 */
export async function parse(markdown: string): Promise<{ frontMatter: unknown; content: string }> {
	const result = await processor.process(markdown);
	return {
		frontMatter: result.data.frontMatter,
		content: result.toString()
	};
}
