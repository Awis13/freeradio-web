import { describe, it, expect, beforeEach } from 'vitest';
import { playerStore } from './player.svelte';
import type { Station } from '$lib/types';

const base: Station = {
	id: 'a',
	name: 'A',
	slug: 'a',
	genre: 'test',
	description: '',
	artwork_url: '',
	stream_url: 'https://example.com/a.wav',
	is_public: true,
	is_online: true,
	created_at: '',
	updated_at: ''
};

const stationA: Station = { ...base };
const stationB: Station = { ...base, id: 'b', name: 'B', slug: 'b', stream_url: 'https://example.com/b.wav' };

describe('playerStore', () => {
	beforeEach(() => {
		playerStore.stop();
	});

	it('play sets station and intent but never isPlaying directly', () => {
		playerStore.play(stationA);
		expect(playerStore.station?.id).toBe('a');
		expect(playerStore.playRequested).toBe(true);
		expect(playerStore.buffering).toBe(true);
		// isPlaying is only confirmed by a real media event, never set by play()
		expect(playerStore.isPlaying).toBe(false);
	});

	it('toggle flips playRequested and clears error/buffering when resuming', () => {
		playerStore.play(stationA);
		playerStore.toggle();
		expect(playerStore.playRequested).toBe(false);
		playerStore.toggle();
		expect(playerStore.playRequested).toBe(true);
		expect(playerStore.error).toBeNull();
		expect(playerStore.buffering).toBe(true);
	});

	it('toggle is a no-op without a station', () => {
		playerStore.toggle();
		expect(playerStore.playRequested).toBe(false);
	});

	it('stop clears station, intent, isPlaying and the audio reference', () => {
		playerStore.play(stationA);
		playerStore.audio = document.createElement('audio');
		playerStore.stop();
		expect(playerStore.station).toBeNull();
		expect(playerStore.playRequested).toBe(false);
		expect(playerStore.isPlaying).toBe(false);
		expect(playerStore.buffering).toBe(false);
		expect(playerStore.audio).toBeNull();
	});

	it('setVolume clamps to [0,1] and applies to the bound element', () => {
		const el = document.createElement('audio');
		playerStore.bindAudio(el);
		playerStore.setVolume(1.5);
		expect(playerStore.volume).toBe(1);
		expect(el.volume).toBe(1);
		playerStore.setVolume(-1);
		expect(playerStore.volume).toBe(0);
		expect(el.volume).toBe(0);
	});

	it('bindAudio applies the current volume to the element', () => {
		playerStore.setVolume(0.4);
		const el = document.createElement('audio');
		playerStore.bindAudio(el);
		expect(playerStore.audio).toBe(el);
		expect(el.volume).toBe(0.4);
	});
});
