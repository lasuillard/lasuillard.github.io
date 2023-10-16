import { initEngine } from '$lib/search';
import { initTheme } from '$lib/theme';

initTheme();

// Initialize search engine
initEngine().then((engine) => {
	console.debug(`Search engine initialized, there is ${engine.termCount} terms in the index`);
});
