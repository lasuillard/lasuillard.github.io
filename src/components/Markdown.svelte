<script lang="ts">
	import 'highlight.js/styles/atom-one-dark-reasonable.css';

	// Frontmatter passed as props
	// NOTE: Variables not specified here will emit warning in console "<Markdown> was created with unknown prop 'title'".
	export let title;
	export let publicationDate;
	export let tags;

	// Meaningless code to suppress linter warnings
	[title, publicationDate, tags];
</script>

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
