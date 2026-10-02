/**
 * Opo Theme — CSS Custom Properties Generator
 * Output: per-variant CSS files + combined with prefers-color-scheme
 */

import { formatHex } from 'culori';
import { tintAlpha } from '../palette.js';

// Tint and selection variables. Tints use the validated alphas from
// palette.js, so any palette text color stays at AA (AAA for hc) on them.
// --opo-selection / --opo-selection-text are a solid fill with bg-colored
// text, for ::selection and other places that can set the text color.
function alphaVars(variant, mode) {
  const hex = (key) => formatHex(variant.ui[key]);
  const mix = (key, alpha) => `color-mix(in srgb, ${hex(key)} ${Math.round(alpha * 100)}%, transparent)`;
  const tint = tintAlpha[mode];
  return [
    `--opo-selection: ${hex('accent')};`,
    `--opo-selection-text: ${hex('bg')};`,
    `--opo-accent-selection: ${mix('accent', tint.textSelection)};`,
    `--opo-accent-bg: ${mix('accent', tint.listSelection)};`,
    `--opo-accent-border: ${hex('accent')};`,
    `--opo-pass-bg: ${mix('pass', tint.highlight)};`,
    `--opo-fail-bg: ${mix('fail', tint.highlight)};`,
    `--opo-warn-bg: ${mix('warn', tint.highlight)};`,
    `--opo-neutral-bg: ${mix('neutral', tint.listSelection)};`,
    `--opo-border-light: ${mix('neutral', 0.35)};`,
  ];
}

function cssVariant(variant, mode) {
  const label = mode === 'hc' ? 'High Contrast' : mode.charAt(0).toUpperCase() + mode.slice(1);
  const lines = [
    `/* Opo ${label} — Colorblind-safe accessible theme */`,
    `/* https://github.com/IschaGast/opo-theme */`,
    '',
    ':root {',
  ];

  // UI colors
  for (const [key, color] of Object.entries(variant.ui)) {
    const name = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --opo-${name}: ${formatHex(color)};`);
  }

  lines.push('');
  lines.push('  /* Syntax */');
  for (const [key, color] of Object.entries(variant.syntax)) {
    lines.push(`  --opo-syntax-${key}: ${formatHex(color)};`);
  }

  lines.push('');
  lines.push('  /* Tints and selection (validated alphas, see palette.js) */');
  for (const line of alphaVars(variant, mode)) lines.push(`  ${line}`);

  lines.push('}');
  return lines.join('\n') + '\n';
}

/**
 * Generate per-variant CSS file.
 */
export function generateCssVariant(variant, mode) {
  return cssVariant(variant, mode);
}

/**
 * Generate combined CSS with prefers-color-scheme.
 */
export function generateCssCombined(lightVariant, darkVariant) {
  const lightCss = cssVariant(lightVariant, 'light');
  const darkLines = [];

  darkLines.push('');
  darkLines.push('@media (prefers-color-scheme: dark) {');

  // Re-generate dark vars inside media query
  darkLines.push('  :root {');
  for (const [key, color] of Object.entries(darkVariant.ui)) {
    const name = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    darkLines.push(`    --opo-${name}: ${formatHex(color)};`);
  }
  darkLines.push('');
  for (const [key, color] of Object.entries(darkVariant.syntax)) {
    darkLines.push(`    --opo-syntax-${key}: ${formatHex(color)};`);
  }

  darkLines.push('');
  for (const line of alphaVars(darkVariant, 'dark')) darkLines.push(`    ${line}`);

  darkLines.push('  }');
  darkLines.push('}');

  return lightCss + darkLines.join('\n') + '\n';
}
