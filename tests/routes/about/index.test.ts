// @vitest-environment jsdom
import Page from '$lib/../routes/about/+page.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('about', () => {
	it('should render', () => {
		const { container } = render(Page);
		expect(container).toBeTruthy();
	});
});
