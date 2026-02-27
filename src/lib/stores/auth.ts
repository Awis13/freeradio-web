import { writable } from 'svelte/store';

export const user = writable<{ id: string; username: string } | null>(null);
export const token = writable<string | null>(null);
