import { useEffect, useMemo, useState } from 'react';
import { registry } from '../effects/registry';
import { FLAVOURS, defaultsOf, type Flavour, type Values } from '../lib/types';
import CodePanel from './CodePanel';
import '../styles/workbench.css';

const FLAVOUR_KEY = 'snippetlab:flavour';

export default function Configurator({ slug }: { slug: string }) {
  const effect = registry[slug];
  const defaults = useMemo(() => defaultsOf(effect.params), [effect]);
  const [values, setValues] = useState<Values>(defaults);
  const [flavour, setFlavour] = useState<Flavour>(effect.flavours[0]);

  // Remember the viewer's stack between effects.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FLAVOUR_KEY) as Flavour | null;
      if (saved && effect.flavours.includes(saved)) setFlavour(saved);
    } catch {}
  }, [effect]);
  const chooseFlavour = (f: Flavour) => {
    setFlavour(f);
    try { localStorage.setItem(FLAVOUR_KEY, f); } catch {}
  };

  const output = useMemo(() => effect.generate(flavour, values), [effect, flavour, values]);
  const changed = effect.params.some((p) => values[p.key] !== p.default);
  const { Preview } = effect;

  return (
    <div className="bench">
      <section className="bench-top" aria-label="Preview and settings">
        <div className="bench-preview">
          <Preview values={values} />
        </div>

        <div className="bench-controls">
          <div className="controls-head">
            <h2>Settings</h2>
            <button type="button" className="btn ghost" disabled={!changed} onClick={() => setValues(defaults)}>
              Reset settings
            </button>
          </div>
          <div className="sliders">
            {effect.params.map((p) => (
              <label key={p.key} htmlFor={`p-${p.key}`} className="slider">
                <span className="slider-row">
                  <span>{p.label}</span>
                  <output htmlFor={`p-${p.key}`}>{values[p.key]}{p.unit}</output>
                </span>
                <input
                  id={`p-${p.key}`}
                  type="range"
                  min={p.min}
                  max={p.max}
                  step={p.step ?? 1}
                  value={values[p.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [p.key]: Number(e.target.value) }))}
                />
                {p.hint && <span className="slider-hint">{p.hint}</span>}
              </label>
            ))}
          </div>
          <p className="controls-note">The code below updates as you move the sliders.</p>
        </div>
      </section>

      <CodePanel
        flavours={FLAVOURS.filter((f) => effect.flavours.includes(f.id))}
        flavour={flavour}
        onFlavour={chooseFlavour}
        output={output}
      />
    </div>
  );
}
