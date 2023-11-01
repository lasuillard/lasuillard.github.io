import { describe, expect, it } from 'vitest';
import { parse } from './markdown';

describe(parse, () => {
	it('parses given markdown text with front matter', async () => {
		const result = await parse(`---
message: "Hello, World!"
---

# Lorem Ipsum

Lorem Ipsum is simply dummy text of the printing and typesetting industry.`);
		expect(result.frontMatter).toEqual({ message: 'Hello, World!' });
		expect(result.content).toEqual(`<h1 id="lorem-ipsum"><a href="#lorem-ipsum">Lorem Ipsum</a></h1>
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>`);
	});

	it('should work with no problem if there is no front matter', async () => {
		const result = await parse(`# Lorem Ipsum

Lorem Ipsum is simply dummy text of the printing and typesetting industry.`);
		expect(result.frontMatter).toEqual(undefined);
		expect(result.content).toEqual(`<h1 id="lorem-ipsum"><a href="#lorem-ipsum">Lorem Ipsum</a></h1>
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>`);
	});
});
