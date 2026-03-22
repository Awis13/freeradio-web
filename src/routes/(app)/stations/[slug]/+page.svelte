<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Station } from '$lib/types';
	import { stationsStore } from '$lib/stores/stations.svelte';
	import { playerStore } from '$lib/stores/player.svelte';
	import Button from '$lib/components/Button.svelte';
	import PlayingIndicator from '$lib/components/PlayingIndicator.svelte';

	let { data } = $props();

	let station = $state<Station | null>(null);
	let loading = $state(true);
	let pollTimer: ReturnType<typeof setInterval> | null = null;

	const isCurrentlyPlaying = $derived(
		station && playerStore.station?.id === station.id && playerStore.isPlaying
	);

	const displayName = $derived(
		station ? (/^\d+$/.test(station.name) ? `Station #${station.name}` : station.name) : ''
	);

	async function fetchStation() {
		const result = await stationsStore.fetchOne(data.slug);
		if (result) station = result;
		return result;
	}

	onMount(async () => {
		const result = await fetchStation();
		loading = false;
		if (result) {
			// Поллинг каждые 30 секунд для обновления now_playing и listeners
			pollTimer = setInterval(() => fetchStation(), 30000);
		}
	});

	onDestroy(() => {
		if (pollTimer) {
			clearInterval(pollTimer);
			pollTimer = null;
		}
	});

	function handlePlay() {
		if (!station) return;
		if (isCurrentlyPlaying) {
			playerStore.toggle();
		} else {
			playerStore.play(station);
		}
	}

	function formatUptime(dateStr: string): string {
		const diff = Date.now() - new Date(dateStr).getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const days = Math.floor(hours / 24);
		if (days > 0) return `${days}d ${hours % 24}h`;
		if (hours > 0) return `${hours}h`;
		const mins = Math.floor(diff / (1000 * 60));
		return `${mins}m`;
	}
</script>

<svelte:head>
	<title>{station ? `${displayName} — STUDIO 23` : 'Station — STUDIO 23'}</title>
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
	<a href="/explore" class="back-link">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
			<polyline points="15 18 9 12 15 6" />
		</svg>
		Back to Explore
	</a>

	<div class="station">
		<!-- Artwork -->
		<div class="artwork">
			{#if station.artwork_url}
				<img class="artwork-img" src={station.artwork_url} alt={displayName} />
			{:else}
				<div class="artwork-inner">
					{displayName.charAt(0)}
				</div>
			{/if}
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

			<h1 class="name">{displayName}</h1>
			<p class="desc">{station.description}</p>

			{#if station.now_playing}
				<div class="now-playing-section">
					<span class="now-playing-label">Now Playing</span>
					<p class="now-playing">{station.now_playing}</p>
				</div>
			{/if}

			<div class="stats">
				{#if station.listeners_count != null}
					<div class="stat">
						<span class="stat-val">{station.listeners_count}</span>
						<span class="stat-label">Listeners</span>
					</div>
				{/if}
				{#if station.bpm}
					<div class="stat">
						<span class="stat-val">{Math.round(station.bpm)}</span>
						<span class="stat-label">BPM</span>
					</div>
				{/if}
				{#if station.is_online && station.updated_at}
					<div class="stat">
						<span class="stat-val">{formatUptime(station.updated_at)}</span>
						<span class="stat-label">Online</span>
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
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		color: var(--color-text-dim);
		text-decoration: none;
		margin-bottom: 2rem;
		transition: color 150ms ease;
	}

	.back-link:hover {
		color: var(--accent-color);
	}

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

	.artwork-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
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

	.now-playing-section {
		margin-bottom: 1.5rem;
		padding: 0.75rem 1rem;
		background: rgba(var(--accent-rgb), 0.05);
		border: 1px solid rgba(var(--accent-rgb), 0.1);
		border-radius: 0.25rem;
	}

	.now-playing-label {
		font-size: 0.625rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-dim);
	}

	.now-playing {
		font-size: 0.875rem;
		color: var(--accent-color);
		margin-top: 0.25rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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

		.name {
			font-size: 1.5rem;
		}

		.stats {
			gap: 1.25rem;
		}

		.stat-val {
			font-size: 1.25rem;
		}
	}
</style>
