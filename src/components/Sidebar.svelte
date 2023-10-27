<script lang="ts">
	import Profile from '$components/Profile.svelte';
	import Search from '$components/Search.svelte';
</script>

<!-- TODO: Integrate into header menu (responsive) -->
<div data-testid="sidebar" {...$$restProps}>
	<aside class="grid grid-cols-1">
		<Profile />

		<div class="divider" />

		<Search class="mb-4" />
	</aside>
</div>
