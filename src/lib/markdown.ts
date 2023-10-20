import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { parse as parseYaml } from 'yaml';

export const processor = unified()
	.use(remarkParse)
	.use(remarkStringify)
	.use(remarkFrontmatter, ['yaml'])
	.use(() => (node, file) => {
		// @ts-expect-error False-positive warning; BUG: `children` exists in node TS says it doesn't
		const frontMatter = node.children.find((child) => child.type === 'yaml')?.value ?? null;
		if (frontMatter) {
			file.data.frontMatter = parseYaml(frontMatter);
		}
	})
	.use(remarkRehype)
	.use(rehypeStringify)
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
