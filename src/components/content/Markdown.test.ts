// @vitest-environment happy-dom
import Markdown from '$components/content/Markdown.svelte';
import { parse } from '$lib/markdown';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

// NOTE: It is required not to have any wrapping element (thus no locator) as this component is just an wrapper

it('render with parsed content', async () => {
	const { content } = await parse(`---
message: "Hello, World!"
---

# Lorem Ipsum

Lorem Ipsum is simply dummy text of the printing and typesetting industry.`);
	const {
		component: { $$: component }
	} = render(Markdown, { content });
	expect(component.ctx[component.props['frontMatter']]).toBeUndefined();
	expect(component.ctx[component.props['content']]).toMatchInlineSnapshot(`
		"<h1 id="lorem-ipsum"><a href="#lorem-ipsum">Lorem Ipsum</a></h1>
		<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>"
	`);
});

it('render with nothing', async () => {
	const { container } = render(Markdown);
	expect(container.innerHTML).toMatchInlineSnapshot(`"<div class="hidden"></div>"`);
});

it.todo('render with raw markdown input slot'); // https://github.com/testing-library/svelte-testing-library/issues/48
