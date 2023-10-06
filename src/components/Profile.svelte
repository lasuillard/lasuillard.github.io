<script lang="ts">
	import GitHub from './icon/GitHub.svelte';
	import Gmail from './icon/Gmail.svelte';
	import LinkedIn from './icon/LinkedIn.svelte';

	// TODO: Automate generating profile image (hash email by md5)
	// https://gravatar.com/site/implement/images/
	let profileImage = 'https://www.gravatar.com/avatar/ff482bc4abad770478cc7bd36cb490fd';
	let size = 200;
</script>

<div data-testid="profile" {...$$restProps}>
	<!-- Avatar -->
	<div class="avatar w-full">
		<div class="w-1/3 md:w-3/5 rounded-full ring-2 ring-primary bg-primary">
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
	<h1 class="font-semibold text-3xl md:text-2xl">Yuchan Lee</h1>
	<p class="font-light text-xl md:text-md">A lazy developer.</p>

	<!-- Contacts -->
	<div class="mt-8 pr-4 flex justify-end">
		<div class="flex space-x-3 rounded-lg p-2 px-3 dark:bg-white">
			<!-- GitHub -->
			<a href="https://github.com/lasuillard">
				<GitHub class="w-9 h-9 md:w-7 md:h-7" />
			</a>

			<!-- LinkedIn -->
			<a href="https://www.linkedin.com/in/%EC%9C%A0%EC%B0%AC-%EC%9D%B4-67751020b/">
				<LinkedIn class="w-9 h-9 md:w-7 md:h-7" />
			</a>

			<!-- Gmail -->
			<a href="mailto:lasuillard@gmail.com">
				<Gmail class="w-9 h-9 md:w-7 md:h-7" />
			</a>
		</div>
	</div>
</div>
