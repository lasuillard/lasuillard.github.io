// @vitest-environment jsdom
import Page from '$lib/../routes/+page.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('index', () => {
	it('should have a heading', () => {
		const { queryByText } = render(Page);
		const heading = queryByText('Welcome to SvelteKit');
		expect(heading).toBeTruthy();
	});
});
