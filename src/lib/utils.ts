/**
 * Returns variable name.
 * @example
 * const myVar = "123"
 * getVarName({ myVar }) // Returns "myVar"
 * @param obj Wrapping object for variable.
 * @returns Name of variable.
 */
export function getVarName(obj: { [_: string]: unknown }): string {
	return Object.keys(obj)[0];
}

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
