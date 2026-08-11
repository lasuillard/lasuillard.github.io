import { getVarName, omitKeys, quoteJoin, escapeXml } from '$lib/utils';
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

describe('escapeXml', () => {
	it('escapes XML special characters', () => {
		expect(escapeXml('< > & \' "')).toEqual('&lt; &gt; &amp; &apos; &quot;');
	});
});
