// @vitest-environment happy-dom
import '$routes/+layout';
import Layout from '$routes/+layout.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('renders', () => {
	const { container } = render(Layout, { data: { current: '' } });
	expect(container).toBeTruthy();
});

it.todo('contains a header');
it.todo('contains a left sidebar');
it.todo('contains a main content slot');
it.todo('contains a footer');
