// @vitest-environment jsdom
import Header from '$components/Header.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Header', () => {
	it('should have a link to home', () => {
		const { container } = render(Header);
		const homeLink = container.querySelector('a[href="/"]') as HTMLElement;
		expect(homeLink).toBeTruthy();
	});

	it('should contain search bar', () => {
		const { queryByTestId } = render(Header);
		const search = queryByTestId('search') as HTMLInputElement;
		expect(search).toBeTruthy();
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
