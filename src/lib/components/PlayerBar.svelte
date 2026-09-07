<script lang="ts">
	import { playerStore } from '$lib/stores/player.svelte';
	import PlayingIndicator from './PlayingIndicator.svelte';
	import VolumeSlider from './VolumeSlider.svelte';

	let audioEl: HTMLAudioElement | undefined = $state();

	// Bind the audio element to the store. Clears the reference on unmount so the
	// store never holds a stale element.
	$effect(() => {
		const el = audioEl;
		if (el) {
			playerStore.bindAudio(el);
			return () => {
				if (playerStore.audio === el) {
					playerStore.audio = null;
				}
			};
		}
	});

	// Station-scoped controller — the single source of truth for playback.
	// Owns source attach, HLS lifecycle, media events, buffering and teardown.
	// Re-runs only when the station or the audio element changes, so toggling
	// play/pause never tears down the source. `isPlaying` is confirmed only by a
	// real `playing` media event; a rejected play() never leaves the UI "Playing".
	$effect(() => {
		const station = playerStore.station;
		const audio = playerStore.audio;
		if (!station || !audio) return;

		let disposed = false;
		let hls: import('hls.js').default | null = null;

		const url = station.stream_url;
		const isHls = url.endsWith('.m3u8');

		const onPlaying = () => {
			if (disposed) return;
			playerStore.isPlaying = true;
			playerStore.buffering = false;
			playerStore.error = null;
		};
		const onWaiting = () => {
			if (disposed) return;
			playerStore.buffering = true;
		};
		const onError = () => {
			if (disposed) return;
			playerStore.error = 'Playback error';
			playerStore.isPlaying = false;
			playerStore.buffering = false;
		};
		const onPause = () => {
			if (disposed) return;
			playerStore.isPlaying = false;
			playerStore.buffering = false;
		};

		audio.addEventListener('playing', onPlaying);
		audio.addEventListener('waiting', onWaiting);
		audio.addEventListener('error', onError);
		audio.addEventListener('pause', onPause);

		if (isHls) {
			// Client-only dynamic import: hls.js is never bundled or executed on the
			// server. Late callbacks from a previous station are ignored via `disposed`.
			import('hls.js').then(({ default: HlsCtor }) => {
				if (disposed) return;
				if (!HlsCtor.isSupported()) {
					playerStore.error = 'HLS is not supported in this browser';
					return;
				}
				hls = new HlsCtor();
				hls.on(HlsCtor.Events.MANIFEST_PARSED, () => {
					if (disposed) return;
					if (playerStore.playRequested) {
						audio.play().catch(() => {
							playerStore.isPlaying = false;
							playerStore.buffering = false;
						});
					}
				});
				hls.on(HlsCtor.Events.ERROR, (_evt, data) => {
					if (disposed) return;
					if (data.fatal) {
						playerStore.error = 'Stream error';
						playerStore.isPlaying = false;
						playerStore.buffering = false;
					}
				});
				hls.loadSource(url);
				hls.attachMedia(audio);
			});
		} else {
			audio.src = url;
		}

		return () => {
			disposed = true;
			audio.removeEventListener('playing', onPlaying);
			audio.removeEventListener('waiting', onWaiting);
			audio.removeEventListener('error', onError);
			audio.removeEventListener('pause', onPause);
			if (hls) {
				hls.destroy();
				hls = null;
			}
			audio.pause();
			audio.removeAttribute('src');
			audio.load();
		};
	});

	// Play/pause intent bridge. Reacts to toggle() and to station switches (so a
	// freshly attached source is played) without owning the HLS lifecycle. A
	// rejected play() never leaves the UI in the "Playing" state.
	$effect(() => {
		const audio = playerStore.audio;
		// Re-run when the station changes so a newly attached source is played.
		void playerStore.station;
		if (!audio) return;
		if (playerStore.playRequested) {
			audio.play().catch(() => {
				playerStore.isPlaying = false;
				playerStore.buffering = false;
			});
		} else {
			audio.pause();
		}
	});
</script>

{#if playerStore.station}
<div class="bar active">
	<audio bind:this={audioEl} crossorigin="anonymous"></audio>

	<div class="inner">
		<div class="info">
			{#if playerStore.isPlaying}
				<PlayingIndicator />
			{/if}
			<div class="meta">
				<span class="name">{playerStore.station.name}</span>
				<span class="genre">{playerStore.station.genre}</span>
			</div>
		</div>

		<div class="controls">
			<button class="play-btn" onclick={() => playerStore.toggle()}>
				{#if playerStore.isPlaying}
					<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
						<rect x="6" y="4" width="4" height="16" rx="1" />
						<rect x="14" y="4" width="4" height="16" rx="1" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
						<polygon points="5,3 19,12 5,21" />
					</svg>
				{/if}
			</button>

			<button class="stop-btn" onclick={() => playerStore.stop()} aria-label="Stop">
				<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
					<rect x="4" y="4" width="16" height="16" rx="2" />
				</svg>
			</button>

			<VolumeSlider
				value={playerStore.volume}
				onchange={(v) => playerStore.setVolume(v)}
			/>
		</div>
	</div>
</div>
{/if}

<style>
	.bar {
		border-top: 1px solid var(--color-border);
		background: var(--color-surface);
		padding: 0 1.5rem;
	}

	.inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 3.5rem;
		gap: 1rem;
	}

	.info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		min-width: 0;
	}

	.name {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.genre {
		font-size: 0.6875rem;
		color: var(--accent-color);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.play-btn,
	.stop-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		color: var(--color-text-muted);
		cursor: pointer;
		padding: 0.25rem;
		transition: color 150ms ease;
	}

	.play-btn:hover,
	.stop-btn:hover {
		color: var(--accent-color);
	}

	.play-btn {
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--color-border-light);
		border-radius: 50%;
	}

	.play-btn:hover {
		border-color: var(--accent-color);
	}

	@media (max-width: 640px) {
		.genre {
			display: none;
		}
	}
</style>
