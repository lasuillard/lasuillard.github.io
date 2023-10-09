// @vitest-environment jsdom
import Search from '$components/Search.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

// TODO: Default theme from OS media preference
//       https://stackoverflow.com/questions/50840168/how-to-detect-if-the-os-is-in-dark-mode-in-browsers
it('nothing to test yet, just render it', () => {
	const { container } = render(Search);
	expect(container).toBeTruthy();
});
