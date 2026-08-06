# Project Instructions

Check [README.md](./README.md) and [CONTRIBUTING.md](./CONTRIBUTING.md) to understand the project and its structure.

## Build and Test Commands

- Install: `npm ci`
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint && npm run check`
- Format: `npm run fmt`
- Type check: `npm run check` (svelte-check + svelte-kit sync)
- Unit tests: `npm run test`
- E2E tests: `npm run build && npm run e2e`
- CI checks: `npm run fmt && npm run lint && npm run check && npm run test && npm run build && npm run e2e`
- Fix lint/format issues: `npm run lint:fix && npm run fmt`

## Definition of Done

A task is complete when ALL of the following pass:

1. `npm run fmt` exits 0
2. `npm run lint && npm run check` exits 0
3. `npm run test` exits 0 with no failures
4. `npm run build && npm run e2e` exits 0 with no failures (if the change affects UI/rendering)
5. Build succeeds: `npm run build` exits 0
6. Changed files have been staged and committed

## When Writing Code

- Run `npm run lint && npm run check` or rely on `pre-commit` hooks after every file change
- Format with `npm run fmt` before committing
- Use TypeScript and Svelte 5 runes ($state, $derived, $props, etc.)
- Write tests for new behavior in `tests/` using Vitest
- For UI changes, add Playwright tests in `e2e/tests/`
- Follow Tailwind/DaisyUI components for styling
- To debug a specific test: `npm run test --testNamePattern "<test name pattern>"`
- To run a single test file: `npm run test --run tests/path/to/file.test.ts`
- Never create new blog posts or modify existing post metadata on your own (e.g., for test fixtures). Instead, request the user to do so.
- Use Korean for all user-facing text (UI labels, messages, placeholders, etc.).

## When Reviewing Code

- Check for security issues in dependencies: `npm audit`
- Verify the build succeeds: `npm run build`
- Verify unit tests pass: `npm run test`
- For UI/end-to-end changes, run Playwright: `npm run build && npm run e2e`
- Ensure type checking passes: `npm run check`

## When Blocked

- If tests fail after 3 attempts: stop and report the failing test with full output
- If a dependency is missing: check `package.json` first, then run `npm install`
- If Playwright/browser issues occur: run `npm exec -- playwright install --with-deps chromium`
- Never: delete files to resolve errors, force push, skip tests, or disable linters
