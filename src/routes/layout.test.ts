// @vitest-environment jsdom
import Layout from '$routes/+layout.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('renders', async () => {
	const { container } = render(Layout);
	expect(container).toBeTruthy();
});
