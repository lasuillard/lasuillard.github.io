// @vitest-environment happy-dom
import Header from '$components/layout/Header.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('header')).toBeTruthy();
});

// NOTE: Further reading for 2-way binding: https://github.com/testing-library/svelte-testing-library/issues/117
it('has a button to toggle drawer', async () => {
	const {
		getByTestId,
		component: { $$: component }
	} = render(Header);
	const drawerToggle = getByTestId('drawer-toggle');
	expect(drawerToggle).toBeTruthy();
	expect(component.ctx[component.props['drawerOpen']]).toBe(false);
	drawerToggle.click();
	expect(component.ctx[component.props['drawerOpen']]).toBe(true);
});

it('has a link to home', () => {
	const { getAllByText } = render(Header);
	getAllByText('Home').forEach((elem) => {
		expect(elem.getAttribute('href')).toEqual('/');
	});
});

it('has a link to about', () => {
	const { getAllByText } = render(Header);
	getAllByText('About Me').forEach((elem) => {
		expect(elem.getAttribute('href')).toEqual('/about-me');
	});
});

it('has a link to blog', () => {
	const { getAllByText } = render(Header);
	getAllByText('Blog').forEach((elem) => {
		expect(elem.getAttribute('href')).toEqual('/blog');
	});
});

it('contains theme selector', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('theme-select')).toBeTruthy();
});
