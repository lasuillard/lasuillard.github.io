// @vitest-environment jsdom
import Page from '$lib/../routes/+error.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('error', () => {
	it('shows error detail', () => {
		const { getByText } = render(Page, {
			status: 404,
			message: 'Not Found'
		});
		expect(getByText('404')).toBeTruthy();
		expect(getByText('Not Found')).toBeTruthy();
	});

	it('provides alternative message if not given', () => {
		const { getByText } = render(Page, {
			status: 404
		});
		expect(getByText('404')).toBeTruthy();
		expect(getByText('Unknown Error')).toBeTruthy();
	});
});
