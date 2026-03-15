/**
 * Opo Theme — Variant Derivation
 *
 * Generates Dark and High Contrast variants from the Light source palette.
 *
 * Dark: map lightness into dark range using a non-linear curve.
 *   Backgrounds: L ∈ [0.20, 0.27] (dark but not black)
 *   Text/colors: L remapped to provide equivalent contrast on dark bg.
 *   If result is out of sRGB gamut, reduce chroma until in-gamut.
 *
 * High Contrast: increase lightness delta by 25%, chroma by 15%.
 *   Target: WCAG AAA (7:1) for all text/bg pairings.
 */

import { clampChroma } from 'culori';

const BG_KEYS = ['bg', 'bgPanel', 'bgHover'];

/**
 * Remap lightness for dark mode.
 * Backgrounds (high L) → low L dark range.
 * Foregrounds (low L) → high L for readability on dark bg.
 * Colors (mid L) → pushed higher for dark bg contrast.
 */
function darkRemap(color, role) {
  let l;

  if (role === 'bg') {
    // Map bg lightness: 1.0→0.18, 0.978→0.20, 0.947→0.24
    // Linear interpolation within dark bg range
    const t = (1.0 - color.l) / (1.0 - 0.90); // normalized distance from white
    l = 0.18 + Math.min(t, 1) * 0.06;
  } else if (role === 'text') {
    // Text: invert relative to bg contrast relationship
    // Light text ≈ 0.28 → Dark text ≈ 0.87 (maintain contrast ratio)
    // Light textMid ≈ 0.48 → Dark textMid ≈ 0.70
    // Light textFaint ≈ 0.53 → Dark textFaint ≈ 0.65
    l = 0.30 + (1.0 - color.l) * 0.80;
  } else {
    // Semantic/syntax colors: boost lightness for dark bg readability
    // Ensure L >= 0.62 for minimum AA on dark bg
    l = Math.max(0.62, 0.35 + (1.0 - color.l) * 0.55);
  }

  const remapped = {
    mode: 'oklch',
    l: Math.max(0, Math.min(1, l)),
    c: color.c,
    h: color.h || 0,
  };
  return clampChroma(remapped, 'oklch');
}

/**
 * Increase contrast for HC variant.
 * Backgrounds push toward extremes, text/colors increase contrast.
 * Chroma increases by 15%.
 */
function highContrast(color, role) {
  const delta = 0.25;
  let l;

  if (role === 'bg') {
    l = Math.min(1, color.l + (1 - color.l) * delta);
  } else {
    l = Math.max(0, color.l - color.l * delta);
  }

  const hc = {
    mode: 'oklch',
    l,
    c: color.c * 1.15,
    h: color.h || 0,
  };
  return clampChroma(hc, 'oklch');
}

/**
 * Derive a full variant palette from the light source.
 */
export function deriveVariant(lightPalette, lightSyntax, mode) {
  if (mode === 'light') {
    return { ui: { ...lightPalette }, syntax: { ...lightSyntax } };
  }

  const ui = {};
  const syntax = {};

  if (mode === 'dark') {
    const textKeys = ['text', 'textMid', 'textFaint', 'neutral'];

    for (const [key, color] of Object.entries(lightPalette)) {
      const role = BG_KEYS.includes(key) ? 'bg'
        : textKeys.includes(key) ? 'text'
        : 'color';
      ui[key] = darkRemap(color, role);
    }
    for (const [key, color] of Object.entries(lightSyntax)) {
      syntax[key] = darkRemap(color, 'color');
    }
  } else if (mode === 'hc') {
    for (const [key, color] of Object.entries(lightPalette)) {
      const role = BG_KEYS.includes(key) ? 'bg' : 'fg';
      ui[key] = highContrast(color, role);
    }
    for (const [key, color] of Object.entries(lightSyntax)) {
      syntax[key] = highContrast(color, 'fg');
    }
  }

  return { ui, syntax };
}

/**
 * Derive ANSI colors for a variant.
 * Dark: use bright set as normal (better contrast on dark bg),
 *       boost normal set as bright.
 * HC: increase chroma for stronger colors.
 */
export function deriveAnsi(normalAnsi, brightAnsi, mode) {
  if (mode === 'light') {
    return { normal: [...normalAnsi], bright: [...brightAnsi] };
  }

  if (mode === 'dark') {
    // For dark mode, use bright colors as normal (they have higher L)
    // and create even brighter variants for the bright set
    return {
      normal: brightAnsi.map(c => clampChroma({
        mode: 'oklch', l: c.l, c: c.c, h: c.h || 0,
      }, 'oklch')),
      bright: brightAnsi.map(c => clampChroma({
        mode: 'oklch',
        l: Math.min(1, c.l + 0.12),
        c: c.c,
        h: c.h || 0,
      }, 'oklch')),
    };
  }

  if (mode === 'hc') {
    return {
      normal: normalAnsi.map(c => highContrast(c, 'fg')),
      bright: brightAnsi.map(c => {
        // Bright HC: boost lightness further
        const boosted = {
          mode: 'oklch',
          l: Math.min(1, c.l + 0.10),
          c: c.c * 1.15,
          h: c.h || 0,
        };
        return clampChroma(boosted, 'oklch');
      }),
    };
  }
}
