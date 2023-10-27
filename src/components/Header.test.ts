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
	const { getByTestId, component: _component } = render(Header, { openSidebar });
	const component = _component.$$;
	const sidebarToggle = getByTestId('sidebar-toggle');
	expect(sidebarToggle).toBeTruthy();
	expect(component.ctx[component.props['openSidebar']]).toBe(false);
	sidebarToggle.click();
	expect(component.ctx[component.props['openSidebar']]).toBe(true);
});

it('has a link to home', () => {
	const { getByText } = render(Header);
	expect(getByText('Home').getAttribute('href')).toEqual('/');
});

it('has a link to about', () => {
	const { getByText } = render(Header);
	expect(getByText('About Me').getAttribute('href')).toEqual('/about-me');
});

it('has a link to blog', () => {
	const { getByText } = render(Header);
	expect(getByText('Blog').getAttribute('href')).toEqual('/blog');
});

it('contains theme selector', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('theme-select')).toBeTruthy();
});

it('contains language selector', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('language-select')).toBeTruthy();
});
