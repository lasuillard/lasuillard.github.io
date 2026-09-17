import { formatDistanceStrict, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * Returns clone of given object with properties in keys omitted.
 * @example
 * omitKeys({a: 1, b: 3, c: 2}, ["b"]) // Returns { a: 1, c: 2 }
 * @param obj Input object to omit some keys.
 * @param keys Keys to omit.
 * @returns Object with given keys omitted.
 */
export function omitKeys(obj: any, keys: string[]): any {
	return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)));
}

/**
 * Returns join of items stringified and quoted.
 * @example
 * quoteJoin([13, 2.7, "abDg"]) // Returns '"13", "2.7", "abDg"'
 * @param values Items to join.
 * @returns Joined text.
 */
export function quoteJoin(values: unknown[]): string {
	return values.map((value) => `"${value}"`).join(', ');
}

/**
 * Returns a human-friendly relative date string in Korean (e.g., '오늘', '3일 전', '2개월 전').
 * @param date The target date to compare.
 * @param baseDate The base date to compare against (defaults to current time).
 * @returns Relative date string in Korean.
 */
export function formatRelativeDate(date: Date, baseDate: Date = new Date()): string {
	if (isSameDay(date, baseDate)) {
		return '오늘';
	}
	return formatDistanceStrict(date, baseDate, {
		addSuffix: true,
		locale: ko
	});
}

/**
 * Converts a string to kebab-case.
 * Splits on whitespace, punctuation, and camelCase boundaries.
 * Preserves Unicode characters (e.g., Korean).
 * @param str Input string.
 * @returns kebab-case string.
 */
export function kebabCase(str: string): string {
	return (
		str
			// Insert separator before uppercase letters in camelCase
			.replace(/([a-z\d])([A-Z])/g, '$1 $2')
			// Insert separator between letters and digits
			.replace(/([a-zA-Z])(\d)/g, '$1 $2')
			.replace(/(\d)([a-zA-Z])/g, '$1 $2')
			// Replace non-alphanumeric, non-Unicode-letter characters with spaces
			.replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
			.trim()
			.toLowerCase()
			.split(/\s+/)
			.filter(Boolean)
			.join('-')
	);
}
