<script lang="ts">
	import { format } from 'date-fns';

	let { data } = $props();
</script>

<div>
	<div class="flex flex-col">
		{#if data.posts.length > 0}
			<p class="mb-4 text-3xl">
				There are {data.posts.length} posts with tag {data.tag}
			</p>
			<ul class="space-y-2">
				{#each data.posts as { metadata: { id, slug, title, publicationDate } } (id)}
					<li>
						<p class="mb-1 text-xl"><a href="/blog/{id}-{slug}">{title}</a></p>
						<p class="font-light">
							Published at
							<time datetime={publicationDate.toISOString()} role="time"
								>{format(publicationDate, 'yyyy. MM. dd')}</time
							>
						</p>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-2xl">
				There is no post with {data.tag}.
			</p>
		{/if}
	</div>
</div>
