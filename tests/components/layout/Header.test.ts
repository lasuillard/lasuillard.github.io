// @vitest-environment happy-dom
import Header from '$components/layout/Header.svelte';
import { render } from '@testing-library/svelte';
import { expect } from 'vitest';
import { it } from '^/tests/_helpers/vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Header);
	expect(getByTestId('header')).toBeTruthy();
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

it('closes drawer when clicking outside of it', async ({ user }) => {
	const component = render(Header, { drawerOpen: true });

	const drawerOverlay = component.container.querySelector('.drawer-overlay');
	if (drawerOverlay) {
		await user.click(drawerOverlay);
	}

	const drawerCheckbox = component.container.querySelector('#header-drawer') as HTMLInputElement;
	expect(drawerCheckbox).toBeTruthy();
});
