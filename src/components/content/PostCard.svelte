<script lang="ts">
	import TagBadge from './TagBadge.svelte';
	import CalendarDaysIcon from '$components/icon/CalendarDays.svelte';
	import { format, formatDistanceStrict } from 'date-fns';
	import type { Metadata } from '$lib/post';

	interface Props {
		metadata: Metadata;
		selectedTag?: string | null;
		variant?: 'horizontal' | 'vertical';
	}

	let { metadata, selectedTag = null, variant = 'horizontal' }: Props = $props();
	const { id, slug, title, publicationDate, preview, summary, tags } = metadata;
	const postUrl = `/blog/${id}-${slug}`;
</script>

<div
	class="card bg-base-100 border-base-200 border shadow-xl transition-transform duration-200 hover:scale-[1.02]
    {variant === 'horizontal' ? 'md:card-side md:h-80 lg:h-96' : ''}"
>
	{#if preview}
		<figure
			class="{variant === 'horizontal' ? 'md:w-2/5 md:flex-shrink-0 lg:w-[28.8rem]' : ''} bg-white"
		>
			<a href={postUrl} class="flex h-full w-full items-center justify-center">
				<img
					src={preview}
					alt={title}
					class="h-full w-full object-contain {variant === 'horizontal' ? 'md:h-80 lg:h-96' : ''}"
				/>
			</a>
		</figure>
	{/if}
	<div
		class="card-body justify-center {variant === 'vertical'
			? 'items-center p-4 text-center text-xs'
			: 'items-start text-left md:p-6 lg:p-8'}"
	>
		<h2 class="card-title {variant === 'vertical' ? 'justify-center text-base' : 'text-2xl'}">
			<a href={postUrl} class="link hover:text-secondary">{title}</a>
		</h2>
		<p class="text-gray-500 {variant === 'vertical' ? 'mb-1' : 'mt-1'}">
			<CalendarDaysIcon class="mb-1 inline-block h-4 w-4" />
			<time datetime={publicationDate.toISOString()} role="time">
				{formatDistanceStrict(publicationDate, new Date(), { addSuffix: true })}
				({format(publicationDate, 'yyyy년 M월 d일')})
			</time>
		</p>
		<p class="line-clamp-3 {variant === 'vertical' ? 'leading-snug' : 'md:text-lg'} [&_p]:mt-0">
			{summary}
		</p>
		<div
			class="mt-4 leading-loose md:line-clamp-2 {variant === 'vertical'
				? 'text-center'
				: 'text-left'}"
		>
			{#each tags as tag (tag)}
				<span class="mr-1 mb-1 inline-block align-middle">
					<TagBadge {tag} selected={selectedTag?.toLowerCase() === tag.toLowerCase()} />
				</span>
			{/each}
		</div>
	</div>
</div>
