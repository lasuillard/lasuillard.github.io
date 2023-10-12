// @vitest-environment jsdom
import '$routes/+layout';
import Layout from '$routes/+layout.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('shows error detail', () => {
	const { container } = render(Layout);
	expect(container).toBeTruthy();
});

it.todo('should have theme switch', () => {});
it.todo('should have language switch');
it.todo('should have search input to find posts');
it.todo('should have left sidebar to present profile');
it.todo('should have main content slot');
it.todo('should have right sidebar to browse posts');
