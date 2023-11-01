// @vitest-environment happy-dom
import ThemeSelect from '$components/utility/ThemeSelect.svelte';
import { Theme, getTheme, initTheme } from '$lib/theme';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, expect, it } from 'vitest';

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
