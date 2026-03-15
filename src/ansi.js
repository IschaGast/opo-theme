/**
 * Opo Theme — 16 ANSI Terminal Colors
 *
 * Colorblind-safe strategy (Okabe-Ito):
 *   ANSI 1 (red)   → orange  — universally distinct from blue
 *   ANSI 2 (green) → blue    — universally distinct from orange
 *   ANSI 3 (yellow)→ amber   — distinct from both orange and blue in all CVD types
 *   ANSI 5 (magenta)→ reddish-purple — from Okabe-Ito palette
 *   ANSI 6 (cyan)  → teal    — distinct from blue in all CVD types
 *
 * Normal (0-7): designed for light backgrounds (high contrast vs white)
 * Bright (8-15): designed for dark backgrounds (high contrast vs dark)
 */

// Normal colors (ANSI 0-7)
export const normal = [
  { mode: 'oklch', l: 0.2785, c: 0.0132, h: 253.04 },  // 0 black   — text color
  { mode: 'oklch', l: 0.5400, c: 0.1417, h: 53.64 },    // 1 red     — orange (fail)
  { mode: 'oklch', l: 0.4509, c: 0.1641, h: 258.18 },   // 2 green   — blue (pass)
  { mode: 'oklch', l: 0.5500, c: 0.1400, h: 80.00 },    // 3 yellow  — amber
  { mode: 'oklch', l: 0.5333, c: 0.1892, h: 257.56 },   // 4 blue    — accent blue
  { mode: 'oklch', l: 0.4800, c: 0.1200, h: 328.00 },   // 5 magenta — reddish-purple
  { mode: 'oklch', l: 0.4600, c: 0.1000, h: 190.00 },   // 6 cyan    — teal
  { mode: 'oklch', l: 0.9472, c: 0.0069, h: 247.90 },   // 7 white   — bgHover
];

// Bright colors (ANSI 8-15)
export const bright = [
  { mode: 'oklch', l: 0.4849, c: 0.0196, h: 251.02 },   // 8  bright black   — textMid
  { mode: 'oklch', l: 0.7000, c: 0.1400, h: 53.64 },    // 9  bright red     — bright orange
  { mode: 'oklch', l: 0.6200, c: 0.1500, h: 258.18 },   // 10 bright green   — bright blue
  { mode: 'oklch', l: 0.7500, c: 0.1400, h: 80.00 },    // 11 bright yellow  — bright amber
  { mode: 'oklch', l: 0.6500, c: 0.1700, h: 257.56 },   // 12 bright blue    — bright accent
  { mode: 'oklch', l: 0.6200, c: 0.1200, h: 328.00 },   // 13 bright magenta — bright purple
  { mode: 'oklch', l: 0.6200, c: 0.1000, h: 190.00 },   // 14 bright cyan    — bright teal
  { mode: 'oklch', l: 1.0000, c: 0.0000, h: 0 },        // 15 bright white   — pure white
];

// Combined for easy iteration
export const ansi = [...normal, ...bright];
