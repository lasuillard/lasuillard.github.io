<script lang="ts">
	import LanguageSelect from './LanguageSelect.svelte';
	import Search from './Search.svelte';
	import ThemeSelect from './ThemeSelect.svelte';
</script>

<!-- TODO: Responsive menu: squash into dropdown if small, otherwise spread it -->
<div data-testid="header" {...$$restProps}>
	<header class="navbar flex-wrap md:hidden" data-testid="header:sm">
		<!-- Dropdown menu for small screen -->
		<div class="dropdown flex-1">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/>
				</svg>
			</label>
			<ul class="menu menu-md dropdown-content bg-base-300 z-[1] rounded-box shadow">
				<li>
					<a href="/" class="font-light text-base">Home</a>
				</li>
				<li>
					<a href="/about" class="font-light text-base">About</a>
				</li>
				<li>
					<a href="/blog" class="font-light text-base">Blog</a>
				</li>
				<li>
					<Search class="mr-2 lg:mr-4 w-64" />
				</li>
			</ul>
		</div>
		<div class="flex-none lg:navbar-end flex-wrap">
			<ThemeSelect />
			<LanguageSelect class="ml-2 lg:ml-4" />
		</div>
	</header>
	<!-- Full horizontal menu -->
	<header class="navbar max-sm:hidden" data-testid="header:md">
		<div class="flex-1 lg:navbar-start">
			<ul class="menu menu-horizontal items-center">
				<li>
					<a href="/" class="font-light text-base">Home</a>
				</li>
				<li>
					<a href="/about" class="font-light text-base">About</a>
				</li>
				<li>
					<a href="/blog" class="font-light text-base">Blog</a>
				</li>
			</ul>
		</div>
		<div class="flex-none lg:navbar-end flex-wrap">
			<Search class="mr-2 lg:mr-4" />
			<ThemeSelect />
			<LanguageSelect class="ml-2 lg:ml-4" />
		</div>
	</header>
</div>
