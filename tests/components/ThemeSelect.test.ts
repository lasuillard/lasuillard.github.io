// @vitest-environment jsdom
import ThemeSelect from '$components/ThemeSelect.svelte';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';

describe('ThemeSelect', () => {
	// TODO: Default theme from OS media preference
	//       https://stackoverflow.com/questions/50840168/how-to-detect-if-the-os-is-in-dark-mode-in-browsers
	it('should start with dark theme by default', () => {
		const { queryByTestId } = render(ThemeSelect);
		expect(document.documentElement.getAttribute('data-theme')).toEqual('dark');
		const toggle = queryByTestId('toggle-input') as HTMLInputElement;
		expect(toggle.checked).toBeTruthy();
	});

	it('should toggle between light and dark themes', async () => {
		const { queryByTestId } = render(ThemeSelect);
		expect(document.documentElement.getAttribute('data-theme')).toEqual('dark');
		const toggle = queryByTestId('toggle-input') as HTMLInputElement;
		expect(toggle.checked).toBeTruthy();
		toggle.click();
		expect(toggle.checked).toBeFalsy();
		await tick();
		expect(document.documentElement.getAttribute('data-theme')).toEqual('light');
		toggle.click();
		expect(toggle.checked).toBeTruthy();
		await tick();
		expect(document.documentElement.getAttribute('data-theme')).toEqual('dark');
	});
});
