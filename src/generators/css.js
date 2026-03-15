/**
 * Opo Theme — CSS Custom Properties Generator
 * Output: per-variant CSS files + combined with prefers-color-scheme
 */

import { formatHex } from 'culori';

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

  // Alpha variants
  const accent = formatHex(variant.ui.accent);
  const neutral = formatHex(variant.ui.neutral);
  const pass = formatHex(variant.ui.pass);
  const fail = formatHex(variant.ui.fail);

  lines.push('');
  lines.push('  /* Alpha variants */');
  lines.push(`  --opo-accent-selection: color-mix(in srgb, ${accent} 35%, transparent);`);
  lines.push(`  --opo-accent-bg: color-mix(in srgb, ${accent} 8%, transparent);`);
  lines.push(`  --opo-accent-border: color-mix(in srgb, ${accent} 50%, transparent);`);
  lines.push(`  --opo-pass-bg: color-mix(in srgb, ${pass} 8%, transparent);`);
  lines.push(`  --opo-fail-bg: color-mix(in srgb, ${fail} 8%, transparent);`);
  lines.push(`  --opo-neutral-bg: color-mix(in srgb, ${neutral} 8%, transparent);`);
  lines.push(`  --opo-border-light: color-mix(in srgb, ${neutral} 35%, transparent);`);

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

  const accent = formatHex(darkVariant.ui.accent);
  const neutral = formatHex(darkVariant.ui.neutral);
  const pass = formatHex(darkVariant.ui.pass);
  const fail = formatHex(darkVariant.ui.fail);

  darkLines.push('');
  darkLines.push(`    --opo-accent-selection: color-mix(in srgb, ${accent} 35%, transparent);`);
  darkLines.push(`    --opo-accent-bg: color-mix(in srgb, ${accent} 8%, transparent);`);
  darkLines.push(`    --opo-accent-border: color-mix(in srgb, ${accent} 50%, transparent);`);
  darkLines.push(`    --opo-pass-bg: color-mix(in srgb, ${pass} 8%, transparent);`);
  darkLines.push(`    --opo-fail-bg: color-mix(in srgb, ${fail} 8%, transparent);`);
  darkLines.push(`    --opo-neutral-bg: color-mix(in srgb, ${neutral} 8%, transparent);`);
  darkLines.push(`    --opo-border-light: color-mix(in srgb, ${neutral} 35%, transparent);`);

  darkLines.push('  }');
  darkLines.push('}');

  return lightCss + darkLines.join('\n') + '\n';
}
