// @vitest-environment happy-dom
import { load } from '$routes/about-me/+page';
import Page from '$routes/about-me/+page.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('should render', async () => {
	// @ts-expect-error Enough for mocking.
	const { container } = render(Page, { data: await load() });
	expect(container).toBeTruthy();
});
