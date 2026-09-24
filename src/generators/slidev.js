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
  // Themes must import the base layout styles themselves (padding, h-full).
  return `import '@slidev/client/styles/layouts-base.css'\nimport './opo.css'\nimport './layouts.css'\n`;
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
`;
}

// Only colors, font and iA Presenter-like spacing on top of Slidev's base
// layout styles; everything else stays Slidev default.
export function generateSlidevLayouts() {
  return `/* Opo — Slidev layout styles (generated) */

.slidev-slide-content,
.slidev-page {
  background: var(--opo-bg);
  color: var(--opo-text);
}

.slidev-layout {
  padding: 3.5rem 4.5rem;
  font-size: 1.35rem;
  line-height: 1.45;

  h1 {
    font-size: 2.6rem;
    font-weight: 600;
    line-height: 1.15;
    margin-bottom: 1.25rem;
  }

  h1 + p {
    color: var(--opo-text-mid);
    font-size: 1.4rem;
    margin-top: -0.5rem;
  }

  p,
  li {
    line-height: 1.45;
  }

  a {
    color: var(--opo-accent);
    text-decoration: underline;
    text-underline-offset: 0.15em;
    border-bottom: none;
  }
}

/* Cover and section: vertically centered, left aligned */
.slidev-layout.cover,
.slidev-layout.intro,
.slidev-layout.section {
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 3.2rem;
    line-height: 1.1;
  }
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

Alles in het midden van de slide.

---
layout: statement
---

# statement

Eén uitspraak, groot en gecentreerd.

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
