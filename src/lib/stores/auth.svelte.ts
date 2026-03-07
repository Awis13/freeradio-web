import type { User } from '$lib/types';
import { apiFetch } from '$lib/api/client';

interface AuthTokenResponse {
	token: string;
	refresh_token: string;
	expires_in: number;
	user: User;
}

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

	private saveTokens(res: AuthTokenResponse) {
		this.token = res.token;
		this.user = res.user;
		localStorage.setItem('freeradio-token', res.token);
		localStorage.setItem('freeradio-refresh-token', res.refresh_token);
		localStorage.setItem('freeradio-user', JSON.stringify(res.user));
	}

	async login(email: string, password: string) {
		this.loading = true;
		this.error = null;
		try {
			const res = await apiFetch<AuthTokenResponse>('/api/v1/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password })
			});
			this.saveTokens(res);
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Login failed';
			throw e;
		} finally {
			this.loading = false;
		}
	}

	async register(email: string, displayName: string, password: string, registrationToken?: string) {
		this.loading = true;
		this.error = null;
		try {
			const payload: Record<string, string> = { email, password, display_name: displayName };
			if (registrationToken) {
				payload.registration_token = registrationToken;
			}
			const res = await apiFetch<AuthTokenResponse>('/api/v1/auth/register', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			this.saveTokens(res);
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Registration failed';
			throw e;
		} finally {
			this.loading = false;
		}
	}

	async changePassword(oldPassword: string, newPassword: string) {
		const res = await apiFetch<AuthTokenResponse>('/api/v1/auth/password', {
			method: 'POST',
			body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
		});
		this.saveTokens(res);
	}

	logout() {
		const refreshToken = localStorage.getItem('freeradio-refresh-token');
		// Fire-and-forget server logout
		if (this.token) {
			apiFetch('/api/v1/auth/logout', {
				method: 'POST',
				body: JSON.stringify({ refresh_token: refreshToken ?? undefined })
			}).catch(() => {});
		}
		this.token = null;
		this.user = null;
		localStorage.removeItem('freeradio-token');
		localStorage.removeItem('freeradio-refresh-token');
		localStorage.removeItem('freeradio-user');
	}
}

export const authStore = new AuthState();

// Initialize on module import — before any component's onMount.
// Fixes race condition where dashboard checks isAuthenticated
// before root layout calls init() in its onMount.
authStore.init();
