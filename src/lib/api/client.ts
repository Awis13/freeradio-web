import { env } from '$env/dynamic/public';

function getApiBase(): string {
	return env.PUBLIC_CP_API_URL ?? 'http://localhost:8085';
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

	if (!res.ok) {
		const contentType = res.headers.get('content-type') ?? '';
		if (contentType.includes('application/json')) {
			const json = await res.json().catch(() => ({}));
			throw new Error(json.error ?? `Request failed (${res.status})`);
		}
		throw new Error(`Request failed (${res.status})`);
	}

	return res.json() as Promise<T>;
}
