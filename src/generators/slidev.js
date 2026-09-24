/**
 * Opo Theme — Slidev Theme Generator
 * Output: a local Slidev theme package (slidev-theme-opo)
 *
 * Slidev themes use the same structure as a slide project: package.json
 * with slidev defaults, styles/index.ts as the stylesheet entry, and
 * setup/shiki.ts for code highlighting. Slidev toggles dark mode with an
 * `html.dark` class, so light and dark variables are scoped to that
 * class instead of prefers-color-scheme.
 *
 * Layouts and styles are Slidev's default theme, vendored unchanged in
 * src/slidev-default/ and copied by build.js (a theme outside the project
 * cannot import @slidev/theme-default). Opo only adds colors and fonts.
 *
 * Shiki accepts VS Code themes, so the code highlighting reuses the
 * VS Code generator output for the same variants.
 *
 * Usage in slides.md frontmatter: `theme: ../opo-theme/dist/slidev`
 * Docs: https://sli.dev/guide/write-theme
 */

import { formatHex } from 'culori';

const FONT_SANS = 'Atkinson Hyperlegible Next';
const FONT_MONO = 'Atkinson Hyperlegible Mono';

export function generateSlidevPackageJson() {
  const pkg = {
    name: 'slidev-theme-opo',
    version: '1.0.0',
    description: 'Colorblind-safe, OKLCH-based accessible Slidev theme',
    author: 'Ischa Gast',
    license: 'MIT',
    keywords: ['slidev-theme', 'slidev'],
    engines: { slidev: '>=0.48.0' },
    slidev: {
      colorSchema: 'both',
      defaults: {
        fonts: {
          sans: FONT_SANS,
          mono: FONT_MONO,
          weights: '400,600,700',
          italic: true,
        },
      },
    },
  };
  return JSON.stringify(pkg, null, 2) + '\n';
}

export function generateSlidevStylesIndex() {
  // Same order as @slidev/theme-default/styles/index.ts, plus Opo colors
  // and the iA Presenter-style layer on top.
  return `import '@slidev/client/styles/layouts-base.css'\nimport './default-layouts.css'\nimport './opo.css'\nimport './ia.css'\n`;
}

function varBlock(variant, indent) {
  const hex = (c) => formatHex(c);
  const ui = variant.ui;
  const syn = variant.syntax;
  const pad = ' '.repeat(indent);

  const lines = [];
  for (const [key, color] of Object.entries(ui)) {
    const name = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`--opo-${name}: ${hex(color)};`);
  }
  lines.push(`--opo-accent-bg: color-mix(in srgb, ${hex(ui.accent)} 10%, transparent);`);
  lines.push(`--opo-border-light: color-mix(in srgb, ${hex(ui.neutral)} 35%, transparent);`);
  lines.push('');
  lines.push(`--slidev-theme-primary: ${hex(ui.accent)};`);
  lines.push(`--slidev-code-background: ${hex(ui.bgPanel)};`);
  lines.push(`--slidev-code-foreground: ${hex(ui.text)};`);
  lines.push(`--slidev-code-tab-divider: ${hex(ui.bgHover)};`);
  lines.push(`--slidev-code-tab-text-color: ${hex(ui.textMid)};`);
  lines.push(`--slidev-code-tab-active-text-color: ${hex(ui.text)};`);
  lines.push(`--slidev-slide-container-background: ${hex(ui.bg)};`);
  lines.push(`--slidev-controls-foreground: ${hex(ui.text)};`);
  lines.push(`--slidev-code-radius: 6px;`);
  lines.push(`--slidev-code-padding: 12px 16px;`);
  lines.push(`--slidev-code-font-size: 14px;`);
  lines.push(`--slidev-code-line-height: 22px;`);

  // Syntax colors are exposed for custom components; Shiki uses the VS Code theme.
  lines.push('');
  for (const [key, color] of Object.entries(syn)) {
    lines.push(`--opo-syntax-${key}: ${hex(color)};`);
  }

  return lines.map((l) => (l ? pad + l : '')).join('\n');
}

