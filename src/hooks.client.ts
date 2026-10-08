import { initEngine } from "#lib/search.js";
import { initTheme } from "#lib/theme.js";
import { PUBLIC_ENVIRONMENT, PUBLIC_SENTRY_DSN } from "$app/env/public";
import * as Sentry from "@sentry/sveltekit";
import { setDefaultOptions } from "date-fns";
import { ko } from "date-fns/locale";
import mermaid from "mermaid";

const currentEnv = PUBLIC_ENVIRONMENT || "unknown";
const sentryDsn = PUBLIC_SENTRY_DSN || "";

console.info("Current environment is:", currentEnv);
if (sentryDsn) {
  console.info("Non-empty Sentry DSN detected.");
} else {
  console.warn("Sentry DSN is not provided.");
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
      blockAllMedia: false,
    }),
    Sentry.consoleLoggingIntegration({
      levels: ["warn", "error"],
    }),
  ],
  environment: currentEnv,
  _experiments: {
    enableLogs: true,
  },
});

export const handleError = Sentry.handleErrorWithSentry(({ error, event }) => {
  console.error("An error occurred on the client side:", error, event);
});

// Locale
setDefaultOptions({ locale: ko });

// Theme
initTheme();

// Initialize Mermaid for fancy diagrams
// Should call `mermaid.run()` on components load explicitly
mermaid.initialize({
  theme: "neutral",
});
console.debug("Mermaid initialized");

// Search Engine
initEngine().then((engine) => {
  console.debug(
    `Search engine initialized, there is ${engine.termCount} terms in the index`,
  );
});
