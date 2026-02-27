const API_BASE = import.meta.env.VITE_CP_API_URL ?? 'http://localhost:8080';

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

	const res = await fetch(`${API_BASE}${path}`, {
		...init,
		headers: { ...headers, ...(init?.headers as Record<string, string>) }
	});

	if (!res.ok) {
		const body = await res.text().catch(() => '');
		throw new Error(body || `API ${res.status}: ${res.statusText}`);
	}

	return res.json() as Promise<T>;
}