export function generateSlidevColors(variants) {
  return `/* Opo — Colorblind-safe accessible theme for Slidev (generated) */
/* https://github.com/IschaGast/opo-theme */

html:not(.dark) {
${varBlock(variants.light, 2)}
}

html.dark {
${varBlock(variants.dark, 2)}
}

.slidev-slide-content,
.slidev-page {
  background: var(--opo-bg);
  color: var(--opo-text);
}

/* The default theme dims subtitles and h6 with opacity, which drops text
   below WCAG AA on Opo backgrounds (about 3:1 for h1 + p). Use validated
   palette colors instead. */
.slidev-layout h1 + p {
  opacity: 1;
  color: var(--opo-text);
}

.slidev-layout h6:not(.opacity-100) {
  opacity: 1;
  color: var(--opo-text-mid);
}
`;
}

// iA Presenter-style layer on top of the default theme: one left-aligned
// style everywhere, heavy tight titles, bold subtitles, generous margins.
// Everything is top left; only the center layout centers vertically.
export function generateSlidevIaLayer() {
  return `/* Opo — iA Presenter-style layout layer (generated) */

.slidev-layout {
  padding: 2.5rem 4rem;
  font-size: 1.4rem;
  line-height: 1.3;
  text-align: left;

  h1,
  h2,
  h3 {
    text-wrap: balance;
  }

  h1 {
    font-size: 2.35rem;
    font-weight: 700;
    line-height: 1.1;
    margin: 0 0 0.75rem;
  }

  h1 + p {
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 1.5rem;
  }

  h2 {
    font-size: 1.9rem;
    font-weight: 700;
    line-height: 1.2;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.3;
  }

  p,
  li {
    line-height: 1.3;
  }
}

/* Split layouts (image-left/right, iframe-left/right): the text column is
   half the slide, so like iA use a smaller title and a tighter margin on
   the side of the image. */
.grid-cols-2 > .slidev-layout.default {
  h1 {
    font-size: 2rem;
  }

  h1 + p {
    font-size: 1.35rem;
  }
}

.grid-cols-2 > .slidev-layout.default:first-child {
  padding-right: 2.5rem;
}

.grid-cols-2 > .slidev-layout.default:last-child {
  padding-left: 2.5rem;
}

/* full: the whole slide, no margins */
.slidev-layout.full {
  padding: 0;
}

/* Every layout is top left, so text does not jump between slides.
   The default theme and core layouts center vertically (grid, my-auto)
   or horizontally (text-center); undo that here. Only \`center\` keeps
   vertical centering, still left aligned. */
.slidev-layout.cover,
.slidev-layout.intro,
.slidev-layout.section,
.slidev-layout.statement,
.slidev-layout.fact,
.slidev-layout.quote {
  display: block;
  place-content: normal;
  text-align: left;

  > div {
    margin: 0;
    text-align: left;
  }
}

.slidev-layout.center {
  place-content: center start;
  text-align: left;
}

/* Like iA Presenter, headings use text-wrap: balance so wrapped lines are
   even. Large titles are also capped at 70% of the slide so they do not
   run across the whole width. */
.slidev-layout.cover h1,
.slidev-layout.intro h1,
.slidev-layout.section h1,
.slidev-layout.center h1,
.slidev-layout.statement h1,
.slidev-layout.quote h1,
.slidev-page .slidev-layout.end.end h1 {
  max-width: 70%;
}

/* Sizes: title slides and statements are larger than a normal slide */
.slidev-layout.cover h1,
.slidev-layout.intro h1 {
  font-size: 4rem;
  line-height: 1.1;
}

.slidev-layout.cover h1 + p,
.slidev-layout.intro h1 + p {
  font-size: 1.9rem;
}

.slidev-layout.section h1,
.slidev-layout.center h1 {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
}

.slidev-layout.statement h1 {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.1;
}

.slidev-layout.fact h1 {
  font-size: 7rem;
  font-weight: 700;
  line-height: 1;
}

.slidev-layout.fact h1 + p {
  font-size: 1.9rem;
}

.slidev-layout.quote h1 {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
}

/* End: Slidev's core layout is white on black and centered via scoped
   CSS; use Opo colors and top left like the rest. */
.slidev-page .slidev-layout.end.end {
  /* align-content also applies to block containers in current browsers */
  display: block;
  place-content: normal;
  background: var(--opo-bg);
  color: var(--opo-text);
  text-align: left;
  font-size: 1.4rem;
  letter-spacing: normal;
}

.slidev-page .slidev-layout.end.end h1 {
  font-size: 3.5rem;
  font-weight: 700;
}
`;
}

