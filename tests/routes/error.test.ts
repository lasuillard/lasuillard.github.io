// @vitest-environment happy-dom
import Page from '$routes/+error.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it.todo('shows error detail', () => {
	const { getByText } = render(Page, {
		status: 404,
		message: 'Not Found'
	});
	expect(getByText('404')).toBeTruthy();
	expect(getByText('Not Found')).toBeTruthy();
});

it.todo('provides alternative message if not given', () => {
	const { getByText } = render(Page, {
		status: 404
	});
	expect(getByText('404')).toBeTruthy();
	expect(getByText('Unknown Error')).toBeTruthy();
});
