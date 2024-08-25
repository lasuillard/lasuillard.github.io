<script lang="ts">
	export let theme: 'github-light' | 'github-dark';
</script>

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

<style lang="postcss">
	:global(.utterances) {
		@apply mt-20 max-w-full lg:mx-8;
	}
</style>