export function generateSlidevShikiSetup() {
  return `import opoLight from './opo-light.json'
import opoDark from './opo-dark.json'

// Same shape as defineShikiSetup from @slidev/types, without the dependency.
export default function () {
  return {
    themes: {
      light: opoLight,
      dark: opoDark,
    },
  }
}
`;
}

// Example deck with one slide per built-in layout.
// Run from a Slidev project: npx slidev ../opo-theme/dist/slidev/example.md
export function generateSlidevExample() {
  return `---
theme: ./
title: Layout-voorbeelden
layout: cover
---

# cover

Titelslide. Gebruik \`layout: cover\` in de frontmatter van een slide.

---
layout: intro
---

# intro

Introductie van spreker of onderwerp.

Naam · functie · datum

---

# default

Zonder \`layout:\` krijg je deze. Titel bovenaan, inhoud eronder.

- Een opsomming
- Met **nadruk** en een [link](https://sli.dev)
- En \`inline code\`

---
layout: section
---

# section

Tussenslide voor een nieuw hoofdstuk.

---
layout: center
---

# center

Verticaal in het midden, links uitgelijnd. De enige layout die niet bovenaan begint.

---
layout: statement
---

# statement

Eén uitspraak, groot.

---
layout: fact
---

# 4 van 4

\`fact\`: één getal of feit met toelichting.

---
layout: quote
---

# "Wat doet déze afbeelding op déze plek?"

\`quote\`: een citaat met bron.

---
layout: two-cols
---

# two-cols

Linkerkolom. Alles vóór \`::right::\`.

::right::

## Rechts

Alles na \`::right::\` komt hier.

---
layout: two-cols-header
---

# two-cols-header

Kop over de volle breedte, daaronder twee kolommen.

::left::

Links: \`::left::\`

::right::

Rechts: \`::right::\`

---
layout: image-right
image: /voorbeeld.svg
---

# image-right

Tekst links, afbeelding rechts. Zet \`image:\` in de frontmatter. Met \`backgroundSize: contain\` wordt de afbeelding niet bijgesneden.

---
layout: image-left
image: /voorbeeld.svg
---

# image-left

Afbeelding links, tekst rechts.

---
layout: image
image: /voorbeeld.svg
---

---
layout: iframe-right
url: /voorbeeld.svg
---

# iframe-right

Tekst links, een webpagina rechts. Zet \`url:\` in de frontmatter. Werkt alleen als de site insluiten toestaat.

---
layout: iframe-left
url: /voorbeeld.svg
---

# iframe-left

Webpagina links, tekst rechts.

---
layout: iframe
url: /voorbeeld.svg
---

---
layout: none
---

# none

Helemaal geen styling, ook geen padding. Voor als je alles zelf wilt bepalen.

---
layout: full
---

# full

Geen padding: de inhoud gebruikt de hele slide. Handig voor eigen HTML of een grote afbeelding.

---
layout: end
---

# end

Afsluitende slide.

---

# Presenter notes

Tekst in een HTML-comment aan het eind van een slide verschijnt alleen in de presenter-weergave.

<!--
Dit zie je alleen op /presenter.
-->
`;
}

// Placeholder image for the image layouts in the example deck.
export function generateSlidevPlaceholder(variant) {
  const hex = (c) => formatHex(c);
  const ui = variant.ui;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <rect width="1600" height="1000" fill="${hex(ui.bgHover)}"/>
  <circle cx="1180" cy="330" r="150" fill="${hex(ui.accent)}" opacity="0.25"/>
  <path d="M0 1000 L520 480 L900 820 L1150 600 L1600 1000 Z" fill="${hex(ui.accent)}" opacity="0.35"/>
  <path d="M0 1000 L420 700 L760 1000 Z" fill="${hex(ui.fail)}" opacity="0.3"/>
</svg>
`;
}
