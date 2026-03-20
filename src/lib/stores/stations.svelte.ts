import { apiFetch } from '$lib/api/client';
import type { Station, StationListResponse, StationSort } from '$lib/types';

class StationsState {
	items = $state<Station[]>([]);
	loading = $state(false);
	error = $state<string | null>(null);

	// Query state
	query = $state('');
	selectedGenre = $state('');
	sort = $state<StationSort>('name');
	page = $state(0);
	limit = $state(20);
	total = $state(0);
	hasMore = $state(false);

	// Genres
	genres = $state<string[]>([]);

	// Polling
	private pollTimer: ReturnType<typeof setInterval> | null = null;
	private searchTimer: ReturnType<typeof setTimeout> | null = null;

	// Derived
	onlineCount = $derived(this.items.filter((s) => s.is_online).length);
	totalListeners = $derived(this.items.reduce((sum, s) => sum + (s.listeners_count || 0), 0));

	async fetch() {
		this.loading = true;
		this.error = null;
		try {
			const params = new URLSearchParams();
			if (this.query) params.set('q', this.query);
			if (this.selectedGenre) params.set('genre', this.selectedGenre);
			if (this.sort !== 'name') params.set('sort', this.sort);
			params.set('limit', String(this.limit));
			params.set('offset', String(this.page * this.limit));

			const qs = params.toString();
			const data = await apiFetch<StationListResponse>(`/api/v1/stations${qs ? '?' + qs : ''}`);
			this.items = data.items || [];
			this.total = data.total;
			this.hasMore = data.has_more;
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Failed to load stations';
			this.items = [];
		} finally {
			this.loading = false;
		}
	}

	async fetchGenres() {
		try {
			this.genres = await apiFetch<string[]>('/api/v1/stations/genres');
		} catch {
			// Non-critical, genre buttons just won't show
		}
	}

	search(q: string) {
		this.query = q;
		this.page = 0;
		if (this.searchTimer) clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => this.fetch(), 300);
	}

	setGenre(genre: string) {
		this.selectedGenre = this.selectedGenre === genre ? '' : genre;
		this.page = 0;
		this.fetch();
	}

	setSort(sort: StationSort) {
		this.sort = sort;
		this.page = 0;
		this.fetch();
	}

	nextPage() {
		if (this.hasMore) {
			this.page++;
			this.fetch();
		}
	}

	prevPage() {
		if (this.page > 0) {
			this.page--;
			this.fetch();
		}
	}

	startPolling() {
		this.stopPolling();
		this.pollTimer = setInterval(() => this.fetch(), 30000);
	}

	stopPolling() {
		if (this.pollTimer) {
			clearInterval(this.pollTimer);
			this.pollTimer = null;
		}
	}

	async fetchOne(slug: string): Promise<Station | null> {
		try {
			return await apiFetch<Station>(`/api/v1/stations/${slug}`);
		} catch {
			return null;
		}
	}
}

export const stationsStore = new StationsState();
