// @vitest-environment happy-dom
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import { load } from './+page';
import Page from './+page.svelte';

it('renders', async () => {
	// @ts-expect-error Enough for mocking.
	const { container } = render(Page, { data: await load() });
	expect(container).toBeTruthy();
});
