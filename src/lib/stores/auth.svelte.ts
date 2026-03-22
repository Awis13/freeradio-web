import type { User } from '$lib/types';
import { apiFetch } from '$lib/api/client';

interface AuthResponse {
	user: User;
}

class AuthState {
	user = $state<User | null>(null);
	error = $state<string | null>(null);
	loading = $state(false);

	get isAuthenticated(): boolean {
		return !!this.user;
	}

	init() {
		if (typeof window === 'undefined') return;
		const savedUser = localStorage.getItem('freeradio-user');
		if (savedUser) {
			try {
				this.user = JSON.parse(savedUser);
			} catch {
				/* ignore */
			}
		}
	}

	private saveUser(user: User) {
		this.user = user;
		localStorage.setItem('freeradio-user', JSON.stringify(user));
	}

	async login(email: string, password: string) {
		this.loading = true;
		this.error = null;
		try {
			const res = await apiFetch<AuthResponse>('/api/v1/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password })
			});
			this.saveUser(res.user);
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
			const res = await apiFetch<AuthResponse>('/api/v1/auth/register', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			this.saveUser(res.user);
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Registration failed';
			throw e;
		} finally {
			this.loading = false;
		}
	}

	async changePassword(oldPassword: string, newPassword: string) {
		const res = await apiFetch<AuthResponse>('/api/v1/auth/password', {
			method: 'POST',
			body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
		});
		this.saveUser(res.user);
	}

	logout() {
		// Fire-and-forget server logout (cookies sent automatically)
		apiFetch('/api/v1/auth/logout', {
			method: 'POST',
			body: JSON.stringify({})
		}).catch(() => {});
		this.user = null;
		localStorage.removeItem('freeradio-user');
	}
}

export const authStore = new AuthState();

// Initialize on module import — before any component's onMount.
authStore.init();
