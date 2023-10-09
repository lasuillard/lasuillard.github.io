<script lang="ts">
	import LanguageSelect from './LanguageSelect.svelte';
	import Search from './Search.svelte';
	import ThemeSelect from './ThemeSelect.svelte';
	import About from './icon/About.svelte';
	import Blog from './icon/Blog.svelte';
	import Home from './icon/Home.svelte';
</script>

<div data-testid="header" {...$$restProps}>
	<header class="navbar flex-wrap md:flex-nowrap">
		<div class="md:navbar-start">
			<ul class="menu menu-horizontal flex-nowrap items-center">
				<li data-testid="home-link">
					<a href="/" title="Home">
						<Home class="w-6 h-6" />
					</a>
				</li>
				<li data-testid="about-link">
					<a href="/about" title="About">
						<About class="w-6 h-6" />
					</a>
				</li>
				<li data-testid="blog-link">
					<a href="/blog" title="Blog">
						<Blog class="w-6 h-6" />
					</a>
				</li>
			</ul>
		</div>
		<div class="md:navbar-end">
			<Search class="mr-4" />
			<ThemeSelect />
			<LanguageSelect />
		</div>
	</header>
</div>
