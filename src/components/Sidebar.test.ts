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

it('contains search bar', () => {
	const { getByTestId } = render(Sidebar);
	expect(getByTestId('search')).toBeTruthy();
});
