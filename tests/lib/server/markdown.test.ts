// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { parse } from '~/lib/server/markdown';

describe(parse, () => {
	it('parses given markdown text with front matter', async () => {
		const result = await parse(
			`---
message: "Hello, World!"
preview: ./preview.png
---

# Lorem Ipsum

Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
			{ filepath: '/posts/my-post/index.md' } // Don't care in this test case
		);
		expect(result.frontMatter).toEqual({
			message: 'Hello, World!',
			preview: '/posts/my-post/preview.png'
		});
		expect(result.content).toMatchInlineSnapshot(`
			"# Lorem Ipsum

			Lorem Ipsum is simply dummy text of the printing and typesetting industry.
			"
		`);
	});

	it('should work with no problem if there is no front matter', async () => {
		const result = await parse(
			`# Lorem Ipsum

Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
			{ filepath: '' } // Don't care in this test case
		);
		expect(result.frontMatter).toEqual({});
		expect(result.content).toMatchInlineSnapshot(`
			"# Lorem Ipsum

			Lorem Ipsum is simply dummy text of the printing and typesetting industry.
			"
		`);
	});

	it('rewrite relative paths in markdown images', async () => {
		const result = await parse(
			'![Preview](./preview.png)',
			{ filepath: '/posts/my-post/index.md' } // Don't care in this test case
		);

		expect(result.frontMatter).toEqual({});
		expect(result.content).toMatchInlineSnapshot(`
			"![Preview](/posts/my-post/preview.png)
			"
		`);
	});

	it('rewrite /static paths in HTML img elements', async () => {
		const result = await parse(
			'<img src="./diagram.png" alt="Diagram" width="50%" />',
			{ filepath: '/posts/my-post/index.md' } // Don't care in this test case
		);

		expect(result.frontMatter).toEqual({});
		expect(result.content).toMatchInlineSnapshot(
			`
			"<img src="/posts/my-post/diagram.png" alt="Diagram" width="50%" />
			"
		`
		);
	});

	it('handles multiple frontmatter blocks', async () => {
		// The markdown parser seems to only process the first frontmatter block
		// So let's test that it parses correctly and doesn't crash
		const result = await parse(
			`---
message: "First"
---
---
message: "Second"  
---

# Content`,
			{ filepath: '/posts/test/index.md' }
		);
		
		// Should only parse the first frontmatter block
		expect(result.frontMatter).toEqual({ message: 'First' });
		expect(result.content).toContain('# Content');
	});

	it('handles HTML img without src attribute', async () => {
		const result = await parse(
			'<img alt="No source" />',
			{ filepath: '/posts/test/index.md' }
		);
		
		// Should not crash and keep original HTML
		expect(result.content).toContain('<img alt="No source" />');
	});

	it('handles remote URLs in frontmatter and content', async () => {
		const result = await parse(
			`---
preview: https://example.com/preview.png
---

![Remote](https://example.com/image.png)`,
			{ filepath: '/posts/test/index.md' }
		);
		
		// Remote URLs should remain unchanged
		expect(result.frontMatter.preview).toBe('https://example.com/preview.png');
		expect(result.content).toContain('https://example.com/image.png');
	});
});
