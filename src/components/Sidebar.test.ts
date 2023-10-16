// @vitest-environment jsdom
import Sidebar from '$components/Sidebar.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Sidebar);
	expect(getByTestId('sidebar')).toBeTruthy();
});

it('contains profile', () => {
	const { getByTestId } = render(Sidebar);
	expect(getByTestId('profile')).toBeTruthy();
});

it('has a link to home', () => {
	const { getByText } = render(Sidebar);
	expect(getByText('Home').getAttribute('href')).toEqual('/');
});

it('has a link to about', () => {
	const { getByText } = render(Sidebar);
	expect(getByText('About').getAttribute('href')).toEqual('/about');
});

it('has a link to blog', () => {
	const { getByText } = render(Sidebar);
	expect(getByText('Blog').getAttribute('href')).toEqual('/blog');
});

it('contains search bar', () => {
	const { getByTestId } = render(Sidebar);
	expect(getByTestId('search')).toBeTruthy();
});
