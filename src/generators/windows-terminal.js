/**
 * Opo Theme — Windows Terminal Theme Generator
 * Output: JSON (all variants in one file)
 * Note: Windows Terminal uses 'purple' instead of 'magenta'
 */

import { formatHex } from 'culori';

function generateScheme(variant, ansi, mode) {
  const label = mode === 'hc' ? 'High Contrast' : mode.charAt(0).toUpperCase() + mode.slice(1);

  return {
    name: `Opo ${label}`,
    background: formatHex(variant.ui.bg),
    foreground: formatHex(variant.ui.text),
    cursorColor: formatHex(variant.ui.accent),
    selectionBackground: formatHex(variant.ui.bgHover),
    black: formatHex(ansi.normal[0]),
    red: formatHex(ansi.normal[1]),
    green: formatHex(ansi.normal[2]),
    yellow: formatHex(ansi.normal[3]),
    blue: formatHex(ansi.normal[4]),
    purple: formatHex(ansi.normal[5]),
    cyan: formatHex(ansi.normal[6]),
    white: formatHex(ansi.normal[7]),
    brightBlack: formatHex(ansi.bright[0]),
    brightRed: formatHex(ansi.bright[1]),
    brightGreen: formatHex(ansi.bright[2]),
    brightYellow: formatHex(ansi.bright[3]),
    brightBlue: formatHex(ansi.bright[4]),
    brightPurple: formatHex(ansi.bright[5]),
    brightCyan: formatHex(ansi.bright[6]),
    brightWhite: formatHex(ansi.bright[7]),
  };
}

export function generateWindowsTerminal(variants, ansiSets) {
  const schemes = [];
  for (const [mode, variant] of Object.entries(variants)) {
    schemes.push(generateScheme(variant, ansiSets[mode], mode));
  }
  return JSON.stringify(schemes, null, 2) + '\n';
}
