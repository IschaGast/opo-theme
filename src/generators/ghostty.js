/**
 * Opo Theme — Ghostty Theme Generator
 * Output: INI-style key=value (NOT TOML)
 */

import { formatHex } from 'culori';

export function generateGhostty(variant, ansi, mode) {
  const bg = formatHex(variant.ui.bg);
  const fg = formatHex(variant.ui.text);
  const cursor = formatHex(variant.ui.accent);
  // Solid accent selection with bg-colored text: visible at 3:1+ and
  // readable at AA/AAA (validated as 'inverted' in validate.js)
  const selection = formatHex(variant.ui.accent);
  const selectionFg = bg;

  const lines = [
    `# Opo ${mode.charAt(0).toUpperCase() + mode.slice(1)} — Colorblind-safe accessible theme`,
    `# https://github.com/IschaGast/opo-theme`,
    '',
    `background = ${bg}`,
    `foreground = ${fg}`,
    `cursor-color = ${cursor}`,
    `cursor-text = ${bg}`,
    `selection-background = ${selection}`,
    `selection-foreground = ${selectionFg}`,
  ];

  const all = [...ansi.normal, ...ansi.bright];
  for (let i = 0; i < 16; i++) {
    lines.push(`palette = ${i}=${formatHex(all[i])}`);
  }

  return lines.join('\n') + '\n';
}
