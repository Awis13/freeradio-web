<script lang="ts">
	import { onMount } from 'svelte';
	import { stationsStore } from '$lib/stores/stations.svelte';
	import StationCard from '$lib/components/StationCard.svelte';
	import GenreTag from '$lib/components/GenreTag.svelte';

	onMount(() => {
		stationsStore.fetch();
	});
</script>

<svelte:head>
	<title>Explore Stations — STUDIO 23</title>
</svelte:head>

<div class="header">
	<div>
		<h1 class="title">Explore Stations</h1>
		<p class="subtitle">
			{stationsStore.onlineCount} stations online · {stationsStore.totalListeners} listeners
		</p>
	</div>
</div>

<!-- Genre filters -->
{#if stationsStore.genres.length > 0}
	<div class="filters">
		<GenreTag
			genre="All"
			active={!stationsStore.selectedGenre}
			onclick={() => stationsStore.setGenre(null)}
		/>
		{#each stationsStore.genres as genre}
			<GenreTag
				{genre}
				active={stationsStore.selectedGenre === genre}
				onclick={() => stationsStore.setGenre(stationsStore.selectedGenre === genre ? null : genre)}
			/>
		{/each}
	</div>
{/if}

<!-- Station grid -->
{#if stationsStore.loading}
	<div class="loading">
		<div class="spinner"></div>
		<span>Loading stations...</span>
	</div>
{:else if stationsStore.filtered.length === 0}
	<div class="empty">
		<p>No stations found</p>
		{#if stationsStore.selectedGenre}
			<button class="reset" onclick={() => stationsStore.setGenre(null)}>Show all stations</button>
		{/if}
	</div>
{:else}
	<div class="grid">
		{#each stationsStore.filtered as station (station.id)}
			<StationCard {station} />
		{/each}
	</div>
{/if}

<style>
	.header {
		margin-bottom: 1.5rem;
	}

	.title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.25rem;
	}

	.subtitle {
		font-size: 0.8125rem;
		color: var(--color-text-dim);
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.25rem;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 4rem 0;
		color: var(--color-text-dim);
		font-size: 0.8125rem;
	}

	.spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid var(--color-border);
		border-top-color: var(--accent-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.empty {
		text-align: center;
		padding: 4rem 0;
		color: var(--color-text-dim);
	}

	.reset {
		margin-top: 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--accent-color);
		background: none;
		border: 1px solid var(--accent-color);
		padding: 0.375rem 0.75rem;
		border-radius: 2px;
		cursor: pointer;
	}

	.reset:hover {
		background: rgba(var(--accent-rgb), 0.1);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
