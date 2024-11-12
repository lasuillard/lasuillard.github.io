// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { parse } from '~/lib/markdown';

describe(parse, () => {
	it('parses given markdown text with front matter', async () => {
		const result = await parse(`---
message: "Hello, World!"
---

# Lorem Ipsum

Lorem Ipsum is simply dummy text of the printing and typesetting industry.`);
		expect(result.frontMatter).toEqual({ message: 'Hello, World!' });
		expect(result.content).toMatchInlineSnapshot(`
			"<h1 id="lorem-ipsum"><a href="#lorem-ipsum">Lorem Ipsum</a></h1>
			<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>"
		`);
	});

	it('should work with no problem if there is no front matter', async () => {
		const result = await parse(`# Lorem Ipsum

Lorem Ipsum is simply dummy text of the printing and typesetting industry.`);
		expect(result.frontMatter).toBeUndefined();
		expect(result.content).toMatchInlineSnapshot(`
			"<h1 id="lorem-ipsum"><a href="#lorem-ipsum">Lorem Ipsum</a></h1>
			<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>"
		`);
	});

	it('rewrite /static paths in markdown images', async () => {
		const result = await parse('![Preview](/static/posts/my-post/preview.png)');

		expect(result.frontMatter).toBeUndefined();
		expect(result.content).toMatchInlineSnapshot(
			`"<p><img src="/posts/my-post/preview.png" alt="Preview"></p>"`
		);
	});

	it('rewrite /static paths in HTML img elements', async () => {
		const result = await parse(
			'<img src="/static/posts/my-post/diagram.png" alt="Diagram" width="50%" />'
		);

		expect(result.frontMatter).toBeUndefined();
		expect(result.content).toMatchInlineSnapshot(
			`"<img src="/posts/my-post/diagram.png" alt="Diagram" width="50%" />"`
		);
	});
});
