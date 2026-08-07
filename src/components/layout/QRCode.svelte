<script lang="ts">
	import { browser } from '$app/environment';
	import QRCodeLibrary from 'qrcode';
	import Check from '$components/icon/Check.svelte';
	import Copy from '$components/icon/Copy.svelte';

	interface Props {
		url: string;
		width?: number;
	}

	let { url, width = 213 }: Props = $props();

	let qrCodeCanvas: HTMLElement | undefined = $state();
	let copied = $state(false);

	$effect(() => {
		if (!qrCodeCanvas || !url) return;

		QRCodeLibrary.toCanvas(qrCodeCanvas, url, { width }, (err) => {
			if (err) console.error(err);
		});
	});

	function handleCopy() {
		if (browser && url) {
			navigator.clipboard.writeText(url).then(() => {
				copied = true;
				setTimeout(() => {
					copied = false;
				}, 2000);
			});
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="flex flex-col items-center gap-2" onclick={(e) => e.stopPropagation()}>
	<div class="rounded-xl bg-white p-2 shadow-lg">
		{#if url}
			<canvas
				bind:this={qrCodeCanvas}
				class="shrink-0 rounded-xl"
				data-testid="qrcode"
				title={url}
				{width}
				style="width: {width}px; height: {width}px; min-width: {width}px; min-height: {width}px;"
			></canvas>
		{:else}
			<canvas
				{width}
				style="width: {width}px; height: {width}px; min-width: {width}px; min-height: {width}px;"
			></canvas>
		{/if}
	</div>
	{#if url}
		<div class="mt-1 flex items-center justify-between gap-1" style="width: {width}px;">
			<div class="flex-1 overflow-hidden text-center">
				<span
					class="text-base-content/70 block truncate text-xs font-semibold select-all"
					title={url}
				>
					{url}
				</span>
			</div>
			<button class="btn btn-xs btn-circle btn-ghost" onclick={handleCopy} aria-label="Copy URL">
				{#if copied}
					<Check class="h-3.5 w-3.5" stroke="green" stroke-width="2.5" />
				{:else}
					<Copy class="h-3.5 w-3.5" />
				{/if}
			</button>
		</div>
	{/if}
</div>
