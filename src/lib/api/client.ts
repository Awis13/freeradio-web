import { env } from '$env/dynamic/public';

function getApiBase(): string {
	return env.PUBLIC_CP_API_URL ?? 'http://localhost:8085';
}

export function getTenantDomain(): string {
	return env.PUBLIC_TENANT_DOMAIN ?? 'localhost';
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
	if (isRefreshing && refreshPromise) return refreshPromise;

	isRefreshing = true;
	refreshPromise = (async () => {
		try {
			const res = await fetch(`${getApiBase()}/api/v1/auth/refresh`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({})
			});

			if (!res.ok) return false;

			const data = await res.json();
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
	localStorage.removeItem('freeradio-user');
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${getApiBase()}${path}`, {
		...init,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers as Record<string, string>)
		}
	});

	// On 401, try refreshing the token once (skip for auth endpoints)
	const isAuthEndpoint = path.startsWith('/api/v1/auth/');
	if (res.status === 401 && typeof window !== 'undefined' && !isAuthEndpoint) {
		const refreshed = await tryRefresh();
		if (refreshed) {
			// Retry — server set new access_token cookie
			const retry = await fetch(`${getApiBase()}${path}`, {
				...init,
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...(init?.headers as Record<string, string>)
				}
			});

			if (retry.ok) {
				return retry.json() as Promise<T>;
			}

			if (retry.status === 401) {
				clearAuth();
				window.location.href = '/login?expired=1';
				throw new Error('Session expired');
			}

			return handleError(retry);
		}

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
