import certificates from '$data/certificates';
import educations from '$data/educations';
import experiences from '$data/experiences';
import personalWorks from '$data/personal-works';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	return json({
		certificates,
		educations,
		experiences,
		personalWorks
	});
};
