// @vitest-environment jsdom
import { load } from '$routes/blog/tag/[tag]/+page';
import Page from '$routes/blog/tag/[tag]/+page.svelte';
import { getByRole, getByText, render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';
import postsFixture from '~/tests/fixtures/posts.json';

it('list posts with matching tag', async () => {
	const fetch = vi.fn(() => ({
		json: vi.fn(() => postsFixture)
	}));
	const page = render(Page, {
		// @ts-expect-error Enough for mocking.
		data: await load({ params: { tag: 'Banana' }, fetch })
	});
	const resultRows = page.getAllByRole('listitem');
	console.log(resultRows);
	postsFixture
		.filter((post) => post.metadata.tags.includes('Banana'))
		.forEach((post) => {
			const row = resultRows.find((row) =>
				row.querySelector(`a[href='/blog/${post.id}']`)
			) /* Assert below */!;
			expect(row).toBeTruthy();
			expect(getByText(row, post.metadata.title)).toBeTruthy();
			expect(getByRole(row, 'time').getAttribute('datetime')).toEqual(
				new Date(post.metadata.publicationDate).toISOString()
			);
			expect(getByRole(row, 'link').getAttribute('href')).toBeDefined();
		});
});

it('no post matching tag', async () => {
	const fetch = vi.fn(() => ({
		json: vi.fn(() => [])
	}));
	const { getByText } = render(Page, {
		// @ts-expect-error Enough for mocking.
		data: await load({ params: { tag: 'Apple' }, fetch })
	});
	expect(getByText('There is no post with Apple.')).toBeTruthy();
});
