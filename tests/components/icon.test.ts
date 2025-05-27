// @vitest-environment happy-dom
import GitHub from '$components/icon/GitHub.svelte';
import Gmail from '$components/icon/Gmail.svelte';
import LinkedIn from '$components/icon/LinkedIn.svelte';
import Moon from '$components/icon/Moon.svelte';
import RSS from '$components/icon/RSS.svelte';
import Search from '$components/icon/Search.svelte';
import Sun from '$components/icon/Sun.svelte';
import { render } from '@testing-library/svelte';
import Docker from '^/src/components/icon/Docker.svelte';
import Menu from '^/src/components/icon/Menu.svelte';
import Npm from '^/src/components/icon/npm.svelte';
import PyPi from '^/src/components/icon/PyPI.svelte';
import { expect, it } from 'vitest';

it.each([
	{ Component: Docker },
	{ Component: PyPi },
	{ Component: Npm },
	{ Component: GitHub },
	{ Component: Gmail },
	{ Component: LinkedIn },
	{ Component: Menu },
	{ Component: RSS },
	{ Component: Moon },
	{ Component: Search },
	{ Component: Sun }
])('render icon $Component.name', ({ Component }) => {
	const { container } = render(Component);
	expect(container).toBeTruthy();
});
