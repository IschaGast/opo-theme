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
 * Colorblind safety: blue/orange instead of green/red (Okabe-Ito, 2008)
 * All text colors validated at WCAG AA (4.5:1) against all three backgrounds.
 */

// UI colors — Light variant (source of truth)
export const light = {
  // Backgrounds (high lightness, near-neutral)
  bg:        { mode: 'oklch', l: 1.0000, c: 0.0000, h: 0 },       // #ffffff
  bgPanel:   { mode: 'oklch', l: 0.9782, c: 0.0034, h: 247.86 },  // #f6f8fa
  bgHover:   { mode: 'oklch', l: 0.9472, c: 0.0069, h: 247.90 },  // #eaeef2

  // Text (low lightness, near-neutral cool gray)
  text:      { mode: 'oklch', l: 0.2785, c: 0.0132, h: 253.04 },  // #24292f
  textMid:   { mode: 'oklch', l: 0.4849, c: 0.0196, h: 251.02 },  // #57606a
  textFaint: { mode: 'oklch', l: 0.5276, c: 0.0172, h: 251.29 },  // #646c75

  // Semantic colors (colorblind-safe: blue + orange)
  accent:    { mode: 'oklch', l: 0.5333, c: 0.1892, h: 257.56 },  // #0867d7
  pass:      { mode: 'oklch', l: 0.4509, c: 0.1641, h: 258.18 },  // #0550ae
  fail:      { mode: 'oklch', l: 0.5400, c: 0.1417, h: 53.64 },   // #ab5200
  neutral:   { mode: 'oklch', l: 0.4849, c: 0.0196, h: 251.02 },  // #57606a
};

// Derived semi-transparent colors (from light palette)
export const lightAlpha = {
  accentSelection: 'rgba(8,103,215,0.35)',
  accentBg:        'rgba(8,103,215,0.08)',
  accentBorder:    'rgba(8,103,215,0.5)',
  passBg:          'rgba(5,80,174,0.08)',
  failBg:          'rgba(179,89,0,0.08)',
  neutralBg:       'rgba(87,96,106,0.08)',
  borderLight:     'rgba(87,96,106,0.35)',
  codeBg:          'rgba(0,0,0,0.04)',
};

// Syntax highlighting — 5 categories (minimalist)
// Each chosen for maximum distinguishability across all CVD types
export const syntax = {
  keyword:  { mode: 'oklch', l: 0.4509, c: 0.1641, h: 258.18 },  // #0550ae — blue
  string:   { mode: 'oklch', l: 0.5400, c: 0.1417, h: 53.64 },   // #ab5200 — warm orange
  comment:  { mode: 'oklch', l: 0.5200, c: 0.0100, h: 251.00 },  // #65696f — muted gray
  type:     { mode: 'oklch', l: 0.4800, c: 0.1200, h: 328.00 },  // #81427f — reddish-purple
  function: { mode: 'oklch', l: 0.4600, c: 0.1000, h: 190.00 },  // #006964 — teal/cyan
};
