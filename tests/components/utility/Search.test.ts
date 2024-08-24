// @vitest-environment happy-dom
import Search from '$components/utility/Search.svelte';
import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Search);
	expect(getByTestId('search')).toBeTruthy();
});

it('has a text input with placeholder', () => {
	const component = render(Search);
	expect((component.getByRole('textbox') as HTMLInputElement).placeholder).toEqual('Search');
});

it.todo('shows matching results for given query', async () => {
	const component = render(Search);
	const input = component.getByRole('textbox') as HTMLInputElement;
	await fireEvent.change(input, { target: { value: 'uno' } });
	expect(input.value).toEqual('uno');
	await tick();
	expect(component.getByText('Uno terra errat')).toBeTruthy(); // FIXME: Not sure why changes aren't reflected
});
