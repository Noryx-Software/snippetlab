import type { Param } from '../../lib/types';

export const params: Param[] = [
  { key: 'refraction', label: 'Refraction', min: 0, max: 90, default: 48, unit: 'px', hint: 'How far the rim pulls the photo inward.' },
  { key: 'bezel', label: 'Bezel width', min: 6, max: 70, default: 34, unit: 'px', hint: 'Width of the bending band along the edge.' },
  { key: 'frost', label: 'Frost', min: 0, max: 12, step: 0.5, default: 1.5, unit: 'px', hint: 'Blur behind the glass.' },
  { key: 'dispersion', label: 'Dispersion', min: 0, max: 12, default: 3, unit: 'px', hint: 'Red and blue split at the rim.' },
  { key: 'radius', label: 'Corner radius', min: 0, max: 40, default: 14, unit: 'px' },
  { key: 'tint', label: 'Tint', min: 0, max: 80, default: 45, unit: '%', hint: 'Darkening that keeps white text readable.' },
];
