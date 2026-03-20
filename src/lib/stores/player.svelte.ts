import type { Station } from '$lib/types';

class PlayerState {
	isPlaying = $state(false);
	station = $state<Station | null>(null);
	volume = $state(0.8);
	error = $state<string | null>(null);
	buffering = $state(false);
	audio: HTMLAudioElement | null = null;

	bindAudio(el: HTMLAudioElement) {
		this.audio = el;
		this.audio.volume = this.volume;
	}

	play(station: Station) {
		this.station = station;
		this.isPlaying = true;
		this.error = null;
		this.buffering = true;
	}

	toggle() {
		if (!this.station) return;
		this.isPlaying = !this.isPlaying;
		if (this.audio) {
			if (this.isPlaying) {
				this.error = null;
				this.buffering = true;
				this.audio.play().catch((e) => {
					this.error = e instanceof Error ? e.message : 'Playback failed';
					this.isPlaying = false;
					this.buffering = false;
				});
			} else {
				this.audio.pause();
				this.buffering = false;
			}
		}
	}

	stop() {
		this.isPlaying = false;
		this.station = null;
		this.error = null;
		this.buffering = false;
		if (this.audio) {
			this.audio.pause();
			this.audio.src = '';
		}
	}

	setVolume(v: number) {
		this.volume = Math.max(0, Math.min(1, v));
		if (this.audio) {
			this.audio.volume = this.volume;
		}
	}
}

export const playerStore = new PlayerState();
