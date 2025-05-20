/* c8 ignore start */
import { initEngine } from '$lib/search';
import { initTheme } from '$lib/theme';
import * as Sentry from '@sentry/sveltekit';
import { setDefaultOptions } from 'date-fns';
import { ko } from 'date-fns/locale';
import mermaid from 'mermaid';

const { logger } = Sentry;

// Sentry
Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	tracesSampleRate: 0.05,
	replaysSessionSampleRate: 0.05,
	replaysOnErrorSampleRate: 1,
	integrations: [Sentry.replayIntegration()],
	environment: import.meta.env.MODE,
	_experiments: {
		enableLogs: true
	}
});
export const handleError = Sentry.handleErrorWithSentry();

// Locale
setDefaultOptions({ locale: ko });

logger.debug('Sentry initialized');

// Theme
initTheme();

// Initialize Mermaid for fancy diagrams
// Should call `mermaid.init()` on components load explicitly
mermaid.initialize({
	startOnLoad: false,
	theme: 'neutral'
});
logger.debug('Mermaid initialized');

// Search Engine
initEngine().then((engine) => {
	logger.debug(`Search engine initialized, there is ${engine.termCount} terms in the index`);
});

/* c8 ignore stop */
