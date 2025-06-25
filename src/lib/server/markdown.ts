import path from 'node:path';
import { URL } from 'node:url';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { parse as parseYaml } from 'yaml';

/**
 * Visit nodes.
 * @param tree Tree node.
 * @param visitor Visitor function.
 */
function visit(tree: any, visitor: (node: any) => void) {
	if (!tree?.children?.length) {
		visitor(tree);
		return;
	}

	for (const child of tree.children) {
		visit(child, visitor);
	}
}

/**
 * Parses frontmatter from markdown file and store it as `file.data.frontMatter` property.
 * @returns A unified plugin that processes the markdown tree.
 */
function parseFrontmatter() {
	// @ts-expect-error Not sure where this type is defined, but it should be a valid plugin
	return (tree, file) => {
		if (file.data.frontMatter !== undefined) {
			console.warn(
				'Markdown frontmatter already parsed. It is unexpected to have multiple front matter blocks in a single markdown file.'
			);
		}

		// @ts-expect-error False-positive warning;
		const idx = tree.children.findIndex((child) => child.type === 'yaml');
		if (idx !== -1) {
			const rawFrontMatter = tree.children.splice(idx, 1)[0].value;
			file.data.frontMatter = parseYaml(rawFrontMatter);
		}
	};
}

/**
 * Rewrites URLs in markdown files to correctly reference static assets.
 * @param options The options for the plugin.
 * @param options.rewriteUrl A function that takes a URL and returns a rewritten URL.
 * @returns A unified plugin that processes the markdown tree.
 */
function rewriteStaticUrls(options: { rewriteUrl: (url: string) => string }) {
	const rewriteUrl = options.rewriteUrl || ((url: string) => url);

	// @ts-expect-error Not sure where this type is defined, but it should be a valid plugin
	return (tree) => {
		// Plugin to rewrite URLs starting with '/static' for compatibility with VS Code Markdown Preview
		visit(tree, (node) => {
			if (node.type === 'image') {
				// e.g. "/static/posts/기술-블로그-시작하기/search-result.png"
				const newUrl = rewriteUrl(node.url);
				node.url = newUrl;
			} else if (node.type === 'html') {
				// e.g. "<img src="/static/posts/개발을-위한-데이터베이스/preview.png" alt="Preview" width="50%" />"
				// TODO: Consider using DOM or XML parser to handle HTML nodes more safely (also update RSS code altogether)
				const match = node.value.match(/src="(?<src>[^"]*)"/);
				if (!match) {
					return;
				}
				const newSrc = rewriteUrl(match.groups.src);
				node.value = node.value.replace(/src="([^"]*)"/, `src="${newSrc}"`);
			}
		});
	};
}

// Base processor for parsing markdown files.
const baseProcessor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	// * Below frontmatter plugins are tightly related with each other, so when updating one, update the others too
	.use(remarkFrontmatter, ['yaml'])
	.use(parseFrontmatter)
	.use(remarkStringify);

/**
 * Parses given markdown string.
 * @param markdown Raw markdown string.
 * @param options Options for parsing.
 * @param options.filepath File path of the markdown file being parsed, used to resolve relative URLs.
 *  It should be an absolute path from repository root, e.g. `/posts/1/index.md`.
 * @returns Front matter and content converted into HTML.
 */
export async function parse(
	markdown: string,
	options: { filepath: string }
): Promise<{ frontMatter: unknown; content: string }> {
	const baseDir = path.dirname(options.filepath);

	// Function to rewrite URLs relative to the markdown file's base directory.
	const resolveUrl = (url: string) => {
		try {
			// If the URL is valid remote source, return it as is
			new URL(url);
		} catch {
			// Otherwise, assume it's a local asset and rewrite it
			return path.join(baseDir, url);
		}
		return url;
	};

	// Parse markdown content
	const processor = baseProcessor().use(rewriteStaticUrls, { rewriteUrl: resolveUrl });
	const parsedResult = await processor.process(markdown);
	const content = parsedResult.value.toString();

	// Extract frontmatter
	// TODO: Type the `frontMatter` properly
	const frontMatter: any = parsedResult.data.frontMatter || {};

	// Resolve preview URL in frontmatter
	if (frontMatter.preview !== undefined) {
		frontMatter.preview = resolveUrl(frontMatter.preview);
	}

	return { frontMatter, content };
}
