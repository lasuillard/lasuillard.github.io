// @vitest-environment happy-dom
import { load } from '$routes/+page';
import Page from '$routes/+page.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('renders', async () => {
	// @ts-expect-error Enough for mocking.
	const { container } = render(Page, { data: await load() });
	expect(container).toBeTruthy();
});
