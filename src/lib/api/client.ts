const API_BASE = import.meta.env.VITE_CP_API_URL ?? 'http://localhost:8080';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		headers: {
			'Content-Type': 'application/json',
			...init?.headers
		},
		...init
	});

	if (!res.ok) {
		throw new Error(`API ${res.status}: ${res.statusText}`);
	}

	return res.json() as Promise<T>;
}
