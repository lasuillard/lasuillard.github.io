// @vitest-environment happy-dom
import Page from '$routes/+page.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import { load } from './+page';

it('renders', async () => {
	// @ts-expect-error Enough for mocking.
	const { container } = render(Page, { data: await load() });
	expect(container).toBeTruthy();
});
