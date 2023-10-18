/* eslint-disable @typescript-eslint/ban-ts-comment */
// @vitest-environment happy-dom
import { load } from '$routes/blog/tag/[tag]/+page';
import Page from '$routes/blog/tag/[tag]/+page.svelte';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('list posts', async () => {
	// FIXME: Write global fetch stub for later reuse
	const fetch = vi.fn(() => ({
		json: vi.fn(() => [
			// TODO: More items for testing
			{
				slug: 'lorem-ipsum',
				metadata: {
					title: 'Lorem Ipsum',
					publicationDate: '2020-04-13T13:09:28.333+09:00',
					tags: ['Apple', 'Watermelon', 'Orange']
				}
			}
		])
	}));
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { getByText } = render(Page, { data: await load({ params: { tag: 'Apple' }, fetch }) });
	expect(getByText('Lorem Ipsum')).toBeTruthy();
	// TODO: Find date string
	// TODO: Results have links to each posts
});
