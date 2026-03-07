import { env } from '$env/dynamic/public';

function getApiBase(): string {
	return env.PUBLIC_CP_API_URL ?? 'http://localhost:8085';
}

export function getTenantDomain(): string {
	return env.PUBLIC_TENANT_DOMAIN ?? 'studio23.home.lan';
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
	if (isRefreshing && refreshPromise) return refreshPromise;

	isRefreshing = true;
	refreshPromise = (async () => {
		const refreshToken = localStorage.getItem('freeradio-refresh-token');
		if (!refreshToken) return false;

		try {
			const res = await fetch(`${getApiBase()}/api/v1/auth/refresh`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh_token: refreshToken })
			});

			if (!res.ok) return false;

			const data = await res.json();
			localStorage.setItem('freeradio-token', data.token);
			localStorage.setItem('freeradio-refresh-token', data.refresh_token);
			if (data.user) {
				localStorage.setItem('freeradio-user', JSON.stringify(data.user));
			}
			return true;
		} catch {
			return false;
		} finally {
			isRefreshing = false;
			refreshPromise = null;
		}
	})();

	return refreshPromise;
}

function clearAuth() {
	localStorage.removeItem('freeradio-token');
	localStorage.removeItem('freeradio-refresh-token');
	localStorage.removeItem('freeradio-user');
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('freeradio-token');
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
	}

	const res = await fetch(`${getApiBase()}${path}`, {
		...init,
		headers: { ...headers, ...(init?.headers as Record<string, string>) }
	});

	// On 401, try refreshing the token once
	if (res.status === 401 && typeof window !== 'undefined') {
		const refreshed = await tryRefresh();
		if (refreshed) {
			const newToken = localStorage.getItem('freeradio-token');
			const retryHeaders = {
				...headers,
				...(init?.headers as Record<string, string>),
				Authorization: `Bearer ${newToken}`
			};
			const retry = await fetch(`${getApiBase()}${path}`, {
				...init,
				headers: retryHeaders
			});

			if (retry.ok) {
				return retry.json() as Promise<T>;
			}

			// Retry also failed — clear auth and redirect
			if (retry.status === 401) {
				clearAuth();
				window.location.href = '/login?expired=1';
				throw new Error('Session expired');
			}

			return handleError(retry);
		}

		// Refresh failed — clear auth and redirect
		clearAuth();
		window.location.href = '/login?expired=1';
		throw new Error('Session expired');
	}

	if (!res.ok) {
		return handleError(res);
	}

	return res.json() as Promise<T>;
}

async function handleError(res: Response): Promise<never> {
	const contentType = res.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) {
		const json = await res.json().catch(() => ({}));
		throw new Error(json.error ?? `Request failed (${res.status})`);
	}
	throw new Error(`Request failed (${res.status})`);
}
