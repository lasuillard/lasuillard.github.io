import { initEngine } from '$lib/search';
import { initTheme } from '$lib/theme';
import * as Sentry from '@sentry/sveltekit';
import mermaid from 'mermaid';

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	tracesSampleRate: 0.05,
	replaysSessionSampleRate: 0.05,
	replaysOnErrorSampleRate: 1,
	integrations: [Sentry.replayIntegration()],
	environment: import.meta.env.MODE,
	release: `${__APP_NAME__}@${__APP_VERSION__}`
});
console.debug('Sentry initialized');

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

export const handleError = Sentry.handleErrorWithSentry();
