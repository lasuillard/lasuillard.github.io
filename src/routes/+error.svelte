<script>
	import { page } from '$app/stores';
</script>

<div class="w-full h-full flex justify-center items-center flex-col">
	<h1 class="text-8xl">{$page.status}</h1>
	<p class="text-4xl mt-6">{$page.error?.message}</p>
</div>
