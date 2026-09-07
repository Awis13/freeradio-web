import { test, expect } from '@playwright/test';

/**
 * Browser media smoke tests. These run against a real Chromium with a real
 * <audio> element — no media methods are mocked. They cover the decisive
 * A→B native switch, a local HLS fixture (including a URL query) and teardown.
 */

/** Wait until the harness onMount has populated the fixture stations. */
async function waitForHarness(page: Parameters<typeof test>[0]['page']) {
	await page.waitForFunction(() => {
		const p = (window as unknown as Record<string, unknown>).__player as {
			station: { name: string } | null;
		} | null;
		return !!p;
	});
}

test.describe('player media smoke', () => {
	test('native WAV A→B actually plays', async ({ page }) => {
		await page.goto('/__test/player');
		await waitForHarness(page);

		// Play station A (native WAV).
		await page.getByTestId('play-a').click();
		await expect(page.getByTestId('station')).toHaveText('Station A (WAV)');
		await expect(page.getByTestId('isPlaying')).toHaveText('true');
		// Real playback: the audio element's currentTime must advance.
		await page.waitForFunction(() => {
			const audio = document.querySelector('audio');
			return !!audio && audio.currentTime > 0;
		});

		// Switch to station B — B must actually play.
		await page.getByTestId('play-b').click();
		await expect(page.getByTestId('station')).toHaveText('Station B (WAV)');
		await expect(page.getByTestId('isPlaying')).toHaveText('true');
		await page.waitForFunction(() => {
			const audio = document.querySelector('audio');
			return !!audio && audio.src.includes('b.wav') && audio.currentTime > 0;
		});
	});

	test('local HLS fixture with URL query plays', async ({ page }) => {
		await page.goto('/__test/player');
		await waitForHarness(page);

		await page.getByTestId('play-hls').click();
		await expect(page.getByTestId('station')).toHaveText('Station HLS');
		await expect(page.getByTestId('isPlaying')).toHaveText('true');
		await page.waitForFunction(() => {
			const audio = document.querySelector('audio');
			return !!audio && audio.currentTime > 0;
		});
	});

	test('stop clears state and the store audio reference', async ({ page }) => {
		await page.goto('/__test/player');
		await waitForHarness(page);

		await page.getByTestId('play-a').click();
		await expect(page.getByTestId('isPlaying')).toHaveText('true');

		await page.getByTestId('stop').click();
		await expect(page.getByTestId('station')).toHaveText('none');
		await expect(page.getByTestId('isPlaying')).toHaveText('false');
		await expect(page.getByTestId('error')).toHaveText('none');

		const audioRef = await page.evaluate(() => {
			const p = (window as unknown as Record<string, unknown>).__player as {
				audio: unknown;
			};
			return p.audio;
		});
		expect(audioRef).toBeNull();
	});
});
