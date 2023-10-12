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
