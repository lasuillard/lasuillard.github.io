<script lang="ts">
	import LanguageSelect from '$components/LanguageSelect.svelte';
	import ThemeSelect from '$components/ThemeSelect.svelte';
	import Menu from '$components/icon/Menu.svelte';

	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'About Me', href: '/about-me' },
		{ name: 'Blog', href: '/blog' }
	];

	export let currentPath: string | undefined = undefined;
	export let drawerOpen = false;
</script>

<div data-testid="header-wrapper" {...$$restProps}>
	<!-- Drawer container -->
	<div class="drawer">
		<input id="header-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />

		<div class="drawer-content flex flex-col">
			<!-- Header -->
			<header class="navbar z-10 w-full px-12 py-6" data-testid="header">
				<!-- Drawer button -->
				<div class="flex-none md:hidden">
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
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
					<ul class="menu menu-horizontal">
						{#each links as link}
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
					<ThemeSelect class="flex" />
					<LanguageSelect class="hidden" />
				</div>
			</header>
		</div>

		<!-- Drawer content -->
		<div class="drawer-side lg:hidden">
			<label for="header-drawer" class="drawer-overlay" />

			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="flex min-h-screen w-full"
				on:click={(/* Force close drawer when click wrapper */) => (drawerOpen = false)}
			>
				<ul class="menu m-auto text-2xl text-white">
					{#each links as link}
						<li>
							<a
								class="w-fit"
								class:underline={currentPath === link.href}
								href={link.href}
								on:click={(/* Close drawer when link clicked */) => (drawerOpen = false)}
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
