// @vitest-environment jsdom
import '$routes/+layout';
import Layout from '$routes/+layout.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('renders', () => {
	const { container } = render(Layout);
	expect(container).toBeTruthy();
});

it.todo('contains language switch');
it.todo('contains search input to find posts');
it.todo('contains left sidebar to present profile');
it.todo('contains main content slot');
it.todo('contains right sidebar to browse posts');
