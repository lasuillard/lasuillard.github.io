// @vitest-environment happy-dom
import Search from '$components/layout/Search.svelte';
import { PostSchema } from '$lib/post';
import { clearEngine, initEngine } from '$lib/search';
import { render, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, expect } from 'vitest';
import { it } from '../../_helpers/vitest';

afterEach(() => {
	clearEngine();
});

it('has a valid locator', () => {
	const { getByTestId } = render(Search);
	expect(getByTestId('search')).toBeTruthy();
});

it('has a trigger button and opens modal when clicked', async ({ user }) => {
	const component = render(Search);
	const button = component.getByRole('button', { name: '검색' });
	expect(button).toBeTruthy();

	await user.click(button);
	await tick();

	const input = component.getByTestId('search-input');
	expect(input).toBeTruthy();
});

it('shows matching results for given query', async ({ user }) => {
	const testPost = PostSchema.parse({
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

	const input = component.getByTestId('search-input');
	await user.click(input);
	await user.keyboard('uno');

	await waitFor(() => {
		const resultsContainer = component.getByTestId('search-results');
		expect(resultsContainer).toBeTruthy();
	});

	const titleElement = document.body.textContent;
	expect(titleElement).toContain('Uno terra errat');
});

it('highlights matching terms in the snippet', async ({ user }) => {
	const testPost = PostSchema.parse({
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

	const input = component.getByTestId('search-input');
	await user.click(input);
	await user.keyboard('uniquephrase');
	await tick();

	// Check that the snippet container displays the text
	await waitFor(
		() => {
			const markElement = document.querySelector('mark');
			expect(markElement).toBeTruthy();
			expect(markElement?.textContent).toBe('uniquephrase');
			expect(markElement?.className).toContain('search-highlight');
		},
		{ timeout: 5_000 }
	);
});

it('cancels previous debounce timer on rapid input and renders only latest query results', async ({
	user
}) => {
	const post1 = PostSchema.parse({
		metadata: {
			id: '1',
			slug: 'apple-post',
			title: 'Apple Orchard',
			publicationDate: new Date(),
			preview: '/posts/preview.png',
			summary: 'A test summary',
			tags: ['apple']
		},
		content: 'Content containing apple fruit'
	});
	const post2 = PostSchema.parse({
		metadata: {
			id: '2',
			slug: 'banana-post',
			title: 'Banana Plantation',
			publicationDate: new Date(),
			preview: '/posts/preview.png',
			summary: 'A test summary',
			tags: ['banana']
		},
		content: 'Content containing banana fruit'
	});
	await initEngine([post1, post2]);
	const component = render(Search);

	const button = component.getByRole('button', { name: '검색' });
	await user.click(button);
	await tick();

	const input = component.getByTestId('search-input');
	await user.click(input);

	// Rapid typing: input apple then immediately replace with banana before 150ms debounce fires
	await user.keyboard('apple');
	await user.clear(input);
	await user.keyboard('banana');

	await waitFor(
		() => {
			const resultsContainer = component.getByTestId('search-results');
			expect(resultsContainer).toBeTruthy();
			expect(document.body.textContent).toContain('Banana Plantation');
		},
		{ timeout: 1_000 }
	);

	expect(document.body.textContent).not.toContain('Apple Orchard');
});

it('shows no results for non-matching query', async ({ user }) => {
	const testPost = PostSchema.parse({
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

	const input = component.getByTestId('search-input');
	await user.click(input);
	await user.keyboard('xyz123');

	await waitFor(
		() => {
			const bodyText = document.body.textContent;
			expect(bodyText).toContain('아니면...');
			expect(component.getByTestId('search-no-suggestions')).toBeTruthy();
		},
		{ timeout: 1_000 }
	);

	const searchResults = component.queryByTestId('search-results');
	expect(searchResults).toBeNull();
});

it('suggest matching results for given query', async ({ user }) => {
	const testPost = PostSchema.parse({
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

	const input = component.getByTestId('search-input');
	await user.click(input);
	await user.keyboard('un');

	await waitFor(
		() => {
			const suggestionButton = component.getByRole('button', { name: 'uno' });
			expect(suggestionButton).toBeTruthy();
		},
		{ timeout: 1_000 }
	);

	const searchResults = component.queryByTestId('search-results');
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
