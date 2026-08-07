<script lang="ts">
	import Markdown from '$components/content/Markdown.svelte';
	import { route } from '$lib/urls';
	import { format, formatDistanceStrict } from 'date-fns';

	let { data } = $props();

	let profileImage = '/profile.jpg';
</script>

<div class="mx-auto xl:max-w-[50rem]">
	<div class="grid grid-cols-1 items-center gap-y-8">
		<!-- Profile image -->
		<div class="avatar col-span-1 flex justify-center">
			<div class="h-fit w-36 rounded-lg bg-sky-900 p-0.5 sm:w-48">
				<!-- svelte-ignore a11y_img_redundant_alt -->
				<!-- BUG: https://github.com -->
				<img class="mask rounded-md" src={profileImage} alt="Profile image" />
			</div>
		</div>

		<!-- Title -->
		<div class="text-center">
			<h2 class="text-2xl font-semibold">게으른 개발자, 이유찬입니다.</h2>
		</div>

		<!-- Bio -->
		<div class="w-full px-4 text-center">
			<p class="my-4 text-center">…</p>
			<div class="text-justify leading-8">
				<p>
					소프트웨어 엔지니어 이유찬입니다. 여러 회사에서 Python과 Django, AWS 서비스를 활용하여 웹
					서비스를 구축하고 운영해왔습니다.
				</p>
				<br />
				<p>
					평소 언어를 막론하고 여러 사이드 프로젝트를 개발하고 있습니다. 라이브러리 패키지, CLI
					도구, 컨테이너 이미지, Prometheus Exporter, 그리고 크롬 브라우저 확장 프로그램 등을 만들고
					공유하고 있습니다.
				</p>
				<br />
				<p>
					게으른 개발자를 지향합니다. 지루하고 반복적인 작업을 적극적으로 자동화하고 그보다 더
					가치있는 일에 시간을 할애하는 것을 중요하게 생각합니다. 단순히 코드를 작성하기보다
					사용자에게 가치 있는 제품과 경험을 전달하는 것을 중요하게 여깁니다.
				</p>
				<br />
				<p>취미로는 클라이밍🧗을 즐깁니다.</p>
			</div>
		</div>
	</div>

	<!-- Recent Posts Section -->
	<div class="border-base-content/10 mt-20 border-t pt-10" data-testid="recent-posts">
		<h3 class="mb-8 text-center text-2xl font-bold">최근 쓴 글</h3>
		<div class="columns-1 gap-4 md:columns-3">
			{#if data.recentPosts && data.recentPosts.length}
				{#each data.recentPosts as { metadata: { id, slug, title, publicationDate, summary, tags, preview } } (id)}
					<div class="card bg-base-100 border-base-200 mb-4 break-inside-avoid border shadow-xl">
						{#if preview}
							<figure>
								<img src={preview} alt={title} class="w-full object-cover" />
							</figure>
						{/if}
						<div class="card-body p-4 text-xs">
							<h4 class="card-title text-base font-semibold">
								<a href="/blog/{id}-{slug}" class="link hover:text-secondary">{title}</a>
							</h4>
							<p class="mb-1 text-gray-500">
								<time datetime={publicationDate.toISOString()} role="time">
									{formatDistanceStrict(publicationDate, new Date(), { addSuffix: true })}
									({format(publicationDate, 'yyyy년 M월 d일')})
								</time>
							</p>
							<div class="text-justify leading-snug">
								<Markdown>{summary}</Markdown>
							</div>
							<div class="card-actions mt-2">
								{#each tags as tag (tag)}
									<span class="badge badge-secondary badge-xs rounded-xs font-semibold">
										<a href={route('/blog', { query: { tag } })}>{tag}</a>
									</span>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<p class="text-center text-sm">아직 글을 쓰지 않았습니다.</p>
			{/if}
		</div>
	</div>
</div>
