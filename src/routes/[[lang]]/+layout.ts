import type { LayoutLoad } from './$types';

export const prerender = true;
export const ssr = true;

export const load: LayoutLoad = ({ url }) => {
	return {
		current: url.pathname
	};
};
