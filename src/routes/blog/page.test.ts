// @vitest-environment jsdom
import { load } from '$routes/blog/+page';
import Page from '$routes/blog/+page.svelte';
import { getAllByRole, getByRole, getByText, render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('list tags', async () => {
	const fetch = vi.fn(() => ({
		json: vi.fn(() => [
			{
				slug: 'lorem-ipsum',
				metadata: {
					title: 'Lorem Ipsum',
					publicationDate: '2020-04-13T13:09:28.333+09:00',
					tags: ['Apple', 'Watermelon', 'Orange']
				},
				content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
			}
		])
	}));
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const page = render(Page, { data: await load({ fetch }) });
	const section = page.getByTestId('tags');
	const tags = getAllByRole(section, 'link');
	expect(tags).toHaveLength(3);
	['Apple', 'Watermelon', 'Orange'].forEach((tag) => {
		expect(getByText(section, tag)).toBeTruthy();
		expect(section.querySelector(`a[href="/blog/tag/${tag}"]`)).toBeTruthy();
	});
});

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
				},
				content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
			}
		])
	}));
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const page = render(Page, { data: await load({ fetch }) });
	const section = page.getByTestId('posts');
	expect(getByText(section, 'Lorem Ipsum')).toBeTruthy();
	expect(getByRole(section, 'time').getAttribute('datetime')).toEqual(
		new Date('2020-04-13T13:09:28.333+09:00').toISOString()
	);
	expect(section.querySelector("a[href='/blog/lorem-ipsum']")).toBeTruthy();
	['Apple', 'Watermelon', 'Orange'].forEach((tag) => {
		expect(getByText(section, tag)).toBeTruthy();
		expect(section.querySelector(`a[href="/blog/tag/${tag}"]`)).toBeTruthy();
	});
});
