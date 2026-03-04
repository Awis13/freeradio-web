<script lang="ts">
	import { playerStore } from '$lib/stores/player.svelte';
	import PlayingIndicator from './PlayingIndicator.svelte';
	import VolumeSlider from './VolumeSlider.svelte';
	import Hls from 'hls.js';

	let audioEl: HTMLAudioElement | undefined = $state();
	let hls: Hls | null = null;

	$effect(() => {
		if (audioEl) {
			playerStore.bindAudio(audioEl);
		}
	});

	$effect(() => {
		const station = playerStore.station;
		if (!station || !audioEl) return;

		if (hls) {
			hls.destroy();
			hls = null;
		}

		const url = station.stream_url;
		if (url.endsWith('.m3u8') && Hls.isSupported()) {
			hls = new Hls();
			hls.loadSource(url);
			hls.attachMedia(audioEl);
		} else {
			audioEl.src = url;
		}
	});

	$effect(() => {
		if (!audioEl) return;
		if (playerStore.isPlaying) {
			audioEl.play().catch(() => {});
		} else {
			audioEl.pause();
		}
	});

	$effect(() => {
		if (audioEl) {
			audioEl.volume = playerStore.volume;
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
