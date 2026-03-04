import type { User } from '$lib/types';
import { apiFetch } from '$lib/api/client';

class AuthState {
	user = $state<User | null>(null);
	token = $state<string | null>(null);
	error = $state<string | null>(null);
	loading = $state(false);

	get isAuthenticated(): boolean {
		return !!this.token;
	}

	init() {
		if (typeof window === 'undefined') return;
		const savedToken = localStorage.getItem('freeradio-token');
		const savedUser = localStorage.getItem('freeradio-user');
		if (savedToken) {
			this.token = savedToken;
			if (savedUser) {
				try {
					this.user = JSON.parse(savedUser);
				} catch {
					/* ignore */
				}
			}
		}
	}

	async login(email: string, password: string) {
		this.loading = true;
		this.error = null;
		try {
			const res = await apiFetch<{ token: string; user: User }>('/api/v1/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password })
			});
			this.token = res.token;
			this.user = res.user;
			localStorage.setItem('freeradio-token', res.token);
			localStorage.setItem('freeradio-user', JSON.stringify(res.user));
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Login failed';
			throw e;
		} finally {
			this.loading = false;
		}
	}

	async register(email: string, displayName: string, password: string) {
		this.loading = true;
		this.error = null;
		try {
			const res = await apiFetch<{ token: string; user: User }>('/api/v1/auth/register', {
				method: 'POST',
				body: JSON.stringify({ email, password, display_name: displayName })
			});
			this.token = res.token;
			this.user = res.user;
			localStorage.setItem('freeradio-token', res.token);
			localStorage.setItem('freeradio-user', JSON.stringify(res.user));
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Registration failed';
			throw e;
		} finally {
			this.loading = false;
		}
	}

	logout() {
		this.token = null;
		this.user = null;
		localStorage.removeItem('freeradio-token');
		localStorage.removeItem('freeradio-user');
	}
}

export const authStore = new AuthState();

// Инициализация при импорте модуля — до onMount любого компонента.
// Это фиксит race condition где dashboard проверяет isAuthenticated
// до того как root layout вызовет init() в своём onMount.
authStore.init();
