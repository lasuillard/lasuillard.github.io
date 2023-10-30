import { browser } from '$app/environment';
import { persisted } from '$lib/store';
import { get, type Writable } from 'svelte/store';

// https://daisyui.com/docs/themes/
/**
 * Available themes for current website.
 */
export enum Theme {
	Light = 'winter',
	Dark = 'night'
}

/**
 * Persistent store for current theme.
 *
 * Store is `undefined` at first and will be available after calling {@link initTheme}.
 */
export let currentTheme: Writable<Theme> | undefined = undefined;

/**
 * Init theme with default from browser preferences.
 */
export function initTheme() {
	const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	console.debug(`Detected preferred color scheme is "${preferDark ? 'dark' : 'light'}"`);

	const themeDefault = preferDark ? Theme.Dark : Theme.Light;
	console.debug(`Theme "${themeDefault}" will be used as default`);

	currentTheme = persisted('theme', themeDefault);

	// Coerce to light if theme is not valid (if theme changed)
	if (!isTheme(get(currentTheme))) {
		currentTheme.set(Theme.Light);
	}

	// Bind store to actual theme
	currentTheme.subscribe((newTheme) => {
		setTheme(newTheme);
	});
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
 *
 * This is different from store {@link currentTheme}, it loads the actual theme applied to pages.
 * @returns Current theme.
 */
export function getTheme(): Theme {
	if (browser) {
		const currentTheme = document.documentElement.getAttribute('data-theme');
		if (currentTheme && isTheme(currentTheme)) {
			return currentTheme;
		}
	}
	return Theme.Light;
}

/**
 * Set current theme.
 *
 * This is different from updating store {@link currentTheme} as it updates actual theme applied to pages.
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
