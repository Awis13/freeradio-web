<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { stationsStore } from '$lib/stores/stations.svelte';
	import type { StationSort } from '$lib/types';
	import StationCard from '$lib/components/StationCard.svelte';
	import GenreTag from '$lib/components/GenreTag.svelte';

	const sortOptions: { value: StationSort; label: string }[] = [
		{ value: 'name', label: 'Name' },
		{ value: 'listeners', label: 'Listeners' },
		{ value: 'online_first', label: 'Online First' },
		{ value: 'newest', label: 'Newest' }
	];

	function handleSearch(e: Event) {
		const target = e.target as HTMLInputElement;
		stationsStore.search(target.value);
	}

	function handleSortChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		stationsStore.setSort(target.value as StationSort);
	}

	const rangeStart = $derived(stationsStore.total === 0 ? 0 : stationsStore.page * stationsStore.limit + 1);
	const rangeEnd = $derived(Math.min((stationsStore.page + 1) * stationsStore.limit, stationsStore.total));

	onMount(() => {
		stationsStore.fetch();
		stationsStore.fetchGenres();
		stationsStore.startPolling();
	});

	onDestroy(() => {
		stationsStore.stopPolling();
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

<!-- Search & Sort -->
<div class="toolbar">
	<input
		type="text"
		class="search-input"
		placeholder="Search stations..."
		value={stationsStore.query}
		oninput={handleSearch}
	/>
	<select class="sort-select" value={stationsStore.sort} onchange={handleSortChange}>
		{#each sortOptions as opt}
			<option value={opt.value}>{opt.label}</option>
		{/each}
	</select>
</div>

<!-- Genre filters -->
{#if stationsStore.genres.length > 0}
	<div class="filters">
		<GenreTag
			genre="All"
			active={!stationsStore.selectedGenre}
			onclick={() => stationsStore.setGenre(stationsStore.selectedGenre)}
		/>
		{#each stationsStore.genres as genre}
			<GenreTag
				{genre}
				active={stationsStore.selectedGenre === genre}
				onclick={() => stationsStore.setGenre(genre)}
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
{:else if stationsStore.error}
	<div class="empty">
		<p>{stationsStore.error}</p>
		<button class="reset" onclick={() => stationsStore.fetch()}>Retry</button>
	</div>
{:else if stationsStore.items.length === 0}
	<div class="empty">
		<p>No stations found</p>
		{#if stationsStore.selectedGenre || stationsStore.query}
			<button class="reset" onclick={() => { stationsStore.search(''); stationsStore.setGenre(stationsStore.selectedGenre); }}>Clear filters</button>
		{/if}
	</div>
{:else}
	<div class="grid">
		{#each stationsStore.items as station (station.id)}
			<StationCard {station} />
		{/each}
	</div>

	<!-- Pagination -->
	<div class="pagination">
		<span class="pagination-info">Showing {rangeStart}–{rangeEnd} of {stationsStore.total} stations</span>
		<div class="pagination-buttons">
			<button
				class="reset"
				disabled={stationsStore.page === 0}
				onclick={() => stationsStore.prevPage()}
			>Previous</button>
			<button
				class="reset"
				disabled={!stationsStore.hasMore}
				onclick={() => stationsStore.nextPage()}
			>Next</button>
		</div>
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

	.toolbar {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.search-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-text);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 2px;
		outline: none;
		transition: border-color 150ms ease;
	}

	.search-input::placeholder {
		color: var(--color-text-dim);
	}

	.search-input:focus {
		border-color: var(--accent-color);
	}

	.sort-select {
		padding: 0.5rem 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-text);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 2px;
		outline: none;
		cursor: pointer;
	}

	.sort-select:focus {
		border-color: var(--accent-color);
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

	.reset:hover:not(:disabled) {
		background: rgba(var(--accent-rgb), 0.1);
	}

	.reset:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.pagination-info {
		font-size: 0.8125rem;
		color: var(--color-text-dim);
	}

	.pagination-buttons {
		display: flex;
		gap: 0.5rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
