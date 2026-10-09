<script lang="ts">
  import PostCard from "#components/content/PostCard.svelte";

  let { data } = $props();

  let profileImage = "/profile.jpg";
</script>

<div class="mx-auto xl:max-w-200">
  <div class="grid grid-cols-1 items-center gap-y-8">
    <!-- Profile image -->
    <div class="avatar col-span-1 flex justify-center">
      <div class="h-fit w-36 rounded-lg bg-sky-900 p-0.5 sm:w-48">
        <img class="mask rounded-md" src={profileImage} alt="이유찬 프로필" />
      </div>
    </div>

    <!-- Title -->
    <div class="text-center">
      <h2 class="text-2xl font-semibold">게으른 개발자, 이유찬입니다.</h2>
    </div>

    <!-- Bio -->
    <div class="w-full px-4 text-center">
      <p class="my-4 text-center">…</p>
      <div class="text-center leading-8">
        <p>
          흔한 백엔드 엔지니어입니다. 주로 Python과 Django, Amazon Web Services
          (AWS)를 활용하여 웹 서비스를 구축하고 운영해왔습니다.
        </p>
        <br />
        <p>
          사이드 프로젝트를 통해 평소 쌓아뒀던 아이디어를 구현 및 검증하는 것을
          즐기는 편입니다. 재사용을 위한 라이브러리 패키지, 개발 편의성을
          증대시키는 CLI 도구, Prometheus Exporter, GitHub App 그리고 크롬
          브라우저 확장 프로그램 등 언어와 프레임워크를 막론하고 다양한 것들을
          만듭니다.
        </p>
        <br />
        <p>그 외 취미로는 클라이밍🧗을 조금 하고 있습니다.</p>
      </div>
    </div>
  </div>

  <!-- Recent Posts Section -->
  <div class="border-base-200 mt-24 border-t pt-16" data-testid="recent-posts">
    <div class="relative mb-10 flex items-center justify-center">
      <h2 class="text-3xl font-extrabold tracking-tight">최근 쓴 글</h2>
      <a
        href="/blog"
        class="btn btn-ghost btn-sm text-base-content/70 hover:text-base-content absolute right-0"
      >
        전체보기 →
      </a>
    </div>

    <div
      class="grid grid-cols-1 items-start gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-x-6 lg:gap-y-10"
    >
      {#if data.recentPosts && data.recentPosts.length}
        {#each data.recentPosts as { metadata: { id, slug, title, publicationDate, summary, tags, preview } } (id)}
          <div class="w-full">
            <PostCard
              metadata={{
                id,
                slug,
                title,
                publicationDate,
                summary,
                tags: tags.length > 3 ? [...tags.slice(0, 3), "..."] : tags,
                preview,
              }}
            />
          </div>
        {/each}
      {:else}
        <div
          class="text-base-content/70 col-span-full py-12 text-center text-lg"
        >
          아직 글을 쓰지 않았습니다.
        </div>
      {/if}
    </div>
  </div>
</div>
