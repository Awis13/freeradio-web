import { writable } from 'svelte/store';

export interface Station {
	id: string;
	name: string;
	description: string;
	streamUrl: string;
	listenersCount: number;
}

export const stations = writable<Station[]>([]);
