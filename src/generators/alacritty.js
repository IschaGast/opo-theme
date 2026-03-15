/**
 * Opo Theme — Alacritty Theme Generator
 * Output: TOML
 */

import { formatHex } from 'culori';

const NAMES = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

export function generateAlacritty(variant, ansi, mode) {
  const bg = formatHex(variant.ui.bg);
  const fg = formatHex(variant.ui.text);
  const cursor = formatHex(variant.ui.accent);
  const selection = formatHex(variant.ui.bgHover);

  const lines = [
    `# Opo ${mode.charAt(0).toUpperCase() + mode.slice(1)} — Colorblind-safe accessible theme`,
    '',
    '[colors.primary]',
    `background = "${bg}"`,
    `foreground = "${fg}"`,
    '',
    '[colors.cursor]',
    `text = "${bg}"`,
    `cursor = "${cursor}"`,
    '',
    '[colors.selection]',
    `text = "${fg}"`,
    `background = "${selection}"`,
    '',
    '[colors.normal]',
  ];

  for (let i = 0; i < 8; i++) {
    lines.push(`${NAMES[i]}   = "${formatHex(ansi.normal[i])}"`);
  }

  lines.push('', '[colors.bright]');
  for (let i = 0; i < 8; i++) {
    lines.push(`${NAMES[i]}   = "${formatHex(ansi.bright[i])}"`);
  }

  return lines.join('\n') + '\n';
}
