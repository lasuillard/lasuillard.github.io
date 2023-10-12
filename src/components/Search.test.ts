// @vitest-environment jsdom
import Search from '$components/Search.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('renders', () => {
	const { container } = render(Search);
	expect(container).toBeTruthy();
});
