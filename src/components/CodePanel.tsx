import { useEffect, useMemo, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import dart from 'highlight.js/lib/languages/dart';
import swift from 'highlight.js/lib/languages/swift';
import cpp from 'highlight.js/lib/languages/cpp';
import yaml from 'highlight.js/lib/languages/yaml';
import glsl from 'highlight.js/lib/languages/glsl';
import type { Flavour, FlavourOutput } from '../lib/types';

for (const [name, lang] of Object.entries({ javascript, xml, css, dart, swift, cpp, yaml, glsl })) {
  hljs.registerLanguage(name, lang);
}

interface Props {
  flavours: { id: Flavour; label: string }[];
  flavour: Flavour;
  onFlavour: (f: Flavour) => void;
  output: FlavourOutput;
}

async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

export default function CodePanel({ flavours, flavour, onFlavour, output }: Props) {
  const [fileIdx, setFileIdx] = useState(0);
  const [toast, setToast] = useState('');
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => setFileIdx(0), [flavour]);
  const file = output.files[Math.min(fileIdx, output.files.length - 1)];
  const html = useMemo(() => hljs.highlight(file.code, { language: file.lang }).value, [file]);
  const lines = useMemo(() => file.code.split('\n').length - 1, [file]);

  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(''), 1800); };

  const copyFile = async () => {
    if (await copyText(file.code)) return flash(`Copied ${file.path}`);
    const sel = window.getSelection(), range = document.createRange();
    if (codeRef.current && sel) { range.selectNodeContents(codeRef.current); sel.removeAllRanges(); sel.addRange(range); }
    flash('Selected. Press Ctrl+C or ⌘C to copy');
  };
  const copyAll = async () => {
    const all = output.files.map((f) => `// ===== ${f.path} =====\n${f.code}`).join('\n');
    flash((await copyText(all)) ? `Copied ${output.files.length} files` : 'Copy failed. Copy each file instead');
  };

  const onTabKey = (e: React.KeyboardEvent, ids: string[], current: number, pick: (i: number) => void) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (current + delta + ids.length) % ids.length;
    pick(next);
    document.getElementById(ids[next])?.focus();
  };

  const flavourIds = flavours.map((f) => `fl-${f.id}`);
  const fileIds = output.files.map((_, i) => `file-${i}`);
  const fIndex = flavours.findIndex((f) => f.id === flavour);

  return (
    <section className="code" aria-label="Generated code">
      <div className="code-head">
        <h2>Code</h2>
        <div className="flavours" role="tablist" aria-label="Framework">
          {flavours.map((f, i) => (
            <button
              key={f.id}
              id={flavourIds[i]}
              role="tab"
              type="button"
              aria-selected={f.id === flavour}
              tabIndex={f.id === flavour ? 0 : -1}
              className="flavour"
              onClick={() => onFlavour(f.id)}
              onKeyDown={(e) => onTabKey(e, flavourIds, fIndex, (n) => onFlavour(flavours[n].id))}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="code-note">
        {output.beta && <span className="chip beta">Beta</span>}
        {output.note}
        {output.beta && ' Not compiled by Snippetlab yet; report anything that fails to build.'}
      </p>

      <div className="code-box">
        <div className="files">
          <div className="file-tabs" role="tablist" aria-label="Files">
            {output.files.map((f, i) => (
              <button
                key={f.path}
                id={fileIds[i]}
                role="tab"
                type="button"
                aria-selected={i === fileIdx}
                tabIndex={i === fileIdx ? 0 : -1}
                className="file-tab"
                onClick={() => setFileIdx(i)}
                onKeyDown={(e) => onTabKey(e, fileIds, fileIdx, setFileIdx)}
              >
                {f.path}
              </button>
            ))}
          </div>
          <div className="code-actions">
            <span className="lines">{lines} lines</span>
            <button type="button" className="btn code-btn" onClick={copyFile}>Copy file</button>
            {output.files.length > 1 && (
              <button type="button" className="btn code-btn" onClick={copyAll}>Copy all</button>
            )}
          </div>
        </div>
        <pre ref={codeRef} tabIndex={0} aria-label={file.path}><code className="hljs" dangerouslySetInnerHTML={{ __html: html }} /></pre>
      </div>
      <div className="toast" role="status" aria-live="polite">{toast}</div>
    </section>
  );
}
