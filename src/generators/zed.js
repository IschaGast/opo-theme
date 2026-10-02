/**
 * Opo Theme — Zed Theme Generator
 * Output: JSON with 8-digit hex (RRGGBBFF with alpha)
 */

import { formatHex } from 'culori';
import { tintAlpha } from '../palette.js';

function hex8(hexColor, alpha = 1.0) {
  const aa = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return hexColor + aa;
}

// Git and diagnostic status colors; the background is a validated tint
// because Zed draws text on it (e.g. inline diagnostics)
function statusColors(colors, tint) {
  const out = {};
  for (const [name, color] of Object.entries(colors)) {
    out[name] = hex8(color);
    out[`${name}.background`] = hex8(color, tint.highlight);
    out[`${name}.border`] = hex8(color);
  }
  return out;
}

function generateZedVariant(variant, ansi, mode) {
  const p = {};
  for (const [k, v] of Object.entries(variant.ui)) p[k] = formatHex(v);
  const s = {};
  for (const [k, v] of Object.entries(variant.syntax)) s[k] = formatHex(v);

  const label = mode === 'hc' ? 'High Contrast' : mode.charAt(0).toUpperCase() + mode.slice(1);
  const isDark = mode === 'dark';
  // Tints with text on top stay within the validated alphas (palette.js)
  const tint = tintAlpha[mode];
  const transparent = '#00000000';

  return {
    name: `Opo ${label}`,
    appearance: isDark ? 'dark' : 'light',
    style: {
      'background.appearance': 'opaque',
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
      'editor.active_wrap_guide': hex8(p.neutral, 0.35),
      'editor.indent_guide': hex8(p.neutral, 0.2),
      'editor.indent_guide_active': hex8(p.neutral),
      'editor.subheader.background': hex8(p.bgPanel),
      'editor.document_highlight.read_background': hex8(p.accent, tint.textSelection / 2),
      'editor.document_highlight.write_background': hex8(p.accent, tint.textSelection / 2),
      'editor.document_highlight.bracket_background': hex8(p.accent, tint.textSelection / 2),

      border: hex8(p.neutral, 0.35),
      'border.variant': hex8(p.neutral, 0.2),
      'border.focused': hex8(p.accent),
      'border.selected': hex8(p.accent),
      'border.disabled': hex8(p.neutral, 0.2),
      'border.transparent': transparent,
      'pane.focused_border': hex8(p.accent),
      'panel.focused_border': hex8(p.accent),
      'pane_group.border': hex8(p.neutral, 0.35),

      'elevated_surface.background': hex8(p.bgPanel),
      'surface.background': hex8(p.bgPanel),
      'element.background': hex8(p.bgHover),
      'element.hover': hex8(p.bgHover),
      'element.selected': hex8(p.accent, tint.listSelection),
      'element.active': hex8(p.accent, tint.listSelection),
      'element.disabled': hex8(p.bgHover),
      // Ghost elements are list rows and buttons without their own
      // background, e.g. the project panel
      'ghost_element.background': transparent,
      'ghost_element.hover': hex8(p.bgHover),
      'ghost_element.selected': hex8(p.accent, tint.listSelection),
      'ghost_element.active': hex8(p.accent, tint.listSelection),
      'ghost_element.disabled': transparent,
      'drop_target.background': hex8(p.accent, tint.listSelection),

      'text': hex8(p.text),
      'text.muted': hex8(p.textMid),
      'text.placeholder': hex8(p.textFaint),
      'text.accent': hex8(p.accent),
      'text.disabled': hex8(p.textFaint),
      'link_text.hover': hex8(p.accent),

      'icon': hex8(p.text),
      'icon.muted': hex8(p.textMid),
      'icon.disabled': hex8(p.textFaint),
      'icon.placeholder': hex8(p.textFaint),
      'icon.accent': hex8(p.accent),

      // AI edit predictions and unreachable code: readable, not faded
      'predictive': hex8(p.textFaint),
      'predictive.background': hex8(p.bgPanel),
      'predictive.border': hex8(p.neutral, 0.35),
      'unreachable': hex8(p.textFaint),
      'unreachable.background': hex8(p.bgPanel),
      'unreachable.border': hex8(p.neutral, 0.35),

      // Cursor and selection; selection stays a tint because syntax colors
      // are drawn on top of it
      players: [
        { cursor: hex8(p.accent), background: hex8(p.accent), selection: hex8(p.accent, tint.textSelection) },
      ],
      // Rainbow brackets
      accents: [p.accent, s.type, s.function, p.warn, p.textMid, s.keyword].map(c => hex8(c)),

      // Git and diagnostic status — mirrors the VS Code mapping so Zed
      // does not fall back to its low-contrast default yellow
      ...statusColors({
        created: p.pass, modified: p.accent, deleted: p.fail, conflict: p.fail,
        renamed: p.accent, ignored: p.textFaint, hidden: p.textFaint,
        error: p.fail, warning: p.warn, info: p.accent, hint: p.textMid, success: p.pass,
      }, tint),

      'status_bar.background': hex8(p.bgPanel),
      'title_bar.background': hex8(p.bgPanel),
      'toolbar.background': hex8(p.bg),
      'tab_bar.background': hex8(p.bgPanel),
      'tab.active_background': hex8(p.bg),
      'tab.inactive_background': hex8(p.bgPanel),
      'search.match_background': hex8(p.accent, 0.25),
      'panel.background': hex8(p.bgPanel),
      'scrollbar.thumb.background': hex8(p.neutral, 0.2),
      'scrollbar.thumb.hover_background': hex8(p.neutral, 0.35),
      'scrollbar.thumb.border': transparent,
      'scrollbar.track.background': transparent,
      'scrollbar.track.border': transparent,
      'title_bar.inactive_background': hex8(p.bgPanel),
      'panel.indent_guide': hex8(p.neutral, 0.2),
      'panel.indent_guide_active': hex8(p.neutral),
      'panel.indent_guide_hover': hex8(p.neutral),

      'terminal.background': hex8(p.bg),
      'terminal.foreground': hex8(p.text),
      'terminal.ansi.background': hex8(p.bg),
      'terminal.bright_foreground': hex8(p.text),
      // Dim text stays readable instead of fading below AA
      'terminal.dim_foreground': hex8(p.textMid),
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
      ...Object.fromEntries(['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
        .map((name, i) => [`terminal.ansi.dim_${name}`, hex8(formatHex(ansi.normal[i]))])),

      syntax: {
        comment:  { color: hex8(s.comment), font_style: 'italic' },
        string:   { color: hex8(s.string) },
        keyword:  { color: hex8(s.keyword), font_weight: 700 },
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
