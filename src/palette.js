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
  neutral:   { mode: 'oklch', l: 0.4849, c: 0.0196, h: 251.02 },  // #57606a

  // Presence indicator — mid-lightness blue that stays legible on both
  // light crème and dark sidebar backgrounds. Slack ships one theme string
  // across desktop/mobile, and mobile forces a dark sidebar in dark mode
  // regardless of theme, so this color must clear ≥3:1 on both extremes.
  presence:  { mode: 'oklch', l: 0.6200, c: 0.1600, h: 258.00 },
};

// Syntax highlighting — 5 categories at unique lightness levels
// Lightness staircase: L=0.33, 0.40, 0.47, 0.50, 0.53
// Gaps of 0.07/0.07/0.03/0.03 — widened for CVD distinguishability
// CVD users can distinguish tokens by brightness + font style (bold/italic)
// Hues from maximally spread Okabe-Ito axes: blue, purple, gray, teal, orange
export const syntax = {
  keyword:  { mode: 'oklch', l: 0.3300, c: 0.1600, h: 258.00 },  // #003172 — blue (= pass, + bold)
  type:     { mode: 'oklch', l: 0.4000, c: 0.1200, h: 328.00 },  // #682b68 — purple
  comment:  { mode: 'oklch', l: 0.4700, c: 0.0100, h: 80.00 },   // #5e5a55 — warm gray (+ italic)
  function: { mode: 'oklch', l: 0.5000, c: 0.1000, h: 185.00 },  // #00736a — teal
  string:   { mode: 'oklch', l: 0.5300, c: 0.1400, h: 54.00 },   // #a55200 — orange (= fail)
};
