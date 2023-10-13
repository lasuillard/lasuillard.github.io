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

		<div>
			<!-- TODO: Recent activities (posts, tags, etc.) -->
			<h2 class="text-lg font-semibold">Recent Posts</h2>
			<p class="mt-1 text-base font-light">There is no post yet.</p>
		</div>
	</aside>
</div>
