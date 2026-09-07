import type { Station } from '$lib/types';

/**
 * Player state store.
 *
 * This store is intentionally state-only: it holds the current station, volume,
 * error/buffering flags and the bound audio element, plus a `playRequested`
 * intent flag. It never touches the audio element directly (no play/pause/src
 * manipulation). All playback is driven by the single station-scoped controller
 * in `PlayerBar.svelte`, which is the one source of truth for source attach,
 * media events, buffering and teardown. `isPlaying` is only ever set to `true`
 * by the controller in response to a real `playing` media event.
 */
class PlayerState {
	isPlaying = $state(false);
	station = $state<Station | null>(null);
	volume = $state(0.8);
	error = $state<string | null>(null);
	buffering = $state(false);
	/** Intent flag: the controller plays when true, pauses when false. */
	playRequested = $state(false);
	/** Bound audio element. Cleared on stop/unmount. */
	audio = $state<HTMLAudioElement | null>(null);

	bindAudio(el: HTMLAudioElement) {
		this.audio = el;
		el.volume = this.volume;
	}

	/** Request playback of a station. Does not set `isPlaying` — that is confirmed by media events. */
	play(station: Station) {
		this.station = station;
		this.error = null;
		this.buffering = true;
		this.playRequested = true;
	}

	/** Toggle play/pause intent. Does not touch the audio element directly. */
	toggle() {
		if (!this.station) return;
		this.playRequested = !this.playRequested;
		if (this.playRequested) {
			this.error = null;
			this.buffering = true;
		}
	}

	/** Stop playback: clear station, intent and the audio reference. */
	stop() {
		this.station = null;
		this.isPlaying = false;
		this.error = null;
		this.buffering = false;
		this.playRequested = false;
		this.audio = null;
	}

	setVolume(v: number) {
		this.volume = Math.max(0, Math.min(1, v));
		if (this.audio) {
			this.audio.volume = this.volume;
		}
	}
}

export const playerStore = new PlayerState();
