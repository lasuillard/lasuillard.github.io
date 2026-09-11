import userEvent, { type UserEvent } from '@testing-library/user-event';

// eslint-disable-next-line no-empty-pattern, jsdoc/require-jsdoc
export async function user({}, use: (value: UserEvent) => Promise<void>) {
	const user = userEvent.setup();
	await use(user);
}
