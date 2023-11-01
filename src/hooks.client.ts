import { initEngine } from '$lib/search';
import { initTheme } from '$lib/theme';

// Array of initializer promises for testing
export const initializers: Promise<unknown>[] = [];

initTheme();

// Initialize search engine
initializers.push(
	initEngine().then((engine) => {
		console.debug(`Search engine initialized, there is ${engine.termCount} terms in the index`);
	})
);
