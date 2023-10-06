// @vitest-environment jsdom
import SearchBar from '$components/SearchBar.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Search', () => {
	// TODO: Default theme from OS media preference
	//       https://stackoverflow.com/questions/50840168/how-to-detect-if-the-os-is-in-dark-mode-in-browsers
	it('nothing to test yet, just render it', () => {
		const { container } = render(SearchBar);
		expect(container).toBeTruthy();
	});
});
