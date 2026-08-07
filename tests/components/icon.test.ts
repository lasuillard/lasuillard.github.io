// @vitest-environment happy-dom
import GitHub from '$components/icon/GitHub.svelte';
import Gmail from '$components/icon/Gmail.svelte';
import LinkedIn from '$components/icon/LinkedIn.svelte';
import Menu from '$components/icon/Menu.svelte';
import Moon from '$components/icon/Moon.svelte';
import QRCode from '$components/icon/QRCode.svelte';
import RSS from '$components/icon/RSS.svelte';
import Search from '$components/icon/Search.svelte';
import Sun from '$components/icon/Sun.svelte';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it.each([
	{ Component: GitHub },
	{ Component: Gmail },
	{ Component: LinkedIn },
	{ Component: Menu },
	{ Component: RSS },
	{ Component: Moon },
	{ Component: Search },
	{ Component: Sun },
	{ Component: QRCode }
])('render icon $Component.name', ({ Component }) => {
	const { container } = render(Component);
	expect(container).toBeTruthy();
});
