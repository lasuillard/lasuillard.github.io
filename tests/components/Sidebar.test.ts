// @vitest-environment jsdom
import Sidebar from '$components/Sidebar.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Sidebar', () => {
	it('has a valid locator', () => {
		const { getByTestId } = render(Sidebar);
		expect(getByTestId('sidebar')).toBeTruthy();
	});

	it('should contain profile', () => {
		const { queryByTestId } = render(Sidebar);
		const profile = queryByTestId('profile') as HTMLInputElement;
		expect(profile).toBeTruthy();
	});
});
