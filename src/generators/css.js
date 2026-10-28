/**
 * Opo Theme — CSS Custom Properties Generator
 * Output: per-variant CSS files + combined with prefers-color-scheme
 *
 * Two layers, as in current themes and design systems:
 *   Hues       --opo-blue, --opo-orange, ...   primitive palette (palette.js)
 *   Base       --opo-bg, --opo-text, --opo-accent, ...  surfaces and text
 *   Roles      --opo-error, --opo-warning, --opo-success, --opo-info, with
 *              -bg tints, plus border, focus, link, selection, code, shadow
 *   Severity   --opo-severity-critical, -major, -minor
 * Every text color is validated on every background and tint (validate.js),
 * so any foreground variable may be used on any background variable.
 */

import { formatHex } from 'culori';
import { elevation, hues, roles, severity, tintAlpha } from '../palette.js';

const kebab = (key) => key.replace(/([A-Z])/g, '-$1').toLowerCase();

// All custom properties for one variant, grouped by layer
function variantVars(variant, mode) {
  const hex = (key) => formatHex(variant.ui[key]);
  const pick = (path) => { const [group, key] = path.split('.'); return formatHex(variant[group][key]); };
  const mix = (color, alpha) => `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
  const tint = tintAlpha[mode];
  const lift = elevation[mode];
  // Info uses the text selection tint, the other roles the highlight tint;
  // both keep every text color at AA (AAA for hc), see tintAlpha
  const roleTint = (key) => key === 'accent' ? tint.textSelection : tint.highlight;

  return [
    ['Hues (primitive palette)', Object.entries(hues).map(([name, path]) => `--opo-${name}: ${pick(path)};`)],
    ['Surfaces, text and semantic base colors', Object.entries(variant.ui).map(([key, color]) => `--opo-${kebab(key)}: ${formatHex(color)};`)],
    ['Syntax', Object.entries(variant.syntax).map(([key, color]) => `--opo-syntax-${key}: ${formatHex(color)};`)],
    ['Roles: error, warning, success and info, each with a tint', [
      ...Object.entries(roles).flatMap(([name, key]) => [
        `--opo-${name}: ${hex(key)};`,
        `--opo-${name}-bg: ${mix(hex(key), roleTint(key))};`,
      ]),
      `--opo-neutral-bg: ${mix(hex('neutral'), tint.listSelection)};`,
      // Text on a solid accent, error, warning or success fill
      `--opo-text-on-fill: ${hex('bg')};`,
    ]],
    ['Interface', [
      `--opo-border: ${hex('neutral')};`,
      // Decorative only: below 3:1, so not for boundaries that must be seen
      `--opo-border-muted: ${mix(hex('neutral'), 0.35)};`,
      `--opo-focus: ${hex('accent')};`,
      `--opo-link: ${hex('accent')};`,
      `--opo-code-bg: ${hex('bgPanel')};`,
      `--opo-shadow: ${mix('#000', lift.shadow)};`,
      `--opo-shadow-strong: ${mix('#000', lift.shadowStrong)};`,
      `--opo-backdrop: ${mix('#000', lift.backdrop)};`,
    ]],
    ['Selection: solid with bg-colored text, or tints where text keeps its color', [
      `--opo-selection: ${hex('accent')};`,
      `--opo-selection-text: ${hex('bg')};`,
      `--opo-accent-selection: ${mix(hex('accent'), tint.textSelection)};`,
      `--opo-accent-bg: ${mix(hex('accent'), tint.listSelection)};`,
      `--opo-accent-border: ${hex('accent')};`,
    ]],
    ['Severity scale for issues and findings (critical and major differ mostly in lightness: add a label or icon)',
      Object.entries(severity).flatMap(([name, key]) => [
        `--opo-severity-${name}: ${hex(key)};`,
        `--opo-severity-${name}-bg: ${mix(hex(key), roleTint(key))};`,
      ])],
    ['Earlier names, kept so existing code keeps working (prefer the roles above)', [
      `--opo-pass-bg: ${mix(hex('pass'), tint.highlight)};`,
      `--opo-fail-bg: ${mix(hex('fail'), tint.highlight)};`,
      `--opo-warn-bg: ${mix(hex('warn'), tint.highlight)};`,
      `--opo-border-light: ${mix(hex('neutral'), 0.35)};`,
    ]],
  ];
}

function rootBlock(variant, mode, indent) {
  const lines = [`${indent}:root {`];
  variantVars(variant, mode).forEach(([title, vars], i) => {
    if (i > 0) lines.push('');
    lines.push(`${indent}  /* ${title} */`);
    for (const line of vars) lines.push(`${indent}  ${line}`);
  });
  lines.push(`${indent}}`);
  return lines;
}

/**
 * All custom properties for one variant as { '--opo-bg': '#fbf8f2', ... },
 * for pages that switch variants at runtime (site, contrast grid).
 */
export function cssVariables(variant, mode) {
  return Object.fromEntries(variantVars(variant, mode).flatMap(([, vars]) =>
    vars.map(line => line.slice(0, -1).split(': '))));
}

function header(label) {
  return [
    `/* Opo ${label} — Colorblind-safe accessible theme */`,
    `/* https://github.com/IschaGast/opo-theme */`,
    '',
  ];
}

/**
 * Generate per-variant CSS file.
 */
export function generateCssVariant(variant, mode) {
  const label = mode === 'hc' ? 'High Contrast' : mode.charAt(0).toUpperCase() + mode.slice(1);
  return [...header(label), ...rootBlock(variant, mode, '')].join('\n') + '\n';
}

/**
 * Generate combined CSS with prefers-color-scheme.
 */
export function generateCssCombined(lightVariant, darkVariant) {
  return [
    ...header('Light and Dark'),
    ...rootBlock(lightVariant, 'light', ''),
    '',
    '@media (prefers-color-scheme: dark) {',
    ...rootBlock(darkVariant, 'dark', '  '),
    '}',
  ].join('\n') + '\n';
}
