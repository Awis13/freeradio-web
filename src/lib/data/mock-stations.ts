import type { Station } from '$lib/types';

export const mockStations: Station[] = [
	{
		id: '1',
		name: 'HARD SIGNAL',
		slug: 'hard-signal',
		genre: 'Hard Techno',
		description: '140+ BPM non-stop industrial hard techno. No mercy, no compromise.',
		stream_url: 'http://localhost:8000/live',
		listeners_count: 47,
		is_online: true,
		bpm: 145,
		owner_id: 'u1'
	},
	{
		id: '2',
		name: 'ACID BUNKER',
		slug: 'acid-bunker',
		genre: 'Acid Techno',
		description: 'Pure 303 squelch from the underground. Acid all day, every day.',
		stream_url: 'http://localhost:8001/live',
		listeners_count: 23,
		is_online: true,
		bpm: 138,
		owner_id: 'u2'
	},
	{
		id: '3',
		name: 'IRON LUNG',
		slug: 'iron-lung',
		genre: 'Industrial Techno',
		description: 'Machine rhythms and metallic textures. The sound of the factory floor.',
		stream_url: 'http://localhost:8002/live',
		listeners_count: 31,
		is_online: true,
		bpm: 142,
		owner_id: 'u3'
	},
	{
		id: '4',
		name: 'VOID PROTOCOL',
		slug: 'void-protocol',
		genre: 'Dark Techno',
		description: 'Abyssal frequencies and haunting atmospheres from the darkest corners.',
		stream_url: 'http://localhost:8003/live',
		listeners_count: 18,
		is_online: true,
		bpm: 136,
		owner_id: 'u4'
	},
	{
		id: '5',
		name: 'SCHRANZ VAULT',
		slug: 'schranz-vault',
		genre: 'Schranz',
		description: 'Relentless loops and distorted kicks. Old school schranz for the hardened.',
		stream_url: 'http://localhost:8004/live',
		listeners_count: 12,
		is_online: false,
		bpm: 150,
		owner_id: 'u5'
	},
	{
		id: '6',
		name: 'TRANCE HORIZON',
		slug: 'trance-horizon',
		genre: 'Hard Trance',
		description: 'Euphoric leads meet pounding basslines. Peak-time energy around the clock.',
		stream_url: 'http://localhost:8005/live',
		listeners_count: 56,
		is_online: true,
		bpm: 148,
		owner_id: 'u6'
	},
	{
		id: '7',
		name: 'GABBER KITCHEN',
		slug: 'gabber-kitchen',
		genre: 'Hardcore',
		description: 'Distorted kicks at 160+. Hardcore will never die.',
		stream_url: 'http://localhost:8006/live',
		listeners_count: 34,
		is_online: true,
		bpm: 165,
		owner_id: 'u7'
	},
	{
		id: '8',
		name: 'HYPNO LOOP',
		slug: 'hypno-loop',
		genre: 'Hypnotic Techno',
		description: 'Minimal, repetitive, transcendent. Let the loop take you somewhere else.',
		stream_url: 'http://localhost:8007/live',
		listeners_count: 29,
		is_online: true,
		bpm: 132,
		owner_id: 'u8'
	},
	{
		id: '9',
		name: 'NOISE FLOOR',
		slug: 'noise-floor',
		genre: 'Industrial Techno',
		description: 'Where noise meets rhythm. Experimental industrial for the adventurous.',
		stream_url: 'http://localhost:8008/live',
		listeners_count: 8,
		is_online: false,
		bpm: 140,
		owner_id: 'u9'
	},
	{
		id: '10',
		name: 'WAREHOUSE 99',
		slug: 'warehouse-99',
		genre: 'Hard Techno',
		description: 'Raw, unfiltered hard techno straight from the warehouse. No polish, all power.',
		stream_url: 'http://localhost:8009/live',
		listeners_count: 41,
		is_online: true,
		bpm: 144,
		owner_id: 'u10'
	}
];

export const mockTenants = [
	{
		id: 't1',
		station_id: '1',
		station_name: 'HARD SIGNAL',
		station_slug: 'hard-signal',
		status: 'ready' as const,
		dashboard_url: 'http://hard-signal.studio23.live'
	},
	{
		id: 't2',
		station_id: '2',
		station_name: 'ACID BUNKER',
		station_slug: 'acid-bunker',
		status: 'provisioning' as const,
		dashboard_url: undefined
	}
];
