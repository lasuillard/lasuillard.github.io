<script lang="ts">
	import { formatDate } from '$lib/time.js';

	export let data;

	const { tag, posts } = data;
</script>

<div>
	<div class="flex flex-col">
		{#if posts.length > 0}
			<p class="text-2xl mb-2">
				There are {posts.length} posts with tag <span class="tag">#{tag}</span>
			</p>
			<ul class="space-y-1">
				{#each posts as post}
					<li>
						<p class="text-lg"><a href="/blog/{post.slug}">{post.metadata.title}</a></p>
						<p>{formatDate(post.metadata.publicationDate)}</p>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-2xl">
				There is no post with <span class="tag">#{tag}</span>
			</p>
		{/if}
	</div>
</div>

<style lang="postcss">
	.tag {
		@apply font-semibold;
	}
</style>
