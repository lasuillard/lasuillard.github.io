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
});
