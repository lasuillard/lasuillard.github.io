<script lang="ts">
	import LanguageSelect from './LanguageSelect.svelte';
	import Search from './Search.svelte';
	import ThemeSelect from './ThemeSelect.svelte';
	import Home from './icon/Home.svelte';
</script>

<div data-testid="header" {...$$restProps}>
	<header class="navbar">
		<div data-testid="home-link" class="flex-1 items-center">
			<a href="/">
				<Home class="w-6 h-6" />
			</a>
		</div>
		<Search class="flex-none mr-3" />
		<ThemeSelect class="flex-none" />
		<LanguageSelect class="flex-none" />
	</header>
</div>
