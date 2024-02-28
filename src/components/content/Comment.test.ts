// @vitest-environment happy-dom
import { render } from '@testing-library/svelte';
import Comment from '^/src/components/content/Comment.svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Comment);
	expect(getByTestId('utterances')).toBeTruthy();
});
