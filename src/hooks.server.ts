import { env } from '$env/dynamic/private';
import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';

const currentEnv = env.ENVIRONMENT || 'unknown';
const sentryDsn = env.SENTRY_DSN || '';

console.info('Current environment is:', currentEnv);
if (sentryDsn) {
	console.info('Non-empty Sentry DSN detected.');
} else {
	console.warn('Sentry DSN is not provided.');
}

export const handle = sequence(
	Sentry.initCloudflareSentryHandle({
		dsn: sentryDsn,
		tracesSampleRate: 0.05,
		environment: currentEnv,
		integrations: [],
		sendDefaultPii: true,
		_experiments: {
			enableLogs: true
		}
	}),
	Sentry.sentryHandle()
);

// @ts-expect-error Ignore types here
export const handleError = Sentry.handleErrorWithSentry(({ error, event }) => {
	console.error('An error occurred on the server side:', error, event);
});
