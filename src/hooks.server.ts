// NOTE: Right now there's no server running but keep this for future
//       Until, this configuration only will be used for development in local
import * as Sentry from '@sentry/sveltekit';
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';

Sentry.init({
	dsn: import.meta.env.SENTRY_DSN,
	tracesSampleRate: 0.05,
	environment: import.meta.env.MODE
});
console.debug('Sentry initialized');

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle());

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
