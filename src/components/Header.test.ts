// @vitest-environment jsdom
import Header from '$components/Header.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

// TODO: Default theme from OS media preference
//       https://stackoverflow.com/questions/50840168/how-to-detect-if-the-os-is-in-dark-mode-in-browsers

describe.each(['header:sm', 'header:md'])('responsive headers', (headerId) => {
	it('should have a link to home', () => {
		const { container } = render(Header);
		const homeLink = container.querySelector(
			`[data-testid="${headerId}"] a[href="/"]`
		) as HTMLElement;
		expect(homeLink).toBeTruthy();
	});

	it('should contain search bar', () => {
		const { container } = render(Header);
		const search = container.querySelector(
			`[data-testid="${headerId}"] [data-testid="search"]`
		) as HTMLElement;
		expect(search).toBeTruthy();
	});

	it('should contain theme selector', () => {
		const { container } = render(Header);
		const themeSelect = container.querySelector(
			`[data-testid="${headerId}"] [data-testid="theme-select"]`
		) as HTMLElement;
		expect(themeSelect).toBeTruthy();
	});

	it('should contain language selector', () => {
		const { container } = render(Header);
		const languageSelect = container.querySelector(
			`[data-testid="${headerId}"] [data-testid="language-select"]`
		) as HTMLElement;
		expect(languageSelect).toBeTruthy();
	});
});
