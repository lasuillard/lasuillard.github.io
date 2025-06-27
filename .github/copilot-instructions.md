---
description: Instructions for GitHub Copilot for this project.
---

This project is a markdown-based blog site built with SvelteKit. Keep below in mind when working with this project:

- Uses SvelteKit (Svelte 5) for the frontend, with Svelte components and file-based routing.
- TypeScript is used throughout, including in Svelte files.
- Uses Yarn as the package manager
- Tailwind CSS 4 is used for styling, with DaisyUI for UI components.
- Markdown files in `/static/posts` are used as blog posts, with frontmatter for metadata.
- ESLint and Prettier are used for linting and formatting.
- Testing uses Vitest for unit tests and Playwright for end-to-end tests.
- The project is containerized for development (Dev Container), and supports GitHub Codespaces.
- Cloudflare adapter is used for deployment.
- Sentry is integrated for error monitoring.
