import { getVarName, omitKeys } from '$lib/utils';
import { describe, expect, it } from 'vitest';

describe(getVarName, () => {
	it('returns variable name', () => {
		const myVar = '123';
		expect(getVarName({ myVar })).toEqual('myVar');
	});
});

describe(omitKeys, () => {
	it('omits some properties', () => {
		expect(omitKeys({ a: 1, b: 3, c: 2 }, ['b'])).toEqual({ a: 1, c: 2 });
	});
});
