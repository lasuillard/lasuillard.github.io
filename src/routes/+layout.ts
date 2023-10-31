import type { LayoutLoad } from './$types';

export const prerender = true;
export const ssr = true;
export const trailingSlash = 'always';

export const load: LayoutLoad = ({ url }) => {
	return {
		current: url.pathname
	};
};
