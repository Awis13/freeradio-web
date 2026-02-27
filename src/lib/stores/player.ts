import { writable } from 'svelte/store';

export const isPlaying = writable(false);
export const currentStation = writable<{ id: string; name: string; streamUrl: string } | null>(null);
export const volume = writable(0.8);
