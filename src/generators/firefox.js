/**
 * Opo Theme — Firefox Static Theme Generator
 * Output: theme add-on manifests (manifest.json per add-on)
 *
 * Opo uses `theme` for light and `dark_theme` for dark in one add-on, so
 * Firefox switches with its own light/dark setting (which follows the OS by
 * default). High Contrast is a separate add-on without a dark theme.
 *
 * Selections and highlighted rows in popups and the sidebar are solid
 * accent with bg-colored text, as in the other tools. Inactive tabs use
 * textMid on the frame (bgHover), the selected tab joins the toolbar (bg).
 *
 * Docs: https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme
 */

import { formatHex } from 'culori';
import { tintAlpha } from '../palette.js';

function hexAlpha(hexColor, a) {
  const aa = Math.round(a * 255).toString(16).padStart(2, '0');
  return hexColor + aa;
}

function themeColors(variant, mode) {
  const p = Object.fromEntries(Object.entries(variant.ui).map(([k, c]) => [k, formatHex(c)]));
  const border = hexAlpha(p.neutral, 0.35);

  return {
    frame: p.bgHover,
    frame_inactive: p.bgPanel,
    tab_background_text: p.textMid,
    tab_selected: p.bg,
    tab_text: p.text,
    tab_line: p.accent,
    tab_loading: p.accent,
    toolbar: p.bg,
    toolbar_text: p.text,
    toolbar_top_separator: p.bgHover,
    toolbar_bottom_separator: p.bgHover,
    toolbar_vertical_separator: p.bgHover,
    toolbar_field: p.bgPanel,
    toolbar_field_text: p.text,
    toolbar_field_border: border,
    toolbar_field_focus: p.bg,
    toolbar_field_text_focus: p.text,
    toolbar_field_border_focus: p.accent,
    toolbar_field_highlight: p.accent,
    toolbar_field_highlight_text: p.bg,
    popup: p.bg,
    popup_text: p.text,
    popup_border: p.bgHover,
    popup_highlight: p.accent,
    popup_highlight_text: p.bg,
    sidebar: p.bgPanel,
    sidebar_text: p.text,
    sidebar_border: p.bgHover,
    sidebar_highlight: p.accent,
    sidebar_highlight_text: p.bg,
    ntp_background: p.bg,
    ntp_card_background: p.bgPanel,
    ntp_text: p.text,
    icons: p.textMid,
    icons_attention: p.accent,
    button_background_hover: p.bgHover,
    button_background_active: hexAlpha(p.accent, tintAlpha[mode].textSelection),
  };
}

function manifest(name, description, id, theme, darkTheme) {
  return {
    manifest_version: 2,
    name,
    version: '1.0.0',
    description,
    author: 'Ischa Gast',
    homepage_url: 'https://github.com/IschaGast/opo-theme',
    browser_specific_settings: { gecko: { id } },
    theme,
    ...(darkTheme && { dark_theme: darkTheme }),
  };
}

export function generateFirefox(variants) {
  return {
    'opo/manifest.json': manifest(
      'Opo',
      'Colorblind-safe, OKLCH-based accessible theme. Follows the Firefox light/dark setting.',
      'opo-theme@ischagast',
      { colors: themeColors(variants.light, 'light') },
      { colors: themeColors(variants.dark, 'dark') },
    ),
    'opo-hc/manifest.json': manifest(
      'Opo High Contrast',
      'Colorblind-safe, OKLCH-based accessible theme at WCAG AAA (7:1).',
      'opo-theme-hc@ischagast',
      { colors: themeColors(variants.hc, 'hc') },
    ),
  };
}
