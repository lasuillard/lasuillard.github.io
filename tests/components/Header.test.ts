// @vitest-environment jsdom
import Header from '$components/Header.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Header', () => {
	// TODO: Default theme from OS media preference
	//       https://stackoverflow.com/questions/50840168/how-to-detect-if-the-os-is-in-dark-mode-in-browsers
	it('should have a link to home', () => {
		const { container } = render(Header);
		const homeLink = container.querySelector('a[href="/"]') as HTMLElement;
		expect(homeLink).toBeTruthy();
	});

	it('should contain search bar', () => {
		const { queryByTestId } = render(Header);
		const searchBar = queryByTestId('search-bar') as HTMLInputElement;
		expect(searchBar).toBeTruthy();
	});

	it.todo('should contain theme selector', () => {
		const { queryByTestId } = render(Header);
		const themeSelect = queryByTestId('theme-select') as HTMLElement;
		expect(themeSelect).toBeTruthy();
	});

	it.todo('should contain language selector', () => {
		const { queryByTestId } = render(Header);
		const languageSelect = queryByTestId('language-select') as HTMLElement;
		expect(languageSelect).toBeTruthy();
	});
});
