// @vitest-environment jsdom
import Menu from '$components/icon/Menu.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('has a valid locator', () => {
	const { getByTestId } = render(Menu);
	expect(getByTestId('icon/menu')).toBeTruthy();
});
