/**
 * Opo Theme — Contrast Grid Generator
 * Output: a self-contained HTML page that shows every pair the build checks
 *
 * The data comes from the same functions as the build gate in validate.js,
 * so the page shows exactly what is enforced: every text and syntax color on
 * every background and tint, inverted fills, CVD distance between color
 * pairs and the ANSI colors. Each color is also simulated under
 * deuteranopia, protanopia and tritanopia, so the page can preview them.
 *
 * The page itself lives in src/contrast/template.html; this file computes
 * the data and injects it as JSON, together with opo.css: the page uses
 * only Opo's custom properties for its own colors.
 */

import { readFileSync } from 'node:fs';
import { formatHex, parse } from 'culori';
import { tintAlpha } from '../palette.js';
import { ansiPairs, contrastPairs, cvdPairs, CVD_SIMULATIONS } from '../validate.js';
import { cssVariables, generateCssCombined } from './css.js';

const TEMPLATE = new URL('../contrast/template.html', import.meta.url);
const NAMES = { light: 'Light', dark: 'Dark', hc: 'High Contrast' };

// How each composited background is drawn (see tintAlpha in palette.js)
function backgroundNotes(mode) {
  const t = tintAlpha[mode];
  const pct = (a) => `${Math.round(Math.round(a * 255) / 255 * 100)}%`;
  return {
    listSelection: `accent ${pct(t.listSelection)} over bgPanel`,
    textSelection: `accent ${pct(t.textSelection)} over bg`,
    passTint: `pass ${pct(t.highlight)} over bg`,
    failTint: `fail ${pct(t.highlight)} over bg`,
    warnTint: `warn ${pct(t.highlight)} over bg`,
    neutralTint: `neutral ${pct(t.listSelection)} over bg`,
  };
}

function variantData(variant, ansi, mode) {
  const hex = (group) => Object.fromEntries(Object.entries(variant[group]).map(([k, c]) => [k, formatHex(c)]));
  const { target, label, results } = contrastPairs(variant, mode);
  const ansiResult = ansiPairs(variant, ansi, mode);
  const round = (n) => Math.round(n * 100) / 100;

  return {
    name: `Opo ${NAMES[mode]}`,
    target,
    label,
    ui: hex('ui'),
    syntax: hex('syntax'),
    notes: backgroundNotes(mode),
    contrast: results.map(r => ({ ...r, ratio: round(r.ratio) })),
    cvd: cvdPairs(variant).map(p => ({ ...p, d: round(p.d) })),
    ansi: {
      colors: [...ansi.normal, ...ansi.bright].map(c => formatHex(c)),
      contrast: ansiResult.contrast.map(r => ({ ...r, ratio: round(r.ratio) })),
      cvd: ansiResult.cvd.map(r => ({ ...r, d: round(r.d) })),
    },
  };
}

// Simulated hex for every color in the data (also inside color-mix() values),
// per CVD type
export function simulations(data) {
  const all = new Set();
  JSON.stringify(data, (key, value) => {
    if (typeof value === 'string') for (const [hex] of value.matchAll(/#[0-9a-f]{6}/g)) all.add(hex);
    return value;
  });
  const sims = {};
  for (const [name, simulate] of Object.entries(CVD_SIMULATIONS)) {
    if (name === 'normal') continue;
    sims[name] = Object.fromEntries([...all].map(h => [h, formatHex(simulate(parse(h)))]));
  }
  return sims;
}

export function generateContrastPage(variants, ansiSets) {
  const modes = {};
  for (const mode of Object.keys(variants)) {
    modes[mode] = variantData(variants[mode], ansiSets[mode], mode);
  }
  const data = opoPageData(variants, { modes });
  return fillTemplate(TEMPLATE, variants, data);
}

// Data shared by the pages that switch variants at runtime: the Opo custom
// properties per variant and the CVD simulation of every color in them
export function opoPageData(variants, data) {
  const vars = Object.fromEntries(Object.entries(variants).map(([mode, v]) => [mode, cssVariables(v, mode)]));
  return { ...data, vars, sims: simulations({ ...data, vars }) };
}

// Inline opo.css (so the page has Opo colors before any script runs) and
// the page data
export function fillTemplate(template, variants, data) {
  // Escape '<' so the JSON cannot close the script tag
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return readFileSync(template, 'utf-8')
    .replace('__OPO_CSS__', generateCssCombined(variants.light, variants.dark))
    .replace('__OPO_DATA__', json);
}
