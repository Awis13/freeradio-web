<script lang="ts">
	import { onMount } from 'svelte';
	import type { Station } from '$lib/types';
	import { stationsStore } from '$lib/stores/stations.svelte';
	import { playerStore } from '$lib/stores/player.svelte';
	import Button from '$lib/components/Button.svelte';
	import PlayingIndicator from '$lib/components/PlayingIndicator.svelte';

	let { data } = $props();

	let station = $state<Station | null>(null);
	let loading = $state(true);

	const isCurrentlyPlaying = $derived(
		station && playerStore.station?.id === station.id && playerStore.isPlaying
	);

	onMount(async () => {
		station = await stationsStore.fetchOne(data.slug);
		loading = false;
	});

	function handlePlay() {
		if (!station) return;
		if (isCurrentlyPlaying) {
			playerStore.toggle();
		} else {
			playerStore.play(station);
		}
	}
</script>

<svelte:head>
	<title>{station ? `${station.name} — STUDIO 23` : 'Station — STUDIO 23'}</title>
</svelte:head>

{#if loading}
	<div class="loading">
		<div class="spinner"></div>
	</div>
{:else if !station}
	<div class="not-found">
		<h1>Station not found</h1>
		<p>The station you're looking for doesn't exist or is no longer available.</p>
		<Button href="/explore" variant="secondary">Back to Explore</Button>
	</div>
{:else}
	<div class="station">
		<!-- Artwork -->
		<div class="artwork">
			<div class="artwork-inner">
				{station.name.charAt(0)}
			</div>
		</div>

		<!-- Info -->
		<div class="info">
			<div class="meta-row">
				<span class="genre">{station.genre}</span>
				{#if station.is_online}
					<span class="live-badge">LIVE</span>
				{:else}
					<span class="offline-badge">OFFLINE</span>
				{/if}
			</div>

			<h1 class="name">{station.name}</h1>
			<p class="desc">{station.description}</p>

			<div class="stats">
				{#if station.bpm}
					<div class="stat">
						<span class="stat-val">{station.bpm}</span>
						<span class="stat-label">BPM</span>
					</div>
				{/if}
				{#if station.listeners_count != null}
					<div class="stat">
						<span class="stat-val">{station.listeners_count}</span>
						<span class="stat-label">Listeners</span>
					</div>
				{/if}
			</div>

			{#if station.is_online}
				<div class="play-section">
					<button class="play-btn" onclick={handlePlay}>
						{#if isCurrentlyPlaying}
							<PlayingIndicator size="md" />
							<span>Now Playing</span>
						{:else}
							<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<polygon points="5,3 19,12 5,21" />
							</svg>
							<span>Play Station</span>
						{/if}
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.station {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		align-items: start;
	}

	.artwork {
		aspect-ratio: 1;
		max-width: 400px;
		border-radius: 0.25rem;
		overflow: hidden;
		border: 1px solid var(--color-border);
	}

	.artwork-inner {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 6rem;
		font-weight: 800;
		color: rgba(var(--accent-rgb), 0.12);
		background: linear-gradient(135deg, var(--color-bg), var(--color-surface));
	}

	.meta-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.genre {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent-color);
	}

	.live-badge {
		padding: 0.125rem 0.5rem;
		font-size: 0.625rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: #0b0f14;
		background: var(--accent-color);
		border-radius: 2px;
	}

	.offline-badge {
		padding: 0.125rem 0.5rem;
		font-size: 0.625rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--color-text-dim);
		border: 1px solid var(--color-border);
		border-radius: 2px;
	}

	.name {
		font-size: 2rem;
		font-weight: 800;
		color: var(--color-text);
		margin-bottom: 0.75rem;
		line-height: 1.1;
	}

	.desc {
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	.stats {
		display: flex;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
	}

	.stat-val {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.stat-label {
		font-size: 0.6875rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-text-dim);
	}

	.play-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #0b0f14;
		background: var(--accent-color);
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 150ms ease;
	}

	.play-btn:hover {
		filter: brightness(1.1);
		box-shadow: 0 0 30px rgba(var(--accent-rgb), 0.4);
	}

	.loading {
		display: flex;
		justify-content: center;
		padding: 6rem 0;
	}

	.spinner {
		width: 2.5rem;
		height: 2.5rem;
		border: 2px solid var(--color-border);
		border-top-color: var(--accent-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.not-found {
		text-align: center;
		padding: 4rem 0;
	}

	.not-found h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.75rem;
	}

	.not-found p {
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.station {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.artwork {
			max-width: 100%;
			aspect-ratio: 16 / 9;
		}
	}
</style>
