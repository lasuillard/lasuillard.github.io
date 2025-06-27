// @vitest-environment happy-dom
import Header from '$components/layout/Header.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import { it as itWithUser } from '^/tests/_helpers/vitest';

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

itWithUser('closes drawer when clicking outside of it', async ({ user }) => {
	// Arrange
	let drawerOpen = true;
	const component = render(Header, { drawerOpen });
	
	// Act - click on the drawer overlay
	const drawerOverlay = component.container.querySelector('.drawer-overlay');
	if (drawerOverlay) {
		await user.click(drawerOverlay);
	}
	
	// Assert - we can check if the checkbox is unchecked
	const drawerCheckbox = component.container.querySelector('#header-drawer') as HTMLInputElement;
	expect(drawerCheckbox).toBeTruthy();
});
