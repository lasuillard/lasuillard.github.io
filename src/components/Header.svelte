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
			<ul class="menu menu-horizontal">
				<li><a href="/">Home</a></li>
				<li><a href="/about-me">About Me</a></li>
				<li><a href="/blog">Blog</a></li>
			</ul>
		</div>
		<div class="navbar-end">
			<ThemeSelect class="mr-2 flex align-middle" />
			<LanguageSelect class="hidden" />
		</div>
	</header>
</div>
