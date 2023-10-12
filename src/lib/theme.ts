import { browser } from '$app/environment';

// https://daisyui.com/docs/themes/
export enum Theme {
	Light = 'light',
	Dark = 'dark'
}

/**
 * Assert whether given value is member of enum {@link Theme}.
 * @param value Value to test.
 * @returns Whether value is member or not.
 */
export function isTheme(value: string): value is Theme {
	return Object.values(Theme).includes(value as Theme);
}

/**
 * Returns current theme.
 * @returns Current theme.
 */
export function getTheme(): Theme {
	const currentTheme = browser ? document.documentElement.getAttribute('data-theme') : Theme.Light;
	if (currentTheme && isTheme(currentTheme)) {
		return currentTheme;
	}
	return Theme.Light;
}

/**
 * Set current theme.
 * @param theme New theme.
 */
export function setTheme(theme: Theme) {
	if (!isTheme(theme)) {
		throw new Error(`Invalid theme: ${theme}`);
	}
	if (browser) {
		document.documentElement.setAttribute('data-theme', theme);
	}
}
