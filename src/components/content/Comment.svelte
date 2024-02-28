<script lang="ts">
	import { Theme, currentTheme } from '^/src/lib/theme';

	$: theme = $currentTheme == Theme.Light ? 'github-light' : 'github-dark';
</script>

{#key $currentTheme}
	<div data-testid="utterances" {...$$restProps}>
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

<style lang="postcss">
	:global(.utterances) {
		@apply m-20 max-w-full lg:mx-8;
	}
</style>
