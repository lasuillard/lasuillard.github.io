/* eslint-disable @typescript-eslint/ban-ts-comment */
// @vitest-environment jsdom
import * as post from '$lib/post';
import { load } from '$routes/blog/[slug]/+page';
import Page from '$routes/blog/[slug]/+page.svelte';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('renders a post', async () => {
	const spy = vi.spyOn(post, 'getPost');
	spy.mockResolvedValueOnce({
		metadata: {
			title: 'Lorem Ipsum',
			publicationDate: new Date('2020-04-13T13:09:28.333+09:00'),
			tags: ['Apple', 'Watermelon', 'Orange']
		},
		// @ts-ignore
		content: null // TODO: Should test the content
	});
	const { getByText, queryByText } = render(Page, {
		// @ts-ignore
		data: await load({ params: { slug: 'lorem-ipsum' } })
	});
	expect(spy).toHaveBeenCalledOnce();
	expect(getByText('Lorem Ipsum')).toBeTruthy();
	expect(getByText('Apple')).toBeTruthy();
	expect(getByText('Watermelon')).toBeTruthy();
	expect(getByText('Orange')).toBeTruthy();
	expect(queryByText('Pear')).toBeNull();
});

it('should throw an error page if post not exists', () => {
	const spy = vi.spyOn(post, 'getPost');
	spy.mockResolvedValueOnce(null);
	expect(async () =>
		render(Page, {
			// @ts-ignore
			data: await load({ params: { slug: 'lorem-ipsum' } })
		})
	).rejects.toMatchObject({
		status: 404,
		body: {
			message: 'Not Found'
		}
	});
});

it.todo("conflicting routes shouldn't exist");