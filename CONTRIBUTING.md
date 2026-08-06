# 👥 Development guide

This project is public but does not accept any pull requests, as it is a personal tech blog. This document describes how to develop and deploy the project.

## 🏗️ Project overview

This project is a personal tech blog built with [SvelteKit](https://kit.svelte.dev/) and hosted on GitHub Pages as a static website.

### 🛠️ Tech stack

This project uses the following tech stack:

- [SvelteKit](https://svelte.dev/docs/kit/introduction) ([adapter-static](https://svelte.dev/docs/kit/adapter-static)) with [TypeScript](https://www.typescriptlang.org/)
- [npm](https://www.npmjs.com/) as a package manager
- [Tailwind](https://tailwindcss.com/) with [DaisyUI](https://daisyui.com/) for styling
- [Vite](https://vite.dev/) for building
- [ESLint](https://eslint.org/), [Prettier](https://prettier.io/) for linting and formatting
- [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/)
- Deployed on [GitHub Pages](https://pages.github.com/) as a static website

### 📂 Key directory structure

- `e2e/`: End-to-end tests using Playwright
- `src/`: Source code
  - `src/components/`: Reusable components
  - `src/lib/`: Shared logic
  - `src/routes/`: Page routes
- `static/`: Static assets
  - `static/posts`: Markdown files and assets for blog posts
- `tests/`: Unit tests
- `flake.nix`: Flake configuration for development environment
- `Justfile`: Quick commands for development
- `package.json`: Project dependencies and configuration

## 🔧 Setting up the development environment

This repository uses [Nix Flakes](https://nix.dev/concepts/flakes.html) to manage tools. The following tools will be automatically installed. You must have `nix` installed first:

- `pre-commit`
- `just`
- `nodejs_24` (JavaScript runtime)
- `npm`

Run `nix develop` to start the development environment, then run `just install` to install dependencies and set up Playwright.

If you prefer a Dev Container, configuration is provided ([devcontainer.json](./.devcontainer/devcontainer.json)) with Nix included.

## ✅ Verifying changes

Before you push your code, verify that it follows the project's coding standards. Run `just ci` to run all checks, or rely on the `pre-commit` hooks.

## 🚀 Deploying the application

The application is deployed to GitHub Pages when you push to the `main` branch.
