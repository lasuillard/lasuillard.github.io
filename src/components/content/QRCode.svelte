<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	export let text: string;
	export let width: number = 128;

	let qrCode: HTMLElement | undefined;

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

<canvas bind:this={qrCode} data-testid="qrcode" title={text} {width} />
