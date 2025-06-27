// @vitest-environment happy-dom
import ThemeSelect from '$components/utility/ThemeSelect.svelte';
import { Theme, getTheme, initTheme } from '$lib/theme';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, expect } from 'vitest';
import { it } from '^/tests/_helpers/vitest';

beforeEach(() => {
	initTheme();
});

it('has a valid locator', () => {
	const { getByTestId } = render(ThemeSelect);
	expect(getByTestId('theme-select')).toBeTruthy();
});

it('toggles between light and dark themes', async () => {
	const { getByRole } = render(ThemeSelect);
	expect(getTheme()).toEqual(Theme.Dark);
	const toggle = getByRole('checkbox') as HTMLInputElement;
	expect(toggle.checked).toBeTruthy();
	toggle.click();
	expect(toggle.checked).toBeFalsy();
	await tick();
	expect(getTheme()).toEqual(Theme.Light);
	toggle.click();
	expect(toggle.checked).toBeTruthy();
	await tick();
	expect(getTheme()).toEqual(Theme.Dark);
});

it('can be toggled with user interaction', async ({ user }) => {
	const { getByTestId } = render(ThemeSelect);
	const initialTheme = getTheme();

	const toggle = getByTestId('toggle-input');
	await user.click(toggle);
	await tick();

	const newTheme = getTheme();
	expect(newTheme).not.toBe(initialTheme);
});

it('has proper accessibility label', () => {
	const { getByLabelText } = render(ThemeSelect);
	expect(getByLabelText('Theme Selection')).toBeTruthy();
});
