// @vitest-environment jsdom
import Toc from '$components/Toc.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Toc);
	expect(getByTestId('toc')).toBeTruthy();
});
