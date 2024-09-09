<script lang="ts">
	import { format, isSameYear } from 'date-fns';

	type Item = {
		period: { start: Date; end?: Date };
		title: string;
		description: string;
		tags?: string[];
	};

	export let items: Item[] = [];
	export let direction: 'left' | 'right' | 'flip' = 'flip';
</script>

<div>
	<ul class="max-md:timeline-compact timeline timeline-vertical timeline-snap-icon">
		{#each items as { period: { start, end }, title, description, tags }, index}
			{@const dir = direction == 'flip' ? (index % 2 == 0 ? 'left' : 'right') : direction}
			<li>
				<hr />
				<div class="timeline-middle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="{dir == 'left' ? 'timeline-start md:text-end' : 'timeline-end'} mb-10">
					<time class="font-mono italic">{format(start, 'yyyy. MMMM')}</time>
					{#if end}
						{@const dateFmt = isSameYear(start, end) ? 'MMMM' : 'yyyy. MMMM'}
						<span class="mx-2">~</span><time class="font-mono italic">{format(end, dateFmt)}</time>
					{/if}
					<div class="text-lg font-black">{title}</div>
					<div>{description}</div>
					{#if tags}
						<div class="mt-2 flex flex-wrap {dir == 'left' ? 'justify-end' : ''} gap-1">
							{#each tags as tag}
								<span class="badge badge-info badge-md font-semibold">{tag}</span>
							{/each}
						</div>
					{/if}
				</div>
				<hr />
			</li>
		{/each}
	</ul>
</div>
