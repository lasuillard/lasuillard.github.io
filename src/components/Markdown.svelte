<article class="prose max-w-none lg:prose-lg" data-testid="markdown">
	<slot />
</article>

<style lang="postcss">
	:global(:where(h1, h2, h3, h4, h5, h6) > a) {
		text-decoration-line: none !important;
	}
	:global(:where(h1, h2, h3, h4, h5, h6) > a:hover) {
		text-decoration-line: underline !important;
	}
</style>
