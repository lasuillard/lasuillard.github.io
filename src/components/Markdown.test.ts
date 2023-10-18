// @vitest-environment happy-dom
import Markdown from '$components/Markdown.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Markdown);
	expect(getByTestId('markdown')).toBeTruthy();
});
