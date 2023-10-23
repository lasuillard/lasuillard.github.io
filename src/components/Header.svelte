<script lang="ts">
	import LanguageSelect from '$components/LanguageSelect.svelte';
	import ThemeSelect from '$components/ThemeSelect.svelte';
	import Menu from '$components/icon/Menu.svelte';

	export let openSidebar = false;
</script>

<div data-testid="header-wrapper" {...$$restProps}>
	<header class="navbar flex-wrap" data-testid="header">
		<div class="flex-1">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<label tabindex="0" class="btn btn-ghost swap" data-testid="sidebar-toggle">
				<input type="checkbox" bind:checked={openSidebar} />
				<!-- TODO: Use different icon for on/off -->
				<Menu class="swap-on h-6 w-6" />
				<Menu class="swap-off h-6 w-6" />
			</label>
		</div>
		<div class="flex-none flex-wrap lg:navbar-end">
			<ThemeSelect class="mr-2 lg:mr-4" />
			<LanguageSelect class="hidden" />
		</div>
	</header>
</div>
