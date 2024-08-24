// @vitest-environment happy-dom
import TocTree from '$components/content/TocTree.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(TocTree, {
		tree: {
			data: document.createElement('div'),
			children: []
		}
	});
	expect(getByTestId('toc-tree')).toBeTruthy();
});

it('renders with data', () => {
	const elem = document.createElement('div');
	elem.innerHTML = '<a href="#lorem-ipsum">Lorem Ipsum</a>';

	const { container } = render(TocTree, {
		tree: {
			data: elem,
			children: []
		}
	});
	expect(container.innerHTML).toMatchInlineSnapshot(
		`"<div data-testid="toc-tree"><p class="mb-1.5 font-light"><a class="link-hover link" href="#lorem-ipsum">Lorem Ipsum</a></p> <ul></ul></div>"`
	);
});
