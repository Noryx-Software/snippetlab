import type { Flavour } from '../lib/types';

export interface CatalogueEntry {
  slug: string;
  name: string;
  category: string;
  summary: string;
  status: 'live' | 'planned';
  flavours: Flavour[];
  /** Library the generated code depends on, if any. */
  library?: string;
}

/** Every effect on the site. A `live` entry needs a module in src/effects/registry.ts. */
export const catalogue: CatalogueEntry[] = [
  {
    slug: 'liquid-glass',
    name: 'Liquid Glass',
    category: 'Surfaces',
    summary: 'A card that bends the photo behind it at the rim, with frost, prism fringe and a rim light.',
    status: 'live',
    flavours: ['vanilla', 'react', 'vue', 'flutter', 'swiftui'],
  },
  {
    slug: 'scroll-timeline',
    name: 'Scroll timeline',
    category: 'Motion',
    summary: 'Sections that pin, scrub and reveal as the page scrolls.',
    status: 'planned',
    flavours: ['vanilla', 'react', 'vue'],
    library: 'GSAP ScrollTrigger',
  },
  {
    slug: 'split-text',
    name: 'Split text reveal',
    category: 'Motion',
    summary: 'Headlines that enter line by line or letter by letter.',
    status: 'planned',
    flavours: ['vanilla', 'react', 'vue', 'flutter', 'swiftui'],
    library: 'GSAP',
  },
  {
    slug: 'hero-scene',
    name: '3D hero scene',
    category: '3D',
    summary: 'A lit model that follows the pointer, with a fallback image for low-power devices.',
    status: 'planned',
    flavours: ['vanilla', 'react', 'vue'],
    library: 'Three.js',
  },
  {
    slug: 'validated-form',
    name: 'Validated form',
    category: 'Forms',
    summary: 'Field rules, inline errors and an accessible submit flow, built from a schema.',
    status: 'planned',
    flavours: ['react', 'vue', 'flutter', 'swiftui'],
    library: 'React Hook Form + Zod',
  },
  {
    slug: 'magnetic-button',
    name: 'Magnetic button',
    category: 'Interaction',
    summary: 'A button that leans toward the pointer and springs back.',
    status: 'planned',
    flavours: ['vanilla', 'react', 'vue', 'flutter', 'swiftui'],
  },
];

export const liveEntries = catalogue.filter((e) => e.status === 'live');
