// @vitest-environment happy-dom
import Search from '$components/utility/Search.svelte';
import { initEngine } from '$lib/search';
import { render } from '@testing-library/svelte';
import { it } from '^/tests/_helpers/vitest';
import { expect } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Search);
	expect(getByTestId('search')).toBeTruthy();
});

it('has a text input with placeholder', () => {
	const component = render(Search);
	expect((component.getByRole('textbox') as HTMLInputElement).placeholder).toEqual('Search');
});

it('shows matching results for given query', async ({ user }) => {
	// Arrange
	await initEngine([
		{
			slug: 'uno-terra-errat',
			metadata: {
				title: 'Uno terra errat',
				publicationDate: new Date(),
				preview: '/posts/preview.png',
				tags: ['uno', 'terra', 'errat']
			},
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus ut est fermentum aliquam. Nullam sit amet sapien sit amet'
		}
	]);
	const component = render(Search);

	// Act
	const input = component.getByRole('textbox') as HTMLInputElement;
	await user.click(input);
	await user.keyboard('uno');

	// Assert
	expect(component.getByText('Uno terra errat')).toBeTruthy();
});
