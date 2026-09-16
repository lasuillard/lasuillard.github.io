import { formatRelativeDate, getVarName, omitKeys, quoteJoin } from '$lib/utils';
import { describe, expect, it } from 'vitest';

describe('getVarName', () => {
	it('returns variable name', () => {
		const myVar = '123';
		expect(getVarName({ myVar })).toEqual('myVar');
	});
});

describe('omitKeys', () => {
	it('omits some properties', () => {
		expect(omitKeys({ a: 1, b: 3, c: 2 }, ['b'])).toEqual({ a: 1, c: 2 });
	});
});

describe('quoteJoin', () => {
	it('joins given items into single text', () => {
		expect(quoteJoin([13, 2.7, 'abDg'])).toEqual('"13", "2.7", "abDg"');
	});
});

describe('formatRelativeDate', () => {
	it('returns "오늘" when dates are on the same day', () => {
		const now = new Date('2026-03-20T15:00:00Z');
		const target = new Date('2026-03-20T09:00:00Z');
		expect(formatRelativeDate(target, now)).toBe('오늘');
	});

	it('returns relative date string in Korean for past dates', () => {
		const now = new Date('2026-03-20T12:00:00Z');
		const target = new Date('2026-03-15T12:00:00Z');
		expect(formatRelativeDate(target, now)).toBe('5일 전');
	});
});
