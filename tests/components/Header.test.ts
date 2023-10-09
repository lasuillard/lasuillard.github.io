// @vitest-environment jsdom
import Header from '$components/Header.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('header')).toBeTruthy();
});

it('has a link to home', () => {
	const { container } = render(Header);
	const homeLink = container.querySelector('a[href="/"]');
	expect(homeLink).toBeTruthy();
});

it('contains search bar', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('search')).toBeTruthy();
});

it('contains theme selector', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('theme-select')).toBeTruthy();
});

it('contains language selector', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('language-select')).toBeTruthy();
});
