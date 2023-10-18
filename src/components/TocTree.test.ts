// @vitest-environment happy-dom
import TocTree from '$components/TocTree.svelte';
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
