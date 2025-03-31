<script lang="ts">
	import Menu from '$components/icon/Menu.svelte';
	import ThemeSelect from '$components/utility/ThemeSelect.svelte';

	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'About Me', href: '/about-me' },
		{ name: 'Blog', href: '/blog' }
	];

	interface Props {
		currentPath?: string | undefined;
		drawerOpen?: boolean;
	}

	let { currentPath = $bindable(undefined), drawerOpen = $bindable(false) }: Props = $props();
</script>

<div data-testid="header-wrapper" class="bg-base-100">
	<!-- Drawer container -->
	<div class="drawer">
		<input id="header-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />

		<div class="drawer-content flex flex-col">
			<!-- Header -->
			<header class="navbar z-10 w-full px-12 py-6" data-testid="header">
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
						<Menu class="h-7 w-7" />
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
				<div class="navbar-end flex-1">
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
				<ul class="menu m-auto text-2xl text-white">
					{#each links as link (link.name)}
						<li>
							<a
								class="w-fit"
								class:underline={currentPath === link.href}
								href={link.href}
								onclick={(/* Close drawer when link clicked */) => (drawerOpen = false)}
							>
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>
