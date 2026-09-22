<script lang="ts">
	interface Props {
		[key: string]: any;
	}
	let { ...rest }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke-width="1.5"
	stroke="currentColor"
	data-testid="heroicons/chevron-right"
	{...rest}
>
	<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
</svg>
