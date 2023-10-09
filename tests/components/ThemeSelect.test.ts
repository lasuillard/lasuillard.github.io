// @vitest-environment jsdom
import ThemeSelect from '$components/ThemeSelect.svelte';
import { Theme, getTheme } from '$lib/theme';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { expect, it, vi } from 'vitest';

it('should default from browser preference: dark', () => {
	const { queryByTestId } = render(ThemeSelect, {});
	expect(getTheme()).toEqual(Theme.Dark);
	const toggle = queryByTestId('toggle-input') as HTMLInputElement;
	expect(toggle.checked).toBeTruthy();
});

it('should default from browser preference: light', () => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore: TS2375
	vi.mocked(window.matchMedia).mockImplementationOnce((query: string) => {
		return { matches: query === '(prefers-color-scheme: light)' };
	});
	const { queryByTestId } = render(ThemeSelect, {});
	expect(getTheme()).toEqual(Theme.Light);
	const toggle = queryByTestId('toggle-input') as HTMLInputElement;
	expect(toggle.checked).toBeFalsy();
});

it('should toggle between light and dark themes', async () => {
	const { queryByTestId } = render(ThemeSelect, {});
	expect(getTheme()).toEqual(Theme.Dark);
	const toggle = queryByTestId('toggle-input') as HTMLInputElement;
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
