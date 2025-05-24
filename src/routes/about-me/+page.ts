import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/profile');
	const data = await response.json();

	// TODO(lasuillard): Better type annotation
	// @ts-expect-error Don't care (for now)
	const {
		certificates,
		educations,
		experiences,
		personalWorks
	}: {
		certificates: any[];
		educations: any[];
		experiences: any[];
		personalWorks: any[];
	} = data;

	return {
		meta: {
			title: 'About Me',
			description: 'Brief information about me.'
		},
		certificates,
		educations,
		experiences,
		personalWorks
	};
};
