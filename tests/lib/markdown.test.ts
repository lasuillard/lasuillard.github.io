// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { parse } from '~/lib/markdown';

describe(parse, () => {
	it('parses markdown into HTML', async () => {
		const result = await parse(`# Lorem Ipsum

Lorem Ipsum is simply dummy text of the printing and typesetting industry.`);
		expect(result.content).toMatchInlineSnapshot(`
			"<h1 id="lorem-ipsum"><a href="#lorem-ipsum">Lorem Ipsum</a></h1>
			<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>"
		`);
	});

	it('renders footnotes with configured footnoteLabel', async () => {
		const result = await parse(`Hello world[^1]

[^1]: Footnote content`);
		expect(result.content).toContain('id="footnote-label"');
		expect(result.content).toContain('🔗 각주');
	});
});
