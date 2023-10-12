// @vitest-environment jsdom
import Gmail from '$components/icon/Gmail.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Gmail);
	expect(getByTestId('icon/gmail')).toBeTruthy();
});
