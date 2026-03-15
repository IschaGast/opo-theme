/**
 * Opo Theme — Warp Terminal Theme Generator
 * Output: YAML
 */

import { formatHex } from 'culori';

const NAMES = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

export function generateWarp(variant, ansi, mode) {
  const label = mode === 'hc' ? 'High Contrast' : mode.charAt(0).toUpperCase() + mode.slice(1);
  const isDark = mode === 'dark';

  const lines = [
    `name: "Opo ${label}"`,
    `accent: "${formatHex(variant.ui.accent)}"`,
    `cursor: "${formatHex(variant.ui.accent)}"`,
    `background: "${formatHex(variant.ui.bg)}"`,
    `foreground: "${formatHex(variant.ui.text)}"`,
    `details: ${isDark ? 'darker' : 'lighter'}`,
    'terminal_colors:',
    '  normal:',
  ];

  for (let i = 0; i < 8; i++) {
    lines.push(`    ${NAMES[i]}: "${formatHex(ansi.normal[i])}"`);
  }

  lines.push('  bright:');
  for (let i = 0; i < 8; i++) {
    lines.push(`    ${NAMES[i]}: "${formatHex(ansi.bright[i])}"`);
  }

  return lines.join('\n') + '\n';
}
