<script lang="ts">
	import Comment from '$components/content/Comment.svelte';
	import Markdown from '$components/content/Markdown.svelte';
	import Toc from '$components/content/Toc.svelte';
	import SeriesWidget from '$components/content/SeriesWidget.svelte';
	import { format, formatDistanceStrict } from 'date-fns';
	import { tick } from 'svelte';

	let { data } = $props();
	const { metadata, content, seriesPosts } = $derived.by(() => {
		return data;
	});

	// HTML element binding used for generating ToC
	let contentWrapper: HTMLElement | undefined = $state();
	let contentIsReady = $state(false);
	let activeId = $state('');

	// Take action when the content is ready
	$effect(() => {
		if (!contentIsReady) {
			console.debug('Content is not ready yet. Skipping patching.');
			return;
		}

		import('mermaid').then(({ default: mermaid }) => {
			console.debug('Mermaid loaded. Running...');
			mermaid.run();
		});

		// Monkey-patching footnote label (add emoji and translate)
		const footnoteLabel = contentWrapper?.querySelector('#footnote-label > a');
		if (footnoteLabel) {
			footnoteLabel.innerHTML = '각주'; // TODO: I18n
			footnoteLabel.innerHTML = '🔗 ' + footnoteLabel.innerHTML;
		} else {
			console.debug('Footnote label not found. Skipping patching.');
		}
	});

	/**
	 * Use native browser history replaceState instead of SvelteKit's replaceState to avoid unwanted
	 * scrolling when updating the URL hash for the Table of Contents during scroll.
	 * @param url - The URL or hash to set.
	 */
	function replaceStateBrowser(url: string) {
		history.replaceState(null, '', url);
	}

	$effect(() => {
		if (!contentIsReady || !contentWrapper) {
			return;
		}

		const initialHash = window.location.hash;

		// Scroll to element if hash is present in URL on mount
		tick().then(() => {
			if (initialHash) {
				try {
					const decodedHash = decodeURIComponent(initialHash);
					const id = decodedHash.slice(1);
					const element = document.getElementById(id) || document.querySelector(decodedHash);
					if (element) {
						let userInteracted = false;
						const cancelScroll = () => {
							userInteracted = true;
						};

						// Listen for interactions that indicate the user wants control
						window.addEventListener('wheel', cancelScroll, { once: true, passive: true });
						window.addEventListener('touchstart', cancelScroll, { once: true, passive: true });
						window.addEventListener(
							'keydown',
							(e) => {
								if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown'].includes(e.code)) {
									cancelScroll();
								}
							},
							{ once: true, passive: true }
						);

						const images = Array.from(contentWrapper?.querySelectorAll('img') || []);
						const promises = images.map((img) => {
							if (img.complete || img.loading === 'lazy') return Promise.resolve();
							return new Promise((resolve) => {
								img.addEventListener('load', resolve, { once: true });
								img.addEventListener('error', resolve, { once: true });
							});
						});

						// Wait for Utterances widget to load and resize
						const utterancesContainer = document.querySelector('[data-testid="utterances"]');
						if (utterancesContainer) {
							promises.push(
								new Promise((resolve) => {
									const handleMessage = (event: MessageEvent) => {
										if (event.origin !== 'https://utteranc.es') return;
										if (event.data && event.data.type === 'resize') {
											window.removeEventListener('message', handleMessage);
											resolve(null);
										}
									};
									window.addEventListener('message', handleMessage);
								})
							);
						}

						Promise.race([
							Promise.all(promises),
							new Promise((resolve) => setTimeout(resolve, 2000))
						]).then(() => {
							window.removeEventListener('wheel', cancelScroll);
							window.removeEventListener('touchstart', cancelScroll);

							if (!userInteracted) {
								element.scrollIntoView({ behavior: 'smooth' });
							}
						});
					}
				} catch (e) {
					console.error('Failed to scroll to hash:', e);
				}
			}
		});

		const handleAnchorClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const anchor = target.closest('a');
			if (!anchor) return;

			const href = anchor.getAttribute('href');
			if (href && href.startsWith('#')) {
				e.preventDefault();
				const id = decodeURIComponent(href.slice(1));
				const element = document.getElementById(id);
				if (element) {
					activeId = href;
					replaceStateBrowser(href);
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}
		};

		window.addEventListener('click', handleAnchorClick);

		return () => {
			window.removeEventListener('click', handleAnchorClick);
		};
	});
