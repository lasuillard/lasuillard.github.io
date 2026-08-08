<script lang="ts">
	import { route } from '$lib/urls';

	interface Props {
		tag: string;
		count?: number;
		selected?: boolean;
		showCount?: boolean;
	}

	let { tag, count, selected = false, showCount = false }: Props = $props();
</script>

<span
	class="badge {selected
		? 'badge-primary'
		: 'badge-secondary'} badge-sm md:badge-md rounded-xs font-semibold"
>
	<a href={selected ? '/blog' : route('/blog', { query: { tag } })}>
		{tag}{showCount && count !== undefined ? ` (${count})` : ''}{selected ? ' ×' : ''}
	</a>
</span>
