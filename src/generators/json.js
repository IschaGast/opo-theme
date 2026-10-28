/**
 * Opo Theme — JSON Color Tokens Generator
 * Output: one JSON file with every color per variant, as hex
 *
 * For build tools and places that cannot read CSS custom properties, such
 * as a web app manifest or a theme-color meta tag. Keys match palette.js:
 *   { light: { hues, ui, roles, syntax, severity, ansi: [16] }, dark: {...}, hc: {...} }
 */

import { formatHex } from 'culori';
import { hues, roles, severity } from '../palette.js';

export function generateJson(variants, ansiSets) {
  const hexes = (colors) => Object.fromEntries(Object.entries(colors).map(([k, c]) => [k, formatHex(c)]));
  const out = {};
  for (const [mode, variant] of Object.entries(variants)) {
    const ui = hexes(variant.ui);
    const syntax = hexes(variant.syntax);
    const pick = (path) => { const [group, key] = path.split('.'); return { ui, syntax }[group][key]; };
    out[mode] = {
      hues: Object.fromEntries(Object.entries(hues).map(([name, path]) => [name, pick(path)])),
      ui,
      roles: Object.fromEntries(Object.entries(roles).map(([name, key]) => [name, ui[key]])),
      syntax,
      severity: Object.fromEntries(Object.entries(severity).map(([name, key]) => [name, ui[key]])),
      ansi: [...ansiSets[mode].normal, ...ansiSets[mode].bright].map(c => formatHex(c)),
    };
  }
  return out;
}
