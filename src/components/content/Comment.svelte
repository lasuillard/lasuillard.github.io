<script lang="ts">
	import { currentTheme, Theme } from '$lib/theme';

	let theme = $derived($currentTheme == Theme.Light ? 'github-light' : 'github-dark');
</script>

{#key theme}
	<div data-testid="utterances" class="w-full">
		<script
			src="https://utteranc.es/client.js"
			repo="lasuillard/lasuillard.github.io"
			issue-term="pathname"
			label="comment"
			{theme}
			crossorigin="anonymous"
			async
		>
		</script>
	</div>
{/key}

<style>
	@reference "../../app.css";

	:global(.utterances) {
		@apply mt-20 max-w-full lg:mx-8;
	}
</style>
