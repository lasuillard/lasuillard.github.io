// @vitest-environment jsdom
import '$routes/+layout';
import Layout from '$routes/+layout.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('layout', () => {
	it('should have theme switch', () => {
		const { queryByTestId } = render(Layout);
		const themeSelect = queryByTestId('theme-select');
		expect(document.documentElement.contains(themeSelect)).toBeTruthy();
	});

	it.todo('should have language switch');
	it.todo('should have search input to find posts');
	it.todo('should have left sidebar to present profile');
	it.todo('should have main content slot');
	it.todo('should have right sidebar to browse posts');
});
