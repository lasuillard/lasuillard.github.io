// @vitest-environment happy-dom
import { Theme, currentTheme, getTheme, initTheme, isTheme, setTheme } from '$lib/theme';
import { describe, expect, it } from 'vitest';
import { getVarName } from './utils';

describe(initTheme, () => {
	it(`store ${getVarName({ currentTheme })} become available once initialized`, () => {
		expect(currentTheme).toBeUndefined();
		initTheme();
		expect(currentTheme).toBeDefined();
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
