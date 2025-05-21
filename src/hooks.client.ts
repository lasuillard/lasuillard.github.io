import { initEngine } from '$lib/search';
import { initTheme } from '$lib/theme';
import * as Sentry from '@sentry/sveltekit';
import { setDefaultOptions } from 'date-fns';
import { ko } from 'date-fns/locale';
import mermaid from 'mermaid';

const currentEnv = import.meta.env.VITE_ENVIRONMENT || 'unknown';
const sentryDsn = import.meta.env.VITE_SENTRY_DSN || '';

console.info('Current environment is:', currentEnv);
if (sentryDsn) {
	console.info('Non-empty Sentry DSN detected.');
} else {
	console.warn('Sentry DSN is not provided.');
}

// Sentry
Sentry.init({
	dsn: sentryDsn,
	tracesSampleRate: 0.05,
	replaysSessionSampleRate: 0.05,
	replaysOnErrorSampleRate: 1,
	integrations: [
		Sentry.replayIntegration({
			maskAllText: false,
			maskAllInputs: false,
			blockAllMedia: false
		}),
		Sentry.consoleLoggingIntegration({
			levels: ['warn', 'error']
		})
	],
	environment: currentEnv,
	sendDefaultPii: true,
	_experiments: {
		enableLogs: true
	}
});

export const handleError = Sentry.handleErrorWithSentry(/* ({ error, event }) => {} */);

// Locale
setDefaultOptions({ locale: ko });

// Theme
initTheme();

// Initialize Mermaid for fancy diagrams
// Should call `mermaid.init()` on components load explicitly
mermaid.initialize({
	startOnLoad: false,
	theme: 'neutral'
});
console.debug('Mermaid initialized');

// Search Engine
initEngine().then((engine) => {
	console.debug(`Search engine initialized, there is ${engine.termCount} terms in the index`);
});
