/**
 * Opo Theme — 16 ANSI Terminal Colors
 *
 * Colorblind-safe strategy (Okabe-Ito):
 *   ANSI 1 (red)   → orange — universally distinct from blue
 *   ANSI 2 (green) → teal   — distinguishable from orange for all CVD types
 *   ANSI 3 (yellow)→ amber  — darker than orange, so the two stay apart
 *                              under deuteranopia (same hue family)
 *   ANSI 5 (magenta)→ raspberry — a purple hue collapses into blue under
 *                              deuteranopia, especially in high contrast
 * All chromatic pairs are checked for CVD distance in validate.js.
 *   ANSI 6 (cyan)  → blue-teal — distinct from teal and blue
 *
 * Normal (0-7): designed for light backgrounds
 * Bright (8-15): designed for dark backgrounds
 */

// Normal colors (ANSI 0-7)
export const normal = [
  { mode: 'oklch', l: 0.2785, c: 0.0132, h: 253.04 },  // 0 black   — text
  { mode: 'oklch', l: 0.5300, c: 0.1400, h: 54.00 },    // 1 red     — orange (fail)
  { mode: 'oklch', l: 0.5000, c: 0.1000, h: 185.00 },   // 2 green   — teal
  { mode: 'oklch', l: 0.4000, c: 0.1400, h: 80.00 },    // 3 yellow  — amber, darker than red
  { mode: 'oklch', l: 0.3300, c: 0.1600, h: 258.00 },   // 4 blue    — blue (pass)
  { mode: 'oklch', l: 0.4000, c: 0.1200, h: 0.00 },     // 5 magenta — raspberry
  { mode: 'oklch', l: 0.5000, c: 0.1890, h: 258.00 },   // 6 cyan    — accent blue
  { mode: 'oklch', l: 0.9380, c: 0.0120, h: 85.00 },    // 7 white   — bgHover
];

// Bright colors (ANSI 8-15)
// Only used by the dark variant (light and hc derive bright from normal).
// Lightness leaves room for a selection tint while every color stays at
// AA on the dark background (validated in validate.js).
export const bright = [
  { mode: 'oklch', l: 0.5800, c: 0.0196, h: 251.02 },   // 8  bright black   — textMid hue
  { mode: 'oklch', l: 0.7000, c: 0.1400, h: 54.00 },    // 9  bright red     — bright orange
  { mode: 'oklch', l: 0.6500, c: 0.1000, h: 185.00 },   // 10 bright green   — bright teal
  { mode: 'oklch', l: 0.7500, c: 0.1400, h: 80.00 },    // 11 bright yellow  — bright amber
  { mode: 'oklch', l: 0.6400, c: 0.1600, h: 258.00 },   // 12 bright blue    — bright blue
  { mode: 'oklch', l: 0.6600, c: 0.1200, h: 0.00 },     // 13 bright magenta — bright raspberry
  { mode: 'oklch', l: 0.7400, c: 0.1700, h: 258.00 },   // 14 bright cyan    — bright accent
  { mode: 'oklch', l: 1.0000, c: 0.0000, h: 0 },        // 15 bright white   — white
];

