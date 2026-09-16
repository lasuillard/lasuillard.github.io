<script lang="ts">
	import type { Metadata } from '$lib/post';
	import { format } from 'date-fns';

	let { changelogs } = $props<{
		changelogs: NonNullable<Metadata['changelog']>;
	}>();

	const sortedChangelogs = $derived(
		[...changelogs].sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		})
	);
</script>

<div class="bg-base-200 border-base-300 rounded-box my-8 border p-5" data-testid="changelog-widget">
	<h3 class="text-base-content mb-3 flex items-center gap-2 text-base font-bold">
		<span>📜</span> <span>변경 이력</span>
	</h3>
	<ul class="space-y-2.5">
		{#each sortedChangelogs as log, i (`${new Date(log.date).getTime()}-${i}`)}
			<li class="flex flex-col gap-1 text-sm sm:flex-row sm:items-start sm:gap-4">
				<div class="mt-0.5 text-xs font-semibold whitespace-nowrap text-gray-500">
					{format(log.date, 'yyyy-MM-dd')}
				</div>
				<div class="text-base-content font-light">
					{log.message}
				</div>
			</li>
		{/each}
	</ul>
</div>
