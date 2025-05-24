import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { parse as parseYaml } from 'yaml';

// TODO: Markdown parser
export const processor = unified()
	.use(remarkParse)
	.use(remarkStringify)
	.use(remarkFrontmatter, ['yaml'])
	.use(() => (tree, file) => {
		// Frontmatter parser plugin
		// @ts-expect-error False-positive warning; BUG: `children` exists in node TS says it doesn't
		const frontMatter = tree.children.find((child) => child.type === 'yaml')?.value ?? null;
		if (frontMatter) {
			file.data.frontMatter = parseYaml(frontMatter);
		}
	});

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
