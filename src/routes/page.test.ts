// @vitest-environment happy-dom
import Page from '$routes/+page.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('renders', () => {
	const { container } = render(Page);
	expect(container).toBeTruthy();
});
