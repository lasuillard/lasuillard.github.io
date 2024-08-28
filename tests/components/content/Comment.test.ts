// @vitest-environment happy-dom
import Comment from '$components/content/Comment.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Comment);
	expect(getByTestId('utterances')).toBeTruthy();
});
