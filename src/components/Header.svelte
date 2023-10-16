<script lang="ts">
	import LanguageSelect from '$components/LanguageSelect.svelte';
	import ThemeSelect from '$components/ThemeSelect.svelte';
	import Menu from '$components/icon/Menu.svelte';
</script>

<div data-testid="header-wrapper" {...$$restProps}>
	<header class="navbar flex-wrap md:hidden" data-testid="header">
		<!-- Dropdown menu for small screen -->
		<div class="dropdown flex-1">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn btn-ghost">
				<Menu class="h-6 w-6" />
			</label>
			<ul class="menu dropdown-content rounded-box menu-md z-[1] bg-base-300 shadow">
				<li>
					<a href="/" class="text-base font-light">Home</a>
				</li>
				<li>
					<a href="/about" class="text-base font-light">About</a>
				</li>
				<li>
					<a href="/blog" class="text-base font-light">Blog</a>
				</li>
			</ul>
		</div>
		<div class="flex-none flex-wrap lg:navbar-end">
			<ThemeSelect />
			<LanguageSelect class="ml-2 lg:ml-4" />
		</div>
	</header>
	<!-- Full horizontal menu -->
	<header class="navbar max-md:hidden" data-testid="header">
		<div class="flex-1 lg:navbar-start">
			<ul class="menu menu-horizontal items-center">
				<li>
					<a href="/" class="text-base font-light">Home</a>
				</li>
				<li>
					<a href="/about" class="text-base font-light">About</a>
				</li>
				<li>
					<a href="/blog" class="text-base font-light">Blog</a>
				</li>
			</ul>
		</div>
		<div class="flex-none flex-wrap lg:navbar-end">
			<ThemeSelect />
			<LanguageSelect class="ml-2 lg:ml-4" />
		</div>
	</header>
</div>
