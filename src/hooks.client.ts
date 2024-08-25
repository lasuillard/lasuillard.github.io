/* c8 ignore start */
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
	environment: import.meta.env.MODE
});
console.debug('Sentry initialized');

initTheme();

// Initialize Mermaid for fancy diagrams
// Should call `mermaid.init()` on components load explicitly
mermaid.initialize({
	startOnLoad: false,
	theme: 'neutral'
});
console.debug('Mermaid initialized');

initEngine().then((engine) => {
	console.debug(`Search engine initialized, there is ${engine.termCount} terms in the index`);
});

export const handleError = Sentry.handleErrorWithSentry();

/* c8 ignore stop */
