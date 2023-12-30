import { initEngine } from '$lib/search';
import { initTheme } from '$lib/theme';
import mermaid from 'mermaid';

// Array of initializer promises for testing
export const initializers: Promise<unknown>[] = [];

initTheme();

// Initialize Mermaid for fancy diagrams
// Should call `mermaid.init()` on components load explicitly
mermaid.initialize({
	startOnLoad: false,
	theme: 'neutral'
});
console.debug('Mermaid initialized');

// Initialize search engine
initializers.push(
	initEngine().then((engine) => {
		console.debug(`Search engine initialized, there is ${engine.termCount} terms in the index`);
	})
);
