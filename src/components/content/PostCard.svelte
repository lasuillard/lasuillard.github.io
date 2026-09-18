<script lang="ts">
	import TagBadge from './TagBadge.svelte';
	import CalendarDaysIcon from '$components/icon/CalendarDays.svelte';
	import type { Metadata } from '$lib/post';
	import { route } from '$lib/urls';
	import { formatRelativeDate } from '$lib/utils';
	import { format } from 'date-fns';

	interface Props {
		metadata: Metadata;
		selectedTag?: string | null;
		variant?: 'horizontal' | 'vertical'; // we might not need variant anymore if we only use vertical, but let's keep it just in case
	}

	let { metadata, selectedTag = null, variant = 'horizontal' }: Props = $props();
	const today = new Date();
	const postUrl = $derived(
		route('/blog/[slug]', { params: { slug: `${metadata.id}-${metadata.slug}` } })
	);
</script>

{#if variant === 'horizontal'}
	<!-- Horizontal Variant -->
	<article
		class="group bg-base-100 border-base-200 flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:shadow-xl md:flex-row"
	>
		<a href={postUrl} class="bg-base-200 block shrink-0 overflow-hidden md:w-2/5">
			<img
				src={metadata.preview}
				alt={metadata.title}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
			/>
		</a>
		<div class="flex flex-1 flex-col justify-center p-6 lg:p-8">
			<div class="text-base-content/60 mb-3 flex items-center gap-1.5 text-sm">
				<CalendarDaysIcon class="h-4 w-4" />
				<time datetime={metadata.publicationDate.toISOString()}>
					{formatRelativeDate(metadata.publicationDate, today)} ({format(
						metadata.publicationDate,
						'yyyy년 M월 d일'
					)})
				</time>
			</div>
			<h2 class="group-hover:text-primary mb-3 text-2xl leading-tight font-bold transition-colors">
				<a href={postUrl}>{metadata.title}</a>
			</h2>
			<p class="text-base-content/70 mb-4 line-clamp-3 leading-relaxed">
				{metadata.summary}
			</p>
			<div class="mt-auto flex flex-wrap gap-2">
				{#each metadata.tags as tag (tag)}
					<TagBadge {tag} selected={selectedTag?.toLowerCase() === tag.toLowerCase()} />
				{/each}
			</div>
		</div>
	</article>
{:else}
	<!-- Vertical Masonry Variant -->
	<article
		class="group bg-base-100 border-base-200 flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
	>
		<a href={postUrl} class="bg-base-200 border-base-200/50 block w-full overflow-hidden border-b">
			<img
				src={metadata.preview}
				alt={metadata.title}
				class="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
			/>
		</a>
		<div class="flex flex-col p-5 sm:p-6">
			<div class="text-base-content/60 mb-2.5 flex items-center gap-1.5 text-xs sm:text-sm">
				<CalendarDaysIcon class="h-4 w-4" />
				<time datetime={metadata.publicationDate.toISOString()}>
					{formatRelativeDate(metadata.publicationDate, today)} ({format(
						metadata.publicationDate,
						'yyyy년 M월 d일'
					)})
				</time>
			</div>
			<h2
				class="group-hover:text-primary mb-2.5 text-lg leading-tight font-bold transition-colors sm:text-xl"
			>
				<a href={postUrl}>{metadata.title}</a>
			</h2>
			<p class="text-base-content/70 mb-4 line-clamp-4 text-sm leading-relaxed sm:text-base">
				{metadata.summary}
			</p>
			<div class="flex flex-wrap gap-1.5">
				{#each metadata.tags as tag (tag)}
					<TagBadge {tag} selected={selectedTag?.toLowerCase() === tag.toLowerCase()} />
				{/each}
			</div>
		</div>
	</article>
{/if}
