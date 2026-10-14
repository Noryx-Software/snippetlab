import { useEffect, useRef, useState } from 'react';
import { createLiquidGlass, makeDraggable } from './core.js';
import { css } from './generate';
import { drawScene } from './scene';
import type { Values } from '../../lib/types';

export default function Preview({ values }: { values: Values }) {
  const photoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<any>(null);
  const dragRef = useRef<any>(null);
  const [src, setSrc] = useState<string>('');
  const [custom, setCustom] = useState(false);

  // Engine and drag, created once.
  useEffect(() => {
    const photo = photoRef.current!, card = cardRef.current!;
    const glass = createLiquidGlass(card, photo, values);
    glassRef.current = glass;
    dragRef.current = makeDraggable(card, glass.render);
    const ro = new ResizeObserver(() => glass.refresh());
    ro.observe(photo);
    ro.observe(card);
    setSrc(drawScene());
    return () => { ro.disconnect(); dragRef.current?.destroy(); };
  }, []);

  // New photo.
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => glassRef.current?.setImage(img);
    img.src = src;
    return () => { img.onload = null; };
  }, [src]);

  // New settings. Runs after the <style> below has applied the new radius.
  useEffect(() => { glassRef.current?.set(values); }, [values]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setSrc(String(reader.result)); setCustom(true); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="pv">
      <style>{css(values)}</style>
      <div className="lg-photo" ref={photoRef} style={{ backgroundImage: src ? `url(${src})` : undefined }}>
        <div className="lg-card" ref={cardRef} tabIndex={0} aria-label="Glass card. Drag it, or use the arrow keys.">
          <div className="lg-glass"><canvas /></div>
          <div className="lg-content" style={{ fontFamily: 'var(--display)' }}>
            <div className="lg-value">$1.3M</div>
            <div className="lg-label">Saved annually from reduced risk exposure</div>
          </div>
        </div>
      </div>
      <div className="pv-actions">
        <label className="btn">
          {custom ? 'Change photo' : 'Use your own photo'}
          <input type="file" accept="image/*" onChange={onFile} />
        </label>
        <button type="button" className="btn" onClick={() => dragRef.current?.reset()}>Reset position</button>
      </div>
      <p className="pv-hint">Drag the card across the photo. Lines bend at the rim and stay straight in the middle.</p>
    </div>
  );
}
