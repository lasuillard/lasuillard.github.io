/**
 * Return new title with suffix.
 * @param title Title of page to add suffix.
 * @returns New title with suffix. If title is `undefined`, returns `"Untitled"`.
 */
export function titleWithSuffix(title: string | undefined): string {
	if (!title) {
		return 'Untitled';
	}

	return `${title} • lasuillard's Blog`;
}

/* c8 ignore start */
if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	describe(titleWithSuffix, () => {
		it('returns new title with suffix', () => {
			expect(titleWithSuffix('Home')).toEqual("Home • lasuillard's Blog");
		});

		it('returns `"Untitled"` if title is `undefined`', () => {
			expect(titleWithSuffix(undefined)).toEqual('Untitled');
		});
	});
}
/* c8 ignore stop */
