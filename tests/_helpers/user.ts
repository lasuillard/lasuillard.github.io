import userEvent, { type UserEvent } from '@testing-library/user-event';
import type { Use } from '@vitest/runner';

// eslint-disable-next-line no-empty-pattern, jsdoc/require-jsdoc
export async function user({}, use: Use<UserEvent>) {
	const user = userEvent.setup();
	await use(user);
}
