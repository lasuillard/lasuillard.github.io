// https://daisyui.com/docs/themes/
export enum Theme {
	Light = 'light',
	Dark = 'dark'
}

export function isTheme(value: string): value is Theme {
	return Object.values(Theme).includes(value as Theme);
}

export function getTheme(): Theme {
	const currentTheme = document.documentElement.getAttribute('data-theme');
	if (currentTheme && isTheme(currentTheme)) {
		return currentTheme;
	}
	return Theme.Light;
}

export function setTheme(theme: Theme) {
	if (!isTheme(theme)) {
		throw new Error(`Invalid theme: ${theme}`);
	}
	document.documentElement.setAttribute('data-theme', theme);
}
