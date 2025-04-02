<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
		// FIXME: Accepting parameters for testing because mocking store isn't easy
		status?: any;
		/* c8 ignore next */
		message?: any;
	}

	// eslint-disable-next-line svelte/valid-prop-names-in-kit-pages
	let { status = $page.status, message = $page.error?.message || 'Unknown Error' }: Props =
		$props();
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<h1 class="text-8xl">{status}</h1>
	<p class="mt-6 text-4xl">{message}</p>
</div>
