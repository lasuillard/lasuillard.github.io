// @vitest-environment happy-dom
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { currentTheme, getTheme, initTheme, isTheme, setTheme, Theme } from '~/lib/theme';

describe(initTheme, () => {
	it('store `currentTheme` become available once initialized', () => {
		expect(currentTheme).toBeUndefined();
		initTheme();
		expect(currentTheme).toBeDefined();
	});

	it('coerce to preferred theme if theme is not valid', () => {
		const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const themeDefault = preferDark ? Theme.Dark : Theme.Light;

		localStorage.setItem('theme', '"cheddar-cheese"');
		initTheme();
		// @ts-expect-error It should be set after init
		expect(get(currentTheme)).toEqual(themeDefault);
	});

	it('fallback to light theme when invalid theme stored', () => {
		// Store an invalid theme in localStorage
		localStorage.setItem('theme', '"invalid-theme"');
		initTheme();
		// @ts-expect-error It should be set after init
		// Should fallback to the system preferred theme (in test environment it's Dark)
		const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const expectedTheme = preferDark ? Theme.Dark : Theme.Light;
		expect(get(currentTheme)).toBe(expectedTheme);
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

	it('should return default light theme when no valid theme attribute', () => {
		// Remove theme attribute temporarily
		const originalTheme = document.documentElement.getAttribute('data-theme');
		document.documentElement.removeAttribute('data-theme');

		expect(getTheme()).toBe(Theme.Light);

		// Restore original theme
		if (originalTheme) {
			document.documentElement.setAttribute('data-theme', originalTheme);
		}
	});

	it('should return light theme when invalid theme attribute', () => {
		// Set invalid theme temporarily
		const originalTheme = document.documentElement.getAttribute('data-theme');
		document.documentElement.setAttribute('data-theme', 'invalid-theme');

		expect(getTheme()).toBe(Theme.Light);

		// Restore original theme
		if (originalTheme) {
			document.documentElement.setAttribute('data-theme', originalTheme);
		}
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
