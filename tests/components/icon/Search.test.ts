// @vitest-environment happy-dom
import Search from '$components/icon/Search.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Search);
	expect(getByTestId('icon/search')).toBeTruthy();
});
