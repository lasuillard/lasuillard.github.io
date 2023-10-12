<script lang="ts">
	// TODO: Automate generating profile image (hash email by md5)
	// https://gravatar.com/site/implement/images/
	let profileImage = 'https://www.gravatar.com/avatar/ff482bc4abad770478cc7bd36cb490fd';
	let size = 200;
</script>

<div data-testid="profile" {...$$restProps}>
	<!-- Avatar -->
	<div class="avatar mb-5 ml-3 mt-3 md:mb-6 md:ml-2 md:mt-2">
		<div class="w-24 rounded-full bg-primary ring-2 ring-primary lg:w-32">
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<!-- BUG: https://github.com/sveltejs/language-tools/issues/524 -->
			<img
				class="mask mask-circle"
				src={`${profileImage}?s=${size}`}
				alt="My gravatar profile image"
			/>
		</div>
	</div>

	<!-- Introduction -->
	<h1 class="text-2xl font-semibold md:text-2xl lg:text-3xl">Yuchan Lee</h1>
	<p class="md:text-md text-base font-light lg:text-xl">A lazy developer.</p>
</div>
