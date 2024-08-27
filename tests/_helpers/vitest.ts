import { type UserEvent } from '@testing-library/user-event';
import { test as base } from 'vitest';
import { user } from './user';

export const it = base.extend({
	user
});

declare module 'vitest' {
	export interface TestContext {
		user: UserEvent;
	}
}
