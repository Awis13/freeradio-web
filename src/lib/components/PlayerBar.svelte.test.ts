import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import PlayerBar from './PlayerBar.svelte';
import { playerStore } from '$lib/stores/player.svelte';
import type { Station } from '$lib/types';

// Mock hls.js so we can assert on HLS lifecycle without a real media pipeline.
const hlsMocks = vi.hoisted(() => {
	const destroy = vi.fn();
	type HlsMockType = ReturnType<typeof vi.fn> & {
		isSupported: ReturnType<typeof vi.fn>;
		Events: { MANIFEST_PARSED: string; ERROR: string };
	};
	const HlsMock = vi.fn().mockImplementation(() => ({
		loadSource: vi.fn(),
		attachMedia: vi.fn(),
		on: vi.fn(),
		destroy
	})) as unknown as HlsMockType;
	HlsMock.isSupported = vi.fn().mockReturnValue(true);
	HlsMock.Events = { MANIFEST_PARSED: 'manifestParsed', ERROR: 'error' };
	return { destroy, HlsMock };
});

vi.mock('hls.js', () => ({ default: hlsMocks.HlsMock }));

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

const nativeA: Station = { ...base };
const nativeB: Station = { ...base, id: 'b', name: 'B', slug: 'b', stream_url: 'https://example.com/b.wav' };
const hlsA: Station = { ...base, stream_url: 'https://example.com/a/index.m3u8' };
const hlsB: Station = { ...base, id: 'b', name: 'B', slug: 'b', stream_url: 'https://example.com/b/index.m3u8' };

const playMock = () => HTMLMediaElement.prototype.play as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
	// jsdom does not implement media playback; stub the methods the controller uses.
	HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
	HTMLMediaElement.prototype.pause = vi.fn();
	HTMLMediaElement.prototype.load = vi.fn();
	hlsMocks.destroy.mockClear();
	hlsMocks.HlsMock.mockClear();
	playerStore.stop();
});

describe('PlayerBar controller — native source', () => {
	it('sets isPlaying true only after a real playing event', async () => {
		playerStore.play(nativeA);
		render(PlayerBar);
		await waitFor(() => expect(playerStore.audio).not.toBeNull());

		// play() was requested, but isPlaying must stay false until the media event.
		expect(playMock()).toHaveBeenCalled();
		expect(playerStore.isPlaying).toBe(false);

		playerStore.audio!.dispatchEvent(new Event('playing'));
		await waitFor(() => expect(playerStore.isPlaying).toBe(true));
		expect(playerStore.buffering).toBe(false);
	});

	it('a rejected play() never leaves the UI Playing', async () => {
		HTMLMediaElement.prototype.play = vi.fn().mockRejectedValue(new Error('blocked'));
		playerStore.play(nativeA);
		render(PlayerBar);
		await waitFor(() => expect(playerStore.audio).not.toBeNull());
		await waitFor(() => expect(playerStore.buffering).toBe(false));
		expect(playerStore.isPlaying).toBe(false);
	});

	it('reflects waiting, error and pause media events', async () => {
		playerStore.play(nativeA);
		render(PlayerBar);
		await waitFor(() => expect(playerStore.audio).not.toBeNull());
		const audio = playerStore.audio!;

		audio.dispatchEvent(new Event('waiting'));
		await waitFor(() => expect(playerStore.buffering).toBe(true));

		audio.dispatchEvent(new Event('playing'));
		await waitFor(() => expect(playerStore.isPlaying).toBe(true));

		audio.dispatchEvent(new Event('error'));
		await waitFor(() => expect(playerStore.error).toBe('Playback error'));
		expect(playerStore.isPlaying).toBe(false);

		audio.dispatchEvent(new Event('playing'));
		await waitFor(() => expect(playerStore.isPlaying).toBe(true));

		audio.dispatchEvent(new Event('pause'));
		await waitFor(() => expect(playerStore.isPlaying).toBe(false));
	});

	it('clears the store audio reference on stop', async () => {
		playerStore.play(nativeA);
		render(PlayerBar);
		await waitFor(() => expect(playerStore.audio).not.toBeNull());
		playerStore.stop();
		await waitFor(() => expect(playerStore.audio).toBeNull());
	});
});

describe('PlayerBar controller — HLS lifecycle', () => {
	it('destroys HLS once on switch and once on stop', async () => {
		playerStore.play(hlsA);
		render(PlayerBar);
		await waitFor(() => expect(hlsMocks.HlsMock).toHaveBeenCalledTimes(1));

		playerStore.play(hlsB);
		await waitFor(() => expect(hlsMocks.destroy).toHaveBeenCalledTimes(1));
		// Wait for B's HLS to be created before stopping so its teardown is exercised.
		await waitFor(() => expect(hlsMocks.HlsMock).toHaveBeenCalledTimes(2));

		playerStore.stop();
		await waitFor(() => expect(hlsMocks.destroy).toHaveBeenCalledTimes(2));
	});

	it('ignores late callbacks from a previous station', async () => {
		playerStore.play(hlsA);
		render(PlayerBar);
		await waitFor(() => expect(hlsMocks.HlsMock).toHaveBeenCalledTimes(1));

		const hlsAInstance = hlsMocks.HlsMock.mock.results[0].value;
		const manifestHandlerA = hlsAInstance.on.mock.calls.find(
			([evt]: [string]) => evt === 'manifestParsed'
		)?.[1];
		expect(manifestHandlerA).toBeTypeOf('function');

		// Switch to B — A's controller is torn down.
		playerStore.play(hlsB);
		await waitFor(() => expect(hlsMocks.destroy).toHaveBeenCalledTimes(1));

		const playCallsBefore = playMock().mock.calls.length;
		manifestHandlerA(); // late MANIFEST_PARSED from station A
		await new Promise((r) => setTimeout(r, 0));
		expect(playMock().mock.calls.length).toBe(playCallsBefore);
	});
});
