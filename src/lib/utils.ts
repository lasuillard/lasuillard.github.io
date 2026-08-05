import {
	MAX_VISIBLE_PAGES,
	START_ELLIPSIS_THRESHOLD,
	END_ELLIPSIS_OFFSET,
	NEAR_START_END_LIMIT
} from './constants';

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

/**
 * Computes the page array containing numbers and/or ellipsis (...) to display in pagination.
 * @param currentPage The active page number.
 * @param totalPages The total number of pages available.
 * @returns An array of page numbers or '...'.
 */
export function getVisiblePages(currentPage: number, totalPages: number): (number | string)[] {
	const pages: (number | string)[] = [];
	if (totalPages <= MAX_VISIBLE_PAGES) {
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i);
		}
	} else {
		// Always show page 1
		pages.push(1);

		if (currentPage <= START_ELLIPSIS_THRESHOLD) {
			// Near start: 1, 2, 3, 4, 5, ..., totalPages
			for (let i = 2; i <= NEAR_START_END_LIMIT; i++) {
				pages.push(i);
			}
			pages.push('...');
			pages.push(totalPages);
		} else if (currentPage >= totalPages - END_ELLIPSIS_OFFSET) {
			// Near end: 1, ..., totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages
			pages.push('...');
			for (let i = totalPages - END_ELLIPSIS_OFFSET - 1; i <= totalPages; i++) {
				if (i > 1) {
					pages.push(i);
				}
			}
		} else {
			// Middle: 1, ..., currentPage - 1, currentPage, currentPage + 1, ..., totalPages
			pages.push('...');
			pages.push(currentPage - 1);
			pages.push(currentPage);
			pages.push(currentPage + 1);
			pages.push('...');
			pages.push(totalPages);
		}
	}
	return pages;
}
