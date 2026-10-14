# Snippetlab

**by NORYX SOFTWARE**

Tune polished interface effects on a live preview, then copy the code for the stack you ship: Vanilla JS, React, Vue, Flutter or SwiftUI.

First effect: **Liquid Glass**, a card that refracts the photo behind it at the rim, like Apple's Liquid Glass.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

Node 20 or later. The site is fully static (Astro + React islands), so it deploys to Vercel, Netlify or Cloudflare Pages with no server.

## How the code is organised

```
src/
  effects/
    catalogue.ts          every effect shown on the home page (live or planned)
    registry.ts           client modules for live effects, keyed by slug
    liquid-glass/
      core.js             the engine; also shipped verbatim in the web output
      params.ts           slider definitions and defaults
      generate.ts         code generators, one per flavour
      Preview.tsx         live preview used on the effect page
      About.astro         "How it works" section
  components/
    Configurator.tsx      preview + settings + code panel for any effect
    CodePanel.tsx         flavour tabs, file tabs, highlighting, copy
  pages/
    index.astro           home and catalogue
    effects/[slug].astro  one page per live effect
```

The live preview imports the same `core.js` and the same CSS generator that the web output ships, so what you see is what you copy.

## Adding an effect

1. Create `src/effects/<slug>/` with:
   - `params.ts`: an array of `Param` (key, label, min, max, default, unit, hint).
   - `generate.ts`: `generate(flavour, values)` returning `{ files, note, beta? }`. Each file is `{ path, lang, code }`, where `lang` is a highlight.js id.
   - `Preview.tsx`: a React component taking `{ values }`.
   - `index.ts`: export an `EffectModule` (`params`, `flavours`, `generate`, `Preview`).
   - Optional `About.astro`: shown under the workbench.
2. Register it in `src/effects/registry.ts`.
3. Add or update its entry in `src/effects/catalogue.ts` with `status: 'live'`.

If a flavour needs a language highlight.js does not have registered yet, add it in `CodePanel.tsx`.

## Status of the generated code

| Flavour | Status |
| --- | --- |
| Vanilla JS, React, Vue | Tested in Chromium. Canvas 2D, so it runs in Safari and Firefox too. |
| Flutter | Beta. Fragment shader, Flutter 3.27+. Not compiled in CI yet. |
| SwiftUI | Beta. Metal `layerEffect`, iOS 17+ / macOS 14+. Not compiled in CI yet. |

## Licence

MIT. See [LICENSE](LICENSE). Generated code carries the same licence.
