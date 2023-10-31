import type { PageLoad } from '../$types';

export const load: PageLoad = () => {
	return {
		meta: {
			title: 'About Me',
			description: 'Brief information about me.'
		}
	};
};
