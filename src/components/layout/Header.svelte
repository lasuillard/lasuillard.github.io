<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import MenuIcon from '$components/icon/Menu.svelte';
	import QRCodeIcon from '$components/icon/QRCode.svelte';
	import QRCode from '$components/layout/QRCode.svelte';
	import ThemeSelect from './ThemeSelect.svelte';
	import Search from './Search.svelte';

	const links = [
		{ name: 'About Me', href: '/' },
		{ name: 'Blog', href: '/blog' }
	];

	interface Props {
		currentPath?: string | undefined;
	}

	let { currentPath = $bindable(undefined) }: Props = $props();

	let currentURL = $derived(browser ? $page?.url?.href || window.location.href : '');
	let qrDropdownDetails: HTMLDetailsElement | undefined = $state();
	let isOpen = $state(false);

	function handleClickOutside(event: MouseEvent) {
		if (qrDropdownDetails?.open && !qrDropdownDetails.contains(event.target as Node)) {
			qrDropdownDetails.removeAttribute('open');
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<header
	data-testid="header-wrapper"
	class="bg-base-100/80 border-base-200 sticky top-0 z-50 w-full border-b backdrop-blur-md"
>
	<div class="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-testid="header">
		<!-- Mobile Menu & Brand -->
		<div class="navbar-start">
			<div class="dropdown md:hidden">
				<button
					type="button"
					tabindex="0"
					class="btn btn-ghost btn-square"
					data-testid="drawer-toggle"
					aria-label="메뉴"
				>
					<MenuIcon class="h-6 w-6" />
				</button>
				<ul
					tabindex="0"
					class="menu dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg"
				>
					{#each links as link (link.name)}
						<li>
							<a class="text-base" class:active={currentPath === link.href} href={link.href}>
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Desktop Navigation links -->
			<div class="hidden md:flex">
				<ul class="menu menu-horizontal gap-2 px-1">
					{#each links as link (link.name)}
						<li>
							<a
								class="text-base font-semibold transition-colors"
								class:active={currentPath === link.href}
								href={link.href}
							>
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Utility buttons -->
		<div class="navbar-end flex items-center gap-2">
			<Search />
			<details
				bind:this={qrDropdownDetails}
				class="dropdown dropdown-end hidden sm:inline-block"
				data-testid="qr-dropdown"
				ontoggle={() => {
					isOpen = qrDropdownDetails?.open ?? false;
				}}
			>
				<summary class="btn btn-ghost btn-circle" aria-label="QR Code">
					<QRCodeIcon class="h-5 w-5" />
				</summary>
				<div
					class={'dropdown-content rounded-box z-50 mt-2 flex flex-col items-center gap-2 transition-all duration-300 select-none ' +
						(isOpen
							? 'bg-base-100/95 border-base-200 scale-100 border p-2.5 opacity-100 shadow-xl backdrop-blur-sm'
							: 'scale-95 border-transparent bg-transparent p-1 opacity-0 shadow-none backdrop-blur-none')}
					style="width: 249px; min-width: 249px;"
				>
					<QRCode url={currentURL} width={213} />
				</div>
			</details>
			<ThemeSelect />
		</div>
	</div>
</header>
