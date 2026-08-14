// @vitest-environment happy-dom
import { Post } from '$lib/post';
import { initEngine } from '$lib/search';
import Search from '$routes/blog/Search.svelte';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { expect } from 'vitest';
import { it } from '../../_helpers/vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Search);
	expect(getByTestId('search')).toBeTruthy();
});

it('has a trigger button and opens modal when clicked', async ({ user }) => {
	const component = render(Search);
	const button = component.getByRole('button', { name: '검색' });
	expect(button).toBeTruthy();
	expect(button.textContent).toContain('검색...');

	await user.click(button);
	await tick();

	// Inside the modal there should be the textbox, which is portaled to document.body
	const input = document.querySelector('input[placeholder="검색어를 입력하세요..."]') as HTMLInputElement;
	expect(input).toBeTruthy();
});

it('shows matching results for given query', async ({ user }) => {
	const testPost = Post.parse({
		metadata: {
			id: '1',
			slug: 'uno-terra-errat',
			title: 'Uno terra errat',
			publicationDate: new Date(),
			preview: '/posts/preview.png',
			summary: 'A test summary',
			tags: ['uno', 'terra', 'errat']
		},
		content:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus ut est fermentum aliquam. Nullam sit amet sapien sit amet'
	});
	await initEngine([testPost]);
	const component = render(Search);

	const button = component.getByRole('button', { name: '검색' });
	await user.click(button);
	await tick();

	const input = document.querySelector('input[placeholder="검색어를 입력하세요..."]') as HTMLInputElement;
	await user.click(input);
	await user.keyboard('uno');
	await tick();

	const resultsContainer = document.querySelector('ol.menu');
	expect(resultsContainer).toBeTruthy();

	const titleElement = document.body.textContent;
	expect(titleElement).toContain('Uno terra errat');
});

it('highlights matching terms in the snippet', async ({ user }) => {
	const testPost = Post.parse({
		metadata: {
			id: '1',
			slug: 'uno-terra-errat',
			title: 'Uno terra errat',
			publicationDate: new Date(),
			preview: '/posts/preview.png',
			summary: 'A test summary',
			tags: ['uno', 'terra', 'errat']
		},
		content:
			'Lorem ipsum dolor sit amet with uniquephrase inside content. Nulla nec purus ut est fermentum aliquam.'
	});
	await initEngine([testPost]);
	const component = render(Search);

	const button = component.getByRole('button', { name: '검색' });
	await user.click(button);
	await tick();

	const input = document.querySelector('input[placeholder="검색어를 입력하세요..."]') as HTMLInputElement;
	await user.click(input);
	await user.keyboard('uniquephrase');
	await tick();

	// Check that the snippet container displays the text
	const markElement = document.querySelector('mark');
	expect(markElement).toBeTruthy();
	expect(markElement?.textContent).toBe('uniquephrase');
	expect(markElement?.className).toContain('text-primary');
});

it('shows no results for non-matching query', async ({ user }) => {
	const testPost = Post.parse({
		metadata: {
			id: '1',
			slug: 'uno-terra-errat',
			title: 'Uno terra errat',
			publicationDate: new Date(),
			preview: '/posts/preview.png',
			summary: 'A test summary',
			tags: ['uno', 'terra', 'errat']
		},
		content: 'Lorem ipsum dolor sit amet'
	});
	await initEngine([testPost]);
	const component = render(Search);

	const button = component.getByRole('button', { name: '검색' });
	await user.click(button);
	await tick();

	const input = document.querySelector('input[placeholder="검색어를 입력하세요..."]') as HTMLInputElement;
	await user.click(input);
	await user.keyboard('xyz123');
	await tick();

	const searchResults = document.querySelector('ol.menu');
	expect(searchResults).toBeNull();

	const bodyText = document.body.textContent;
	expect(bodyText).toContain('검색 결과가 없습니다.');
});

it('suggest matching results for given query', async ({ user }) => {
	const testPost = Post.parse({
		metadata: {
			id: '1',
			slug: 'uno-terra-errat',
			title: 'Uno terra errat',
			publicationDate: new Date(),
			preview: '/posts/preview.png',
			summary: 'A test summary',
			tags: ['uno', 'terra', 'errat']
		},
		content: 'Lorem ipsum dolor sit amet'
	});
	await initEngine([testPost]);
	const component = render(Search);

	const button = component.getByRole('button', { name: '검색' });
	await user.click(button);
	await tick();

	const input = document.querySelector('input[placeholder="검색어를 입력하세요..."]') as HTMLInputElement;
	await user.click(input);
	await user.keyboard('un');
	await tick();

	const searchResults = document.querySelector('ol.menu');
	expect(searchResults).toBeNull();
});

it('shows empty search state initially', async ({ user }) => {
	await initEngine([]);
	const component = render(Search);

	const button = component.getByRole('button', { name: '검색' });
	await user.click(button);
	await tick();

	const bodyText = document.body.textContent;
	expect(bodyText).toContain('검색어를 입력하여 게시글을 찾아보세요.');
});
