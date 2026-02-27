export interface Station {
	id: string;
	name: string;
	slug: string;
	genre: string;
	description: string;
	artwork_url: string;
	stream_url: string;
	owner_id?: string;
	tenant_id?: string;
	is_public: boolean;
	is_online: boolean;
	listeners_count?: number;
	bpm?: number;
	created_at: string;
	updated_at: string;
}

export interface User {
	id: string;
	email: string;
	display_name: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export interface Tenant {
	id: string;
	name: string;
	subdomain: string;
	status: string;
	owner_id?: string;
	health_status: string;
	created_at: string;
	updated_at: string;
}

export interface TenantListResponse {
	items: Tenant[];
	total: number;
	limit: number;
	offset: number;
	has_more: boolean;
}

export type ThemeId = 'phosphor' | 'amber' | 'neon' | 'vapor' | 'ice' | 'fire';

export interface ThemeConfig {
	id: ThemeId;
	label: string;
	hex: string;
	rgb: string;
}
