import { defineEnvVars } from "@sveltejs/kit/env";
import { z } from "zod";

export const variables = defineEnvVars({
  PUBLIC_ENVIRONMENT: {
    public: true,
    schema: z.string().optional(),
  },
  PUBLIC_SENTRY_DSN: {
    public: true,
    schema: z.string().optional(),
  },
});
