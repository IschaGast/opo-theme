/**
 * Opo Theme — OKLCH Source of Truth
 *
 * All colors are defined in OKLCH (Oklab LCH) color space.
 * Hex values are derived from these definitions using culori.
 *
 * OKLCH components:
 *   L = Lightness (0 = black, 1 = white)
 *   C = Chroma (0 = gray, higher = more saturated)
 *   H = Hue angle (0-360 degrees)
 *
 * Design principles:
 *   - Warm crème backgrounds (not pure white) for reduced eye strain
 *     (CMU reading study, BDA dyslexia guidelines, Solarized precedent)
 *   - Blue-green/orange for pass/fail — colorblind-safe (Okabe-Ito, 2008)
 *     while maintaining green="good" convention
 *   - All text validated at WCAG AA (4.5:1) against all three backgrounds
 */

// UI colors — Light variant (source of truth)
export const light = {
  // Backgrounds — warm crème (hue 85°), not pure white
  // CMU study: warm backgrounds improve reading performance
  // BDA: "use dark text on a light (not white) background"
  // Solarized/Kindle/Apple Books: all use warm off-white ~L=96-98%
  bg:        { mode: 'oklch', l: 0.9800, c: 0.0080, h: 85 },    // #fbf8f2 — warm crème
  bgPanel:   { mode: 'oklch', l: 0.9620, c: 0.0100, h: 85 },    // #f5f2eb
  bgHover:   { mode: 'oklch', l: 0.9380, c: 0.0120, h: 85 },    // #eeeae2

  // Text (low lightness, near-neutral cool gray)
  text:      { mode: 'oklch', l: 0.2785, c: 0.0132, h: 253.04 },  // #24292f
  textMid:   { mode: 'oklch', l: 0.4849, c: 0.0196, h: 251.02 },  // #57606a
  textFaint: { mode: 'oklch', l: 0.5000, c: 0.0170, h: 251.00 },  // #5c646d — darkened for warm bg AA

  // Semantic colors — colorblind-safe
  // Pass: blue-green (h=165) — reads as "green=good" but distinguishable
  //   from orange for all CVD types. Inspired by Surinamese flag green.
  // Fail: warm orange — universally distinct from blue-green (Okabe-Ito)
  accent:    { mode: 'oklch', l: 0.5000, c: 0.1890, h: 258.00 },  // #005ccc — darkened for warm bg AA
  pass:      { mode: 'oklch', l: 0.4200, c: 0.1000, h: 165.00 },  // #005d3f — blue-green
  fail:      { mode: 'oklch', l: 0.5000, c: 0.1420, h: 54.00 },   // #9e4600 — darkened for warm bg AA
  neutral:   { mode: 'oklch', l: 0.4849, c: 0.0196, h: 251.02 },  // #57606a
};

// Derived semi-transparent colors (from light palette)
export const lightAlpha = {
  accentSelection: 'rgba(0,92,204,0.35)',
  accentBg:        'rgba(0,92,204,0.08)',
  accentBorder:    'rgba(0,92,204,0.5)',
  passBg:          'rgba(0,93,63,0.08)',
  failBg:          'rgba(158,70,0,0.08)',
  neutralBg:       'rgba(87,96,106,0.08)',
  borderLight:     'rgba(87,96,106,0.35)',
  codeBg:          'rgba(0,0,0,0.04)',
};

// Syntax highlighting — 5 categories (minimalist)
// Each chosen for maximum distinguishability across all CVD types
export const syntax = {
  keyword:  { mode: 'oklch', l: 0.4200, c: 0.1000, h: 165.00 },  // #005d3f — blue-green (= pass)
  string:   { mode: 'oklch', l: 0.5000, c: 0.1420, h: 54.00 },   // #9e4600 — warm orange (= fail)
  comment:  { mode: 'oklch', l: 0.5000, c: 0.0100, h: 251.00 },  // #5f6469 — muted gray
  type:     { mode: 'oklch', l: 0.4600, c: 0.1200, h: 328.00 },  // #7b3c79 — reddish-purple
  function: { mode: 'oklch', l: 0.4400, c: 0.1000, h: 190.00 },  // #00635f — teal/cyan
};
