/**
 * Opo Theme — OKLCH Source of Truth
 *
 * All colors are defined in OKLCH (Oklab LCH) color space.
 * Hex values are derived from these definitions using culori.
 *
 * Design principles:
 *   - Warm crème backgrounds (not pure white) for reduced eye strain
 *     (CMU reading study, BDA dyslexia guidelines, Solarized precedent)
 *   - Blue/orange for pass/fail — universally distinguishable (Okabe-Ito)
 *   - All text validated at WCAG AA (4.5:1) against all three backgrounds
 *   - Each syntax color at a unique OKLCH lightness level so that
 *     CVD users can distinguish tokens by brightness alone
 *   - Keyword uses bold, comment uses italic as non-color differentiators (WCAG 1.4.1)
 *   - All 10 syntax pairs verified distinguishable under deuteranopia,
 *     protanopia, and tritanopia using culori CVD simulation
 */

// UI colors — Light variant (source of truth)
export const light = {
  // Backgrounds — warm crème (hue 85°), not pure white
  // CMU study: warm backgrounds improve reading performance
  // BDA: "use dark text on a light (not white) background"
  // Solarized/Kindle/Apple Books: all use warm off-white ~L=96-98%
  bg:        { mode: 'oklch', l: 0.9800, c: 0.0080, h: 85 },    // #fbf8f2
  bgPanel:   { mode: 'oklch', l: 0.9620, c: 0.0100, h: 85 },    // #f5f2eb
  bgHover:   { mode: 'oklch', l: 0.9380, c: 0.0120, h: 85 },    // #eeeae2

  // Text (low lightness, near-neutral cool gray)
  text:      { mode: 'oklch', l: 0.2785, c: 0.0132, h: 253.04 },  // #24292f
  textMid:   { mode: 'oklch', l: 0.4849, c: 0.0196, h: 251.02 },  // #57606a
  textFaint: { mode: 'oklch', l: 0.5000, c: 0.0170, h: 251.00 },  // #5c646d

  // Semantic colors — Okabe-Ito colorblind-safe
  // Blue/orange: most universally distinguishable pair (Okabe-Ito, 2008)
  accent:    { mode: 'oklch', l: 0.5000, c: 0.1890, h: 258.00 },  // #005ccc
  pass:      { mode: 'oklch', l: 0.3300, c: 0.1600, h: 258.00 },  // #003172 — blue
  fail:      { mode: 'oklch', l: 0.5300, c: 0.1400, h: 54.00 },   // #a55200 — orange
  // Warning: amber at a much lower lightness than fail, so error and warning
  // stay distinct under CVD (min CIEDE2000 9.3 vs fail across all variants)
  warn:      { mode: 'oklch', l: 0.3600, c: 0.1000, h: 80.00 },   // #583500 — amber
  neutral:   { mode: 'oklch', l: 0.4849, c: 0.0196, h: 251.02 },  // #57606a
};

// Syntax highlighting — 5 categories at unique lightness levels
// Lightness staircase: L=0.33, 0.40, 0.47, 0.50, 0.53
// Gaps of 0.07/0.07/0.03/0.03 — widened for CVD distinguishability
// CVD users can distinguish tokens by brightness + font style (bold/italic)
// Hues from maximally spread Okabe-Ito axes: blue, plum, gray, teal, orange
// Type (plum, h350) and function (teal, h190) hues are tuned so every pair
// stays apart under deuteranopia, protanopia and tritanopia in all variants:
// min CIEDE2000 9.0 for pairs without a font style, 5.0 for pairs where
// bold/italic also differs (validated in validate.js)
export const syntax = {
  keyword:  { mode: 'oklch', l: 0.3300, c: 0.1600, h: 258.00 },  // #003172 — blue (= pass, + bold)
  type:     { mode: 'oklch', l: 0.4000, c: 0.1200, h: 350.00 },  // #742651 — plum
  comment:  { mode: 'oklch', l: 0.4700, c: 0.0100, h: 80.00 },   // #5e5a55 — warm gray (+ italic)
  function: { mode: 'oklch', l: 0.5000, c: 0.1000, h: 190.00 },  // #007570 — teal
  string:   { mode: 'oklch', l: 0.5300, c: 0.1400, h: 54.00 },   // #a55200 — orange (= fail)
};

// Tints with text drawn on top, per variant. Each value is at or below the
// highest alpha at which every text and syntax color keeps its contrast
// target (AA, AAA for hc); validate.js enforces this at build time.
//   listSelection: accent over bgPanel (selected rows in file trees, lists)
//   textSelection: accent over bg (editor selection where syntax colors stay)
//   highlight:     pass/fail/warn over bg (find matches, diff and merge lines)
//   terminalSelection: accent over bg, with ANSI colors on top (terminals
//                  without a selection foreground, e.g. Windows Terminal)
// Tools that support a separate selection foreground use a solid accent
// selection with bg-colored text instead (see 'inverted' in validate.js).
export const tintAlpha = {
  light: { listSelection: 0.06, textSelection: 0.09, highlight: 0.08, terminalSelection: 0.07 },
  dark:  { listSelection: 0.20, textSelection: 0.20, highlight: 0.16, terminalSelection: 0.10 },
  hc:    { listSelection: 0.12, textSelection: 0.14, highlight: 0.12, terminalSelection: 0.12 },
};
