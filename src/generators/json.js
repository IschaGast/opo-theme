/**
 * Opo Theme — JSON Color Tokens Generator
 * Output: one JSON file with every color per variant, as hex
 *
 * For build tools and places that cannot read CSS custom properties, such
 * as a web app manifest or a theme-color meta tag. Keys match palette.js:
 *   { light: { ui, syntax, severity, ansi: [16] }, dark: {...}, hc: {...} }
 */

import { formatHex } from 'culori';
import { severity } from '../palette.js';

export function generateJson(variants, ansiSets) {
  const hexes = (colors) => Object.fromEntries(Object.entries(colors).map(([k, c]) => [k, formatHex(c)]));
  const out = {};
  for (const [mode, variant] of Object.entries(variants)) {
    const ui = hexes(variant.ui);
    out[mode] = {
      ui,
      syntax: hexes(variant.syntax),
      severity: Object.fromEntries(Object.entries(severity).map(([name, key]) => [name, ui[key]])),
      ansi: [...ansiSets[mode].normal, ...ansiSets[mode].bright].map(c => formatHex(c)),
    };
  }
  return out;
}
