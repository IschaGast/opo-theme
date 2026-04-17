/**
 * Opo Theme — Slack Sidebar Theme Generator
 *
 * Slack sidebar themes are 8 comma-separated hex colors:
 *   Column BG, Menu BG Hover, Active Item, Active Item Text,
 *   Hover Item, Text Color, Active Presence, Mention Badge
 *
 * Paste the string into Slack > Preferences > Themes > Custom Theme.
 */

import { formatHex } from 'culori';

export function generateSlack(variant, mode) {
  const columnBg     = formatHex(variant.ui.bg);
  const menuBgHover  = formatHex(variant.ui.bgHover);
  const activeItem   = formatHex(variant.ui.accent);
  const activeText   = mode === 'dark' ? formatHex(variant.ui.bg) : '#ffffff';
  const hoverItem    = formatHex(variant.ui.bgPanel);
  const textColor    = formatHex(variant.ui.textMid);
  const presence     = formatHex(variant.ui.presence);
  const mentionBadge = formatHex(variant.ui.fail);

  const theme = [
    columnBg, menuBgHover, activeItem, activeText,
    hoverItem, textColor, presence, mentionBadge,
  ].join(',');

  const label = mode === 'hc' ? 'High Contrast' : mode.charAt(0).toUpperCase() + mode.slice(1);

  return [
    `Opo ${label} — Slack Sidebar Theme`,
    `https://github.com/IschaGast/opo-theme`,
    '',
    `Paste into Slack > Preferences > Themes > Custom Theme:`,
    '',
    theme,
    '',
  ].join('\n');
}
