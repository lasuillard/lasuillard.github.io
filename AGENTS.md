# Project Instructions

Check [README.md](./README.md) and [CONTRIBUTING.md](./CONTRIBUTING.md) to understand the project and its structure.

## Build and Test Commands

- Install: `yarn install --immutable`
- Dev server: `yarn dev`
- Build: `yarn build`
- Lint: `yarn run lint && yarn run check`
- Format: `yarn run fmt`
- Type check: `yarn run check` (svelte-check + svelte-kit sync)
- Unit tests: `yarn test`
- E2E tests: `yarn run build && yarn run e2e`
- CI checks: `yarn run fmt && yarn run lint && yarn run check && yarn test && yarn run build && yarn run e2e`
- Fix lint/format issues: `yarn run lint:fix && yarn run fmt`

## Definition of Done

A task is complete when ALL of the following pass:

1. `yarn run fmt` exits 0
2. `yarn run lint && yarn run check` exits 0
3. `yarn test` exits 0 with no failures
4. `yarn run build && yarn run e2e` exits 0 with no failures (if the change affects UI/rendering)
5. Build succeeds: `yarn build` exits 0
6. Changed files have been staged and committed

## When Writing Code

- Run `yarn run lint && yarn run check` or rely on `pre-commit` hooks after every file change
- Format with `yarn run fmt` before committing
- Use TypeScript and Svelte 5 runes ($state, $derived, $props, etc.)
- Write tests for new behavior in `tests/` using Vitest
- For UI changes, add Playwright tests in `e2e/tests/`
- Follow Tailwind/DaisyUI components for styling
- To debug a specific test: `yarn test --testNamePattern "<test name pattern>"`
- To run a single test file: `yarn test --run tests/path/to/file.test.ts`

## When Reviewing Code

- Check for security issues in dependencies: `yarn audit`
- Verify the build succeeds: `yarn build`
- Verify unit tests pass: `yarn test`
- For UI/end-to-end changes, run Playwright: `yarn run build && yarn run e2e`
- Ensure type checking passes: `yarn run check`

## When Blocked

- If tests fail after 3 attempts: stop and report the failing test with full output
- If a dependency is missing: check `package.json` first, then run `yarn install`
- If Playwright/browser issues occur: run `yarn exec playwright install --with-deps chromium`
- Never: delete files to resolve errors, force push, skip tests, or disable linters
