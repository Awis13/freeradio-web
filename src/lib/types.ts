export interface Station {
	id: string;
	name: string;
	slug: string;
	genre: string;
	description: string;
	artwork_url?: string;
	stream_url: string;
	listeners_count: number;
	is_online: boolean;
	bpm?: number;
	owner_id: string;
}

export interface User {
	id: string;
	username: string;
	email: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export interface Tenant {
	id: string;
	station_id: string;
	station_name: string;
	station_slug: string;
	status: 'pending' | 'provisioning' | 'ready' | 'error';
	dashboard_url?: string;
}

export type ThemeId = 'phosphor' | 'amber' | 'neon' | 'vapor' | 'ice' | 'fire';

export interface ThemeConfig {
	id: ThemeId;
	label: string;
	hex: string;
	rgb: string;
}
