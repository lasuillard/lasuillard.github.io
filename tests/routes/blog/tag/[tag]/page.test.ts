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
					preview: '/lorem-ipsum.png',
					summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
					tags: ['Apple', 'Watermelon', 'Orange']
				},
				content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
			}
		])
	}));
	const { getByText, getByRole } = render(Page, {
		// @ts-expect-error Enough for mocking.
		data: await load({ params: { tag: 'Apple' }, fetch })
	});
	expect(getByText('Lorem Ipsum')).toBeTruthy();
	expect(getByRole('time').getAttribute('datetime')).toEqual(
		new Date('2020-04-13T13:09:28.333+09:00').toISOString()
	);
	expect(getByRole('link').getAttribute('href')).toBeDefined();
});

it('no post matching tag', async () => {
	const fetch = vi.fn(() => ({
		json: vi.fn(() => [])
	}));
	const { getByText } = render(Page, {
		// @ts-expect-error Enough for mocking.
		data: await load({ params: { tag: 'Apple' }, fetch })
	});
	expect(getByText(`There is no post with Apple.`, { exact: false })).toBeTruthy();
});
