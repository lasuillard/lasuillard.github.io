import { formatRelativeDate, getVarName, kebabCase, omitKeys, quoteJoin } from '$lib/utils';
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

describe('kebabCase', () => {
	it('converts space-separated words', () => {
		expect(kebabCase('Hello World')).toBe('hello-world');
	});

	it('converts camelCase', () => {
		expect(kebabCase('camelCaseString')).toBe('camel-case-string');
	});

	it('handles Korean text', () => {
		expect(kebabCase('기술 블로그 시작하기')).toBe('기술-블로그-시작하기');
	});

	it('handles mixed Korean and ASCII', () => {
		expect(kebabCase('SvelteKit으로 블로그 만들기')).toBe('svelte-kit으로-블로그-만들기');
	});

	it('handles punctuation', () => {
		expect(kebabCase('foo--bar__baz')).toBe('foo-bar-baz');
	});

	it('handles empty string', () => {
		expect(kebabCase('')).toBe('');
	});
});
