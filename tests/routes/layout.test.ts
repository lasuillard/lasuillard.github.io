// @vitest-environment jsdom
import '$routes/+layout';
import Layout from '$routes/+layout.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('contains theme switch', () => {
	const { queryByTestId } = render(Layout);
	const themeSelect = queryByTestId('theme-select');
	expect(document.documentElement.contains(themeSelect)).toBeTruthy();
});

it.todo('contains language switch');
it.todo('contains search input to find posts');
it.todo('contains left sidebar to present profile');
it.todo('contains main content slot');
it.todo('contains right sidebar to browse posts');
