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
		drawerOpen?: boolean;
	}

	let { currentPath = $bindable(undefined), drawerOpen = $bindable(false) }: Props = $props();

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

<div data-testid="header-wrapper" class="bg-base-200 sticky top-0 z-10 w-full">
	<!-- Drawer container -->
	<div class="drawer">
		<input id="header-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />

		<div class="drawer-content flex flex-col">
			<!-- Header -->
			<header class="navbar z-10 w-full px-12 py-3" data-testid="header">
				<!-- Drawer button -->
				<div class="flex-none md:hidden">
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<label
						tabindex="0"
						for="header-drawer"
						class="btn btn-square btn-ghost"
						data-testid="drawer-toggle"
						aria-label="Menu"
					>
						<MenuIcon class="h-7 w-7" />
					</label>
				</div>

				<!-- Navigation links -->
				<div class="hidden flex-none md:block">
					<ul class="menu menu-horizontal space-x-2">
						{#each links as link (link.name)}
							<li>
								<a
									class="text-lg font-semibold"
									class:underline={currentPath === link.href}
									href={link.href}
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Utility buttons -->
				<div class="navbar-end flex-1 items-center gap-2">
					<Search />
					<details
						bind:this={qrDropdownDetails}
						class="dropdown dropdown-end hidden md:inline-block"
						data-testid="qr-dropdown"
						ontoggle={() => {
							isOpen = qrDropdownDetails?.open ?? false;
						}}
					>
						<summary class="btn btn-circle btn-ghost" aria-label="QR Code">
							<QRCodeIcon class="h-6 w-6" />
						</summary>
						<div
							class={'dropdown-content rounded-box z-20 mt-2 flex flex-col items-center gap-2 transition-all duration-300 select-none ' +
								(isOpen
									? 'bg-base-100/95 border-base-200 scale-100 border p-2.5 opacity-100 shadow-xl backdrop-blur-xs'
									: 'scale-95 border-transparent bg-transparent p-1 opacity-0 shadow-none backdrop-blur-none')}
							style="width: 249px; min-width: 249px;"
						>
							<QRCode url={currentURL} width={213} />
						</div>
					</details>
					<ThemeSelect />
				</div>
			</header>
		</div>

		<!-- Drawer content -->
		<div class="drawer-side z-10 lg:hidden">
			<label for="header-drawer" class="drawer-overlay"></label>

			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="flex min-h-screen w-full"
				onclick={(/* Force close drawer when click wrapper */) => (drawerOpen = false)}
			>
				<div class="m-auto flex flex-col items-center gap-8">
					<ul class="menu flex flex-col items-center gap-6 text-2xl text-white">
						{#each links as link (link.name)}
							<li>
								<a
									class="mx-auto w-fit"
									class:underline={currentPath === link.href}
									href={link.href}
									onclick={(/* Close drawer when link clicked */) => (drawerOpen = false)}
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>

					<!-- Mobile Drawer QR Code -->
					{#if drawerOpen && currentURL}
						<QRCode url={currentURL} width={213} />
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
