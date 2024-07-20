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
