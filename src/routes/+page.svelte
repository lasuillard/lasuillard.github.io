<script lang="ts">
	// TODO: Automate generating profile image (hash email by md5)
	// https://gravatar.com/site/implement/images/
	let profileImage = 'https://www.gravatar.com/avatar/ff482bc4abad770478cc7bd36cb490fd';
	let size = 384; // px
</script>

<div class="pt-12">
	<div class="grid grid-cols-1 space-x-4 space-y-8 lg:grid-cols-3">
		<div class="flex">
			<div class="avatar mx-auto">
				<div
					class="m-auto h-fit w-48 rounded-full bg-gradient-to-r from-rose-600 via-fuchsia-400 to-yellow-400 p-0.5 lg:w-56"
				>
					<!-- svelte-ignore a11y_img_redundant_alt -->
					<!-- BUG: https://github.com/sveltejs/language-tools/issues/524 -->
					<img
						class="mask mask-circle"
						src={`${profileImage}?s=${size}`}
						alt="My gravatar profile image"
					/>
				</div>
			</div>
		</div>
		<div class="max-lg:text-center lg:col-span-2">
			<h1 class="mb-8 text-4xl font-bold">이유찬</h1>
			<h2 class="mb-4 text-xl font-semibold">게으른 개발자입니다.</h2>
			<div class="leading-8">
				<p>Python 백엔드 개발자입니다.</p>
				<p>대한민국 경기도 고양시에 거주하고 있습니다.</p>
				<p>웹 기반 서비스 백엔드 구축 및 운영 경험이 있습니다.</p>
				<div class="divider"></div>
				<div class="mt-3 grid grid-flow-col px-2 lg:justify-items-start">
					<a class="link-hover text-lg" href="/about-me">About Me</a>
					<a class="link-hover text-lg" href="/blog">Blog</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	@keyframes typing {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}
</style>
