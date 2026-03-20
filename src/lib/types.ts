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
	now_playing?: string;
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
	error_message?: string;
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

// Billing
export interface BillingStatus {
	tenants: TenantBilling[];
}

export interface TenantBilling {
	tenant_id: string;
	tenant_name: string;
	tier: string;
	limits: TierLimits;
	has_stripe: boolean;
}

export interface TierLimits {
	max_stations: number;
	max_platforms: number;
	max_quality: string;
	watermark: boolean;
	dsp: boolean;
	custom_overlays: boolean;
	analytics: string;
	storage: string;
}

export interface StationListResponse {
	items: Station[];
	total: number;
	limit: number;
	offset: number;
	has_more: boolean;
}

export type StationSort = 'name' | 'listeners' | 'online_first' | 'newest';

export type ThemeId = 'phosphor' | 'amber' | 'neon' | 'vapor' | 'ice' | 'fire';

export interface ThemeConfig {
	id: ThemeId;
	label: string;
	hex: string;
	rgb: string;
}
