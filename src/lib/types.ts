import type { ComponentType } from 'react';

export type Flavour = 'vanilla' | 'react' | 'vue' | 'flutter' | 'swiftui';

export const FLAVOURS: { id: Flavour; label: string }[] = [
  { id: 'vanilla', label: 'Vanilla JS' },
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'flutter', label: 'Flutter' },
  { id: 'swiftui', label: 'SwiftUI' },
];

export interface Param {
  key: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  default: number;
  unit?: string;
  hint?: string;
}

export type Values = Record<string, number>;

export interface GenFile {
  path: string;
  /** highlight.js language id */
  lang: string;
  code: string;
}

export interface FlavourOutput {
  files: GenFile[];
  /** One or two sentences on requirements and support. */
  note: string;
  /** Not yet compiled in CI; shown with a Beta chip. */
  beta?: boolean;
}

export interface EffectModule {
  params: Param[];
  flavours: Flavour[];
  generate(flavour: Flavour, values: Values): FlavourOutput;
  Preview: ComponentType<{ values: Values }>;
}

export const defaultsOf = (params: Param[]): Values =>
  Object.fromEntries(params.map((p) => [p.key, p.default]));
