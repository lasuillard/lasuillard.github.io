// @vitest-environment happy-dom
import Comment from '$components/content/Comment.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it.each([{ theme: 'github-light' }, { theme: 'github-dark' }])(
	'renders the component for theme $theme',
	({ theme }) => {
		const { getByTestId } = render(Comment, { theme });
		expect(getByTestId('utterances')).toBeTruthy();
	}
);
