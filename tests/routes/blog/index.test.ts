// @vitest-environment jsdom
import Page from '$lib/../routes/blog/+page.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('blog index', () => {
	it('should render', () => {
		const { container } = render(Page, { data: { allPosts: [] } }); // TODO: Pass more data
		expect(container).toBeTruthy();
	});
});
