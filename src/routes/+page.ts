import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		meta: {
			title: 'Home',
			description: "lasuillard's blog."
		}
	};
};
