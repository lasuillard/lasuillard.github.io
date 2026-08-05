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

	const { getByTestId } = render(TocTree, {
		tree: {
			data: elem,
			children: []
		}
	});
	expect(getByTestId('toc-tree').outerHTML).toMatchInlineSnapshot(
		`"<div data-testid="toc-tree" class="text-center lg:text-left"><p class="mb-1.5 font-light text-sm text-gray-500"><a class="link-hover link" href="#lorem-ipsum">Lorem Ipsum</a></p> <ul></ul></div>"`
	);
});
