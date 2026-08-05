import { getVarName, omitKeys, quoteJoin, getVisiblePages } from '$lib/utils';
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

describe('getVisiblePages', () => {
	it('returns all page numbers when totalPages is <= 7', () => {
		expect(getVisiblePages(1, 5)).toEqual([1, 2, 3, 4, 5]);
		expect(getVisiblePages(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
	});

	it('returns start sequence with trailing ellipsis when currentPage is near start', () => {
		expect(getVisiblePages(3, 10)).toEqual([1, 2, 3, 4, 5, '...', 10]);
	});

	it('returns end sequence with leading ellipsis when currentPage is near end', () => {
		expect(getVisiblePages(8, 10)).toEqual([1, '...', 6, 7, 8, 9, 10]);
	});

	it('returns middle sequence with ellipsis on both sides when currentPage is in the middle', () => {
		expect(getVisiblePages(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
	});
});
