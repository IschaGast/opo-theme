/**
 * Opo Theme — 16 ANSI Terminal Colors
 *
 * Colorblind-safe strategy (Okabe-Ito):
 *   ANSI 1 (red)   → orange — universally distinct from blue
 *   ANSI 2 (green) → teal   — distinguishable from orange for all CVD types
 *   ANSI 3 (yellow)→ amber  — distinct from both orange and blue
 *   ANSI 5 (magenta)→ purple — from Okabe-Ito palette
 *   ANSI 6 (cyan)  → blue-teal — distinct from teal and blue
 *
 * Normal (0-7): designed for light backgrounds
 * Bright (8-15): designed for dark backgrounds
 */

// Normal colors (ANSI 0-7)
export const normal = [
  { mode: 'oklch', l: 0.2785, c: 0.0132, h: 253.04 },  // 0 black   — text
  { mode: 'oklch', l: 0.5200, c: 0.1400, h: 54.00 },    // 1 red     — orange (fail)
  { mode: 'oklch', l: 0.5000, c: 0.1000, h: 185.00 },   // 2 green   — teal
  { mode: 'oklch', l: 0.5200, c: 0.1400, h: 80.00 },    // 3 yellow  — amber
  { mode: 'oklch', l: 0.3600, c: 0.1600, h: 258.00 },   // 4 blue    — blue (pass)
  { mode: 'oklch', l: 0.4200, c: 0.1200, h: 328.00 },   // 5 magenta — purple
  { mode: 'oklch', l: 0.5000, c: 0.1890, h: 258.00 },   // 6 cyan    — accent blue
  { mode: 'oklch', l: 0.9380, c: 0.0120, h: 85.00 },    // 7 white   — bgHover
];

// Bright colors (ANSI 8-15)
export const bright = [
  { mode: 'oklch', l: 0.4849, c: 0.0196, h: 251.02 },   // 8  bright black   — textMid
  { mode: 'oklch', l: 0.7000, c: 0.1400, h: 54.00 },    // 9  bright red     — bright orange
  { mode: 'oklch', l: 0.6500, c: 0.1000, h: 185.00 },   // 10 bright green   — bright teal
  { mode: 'oklch', l: 0.7500, c: 0.1400, h: 80.00 },    // 11 bright yellow  — bright amber
  { mode: 'oklch', l: 0.5500, c: 0.1600, h: 258.00 },   // 12 bright blue    — bright blue
  { mode: 'oklch', l: 0.6200, c: 0.1200, h: 328.00 },   // 13 bright magenta — bright purple
  { mode: 'oklch', l: 0.6500, c: 0.1700, h: 258.00 },   // 14 bright cyan    — bright accent
  { mode: 'oklch', l: 1.0000, c: 0.0000, h: 0 },        // 15 bright white   — white
];

