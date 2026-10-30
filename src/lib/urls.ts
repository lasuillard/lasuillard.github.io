import { asset, resolve } from "$app/paths";
import type { AssetPath, RouteId, RouteParams } from "$app/types";

/**
 * Route mapping for type-safe URL query parameters.
 * Only routes that accept query parameters need to be defined here.
 */
export interface RouteMap {
  "/blog": {
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
export function route<Path extends RouteId>(
  path: Path,
  ...args: RouteArgs<Path>
): string {
  const options = (args as any)[0] || {};
  const resolvedPath = resolve(path as any, options.params);

  if ("query" in options && options.query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== null && value !== undefined && value !== "") {
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
 * Resolves a root-relative asset URL using SvelteKit's `asset()`,
 * while leaving external or non-root URLs unchanged.
 * @param url The asset URL or path to resolve.
 * @returns The resolved asset URL.
 */
export function resolveAsset(url: string): string {
  if (url.startsWith("/")) {
    return asset(url.slice(1) as AssetPath);
  }
  return url;
}
