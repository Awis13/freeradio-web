<script lang="ts">
	import { onMount } from 'svelte';
	import { playerStore } from '$lib/stores/player.svelte';
	import type { Station } from '$lib/types';

	let stations = $state<Record<string, Station>>({});

	onMount(() => {
		const o = window.location.origin;
		const mk = (id: string, name: string, url: string): Station => ({
			id,
			name,
			slug: id,
			genre: 'test',
			description: '',
			artwork_url: '',
			stream_url: url,
			is_public: true,
			is_online: true,
			created_at: '',
			updated_at: ''
		});
		stations = {
			a: mk('a', 'Station A (WAV)', `${o}/__test/fixtures/a.wav`),
			b: mk('b', 'Station B (WAV)', `${o}/__test/fixtures/b.wav`),
			hls: mk('hls', 'Station HLS', `${o}/__test/fixtures/hls/index.m3u8?token=test123`)
		};
		// Expose the store for Playwright assertions.
		(window as unknown as Record<string, unknown>).__player = playerStore;
	});

	function playA() {
		if (stations.a) playerStore.play(stations.a);
	}
	function playB() {
		if (stations.b) playerStore.play(stations.b);
	}
	function playHls() {
		if (stations.hls) playerStore.play(stations.hls);
	}
</script>

<div class="harness">
	<h1>Player test harness</h1>
	<div class="state" data-testid="state">
		<p>station: <span data-testid="station">{playerStore.station?.name ?? 'none'}</span></p>
		<p>isPlaying: <span data-testid="isPlaying">{String(playerStore.isPlaying)}</span></p>
		<p>buffering: <span data-testid="buffering">{String(playerStore.buffering)}</span></p>
		<p>error: <span data-testid="error">{playerStore.error ?? 'none'}</span></p>
	</div>
	<div class="controls">
		<button data-testid="play-a" onclick={playA}>Play A (WAV)</button>
		<button data-testid="play-b" onclick={playB}>Play B (WAV)</button>
		<button data-testid="play-hls" onclick={playHls}>Play HLS</button>
		<button data-testid="toggle" onclick={() => playerStore.toggle()}>Toggle</button>
		<button data-testid="stop" onclick={() => playerStore.stop()}>Stop</button>
	</div>
</div>

<style>
	.harness {
		padding: 1rem;
		font-family: var(--font-mono);
	}
	.state p {
		margin: 0.25rem 0;
	}
	.controls {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}
	.controls button {
		padding: 0.5rem 1rem;
		cursor: pointer;
	}
</style>
