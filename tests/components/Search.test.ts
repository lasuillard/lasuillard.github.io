// @vitest-environment jsdom
import Search from '$components/Search.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Search', () => {
	it('has a valid locator', () => {
		const { getByTestId } = render(Search);
		expect(getByTestId('search')).toBeTruthy();
	});
});