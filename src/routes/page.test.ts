// @vitest-environment happy-dom
import Page from '$routes/+page.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

it('renders', () => {
	const { container } = render(Page);
	expect(container).toBeTruthy();
});

describe('posts', () => {
	it.todo('have all required metadata');
	it.todo('are reachable via slug');
});
