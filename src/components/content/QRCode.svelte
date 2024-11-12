<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	interface Props {
		text: string;
		width?: number;
	}

	let { text, width = 128 }: Props = $props();

	let qrCode: HTMLElement | undefined = $state();

	onMount(() => {
		if (!qrCode) {
			console.error('Canvas for QR Code not defined yet.');
			return;
		}

		QRCode.toCanvas(
			qrCode,
			text,
			{
				width
			},
			(err) => {
				if (err) {
					console.error(err);
					return;
				}
				console.debug(`QR Code for URL ${text} generated successfully`);
			}
		);
	});
</script>

<canvas bind:this={qrCode} data-testid="qrcode" title={text} {width}></canvas>