</script>

<div>
	<div class="flex">
		<!-- Side TOC for large screen -->
		<div class="ml-12 hidden lg:order-last lg:block">
			{#if contentIsReady}
				<Toc
					content={contentWrapper}
					{activeId}
					class="h-md:sticky h-md:top-[10%] h-lg:top-[20vh] min-w-[20vw]"
				/>
			{/if}
		</div>
		<div class="mx-auto max-w-none lg:max-w-[50rem]">
			<div class="mt-6 flex flex-col items-center gap-4 sm:gap-6">
				{#if metadata.preview}
					<img
						src={metadata.preview}
						alt="Preview"
						class="h-auto w-full flex-shrink-0 rounded-xs object-contain sm:h-48 sm:w-48"
					/>
				{/if}
				<div class="flex w-full flex-1 flex-col items-center">
					<h1 class="text-center text-2xl font-bold md:text-3xl">{metadata.title}</h1>
					<p class="mt-4 text-center font-light md:text-base">
						<time datetime={metadata.publicationDate.toISOString()} role="time">
							{formatDistanceStrict(metadata.publicationDate, new Date(), { addSuffix: true })}
							({format(metadata.publicationDate, 'yyyy년 M월 d일')})
						</time>
					</p>
					{#if metadata.summary}
						<p class="mt-2 text-center font-light text-gray-500 md:mt-4 md:text-lg">
							{metadata.summary}
						</p>
					{/if}
					<div class="mt-4 flex flex-wrap justify-center">
						{#each metadata.tags as tag (tag)}
							<div class="badge badge-secondary mr-2 mb-2 rounded-xs p-3 font-semibold">
								<a href="/blog/tag/{tag}">
									{tag}
								</a>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="divider mb-6"></div>
			<!-- Floating/Hoverable TOC for small screens -->
			{#if contentIsReady}
				<div class="lg:hidden">
					<Toc content={contentWrapper} {activeId} isFloating={true} />
				</div>
			{/if}
			<div bind:this={contentWrapper}>
				<article class="prose prose-sm lg:prose-base mx-auto mt-12 max-w-none break-words">
					<Markdown bind:ready={contentIsReady}>{content}</Markdown>
				</article>
			</div>
			{#if metadata.series && seriesPosts && seriesPosts.length > 0}
				<SeriesWidget seriesName={metadata.series} {seriesPosts} currentPostId={metadata.id} />
			{/if}
			<Comment />
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "../../../app.css";

	article {
		& :global(figure figcaption) {
			@apply text-center;
		}

		/* Center image and add some shadow for visual recognition */
		& :global(img) {
			@apply mx-auto shadow-md;
		}
		/* No underline for heading links */
		& :global(:where(h1, h2, h3, h4, h5, h6)) {
			scroll-margin-top: 80px;
		}
		& :global(:where(h1, h2, h3, h4, h5, h6) > a) {
			@apply no-underline;
		}
		/* Show '#' on the left of heading links when hover */
		& :global(:where(h1, h2, h3, h4, h5, h6) > a:hover) {
			@apply before:text-secondary before:absolute before:-ml-6 before:underline before:underline-offset-4 before:content-['#'];
		}
		/* Add some shadow for visual recognition */
		& :global(pre) {
			@apply m-2 p-0 text-wrap;
		}
		/* Center Mermaid diagram horizontally */
		& :global(pre.mermaid svg) {
			@apply mx-auto p-2;
		}
	}
</style>
