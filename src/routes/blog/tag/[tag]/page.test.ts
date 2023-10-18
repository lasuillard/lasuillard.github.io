/* eslint-disable @typescript-eslint/ban-ts-comment */
// @vitest-environment jsdom
import { load } from '$routes/blog/tag/[tag]/+page';
import Page from '$routes/blog/tag/[tag]/+page.svelte';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';
import postsFixture from '~/tests/fixtures/posts.json';

it('list posts with matching tag', async () => {
	const fetch = vi.fn(() => ({
		json: vi.fn(() => postsFixture)
	}));

	// @ts-ignore
	const { getByText } = render(Page, { data: await load({ params: { tag: 'Coconut' }, fetch }) });
	expect(getByText('Puppis artus attoniti haud')).toBeTruthy();
	expect(getByText('Recepta mihi cetera humo')).toBeTruthy();
});

it('informative text should be shown if matching found none', async () => {
	const fetch = vi.fn(() => ({
		json: vi.fn(() => [])
	}));

	// @ts-ignore
	const { getByText } = render(Page, { data: await load({ params: { tag: 'Coconut' }, fetch }) });
	expect(getByText('There is no post with').textContent).toEqual('There is no post with #Coconut');
});
