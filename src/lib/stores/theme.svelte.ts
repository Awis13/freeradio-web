import { themes, themeOrder } from '$lib/data/themes';
import type { ThemeId, ThemeConfig } from '$lib/types';

class ThemeState {
	current = $state<ThemeId>('phosphor');

	get label(): string {
		return themes[this.current].label;
	}

	get config(): ThemeConfig {
		return themes[this.current];
	}

	init() {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem('freeradio-theme') as ThemeId | null;
		if (saved && themes[saved]) {
			this.current = saved;
		}
		this.apply();
	}

	set(id: ThemeId) {
		this.current = id;
		this.apply();
		if (typeof window !== 'undefined') {
			localStorage.setItem('freeradio-theme', id);
		}
	}

	cycle() {
		const i = themeOrder.indexOf(this.current);
		this.set(themeOrder[(i + 1) % themeOrder.length]);
	}

	private apply() {
		if (typeof document === 'undefined') return;
		const t = themes[this.current];
		document.documentElement.style.setProperty('--accent-color', t.hex);
		document.documentElement.style.setProperty('--accent-rgb', t.rgb);
	}
}

export const themeStore = new ThemeState();
