// @vitest-environment jsdom
import Page from '$routes/+page.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

it('should have a heading', () => {
	const { queryByText } = render(Page);
	const heading = queryByText('Welcome to SvelteKit');
	expect(heading).toBeTruthy();
});

describe('posts', () => {
	it.todo('have all required metadata');
	it.todo('are reachable via slug');
});