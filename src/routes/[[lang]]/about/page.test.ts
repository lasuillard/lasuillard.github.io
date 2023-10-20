// @vitest-environment jsdom
import Page from '$routes/[[lang]]/about/+page.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('should render', () => {
	const { container } = render(Page);
	expect(container).toBeTruthy();
});
