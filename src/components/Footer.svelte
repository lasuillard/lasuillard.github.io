<script lang="ts">
	import GitHub from '$components/icon/GitHub.svelte';
	import Gmail from '$components/icon/Gmail.svelte';
	import LinkedIn from '$components/icon/LinkedIn.svelte';
	import RSS from '$components/icon/RSS.svelte';

	const currentYear = new Date().getFullYear();
</script>

<div data-testid="footer" {...$$restProps}>
	<div class="flex flex-col">
		<footer class="footer px-3 py-2 md:px-12 md:py-8">
			<aside class="mx-auto items-center">
				<p class=" text-sm font-light leading-6 md:text-base md:leading-8">
					© 2023 - {currentYear} Yuchan Lee. All rights reserved.<br />
					Made with <a href="https://kit.svelte.dev/" target="_blank" class="link">SvelteKit</a>,
					hosted on
					<a href="https://pages.github.com/" target="_blank" class="link">GitHub Pages</a>.
				</p>
			</aside>
			<nav class="mx-auto place-self-end pb-1 md:place-self-center">
				<div class="grid grid-flow-col space-x-3 lg:space-x-2">
					<!-- GitHub -->
					<a href="https://github.com/lasuillard" target="_blank" class="btn btn-circle btn-ghost">
						<GitHub class="h-7 w-7 lg:h-8 lg:w-8" aria-label="Visit my GitHub profile" />
					</a>

					<!-- LinkedIn -->
					<a
						href="https://www.linkedin.com/in/%EC%9C%A0%EC%B0%AC-%EC%9D%B4-67751020b/"
						target="_blank"
						class="btn btn-circle btn-ghost"
					>
						<LinkedIn class="h-6 w-6 lg:h-7 lg:w-7" aria-label="Visit my LinkedIn profile" />
					</a>

					<!-- Gmail -->
					<a href="mailto:lasuillard@gmail.com" class="btn btn-circle btn-ghost">
						<Gmail
							class="h-8 w-8 items-center p-1 lg:h-9 lg:w-9"
							aria-label="Send an email to me"
						/>
					</a>

					<!-- RSS -->
					<a
						href="/rss.xml"
						target="_blank"
						class="btn btn-circle btn-ghost self-center"
						aria-label="RSS feeds"
					>
						<RSS class="h-8 w-8 lg:h-9 lg:w-9" />
					</a>
				</div>
			</nav>
		</footer>
	</div>
</div>
