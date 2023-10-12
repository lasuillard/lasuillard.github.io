<script lang="ts">
	import GitHub from '$components/icon/GitHub.svelte';
	import Gmail from '$components/icon/Gmail.svelte';
	import LinkedIn from '$components/icon/LinkedIn.svelte';

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

	<!-- Contacts -->
	<div class="mt-8 flex justify-end pr-4">
		<div class="flex space-x-4 rounded-lg p-2 px-3 dark:bg-white">
			<!-- TODO: Consider moving contacts to footer -->
			<!-- GitHub -->
			<a href="https://github.com/lasuillard">
				<GitHub class="h-7 w-7 lg:h-9 lg:w-9" />
			</a>

			<!-- LinkedIn -->
			<a href="https://www.linkedin.com/in/%EC%9C%A0%EC%B0%AC-%EC%9D%B4-67751020b/">
				<LinkedIn class="h-7 w-7 lg:h-9 lg:w-9" />
			</a>

			<!-- Gmail -->
			<a href="mailto:lasuillard@gmail.com">
				<Gmail class="h-7 w-7 lg:h-9 lg:w-9" />
			</a>
		</div>
	</div>
</div>
