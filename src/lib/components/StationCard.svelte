<script lang="ts">
	import type { Station } from '$lib/types';
	import { playerStore } from '$lib/stores/player.svelte';
	import PlayingIndicator from './PlayingIndicator.svelte';

	let { station }: { station: Station } = $props();

	const isCurrentlyPlaying = $derived(
		playerStore.station?.id === station.id && playerStore.isPlaying
	);

	const displayName = $derived(
		/^\d+$/.test(station.name) ? `Station #${station.name}` : station.name
	);

	function handlePlay(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		if (isCurrentlyPlaying) {
			playerStore.toggle();
		} else {
			playerStore.play(station);
		}
	}
</script>

<a href="/stations/{station.slug}" class="card">
	<div class="artwork">
		<div class="artwork-inner">
			{displayName.charAt(0)}
		</div>
		{#if station.is_online}
			<span class="live-badge">LIVE</span>
		{/if}
	</div>

	<div class="body">
		<div class="header">
			<h3 class="name">{displayName}</h3>
			{#if isCurrentlyPlaying}
				<PlayingIndicator />
			{/if}
		</div>

		<span class="genre">{station.genre}</span>

		<p class="desc">{station.description}</p>

		{#if station.now_playing}
			<p class="now-playing">{station.now_playing}</p>
		{/if}

		<div class="footer">
			<div class="stats">
				{#if station.bpm}
					<span class="stat">{Math.round(station.bpm)} BPM</span>
				{/if}
				{#if station.listeners_count != null}
					<span class="stat">{station.listeners_count} listeners</span>
				{/if}
			</div>

			{#if station.is_online}
				<button class="play-btn" onclick={handlePlay}>
					{#if isCurrentlyPlaying}
						PAUSE
					{:else}
						PLAY
					{/if}
				</button>
			{:else}
				<span class="offline">OFFLINE</span>
			{/if}
		</div>
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: all 200ms ease;
	}

	.card:hover {
		border-color: rgba(var(--accent-rgb), 0.3);
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.artwork {
		position: relative;
		aspect-ratio: 16 / 9;
		background: var(--color-bg);
		overflow: hidden;
	}

	.artwork-inner {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
		font-weight: 700;
		color: rgba(var(--accent-rgb), 0.15);
		background: linear-gradient(135deg, var(--color-bg), var(--color-surface));
	}

	.live-badge {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.125rem 0.5rem;
		font-size: 0.625rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: #0b0f14;
		background: var(--accent-color);
		border-radius: 2px;
	}

	.body {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		flex: 1;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.name {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
	}

	.genre {
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--accent-color);
	}

	.desc {
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-text-muted);
		margin: 0.25rem 0 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.now-playing {
		font-size: 0.75rem;
		color: var(--accent-color);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
		padding-top: 0.75rem;
	}

	.stats {
		display: flex;
		gap: 0.75rem;
	}

	.stat {
		font-size: 0.6875rem;
		color: var(--color-text-dim);
	}

	.play-btn {
		padding: 0.25rem 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: #0b0f14;
		background: var(--accent-color);
		border: none;
		border-radius: 2px;
		cursor: pointer;
		transition: all 150ms ease;
	}

	.play-btn:hover {
		filter: brightness(1.1);
		box-shadow: 0 0 12px rgba(var(--accent-rgb), 0.4);
	}

	.offline {
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--color-text-dim);
	}
</style>
