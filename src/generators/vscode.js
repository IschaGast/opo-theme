/**
 * Opo Theme — VS Code Theme Generator
 *
 * Generates VS Code color theme JSON files + package.json.
 * Output: dist/vscode/
 */

import { formatHex } from 'culori';
import { scopeMap } from '../scopes.js';

function hexAlpha(hexColor, a) {
  const aa = Math.round(a * 255).toString(16).padStart(2, '0');
  return hexColor + aa;
}

/**
 * Generate VS Code theme JSON for a single variant.
 */
export function generateTheme(variant, ansi, mode) {
  const p = {};
  for (const [k, v] of Object.entries(variant.ui)) p[k] = formatHex(v);
  const s = {};
  for (const [k, v] of Object.entries(variant.syntax)) s[k] = formatHex(v);
  const a = {
    normal: ansi.normal.map(hex),
    bright: ansi.bright.map(hex),
  };

  const isDark = mode === 'dark';
  const isHc = mode === 'hc';

  // Derive alpha colors
  const accentBg = hexAlpha(p.accent, 0.08);
  const accentSelection = hexAlpha(p.accent, 0.35);
  const accentBorder = hexAlpha(p.accent, 0.5);
  const borderLight = hexAlpha(p.neutral, 0.35);
  const passBg = hexAlpha(p.pass, 0.08);
  const failBg = hexAlpha(p.fail, 0.08);
  const neutralBg = hexAlpha(p.neutral, 0.08);
  const transparent = '#00000000';
  const shadow = isDark ? hexAlpha('#000000', 0.3) : hexAlpha('#000000', 0.08);

  const variantLabel = mode === 'hc' ? 'High Contrast' : mode.charAt(0).toUpperCase() + mode.slice(1);

  return {
    name: `Opo ${variantLabel}`,
    type: isDark ? 'dark' : 'light',
    colors: {
      // Editor
      'editor.background': p.bg,
      'editor.foreground': p.text,
      'editor.lineHighlightBackground': hexAlpha(p.bgHover, 0.5),
      'editor.selectionBackground': accentSelection,
      'editor.inactiveSelectionBackground': hexAlpha(p.accent, 0.15),
      'editor.wordHighlightBackground': hexAlpha(p.accent, 0.12),
      'editor.findMatchBackground': hexAlpha(p.accent, 0.25),
      'editor.findMatchHighlightBackground': hexAlpha(p.accent, 0.12),
      'editorCursor.foreground': p.accent,
      'editorWhitespace.foreground': hexAlpha(p.neutral, 0.2),
      'editorIndentGuide.background': borderLight,
      'editorIndentGuide.activeBackground': p.neutral,
      'editorLineNumber.foreground': p.textFaint,
      'editorLineNumber.activeForeground': p.text,
      'editorBracketMatch.background': hexAlpha(p.accent, 0.12),
      'editorBracketMatch.border': accentBorder,
      'editorGutter.addedBackground': p.pass,
      'editorGutter.deletedBackground': p.fail,
      'editorGutter.modifiedBackground': p.accent,
      'editorError.foreground': p.fail,
      'editorWarning.foreground': s.string,
      'editorInfo.foreground': p.accent,

      // Diff
      'diffEditor.insertedTextBackground': hexAlpha(p.pass, 0.1),
      'diffEditor.removedTextBackground': hexAlpha(p.fail, 0.1),

      // Sidebar
      'sideBar.background': p.bgPanel,
      'sideBar.foreground': p.text,
      'sideBar.border': borderLight,
      'sideBarTitle.foreground': p.text,
      'sideBarSectionHeader.background': p.bgPanel,
      'sideBarSectionHeader.foreground': p.textMid,

      // Activity bar
      'activityBar.background': p.bgPanel,
      'activityBar.foreground': p.text,
      'activityBar.inactiveForeground': p.textFaint,
      'activityBar.border': borderLight,
      'activityBarBadge.background': p.accent,
      'activityBarBadge.foreground': '#ffffff',

      // Status bar
      'statusBar.background': p.bgPanel,
      'statusBar.foreground': p.textMid,
      'statusBar.border': borderLight,
      'statusBar.debuggingBackground': p.fail,
      'statusBar.debuggingForeground': '#ffffff',
      'statusBar.noFolderBackground': p.bgPanel,

      // Title bar
      'titleBar.activeBackground': p.bgPanel,
      'titleBar.activeForeground': p.text,
      'titleBar.inactiveBackground': p.bgPanel,
      'titleBar.inactiveForeground': p.textFaint,
      'titleBar.border': borderLight,

      // Tabs
      'tab.activeBackground': p.bg,
      'tab.activeForeground': p.text,
      'tab.inactiveBackground': p.bgPanel,
      'tab.inactiveForeground': p.textFaint,
      'tab.border': borderLight,
      'tab.activeBorder': transparent,
      'tab.activeBorderTop': p.accent,

      // Lists
      'list.activeSelectionBackground': accentBg,
      'list.activeSelectionForeground': p.text,
      'list.hoverBackground': p.bgHover,
      'list.focusBackground': accentBg,
      'list.highlightForeground': p.accent,

      // Input
      'input.background': p.bg,
      'input.foreground': p.text,
      'input.border': borderLight,
      'input.placeholderForeground': p.textFaint,
      'inputOption.activeBorder': p.accent,
      'focusBorder': p.accent,

      // Dropdown
      'dropdown.background': p.bg,
      'dropdown.foreground': p.text,
      'dropdown.border': borderLight,

      // Button
      'button.background': p.accent,
      'button.foreground': '#ffffff',
      'button.hoverBackground': hexAlpha(p.accent, 0.85),

      // Badge
      'badge.background': p.accent,
      'badge.foreground': '#ffffff',

      // Scrollbar
      'scrollbar.shadow': shadow,
      'scrollbarSlider.background': hexAlpha(p.neutral, 0.2),
      'scrollbarSlider.hoverBackground': hexAlpha(p.neutral, 0.35),
      'scrollbarSlider.activeBackground': hexAlpha(p.neutral, 0.5),

      // Panel
      'panel.background': p.bgPanel,
      'panel.border': borderLight,
      'panelTitle.activeBorder': p.accent,
      'panelTitle.activeForeground': p.text,
      'panelTitle.inactiveForeground': p.textFaint,

      // Peek view
      'peekView.border': p.accent,
      'peekViewEditor.background': p.bgPanel,
      'peekViewResult.background': p.bgPanel,
      'peekViewTitle.background': p.bgPanel,

      // Git
      'gitDecoration.addedResourceForeground': p.pass,
      'gitDecoration.modifiedResourceForeground': p.accent,
      'gitDecoration.deletedResourceForeground': p.fail,
      'gitDecoration.untrackedResourceForeground': p.pass,
      'gitDecoration.conflictingResourceForeground': p.fail,

      // Breadcrumb
      'breadcrumb.foreground': p.textFaint,
      'breadcrumb.focusForeground': p.text,
      'breadcrumb.activeSelectionForeground': p.text,

      // Minimap
      'minimap.findMatchHighlight': hexAlpha(p.accent, 0.5),
      'minimap.selectionHighlight': hexAlpha(p.accent, 0.3),

      // Notification
      'notificationCenter.border': borderLight,
      'notifications.background': p.bgPanel,
      'notifications.foreground': p.text,

      // Terminal
      'terminal.background': p.bg,
      'terminal.foreground': p.text,
      'terminal.ansiBlack': a.normal[0],
      'terminal.ansiRed': a.normal[1],
      'terminal.ansiGreen': a.normal[2],
      'terminal.ansiYellow': a.normal[3],
      'terminal.ansiBlue': a.normal[4],
      'terminal.ansiMagenta': a.normal[5],
      'terminal.ansiCyan': a.normal[6],
      'terminal.ansiWhite': a.normal[7],
      'terminal.ansiBrightBlack': a.bright[0],
      'terminal.ansiBrightRed': a.bright[1],
      'terminal.ansiBrightGreen': a.bright[2],
      'terminal.ansiBrightYellow': a.bright[3],
      'terminal.ansiBrightBlue': a.bright[4],
      'terminal.ansiBrightMagenta': a.bright[5],
      'terminal.ansiBrightCyan': a.bright[6],
      'terminal.ansiBrightWhite': a.bright[7],
      'terminalCursor.foreground': p.accent,

      // General
      'foreground': p.text,
      'descriptionForeground': p.textMid,
      'errorForeground': p.fail,
      'icon.foreground': p.textFaint,
      'widget.shadow': shadow,
      'selection.background': accentSelection,
      'textLink.foreground': p.accent,
      'textLink.activeForeground': p.accent,

      // Testing
      'testing.iconPassed': p.pass,
      'testing.iconFailed': p.fail,
      'testing.iconErrored': p.fail,
      'testing.iconSkipped': p.neutral,
    },
    tokenColors: [
      ...Object.entries(scopeMap).map(([category, scopes]) => ({
        scope: scopes,
        settings: {
          foreground: s[category],
          ...(category === 'comment' ? { fontStyle: 'italic' } : {}),
        },
      })),
      // Punctuation — subtle, uses textMid
      {
        scope: [
          'punctuation',
          'punctuation.definition.tag',
          'punctuation.separator',
          'punctuation.terminator',
          'meta.brace',
        ],
        settings: { foreground: p.textMid },
      },
      // Variable — default foreground
      {
        scope: ['variable', 'variable.other', 'variable.parameter'],
        settings: { foreground: p.text },
      },
      // Markup headings
      {
        scope: ['markup.heading', 'entity.name.section'],
        settings: { foreground: s.keyword, fontStyle: 'bold' },
      },
      // Markup bold/italic
      {
        scope: ['markup.bold'],
        settings: { fontStyle: 'bold' },
      },
      {
        scope: ['markup.italic'],
        settings: { fontStyle: 'italic' },
      },
      // Markup links
      {
        scope: ['markup.underline.link', 'string.other.link'],
        settings: { foreground: p.accent },
      },
    ],
    semanticHighlighting: true,
    semanticTokenColors: {
      function: s.function,
      'function.declaration': s.function,
      method: s.function,
      type: s.type,
      class: s.type,
      interface: s.type,
      enum: s.type,
      namespace: s.type,
      typeParameter: s.type,
      variable: p.text,
      parameter: p.text,
      property: p.text,
      enumMember: s.string,
      decorator: s.function,
    },
  };
}

/**
 * Generate VS Code package.json for the extension.
 */
export function generatePackageJson() {
  return {
    name: 'opo-theme',
    displayName: 'Opo',
    description: 'Colorblind-safe, OKLCH-based accessible color theme',
    version: '1.0.0',
    publisher: 'opo-theme',
    engines: { vscode: '^1.80.0' },
    categories: ['Themes'],
    keywords: [
      'theme', 'color-theme', 'colorblind', 'accessible',
      'light', 'dark', 'high-contrast', 'oklch', 'a11y',
    ],
    icon: 'icon.png',
    contributes: {
      themes: [
        { label: 'Opo Light', uiTheme: 'vs', path: './themes/opo-light-color-theme.json' },
        { label: 'Opo Dark', uiTheme: 'vs-dark', path: './themes/opo-dark-color-theme.json' },
        { label: 'Opo High Contrast', uiTheme: 'hc-light', path: './themes/opo-hc-color-theme.json' },
      ],
    },
    repository: { type: 'git', url: 'https://github.com/IschaGast/opo-theme' },
    license: 'MIT',
  };
}
