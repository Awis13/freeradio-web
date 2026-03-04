import type { Station } from '$lib/types';
import { apiFetch } from '$lib/api/client';

class StationsState {
	all = $state<Station[]>([]);
	selectedGenre = $state<string | null>(null);
	loading = $state(false);
	error = $state<string | null>(null);

	get filtered(): Station[] {
		if (!this.selectedGenre) return this.all;
		return this.all.filter((s) => s.genre === this.selectedGenre);
	}

	get genres(): string[] {
		return [...new Set(this.all.map((s) => s.genre).filter(Boolean))].sort();
	}

	get onlineCount(): number {
		return this.all.filter((s) => s.is_online).length;
	}

	get totalListeners(): number {
		return this.all.reduce((sum, s) => sum + (s.listeners_count ?? 0), 0);
	}

	setGenre(genre: string | null) {
		this.selectedGenre = genre;
	}

	async fetch() {
		this.loading = true;
		this.error = null;
		try {
			const data = await apiFetch<Station[]>('/api/v1/stations');
			this.all = data;
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Failed to load stations';
			this.all = [];
		}
		this.loading = false;
	}

	async fetchOne(slug: string): Promise<Station | null> {
		try {
			return await apiFetch<Station>(`/api/v1/stations/${encodeURIComponent(slug)}`);
		} catch {
			return null;
		}
	}
}

export const stationsStore = new StationsState();
