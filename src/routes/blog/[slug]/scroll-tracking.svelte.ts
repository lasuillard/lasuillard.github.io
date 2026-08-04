import { replaceState } from '$app/navigation';
import { tick } from 'svelte';

export class ScrollTracker {
	public activeId = $state('');
	public isClickScrolling = false;
	public initialScrollDone = false;

	private clickScrollTimeout: ReturnType<typeof setTimeout> | undefined;
	private observer: IntersectionObserver | null = null;

	doInit(container: HTMLElement) {
		if (this.initialScrollDone) return; // Ensure it runs only once per visit
		this.initObserver(container);

		// Scroll to initial hash if present
		const initialHash = window.location.hash;
		if (!initialHash) {
			this.initialScrollDone = true;
			return;
		}

		tick().then(() => {
			try {
				const decodedHash = decodeURIComponent(initialHash);
				const id = decodedHash.slice(1);
				const element = document.getElementById(id) || document.querySelector(decodedHash);

				if (!element) {
					this.initialScrollDone = true;
					return;
				}

				this.activeId = initialHash;
				let userInteracted = false;

				const cleanupListeners = setupInterruptListeners(() => {
					userInteracted = true;
					this.initialScrollDone = true;

					if (cleanupListeners) cleanupListeners();
				});

				const waitPromises = waitForImages(container);
				const utterancesPromise = waitForUtterances();
				if (utterancesPromise) waitPromises.push(utterancesPromise);

				Promise.race([
					Promise.all(waitPromises),
					new Promise((resolve) => setTimeout(resolve, 2_000))
				]).then(() => {
					if (cleanupListeners) cleanupListeners();

					if (!userInteracted) {
						element.scrollIntoView({ behavior: 'smooth' });
						setTimeout(() => {
							this.initialScrollDone = true;
						}, 1_500);
					} else {
						this.initialScrollDone = true;
					}
				});
			} catch (e) {
				console.error('Failed to scroll to hash:', e);
				this.initialScrollDone = true;
			}
		});
	}

	private initObserver(container: HTMLElement) {
		// Destroy previous observer
		if (this.observer) this.observer.disconnect();

		// Find all headings
		const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6') || []);
		if (headings.length === 0) {
			console.debug('No headings found');
			return;
		}

		this.observer = new IntersectionObserver(
			(entries) => {
				if (this.isClickScrolling) return;
				if (!this.initialScrollDone) return;

				let newActiveId = this.activeId;
				let activeIdChanged = false;

				// Find active heading
				for (const entry of entries) {
					if (entry.isIntersecting && entry.target.id) {
						newActiveId = '#' + entry.target.id;
						activeIdChanged = true;
					}
				}

				// Update active heading
				if (activeIdChanged && newActiveId !== this.activeId) {
					this.activeId = newActiveId;
					updateUrlHash(this.activeId);
				}
			},
			{ rootMargin: '0px 0px -80% 0px' }
		);

		// Observe headings in container
		headings.forEach((h) => this.observer!.observe(h));
	}

	handleAnchorClick(e: MouseEvent) {
		// Find anchor in clicked element
		const target = e.target as HTMLElement;
		const anchor = target.closest('a');
		if (!anchor) return;

		// Get anchor id
		const href = anchor.getAttribute('href');
		if (!(href && href.startsWith('#'))) {
			return;
		}
		e.preventDefault();
		let id: string;
		try {
			id = decodeURIComponent(href.slice(1) /* Remove leading # */);
		} catch {
			return;
		}

		// Find the element to scroll to
		const element = document.getElementById(id);
		if (!element) return;

		// Update active heading
		this.activeId = href;
		updateUrlHash(href);

		// Scroll to element smoothly
		this.isClickScrolling = true;
		element.scrollIntoView({ behavior: 'smooth' });
		if (this.clickScrollTimeout) {
			clearTimeout(this.clickScrollTimeout);
		}
		this.clickScrollTimeout = setTimeout(() => {
			this.isClickScrolling = false;
		}, 1_000);
	}

	destroy() {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		if (this.clickScrollTimeout) {
			clearTimeout(this.clickScrollTimeout);
		}
	}
}

/**
 * Update current URL hash
 * @param hash New hash value
 */
function updateUrlHash(hash: string) {
	if (!hash) {
		hash = window.location.pathname + window.location.search;
	}
	replaceState(hash, {});
}

/**
 * Wait for all images to load or fail
 * @param container Target element containing images
 * @returns Array of promises resolving when images are loaded
 */
function waitForImages(container: HTMLElement): Promise<unknown>[] {
	const images = Array.from(container.querySelectorAll('img') || []);
	return images.map((img) => {
		if (img.complete || img.loading === 'lazy') {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			img.addEventListener('load', resolve, { once: true });
			img.addEventListener('error', resolve, { once: true });
		});
	});
}

/**
 * Wait for utterances to load
 * @returns Promise resolving when utterances are loaded
 */
function waitForUtterances(): Promise<unknown> | null {
	const utterancesContainer = document.querySelector('[data-testid="utterances"]');
	if (!utterancesContainer) {
		return null;
	}

	return new Promise((resolve) => {
		const timeout = setTimeout(() => {
			window.removeEventListener('message', handleMessage);
			resolve(null);
		}, 3_000);

		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== 'https://utteranc.es') {
				return;
			}
			if (event.data && event.data.type === 'resize') {
				clearTimeout(timeout);
				window.removeEventListener('message', handleMessage);
				resolve(null);
			}
		};
		window.addEventListener('message', handleMessage);
	});
}

/**
 * Setup listeners for interrupting scroll
 * @param cancelScroll Function to cancel scroll
 * @returns Function to remove listeners
 */
function setupInterruptListeners(cancelScroll: () => void) {
	const onKeydown = (e: KeyboardEvent) => {
		if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown'].includes(e.code)) {
			cancelScroll();
		}
	};

	window.addEventListener('wheel', cancelScroll, { once: true, passive: true });
	window.addEventListener('touchstart', cancelScroll, { once: true, passive: true });
	window.addEventListener('keydown', onKeydown, { once: true, passive: true });

	return () => {
		window.removeEventListener('wheel', cancelScroll);
		window.removeEventListener('touchstart', cancelScroll);
		window.removeEventListener('keydown', onKeydown);
	};
}
