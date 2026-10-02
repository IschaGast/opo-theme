/**
 * Opo Theme — Bear App Theme Generator
 * Output: .theme JSON files (Bear 2 format)
 *
 * Bear 2 uses plain JSON with five sections: base, sidebar, notes, placeholder, editor.
 * Colors reference other sections via "$section.key" syntax.
 * Installation: copy to /Applications/Bear.app/Contents/Frameworks/BearCore.framework/Versions/A/Resources/
 * (replaces an existing theme name; custom names don't appear in Bear's UI)
 */

import { formatHex, interpolate } from 'culori';
import { tintAlpha } from '../palette.js';

export function generateBear(variant, mode) {
  const hex = (color) => formatHex(color);
  const ui = variant.ui;
  const syn = variant.syntax;

  const isDark = mode === 'dark';

  // Bear draws text in its own color on top of selection and search
  // backgrounds, so these are validated tints, precomposited to opaque hex
  const tint = tintAlpha[mode];
  const over = (base, color, alpha) => hex(interpolate([base, color])(alpha));
  const textSelection = over(ui.bg, ui.accent, tint.textSelection);
  const listSelection = over(ui.bg, ui.accent, tint.listSelection);
  const searchBg = over(ui.bg, ui.warn, tint.highlight);

  // Sidebar: always dark chrome for light themes (like Red Graphite),
  // slightly lighter panel for dark themes
  const sidebarBg = isDark ? hex(ui.bgPanel) : '#2e3235';
  const sidebarBgSec = isDark ? hex(ui.bgHover) : '#474747';
  const sidebarText = isDark ? hex(ui.textMid) : '#d1d1d1';
  const sidebarTextSec = isDark ? hex(ui.text) : '#ffffff';
  const sidebarIcon = isDark ? hex(ui.textFaint) : '#9FA09F';
  const sidebarIconSel = isDark ? hex(ui.text) : '#FFFFFF';

  // Highlighter colors — accessible tints derived from Opo palette
  // Using the pass (blue) and fail (orange) semantic pair + purple/teal/amber
  const highlighters = isDark
    ? {
        default: { 'background color': '#3a4a2a', 'text color': '#d3ffa4' },
        red:     { 'background color': '#4a3020', 'text color': '#ffd5d5' },
        blue:    { 'background color': '#1a3050', 'text color': '#c9e5ff' },
        green:   { 'background color': '#1a3a2a', 'text color': '#cdf7bd' },
        yellow:  { 'background color': '#3a3510', 'text color': '#fcf195' },
        purple:  { 'background color': '#3a2040', 'text color': '#fedaff' },
      }
    : {
        default: { 'background color': '#D3FFA4', 'text color': '#1A3200' },
        red:     { 'background color': '#FFD5D5', 'text color': '#321A00' },
        blue:    { 'background color': '#C9E5FF', 'text color': '#001A32' },
        green:   { 'background color': '#CDF7BD', 'text color': '#102D05' },
        yellow:  { 'background color': '#FCF195', 'text color': '#312C01' },
        purple:  { 'background color': '#FEDAFF', 'text color': '#310032' },
      };

  const theme = {
    base: {
      'text color': hex(ui.text),
      'text secondary color': hex(ui.textMid),
      // Markdown markers and placeholders: readable, not near-invisible
      'text tertiary color': hex(ui.textFaint),
      'background color': hex(ui.bg),
      'background secondary color': hex(ui.bgPanel),
      'background tertiary color': hex(ui.bgHover),
      'stroke color': hex(ui.bgHover),
      'accent color': hex(ui.accent),
      'search primary color': searchBg,
      'search secondary color': '$base.selection color',
      'selection color': textSelection,
    },
    notes: {
      'title color': '$base.text color',
      'subtitle color': '$base.text secondary color',
      'placeholder color': '$base.text secondary color',
      'date color': '$base.text secondary color',
      'pin color': '$base.accent color',
      'separator color': '$base.background tertiary color',
      'search background color': '$base.search primary color',
      'attachment background color': '$base.background secondary color',
      'encrypted token color': '$base.background tertiary color',
      'selection background color': listSelection,
      'ribbon color': '$base.accent color',
      toolbar: {
        'background color': '$base.background color',
        'text color': '$base.text color',
        'icon color': '$base.text secondary color',
        'hover color': '$base.background secondary color',
      },
    },
    sidebar: {
      'text color': sidebarText,
      'text secondary color': sidebarTextSec,
      'background color': sidebarBg,
      'background secondary color': sidebarBgSec,
      'stroke color': '$sidebar.background color',
      'accent color': hex(ui.accent),
      'icon color': sidebarIcon,
      'selected icon color': sidebarIconSel,
      toolbar: {
        'background color': '$sidebar.background color',
        'icon color': '$sidebar.icon color',
        'hover color': '$sidebar.background secondary color',
      },
    },
    placeholder: {
      'background color': '$base.background color',
      'background stroke color': '$base.background tertiary color',
      'shadow color': hex(ui.bgPanel),
      'stroke color': '$base.text tertiary color',
    },
    editor: {
      'background color': '$base.background color',
      'text color': '$base.text color',
      'text light color': '$base.text secondary color',
      'accent color': '$base.accent color',
      'cursor color': '$base.accent color',
      'link color': '$base.accent color',
      'list marker color': '$base.accent color',
      'marker color': '$base.text tertiary color',
      'selection color': '$base.selection color',
      'selection inactive color': '$base.background tertiary color',
      'text font': 'BearSansUI-Regular',
      'text size': 15,
      'line height multiplier': 1.5,
      headers: {
        'text color': '$base.text color',
        'font': 'BearSansUIHeading-Regular',
        'modular scale': 1.125,
        'line height multiplier': 1.3,
        'add top bottom padding': 1,
        'padding top multiplier': 0.5,
        'padding bottom multiplier': 0.3,
      },
      code: {
        'text color': '$base.text color',
        'border color': '$base.text tertiary color',
        'background color': '$base.background secondary color',
        'font': 'RobotoMono-Regular',
        'syntax highlight': {
          comment: hex(syn.comment),
          constant: hex(ui.accent),
          number: hex(ui.accent),
          string: hex(syn.string),
          entity: hex(syn.function),
          keyword: hex(syn.keyword),
          function: hex(syn.function),
          variable: hex(syn.type),
        },
      },
      task: {
        'background color': '$base.background color',
        'border color': '$base.text secondary color',
        'check color': '$base.text color',
      },
      tag: {
        'background color': '$base.background tertiary color',
        'text color': '$base.text color',
        'marker color': '$base.text secondary color',
      },
      highlighter: highlighters,
      separator: {
        'border color': '$base.stroke color',
      },
      table: {
        'border color': '$base.stroke color',
        'cell background color': '$base.background color',
        'cell alternate background color': '$base.background secondary color',
      },
      toolbar: {
        'icon color': '$base.text secondary color',
        'hover color': '$base.background secondary color',
      },
    },
  };

  return JSON.stringify(theme, null, 2) + '\n';
}
