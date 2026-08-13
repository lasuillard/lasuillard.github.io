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

it('has a text input with placeholder', () => {
	const component = render(Search);
	expect((component.getByRole('textbox') as HTMLInputElement).placeholder).toBe('...');
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

	const input = component.getByRole('textbox') as HTMLInputElement;
	await user.click(input);
	await user.keyboard('uno');
	await tick();

	const resultsContainer = component.container.querySelector('ol.menu');
	expect(resultsContainer).toBeTruthy();

	const titleElement = component.getByText('Uno terra errat');
	expect(titleElement).toBeTruthy();
	expect(titleElement.tagName).toBe('SPAN');
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

	const input = component.getByRole('textbox') as HTMLInputElement;
	await user.click(input);
	await user.keyboard('uniquephrase');
	await tick();

	// Check that the snippet container displays the text
	const markElement = component.container.querySelector('mark');
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

	const input = component.getByRole('textbox') as HTMLInputElement;
	await user.click(input);
	await user.keyboard('xyz123');
	await tick();

	const searchResults = component.container.querySelector('ol.menu');
	expect(searchResults).toBeTruthy();
	expect(searchResults?.children.length).toBe(0);
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

	const input = component.getByRole('textbox') as HTMLInputElement;
	await user.click(input);
	await user.keyboard('un');
	await tick();

	const searchResults = component.container.querySelector('ol.menu');
	expect(searchResults).toBeTruthy();
	expect(searchResults?.children.length).toBe(0);
});

it('shows no results message when search is empty', async ({ user }) => {
	await initEngine([]);
	const component = render(Search);

	const input = component.getByRole('textbox') as HTMLInputElement;
	await user.click(input);
	await user.keyboard('test');
	await user.clear(input);
	await tick();

	const noResultsText = component.getByText('No results found');
	const suggestionsText = component.getByText('Suggestions:');
	expect(noResultsText).toBeTruthy();
	expect(suggestionsText).toBeTruthy();
});
