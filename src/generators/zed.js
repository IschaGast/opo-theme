/**
 * Opo Theme — Zed Theme Generator
 * Output: JSON with 8-digit hex (RRGGBBFF with alpha)
 */

import { formatHex } from 'culori';

function hex8(hexColor, alpha = 1.0) {
  const aa = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return hexColor + aa;
}

function generateZedVariant(variant, ansi, mode) {
  const p = {};
  for (const [k, v] of Object.entries(variant.ui)) p[k] = formatHex(v);
  const s = {};
  for (const [k, v] of Object.entries(variant.syntax)) s[k] = formatHex(v);

  const label = mode === 'hc' ? 'High Contrast' : mode.charAt(0).toUpperCase() + mode.slice(1);
  const isDark = mode === 'dark';

  return {
    name: `Opo ${label}`,
    appearance: isDark ? 'dark' : 'light',
    style: {
      background: hex8(p.bg),
      'editor.background': hex8(p.bg),
      'editor.foreground': hex8(p.text),
      'editor.gutter.background': hex8(p.bg),
      'editor.line_number': hex8(p.textFaint),
      'editor.active_line_number': hex8(p.text),
      'editor.active_line.background': hex8(p.bgHover, 0.5),
      'editor.highlighted_line.background': hex8(p.bgHover),
      'editor.invisible': hex8(p.neutral, 0.2),
      'editor.wrap_guide': hex8(p.neutral, 0.15),

      border: hex8(p.neutral, 0.35),
      'border.variant': hex8(p.neutral, 0.2),
      'border.focused': hex8(p.accent),
      'border.selected': hex8(p.accent),

      'elevated_surface.background': hex8(p.bgPanel),
      'surface.background': hex8(p.bgPanel),
      'element.background': hex8(p.bgHover),
      'element.hover': hex8(p.bgHover),
      'element.selected': hex8(p.accent, 0.12),

      'text': hex8(p.text),
      'text.muted': hex8(p.textMid),
      'text.placeholder': hex8(p.textFaint),
      'text.accent': hex8(p.accent),

      'status_bar.background': hex8(p.bgPanel),
      'title_bar.background': hex8(p.bgPanel),
      'toolbar.background': hex8(p.bg),
      'tab_bar.background': hex8(p.bgPanel),
      'tab.active_background': hex8(p.bg),
      'tab.inactive_background': hex8(p.bgPanel),
      'search.match_background': hex8(p.accent, 0.25),
      'panel.background': hex8(p.bgPanel),
      'scrollbar.thumb.background': hex8(p.neutral, 0.2),

      'terminal.background': hex8(p.bg),
      'terminal.foreground': hex8(p.text),
      'terminal.ansi.black': hex8(formatHex(ansi.normal[0])),
      'terminal.ansi.red': hex8(formatHex(ansi.normal[1])),
      'terminal.ansi.green': hex8(formatHex(ansi.normal[2])),
      'terminal.ansi.yellow': hex8(formatHex(ansi.normal[3])),
      'terminal.ansi.blue': hex8(formatHex(ansi.normal[4])),
      'terminal.ansi.magenta': hex8(formatHex(ansi.normal[5])),
      'terminal.ansi.cyan': hex8(formatHex(ansi.normal[6])),
      'terminal.ansi.white': hex8(formatHex(ansi.normal[7])),
      'terminal.ansi.bright_black': hex8(formatHex(ansi.bright[0])),
      'terminal.ansi.bright_red': hex8(formatHex(ansi.bright[1])),
      'terminal.ansi.bright_green': hex8(formatHex(ansi.bright[2])),
      'terminal.ansi.bright_yellow': hex8(formatHex(ansi.bright[3])),
      'terminal.ansi.bright_blue': hex8(formatHex(ansi.bright[4])),
      'terminal.ansi.bright_magenta': hex8(formatHex(ansi.bright[5])),
      'terminal.ansi.bright_cyan': hex8(formatHex(ansi.bright[6])),
      'terminal.ansi.bright_white': hex8(formatHex(ansi.bright[7])),

      syntax: {
        comment:  { color: hex8(s.comment), font_style: 'italic' },
        string:   { color: hex8(s.string) },
        keyword:  { color: hex8(s.keyword) },
        function: { color: hex8(s.function) },
        type:     { color: hex8(s.type) },
        number:   { color: hex8(s.string) },
        variable: { color: hex8(p.text) },
        property: { color: hex8(p.text) },
        punctuation: { color: hex8(p.textMid) },
      },
    },
  };
}

export function generateZed(variants, ansiSets) {
  const themes = [];
  for (const [mode, variant] of Object.entries(variants)) {
    themes.push(generateZedVariant(variant, ansiSets[mode], mode));
  }

  return JSON.stringify({
    $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
    name: 'Opo',
    author: 'Opo Theme Contributors',
    themes,
  }, null, 2) + '\n';
}
