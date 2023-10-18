// @vitest-environment happy-dom
import { load } from '$routes/blog/+page';
import Page from '$routes/blog/+page.svelte';
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
	const { getByText } = render(Page, { data: await load({ fetch }) });
	expect(getByText('Lorem Ipsum')).toBeTruthy();
	// TODO: Find date string
	// TODO: Find tags via loops, assert it links to tag page
});

it.todo('list tags');
