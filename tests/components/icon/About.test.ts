// @vitest-environment jsdom
import About from '$components/icon/About.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(About);
	expect(getByTestId('icon/about')).toBeTruthy();
});
