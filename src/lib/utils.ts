/**
 * Returns variable name.
 * @example
 * // returns "myVar"
 * const myVar = "123"
 * getVarName({ myVar })
 * @param obj Wrapping object for variable.
 * @returns Name of variable.
 */
export function getVarName(obj: { [_: string]: unknown }): string {
	return Object.keys(obj)[0];
}

/**
 * Returns clone of given object with properties in keys omitted.
 * @example
 * // returns { a: 1, c: 2 }
 * omitKeys({a: 1, b: 3, c: 2}, ["b"])
 * @param obj Input object to omit some keys.
 * @param keys Keys to omit.
 * @returns Object with given keys omitted.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function omitKeys(obj: any, keys: string[]): any {
	return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)));
}

/**
 * Returns join of items stringified and quoted.
 * @example
 * // returns '"13", "2.7", "abDg"'
 * quoteJoin([13, 2.7, "abDg"])
 * @param values Items to join.
 * @returns Joined text.
 */
export function quoteJoin(values: unknown[]): string {
	return values.map((value) => `"${value}"`).join(', ');
}

/* c8 ignore start */
if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

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

	describe(quoteJoin, () => {
		it('joins given items into single text', () => {
			expect(quoteJoin([13, 2.7, 'abDg'])).toEqual('"13", "2.7", "abDg"');
		});
	});
}
/* c8 ignore stop */
