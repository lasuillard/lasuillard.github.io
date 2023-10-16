// @vitest-environment jsdom
import Header from '$components/Header.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('header')).toBeTruthy();
});

// NOTE: Further reading for 2-way binding: https://github.com/testing-library/svelte-testing-library/issues/117
it('has a button to toggle sidebar', async () => {
	const openSidebar = false;
	const { getByTestId } = render(Header, { openSidebar });
	expect(getByTestId('sidebar-toggle')).toBeTruthy();
});

it('contains theme selector', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('theme-select')).toBeTruthy();
});

it('contains language selector', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('language-select')).toBeTruthy();
});
