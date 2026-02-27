import type { ThemeConfig, ThemeId } from '$lib/types';

export const themes: Record<ThemeId, ThemeConfig> = {
	phosphor: { id: 'phosphor', label: 'GRN', hex: '#c4ffcb', rgb: '196, 255, 203' },
	amber: { id: 'amber', label: 'AMB', hex: '#ffb43c', rgb: '255, 180, 60' },
	neon: { id: 'neon', label: 'NEON', hex: '#a0ffc8', rgb: '160, 255, 200' },
	vapor: { id: 'vapor', label: 'VPR', hex: '#ff6ec8', rgb: '255, 110, 200' },
	ice: { id: 'ice', label: 'ICE', hex: '#8cd2ff', rgb: '140, 210, 255' },
	fire: { id: 'fire', label: 'FIRE', hex: '#ff8228', rgb: '255, 130, 40' }
};

export const themeOrder: ThemeId[] = ['phosphor', 'amber', 'neon', 'vapor', 'ice', 'fire'];
