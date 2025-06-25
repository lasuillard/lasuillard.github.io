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
});
