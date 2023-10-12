// @vitest-environment jsdom
import Markdown from '$components/Markdown.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('renders', () => {
	const { container } = render(Markdown);
	expect(container).toBeTruthy();
});
