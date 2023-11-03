import { browser } from '$app/environment';
import { persisted } from '$lib/store';
import { get, type Writable } from 'svelte/store';
import { getVarName } from './utils';

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

/* c8 ignore start */
if (import.meta.vitest) {
	// @vitest-environment happy-dom
	const { describe, expect, it } = import.meta.vitest;

	describe(initTheme, () => {
		it(`store ${getVarName({ currentTheme })} become available once initialized`, () => {
			expect(currentTheme).toBeUndefined();
			initTheme();
			expect(currentTheme).toBeDefined();
		});

		it('coerce to light theme if theme is not valid', () => {
			localStorage.setItem('theme', '"cheddar-cheese"');
			initTheme();
			// @ts-expect-error It should be set after init
			expect(get(currentTheme)).toEqual(Theme.Light);
		});
	});

	describe(isTheme, () => {
		it('should return `true` for known enums', () => {
			for (const theme of Object.values(Theme)) {
				expect(isTheme(theme)).toBeTruthy();
			}
		});

		it('should return `false` for unknown enums', () => {
			expect(isTheme('crispy-potato')).toBeFalsy();
			expect(isTheme('comfortable-sofa')).toBeFalsy();
			expect(isTheme('bed-is-heaven')).toBeFalsy();
		});
	});

	describe(getTheme, () => {
		it('should return `data-theme` attribute of document root', () => {
			const themeAttr = document.documentElement.getAttribute('data-theme');
			expect(getTheme()).toEqual(themeAttr);
		});
	});

	describe(setTheme, () => {
		it('should update `data-theme` attribute of document root on change', () => {
			setTheme(Theme.Dark);
			expect(document.documentElement.getAttribute('data-theme')).toEqual(Theme.Dark);
		});

		it('should throw an error if unknown theme given', () => {
			expect(() => setTheme('cheesy-pizza' as Theme)).toThrowError(/^Invalid theme: (.+)$/);
		});
	});
}
/* c8 ignore stop */
