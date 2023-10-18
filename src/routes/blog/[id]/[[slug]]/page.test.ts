/* eslint-disable @typescript-eslint/ban-ts-comment */
// @vitest-environment jsdom
import * as post from '$lib/post';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';
import { load } from './+page';
import Page from './+page.svelte';

it('renders a post', async () => {
	const spy = vi.spyOn(post, 'getPost');
	spy.mockResolvedValueOnce({
		id: 'non-numeric-id',
		slug: 'coke-and-cider',
		lang: 'ko',
		metadata: {
			title: 'Coke and Cider',
			publicationDate: new Date('2020-04-13T00:00:00.000+09:00'),
			tags: ['beverage', 'review']
		},
		// @ts-ignore
		content: null // TODO: Should test the content
	});
	const { getByText, queryByText } = render(Page, {
		// @ts-ignore
		data: await load({
			params: { id: 'non-numeric-id', slug: 'coke-and-cider' },
			route: { id: '/blog/[id]/[[slug]]' }
		})
	});
	expect(spy).toHaveBeenCalledOnce();
	expect(getByText('Coke and Cider')).toBeTruthy();
	expect(getByText('beverage')).toBeTruthy();
	expect(getByText('review')).toBeTruthy();
	expect(queryByText('polarbear')).toBeNull();
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
