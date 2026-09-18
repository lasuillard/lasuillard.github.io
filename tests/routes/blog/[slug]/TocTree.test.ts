// @vitest-environment happy-dom
import TocTree from '$routes/blog/[slug]/TocTree.svelte';
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
		},
		isHovered: true
	});
	expect(getByTestId('toc-tree').outerHTML).toMatchInlineSnapshot(
		`"<div data-testid="toc-tree" class="text-left"><a class="block overflow-hidden py-1.5 text-sm text-ellipsis whitespace-nowrap transition-colors text-base-content/70 hover:text-base-content " href="#lorem-ipsum">Lorem Ipsum</a> <!----></div>"`
	);
});
