import type { RouteId, RouteParams } from '$app/types';

/**
 * Route mapping for type-safe URL query parameters.
 * Only routes that accept query parameters need to be defined here.
 */
export interface RouteMap {
	'/blog': {
		page?: number | string;
		tag?: string;
	};
}

/**
 * Extracts the query type for a given RouteId, defaulting to empty parameters.
 */
type QueryFor<Path extends RouteId> = Path extends keyof RouteMap
	? RouteMap[Path]
	: Record<string, never>;

/**
 * Helper to determine if a type has known keys.
 * SvelteKit's empty parameter maps are represented as Record<string, never>.
 */
type HasKeys<T> = string extends keyof T ? false : true;

/**
 * Calculates the appropriate arguments for the `route()` function based on
 * the path parameters and query parameters required for a given RouteId.
 */
export type RouteArgs<Path extends RouteId> =
	HasKeys<RouteParams<Path>> extends true
		? [options: { params: RouteParams<Path>; query?: QueryFor<Path> }]
		: HasKeys<QueryFor<Path>> extends true
			? [options?: { query?: QueryFor<Path> }]
			: [options?: never];

/**
 * Type-safe URL builder.
 * @param path The base path.
 * @param args The query and path parameters.
 * @returns The built URL string.
 */
export function route<Path extends RouteId>(path: Path, ...args: RouteArgs<Path>): string {
	const options = (args as any)[0] || {};
	let resolvedPath: string = path;

	if ('params' in options && options.params) {
		for (const [key, value] of Object.entries(options.params as Record<string, string>)) {
			resolvedPath = resolvedPath.replace(`[${key}]`, String(value));
		}
	}

	if ('query' in options && options.query) {
		const searchParams = new URLSearchParams();
		for (const [key, value] of Object.entries(options.query)) {
			if (value !== null && value !== undefined && value !== '') {
				searchParams.append(key, String(value));
			}
		}
		const search = searchParams.toString();
		if (search) {
			return `${resolvedPath}?${search}`;
		}
	}

	return resolvedPath;
}

/**
 * Unsafe route generator for dynamic runtime paths.
 * Bypasses strict compile-time route checking.
 * @param pathname The dynamic runtime path.
 * @param params The query parameters.
 * @returns The built URL string.
 */
export function unsafeRoute(
	pathname: string,
	params?: Record<string, string | number | boolean | null | undefined>
): string {
	return route(
		pathname as any,
		// @ts-expect-error: Dynamic pathnames bypass static typing constraints
		params && Object.keys(params).length > 0 ? { query: params } : undefined
	);
}
