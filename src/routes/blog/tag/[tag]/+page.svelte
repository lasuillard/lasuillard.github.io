<script lang="ts">
	import { format } from 'date-fns';

	export let data;

	const { tag, posts } = data;
</script>

<div>
	<div class="flex flex-col">
		{#if posts.length > 0}
			<p class="text-3xl mb-4">
				There are {posts.length} posts with tag <span class="tag">#{tag}</span>
			</p>
			<ul class="space-y-2">
				{#each posts as post}
					<li>
						<p class="text-xl mb-1"><a href="/blog/{post.slug}">{post.metadata.title}</a></p>
						<p class="font-light">
							Published at {format(post.metadata.publicationDate, 'yyyy. MM. dd')}
						</p>
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
