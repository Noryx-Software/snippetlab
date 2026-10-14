import type { EffectModule } from '../lib/types';
import liquidGlass from './liquid-glass';

/** Client-side modules for live effects, keyed by catalogue slug. */
export const registry: Record<string, EffectModule> = {
  'liquid-glass': liquidGlass,
};
