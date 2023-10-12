// @vitest-environment jsdom
import Sun from '$components/icon/Sun.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Sun);
	expect(getByTestId('icon/sun')).toBeTruthy();
});
