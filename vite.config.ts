import { codecovSvelteKitPlugin } from "@codecov/sveltekit-plugin";
import { sentrySvelteKit } from "@sentry/sveltekit/vite";
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import fs from "node:fs";
import path from "node:path";
import type { PluginOption } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: "lasuillard",
        project: "lasuillard-github-io",
      },
      telemetry: false,
    }),
    tailwindcss(),
    sveltekit({
      preprocess: [vitePreprocess()],
      adapter: adapter(),
    }),
    {
      name: "exclude-static-files",
      closeBundle() {
        const outputDir = ".svelte-kit/output/client";
        const filePatternsToExclude = [`posts/**/*.drawio`];
        filePatternsToExclude.forEach((pattern) => {
          const matchedFiles = fs.globSync(pattern, { cwd: outputDir });
          matchedFiles.forEach((relPath) => {
            const absPath = path.join(outputDir, relPath);
            if (!fs.existsSync(absPath)) return;
            fs.unlinkSync(absPath);
          });
        });
      },
    },
    svelteTesting() as PluginOption,
    codecovSvelteKitPlugin({
      enableBundleAnalysis: true,
      bundleName: "lasuillard.github.io",
      oidc: {
        useGitHubOIDC: true,
      },
      telemetry: false,
    }),
  ] as PluginOption[],
  define: {
    __PROJECT_ROOT__: JSON.stringify(import.meta.dirname),
  },
  server: {
    fs: {
      allow: ["static/**"],
    },
  },
  test: {
    include: ["tests/**/*.{test,spec}.{js,ts}"],
    setupFiles: ["tests/setup.ts"],
    reporters: ["junit", "default", "html"],
    outputFile: {
      junit: "./junit.xml",
    },
    coverage: {
      include: ["src/components/**", "src/lib/**"],
      exclude: ["src/**.d.ts"],
      reporter: ["text", "clover", "html"],
    },
  },
});
