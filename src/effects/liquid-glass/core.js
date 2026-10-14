/**
 * Liquid Glass — Snippetlab by NORYX SOFTWARE
 * Copyright (c) 2026 NORYX SOFTWARE. Released under the MIT License:
 * https://opensource.org/licenses/MIT
 *
 * Refracts an image under a rounded card, like Apple's Liquid Glass.
 * The card holds a <canvas>; every pixel copies the photo from a position
 * shifted inward near the rim, so lines bend at the bezel and run straight
 * through the middle. Plain Canvas 2D: works in every modern browser.
 *
 *   const glass = createLiquidGlass(cardEl, photoEl, { refraction: 48 });
 *   glass.setImage(img);   // the image photoEl shows with background-size: cover
 *   glass.render();        // after the card moves
 *   glass.refresh();       // after a resize
 */
export function createLiquidGlass(card, photo, options = {}) {
  const o = { refraction: 48, bezel: 34, frost: 1.5, dispersion: 3, ...options };
  const canvas = card.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  let img = null, bg = null, bgW = 0, bgH = 0, fx, fy, w = 0, h = 0, dpr = 1, out = null;

  // The photo exactly as the container shows it (cover fit), optionally frosted.
  function prepareBackdrop() {
    if (!img) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    bgW = Math.round(photo.clientWidth * dpr);
    bgH = Math.round(photo.clientHeight * dpr);
    if (!bgW || !bgH) return;
    const c = document.createElement('canvas');
    c.width = bgW; c.height = bgH;
    const g = c.getContext('2d');
    const s = Math.max(bgW / img.naturalWidth, bgH / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    g.drawImage(img, (bgW - dw) / 2, (bgH - dh) / 2, dw, dh);
    if (o.frost > 0) {
      // Frost by shrinking and enlarging: no ctx.filter needed, so Safari works too.
      const k = 1 + o.frost * dpr * 0.8;
      const t = document.createElement('canvas');
      t.width = Math.max(1, (bgW / k) | 0);
      t.height = Math.max(1, (bgH / k) | 0);
      const tg = t.getContext('2d');
      tg.imageSmoothingQuality = 'high';
      tg.drawImage(c, 0, 0, t.width, t.height);
      g.imageSmoothingQuality = 'high';
      g.drawImage(t, 0, 0, bgW, bgH);
    }
    bg = g.getImageData(0, 0, bgW, bgH).data;
  }

  // Per-pixel inward shift: strongest at the rounded edge, zero past the bezel.
  function buildField() {
    w = Math.round(card.offsetWidth * dpr);
    h = Math.round(card.offsetHeight * dpr);
    if (!w || !h) return;
    canvas.width = w; canvas.height = h;
    out = ctx.createImageData(w, h);
    fx = new Float32Array(w * h);
    fy = new Float32Array(w * h);
    const hw = w / 2, hh = h / 2, bezel = Math.max(o.bezel, 1) * dpr;
    const r = Math.min((parseFloat(getComputedStyle(card).borderTopLeftRadius) || 0) * dpr, hw, hh);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const px = x + 0.5 - hw, py = y + 0.5 - hh;
        const qx = Math.abs(px) - (hw - r), qy = Math.abs(py) - (hh - r);
        const ox = Math.max(qx, 0), oy = Math.max(qy, 0), ol = Math.hypot(ox, oy);
        const depth = -(ol + Math.min(Math.max(qx, qy), 0) - r); // distance in from the edge
        const t = 1 - depth / bezel;
        if (t <= 0) continue;
        const m = Math.min(t, 1) ** 2; // eases in like a curved lip
        let nx, ny; // outward normal of the nearest edge
        if (qx > 0 && qy > 0) { nx = (ox / (ol || 1)) * Math.sign(px); ny = (oy / (ol || 1)) * Math.sign(py); }
        else if (qx > qy) { nx = Math.sign(px); ny = 0; }
        else { nx = 0; ny = Math.sign(py); }
        fx[y * w + x] = -nx * m;
        fy[y * w + x] = -ny * m;
      }
    }
  }

  function render() {
    if (!bg || !out) return;
    const x0 = Math.round(card.offsetLeft * dpr), y0 = Math.round(card.offsetTop * dpr);
    const d = out.data;
    const sG = o.refraction * dpr, sR = sG + o.dispersion * dpr, sB = sG - o.dispersion * dpr;
    const at = (x, y) =>
      ((y < 0 ? 0 : y >= bgH ? bgH - 1 : y | 0) * bgW + (x < 0 ? 0 : x >= bgW ? bgW - 1 : x | 0)) * 4;
    for (let y = 0, i = 0; y < h; y++) {
      for (let x = 0; x < w; x++, i++) {
        const ax = fx[i], ay = fy[i], bx = x0 + x, by = y0 + y, j = i * 4;
        if (!ax && !ay) {
          const k = at(bx, by);
          d[j] = bg[k]; d[j + 1] = bg[k + 1]; d[j + 2] = bg[k + 2];
        } else {
          d[j] = bg[at(bx + ax * sR, by + ay * sR)];
          d[j + 1] = bg[at(bx + ax * sG, by + ay * sG) + 1];
          d[j + 2] = bg[at(bx + ax * sB, by + ay * sB) + 2];
        }
        d[j + 3] = 255;
      }
    }
    ctx.putImageData(out, 0, 0);
  }

  const refresh = () => { prepareBackdrop(); buildField(); render(); };
  return {
    render,
    refresh,
    setImage(image) { img = image; refresh(); },
    set(next) { Object.assign(o, next); refresh(); },
  };
}

/** Optional: drag the card with a pointer or the arrow keys, kept inside its container. */
export function makeDraggable(card, onMove) {
  const place = (x, y) => {
    const p = card.parentElement, w = card.offsetWidth, h = card.offsetHeight;
    card.style.width = w + 'px';
    card.style.right = card.style.bottom = 'auto';
    card.style.left = Math.min(Math.max(x, 0), p.clientWidth - w) + 'px';
    card.style.top = Math.min(Math.max(y, 0), p.clientHeight - h) + 'px';
    onMove && onMove();
  };
  let sx = 0, sy = 0, ox = 0, oy = 0, on = false;
  const down = (e) => {
    on = true; sx = e.clientX; sy = e.clientY; ox = card.offsetLeft; oy = card.offsetTop;
    try { card.setPointerCapture(e.pointerId); } catch {}
  };
  const move = (e) => { if (on) place(ox + e.clientX - sx, oy + e.clientY - sy); };
  const up = () => { on = false; };
  const key = (e) => {
    const m = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] }[e.key];
    if (m) { e.preventDefault(); place(card.offsetLeft + m[0], card.offsetTop + m[1]); }
  };
  card.addEventListener('pointerdown', down);
  card.addEventListener('pointermove', move);
  card.addEventListener('pointerup', up);
  card.addEventListener('pointercancel', up);
  card.addEventListener('keydown', key);
  const reset = () => {
    card.style.left = card.style.top = card.style.right = card.style.bottom = card.style.width = '';
    onMove && onMove();
  };
  return {
    reset,
    destroy() {
      card.removeEventListener('pointerdown', down);
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerup', up);
      card.removeEventListener('pointercancel', up);
      card.removeEventListener('keydown', key);
    },
  };
}
