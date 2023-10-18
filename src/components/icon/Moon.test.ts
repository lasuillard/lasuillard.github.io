// @vitest-environment happy-dom
import Moon from '$components/icon/Moon.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Moon);
	expect(getByTestId('icon/moon')).toBeTruthy();
});
