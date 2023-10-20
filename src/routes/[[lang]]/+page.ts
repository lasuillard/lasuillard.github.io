import { supportedLanguages } from '~/lib/i18n';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	return supportedLanguages.map((lang) => ({
		lang
	}));
};
