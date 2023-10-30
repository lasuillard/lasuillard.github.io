// @vitest-environment happy-dom
import { load } from '$routes/+layout';
import Layout from '$routes/+layout.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('renders', async () => {
	// @ts-expect-error Enough for mocking.
	const { container } = render(Layout, { data: await load({ url: { pathname: '' } }) });
	expect(container).toBeTruthy();
});

it.todo('contains a header');
it.todo('contains a main content slot');
it.todo('contains a footer');
