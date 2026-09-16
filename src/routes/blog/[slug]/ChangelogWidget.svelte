<script lang="ts">
	import ClockIcon from '$components/icon/Clock.svelte';
	import type { Metadata } from '$lib/post';
	import { formatRelativeDate } from '$lib/utils';
	import { format } from 'date-fns';

	let { changelogs } = $props<{
		changelogs: NonNullable<Metadata['changelog']>;
	}>();

	const today = new Date();

	const sortedChangelogs = $derived(
		[...changelogs].sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		})
	);
</script>

<details
	class="collapse-arrow bg-base-200/50 border-base-300 rounded-r-box border-l-primary collapse my-8 border border-l-4 shadow-xs"
	data-testid="changelog-widget"
>
	<summary class="collapse-title cursor-pointer px-5 py-3.5" data-testid="changelog-header">
		<div class="flex items-center justify-between pr-6">
			<div class="flex items-center gap-2.5">
				<div
					class="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
				>
					<ClockIcon class="h-5 w-5 stroke-2" stroke-width="2.25" />
				</div>
				<h3
					class="text-base-content text-base leading-none font-bold"
					data-testid="changelog-title"
				>
					변경 이력
				</h3>
			</div>
			{#if sortedChangelogs.length > 0}
				<time
					datetime={sortedChangelogs[0].date.toISOString()}
					class="badge badge-neutral badge-sm font-medium whitespace-nowrap"
					data-testid="changelog-latest-date"
				>
					{formatRelativeDate(sortedChangelogs[0].date, today)}
				</time>
			{/if}
		</div>
	</summary>

	<div class="collapse-content px-5 pb-5">
		<div class="border-base-300 border-t pt-3">
			<ul class="max-h-48 space-y-3 overflow-y-auto pr-2" data-testid="changelog-list">
				{#each sortedChangelogs as log, i (`${new Date(log.date).getTime()}-${i}`)}
					<li
						class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-4"
						data-testid="changelog-item"
					>
						<div class="flex items-center gap-1.5 whitespace-nowrap sm:w-44 sm:shrink-0">
							<time
								datetime={new Date(log.date).toISOString()}
								class="badge badge-sm font-mono font-medium {i === 0
									? 'badge-primary'
									: 'bg-base-100 border-base-300 text-base-content border'}"
								data-testid="changelog-item-date"
							>
								{format(log.date, 'yyyy-MM-dd')}
							</time>
							{#if i === 0}
								<span
									class="badge badge-outline badge-sm text-primary font-bold"
									data-testid="changelog-latest-badge"
								>
									최신
								</span>
							{/if}
						</div>
						<div
							class="text-base-content text-sm leading-6 font-light"
							data-testid="changelog-message"
						>
							{log.message}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</details>
