<script lang="ts">
	import RSS from '$components/icon/RSS.svelte';

	const currentYear = new Date().getFullYear();
</script>

<div data-testid="footer" {...$$restProps}>
	<div class="flex flex-col">
		<footer class="footer px-3 py-2 md:px-12 md:py-4">
			<aside class="mx-auto items-center">
				<p class=" text-sm font-light leading-6 md:text-base md:leading-8">
					© 2023 - {currentYear} Yuchan Lee. All rights reserved.<br />
					Made with <a href="https://kit.svelte.dev/" class="link">SvelteKit</a>, hosted on
					<a href="https://pages.github.com/" class="link">GitHub Pages</a>.
				</p>
			</aside>
			<nav class="mx-auto place-self-end pb-1 md:place-self-center">
				<div class="space-x- grid grid-flow-col">
					<!-- RSS -->
					<a href="/rss" class="btn btn-circle btn-ghost self-center">
						<RSS class="h-8 w-8 lg:h-9 lg:w-9" />
					</a>
				</div>
			</nav>
		</footer>
	</div>
</div>
