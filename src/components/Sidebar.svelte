<script lang="ts">
	import Profile from '$components/Profile.svelte';
	import Search from '$components/Search.svelte';

	const links = [
		{
			name: 'Home',
			href: '/'
		},
		{
			name: 'About Me',
			href: '/about-me'
		},
		{
			name: 'Blog',
			href: '/blog'
		}
	];
</script>

<!-- TODO: Integrate into header menu (responsive) -->
<div data-testid="sidebar" {...$$restProps}>
	<aside class="grid grid-cols-1">
		<Profile />

		<div class="divider" />

		<div>
			<ul class="space-y-2">
				{#each links as link}
					<li>
						<a href={link.href} class="link-hover link text-base font-light">
							{link.name}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="divider" />

		<Search class="mb-4" />
	</aside>
</div>
