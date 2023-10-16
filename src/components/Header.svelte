<script lang="ts">
	import LanguageSelect from '$components/LanguageSelect.svelte';
	import ThemeSelect from '$components/ThemeSelect.svelte';
	import Menu from '$components/icon/Menu.svelte';
</script>

<div data-testid="header-wrapper" {...$$restProps}>
	<header class="navbar flex-wrap" data-testid="header">
		<!-- Dropdown menu for small screen -->
		<div class="dropdown flex-1">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn btn-ghost" data-testid="sidebar-toggle">
				<Menu class="h-6 w-6" />
			</label>
		</div>
		<div class="flex-none flex-wrap lg:navbar-end">
			<ThemeSelect />
			<LanguageSelect class="ml-2 lg:ml-4" />
		</div>
	</header>
</div>
