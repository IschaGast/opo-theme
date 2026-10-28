/**
 * Opo Theme — Raycast Theme Generator
 * Output: per-variant theme JSON (ray.so format) and an import link
 *
 * A Raycast theme is one appearance (light or dark) with 12 colors. The
 * import link passes them as a comma-separated list in this order (see
 * makeRaycastImportUrl in github.com/raycast/ray-so):
 *   background, backgroundSecondary, text, selection, loader,
 *   red, orange, yellow, green, blue, purple, magenta
 *
 * Raycast draws the selection with its own transparency, so it takes the
 * solid accent (as GitHub Light does). The seven named colors follow the
 * colorblind-safe ANSI mapping (red is orange, green is teal), so every one
 * of them is a color that is validated as text on the background. Opo has
 * no separate orange or purple: orange is the bright red slot and purple
 * the cyan slot (accent blue).
 *
 * Open the link to add the theme (custom themes need Raycast Pro), then set
 * it under Settings > General > Appearance. Opo Light and Opo High Contrast
 * are light themes, Opo Dark is a dark theme.
 */

import { formatHex } from 'culori';

const NAMES = { light: 'Opo Light', dark: 'Opo Dark', hc: 'Opo High Contrast' };

export function generateRaycastTheme(variant, ansi, mode) {
  const ui = (key) => formatHex(variant.ui[key]);
  const slot = (i) => formatHex(i < 8 ? ansi.normal[i] : ansi.bright[i - 8]);

  return {
    author: 'Ischa Gast',
    authorUsername: 'ischagast',
    version: '1',
    name: NAMES[mode],
    appearance: mode === 'dark' ? 'dark' : 'light',
    colors: {
      background: ui('bg'),
      backgroundSecondary: ui('bgPanel'),
      text: ui('text'),
      selection: ui('accent'),
      loader: ui('accent'),
      red: slot(1),
      orange: slot(9),
      yellow: slot(3),
      green: slot(2),
      blue: slot(4),
      purple: slot(6),
      magenta: slot(5),
    },
  };
}

// raycast://theme link, built the same way as makeRaycastImportUrl
export function generateRaycastLink(theme) {
  const { colors, ...rest } = theme;
  const params = Object.entries(rest).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  params.push(`colors=${Object.values(colors).map(encodeURIComponent).join(',')}`);
  return `raycast://theme?${params.join('&')}`;
}
