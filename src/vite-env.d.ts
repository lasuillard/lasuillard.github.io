declare namespace App {
	interface Platform {
		env: {
			SENTRY_DSN: DurableObjectNamespace;
		};
		context: {
			waitUntil(promise: Promise<any>): void;
		};
		caches: CacheStorage & { default: Cache };
	}
}
