// @vitest-environment jsdom
import { load } from '$routes/blog/+page';
import Page from '$routes/blog/+page.svelte';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';
import postsFixture from '~/tests/fixtures/posts.json';

it('list posts', async () => {
	// FIXME: Write global fetch stub for later reuse
	const fetch = vi.fn(() => ({
		json: vi.fn(() => postsFixture)
	}));
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { getByText } = render(Page, { data: await load({ fetch }) });
	expect(getByText('Uno terra errat')).toBeTruthy();
	expect(getByText('Puppis artus attoniti haud')).toBeTruthy();
	expect(getByText('Recepta mihi cetera humo')).toBeTruthy();
	// TODO: Check for tags
});

it.todo('list tags');
