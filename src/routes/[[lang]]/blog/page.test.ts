// @vitest-environment jsdom
import { load } from '$routes/[[lang]]/blog/+page';
import Page from '$routes/[[lang]]/blog/+page.svelte';
import { getAllByRole, getByRole, getByText, render } from '@testing-library/svelte';
import postsFixture from '^/tests/fixtures/posts.json';
import { expect, it, vi } from 'vitest';

it('list all unique tags', async () => {
	const fetch = vi.fn(() => ({
		json: vi.fn(() => postsFixture)
	}));
	// @ts-expect-error Enough for mocking.
	const page = render(Page, { data: await load({ fetch }) });
	const section = page.getByTestId('tags');
	const tags = getAllByRole(section, 'link');
	expect(tags).toHaveLength(10);
	[
		'Banana',
		'Blueberry',
		'Coconut',
		'Grape',
		'Melon',
		'Papaya',
		'Pomegranate',
		'Raspberry',
		'Strawberry',
		'Watermelon'
	].forEach((tag) => {
		expect(getByText(section, tag)).toBeTruthy();
		expect(section.querySelector(`a[href="/blog/tag/${tag}"]`)).toBeTruthy();
	});
});

it('display some text if there is no tag', async () => {
	const fetch = vi.fn(() => ({
		json: vi.fn(() =>
			[...postsFixture].map((p) => ({ ...p, metadata: { ...p.metadata, tags: [] } }))
		)
	}));
	// @ts-expect-error Enough for mocking.
	const page = render(Page, { data: await load({ fetch }) });
	const section = page.getByTestId('tags');
	expect(getByText(section, 'There is no tag yet.')).toBeTruthy();
});

it('list all posts', async () => {
	const fetch = vi.fn(() => ({
		json: vi.fn(() => postsFixture)
	}));
	// @ts-expect-error Enough for mocking.
	const page = render(Page, { data: await load({ fetch }) });
	const cells = page.getAllByRole('cell');
	postsFixture.forEach((post) => {
		// BUG: Below query not working, (works in browser)
		// const cell = page.container.querySelector(`[role='cell']:has(a[href='/blog/${post.id}'])`);
		const cell = cells.find((cell) =>
			cell.querySelector(`a[href='/blog/${post.id}']`)
		) /* Assert below */!;
		expect(cell).toBeTruthy();
		expect(getByText(cell, post.metadata.title)).toBeTruthy();
		expect(getByRole(cell, 'time').getAttribute('datetime')).toEqual(
			new Date(post.metadata.publicationDate).toISOString()
		);
	});
});

it('display some text if there is no post', async () => {
	const fetch = vi.fn(() => ({
		json: vi.fn(() => [])
	}));
	// @ts-expect-error Enough for mocking.
	const page = render(Page, { data: await load({ fetch }) });
	const section = page.getByTestId('posts');
	expect(getByText(section, 'There is no post yet.')).toBeTruthy();
});
