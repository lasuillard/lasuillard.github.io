// @vitest-environment jsdom
import Blog from '$components/icon/Blog.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Blog);
	expect(getByTestId('icon/blog')).toBeTruthy();
});
