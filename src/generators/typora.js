/**
 * Opo Theme — Typora Theme Generator
 * Output: CSS files for Typora's markdown editor
 *
 * Typora themes are plain CSS with custom properties in :root.
 * Installation: copy to ~/Library/Application Support/abnerworks.Typora/themes/
 * Light and dark are separate CSS files; users assign them in Preferences.
 */

import { formatHex } from 'culori';

export function generateTypora(variant, mode) {
  const hex = (color) => formatHex(color);
  const ui = variant.ui;
  const syn = variant.syntax;

  const label = mode === 'hc' ? 'High Contrast' : mode.charAt(0).toUpperCase() + mode.slice(1);
  const isDark = mode === 'dark';

  // Selection color: use accent at reduced opacity
  const selectionBg = isDark ? 'rgba(0, 92, 204, 0.35)' : 'rgba(0, 92, 204, 0.20)';

  return `/* Opo ${label} — Colorblind-safe accessible theme for Typora */
/* https://github.com/IschaGast/opo-theme */

:root {
    --bg-color: ${hex(ui.bg)};
    --text-color: ${hex(ui.text)};
    --md-char-color: ${hex(ui.textFaint)};
    --meta-content-color: ${hex(ui.textMid)};
    --primary-color: ${hex(ui.accent)};
    --primary-btn-border-color: ${hex(ui.pass)};
    --primary-btn-text-color: ${isDark ? hex(ui.bg) : '#ffffff'};
    --window-border: 1px solid ${hex(ui.bgHover)};
    --active-file-bg-color: ${hex(ui.bgHover)};
    --active-file-text-color: ${hex(ui.text)};
    --active-file-border-color: ${hex(ui.accent)};
    --side-bar-bg-color: ${hex(ui.bgPanel)};
    --item-hover-bg-color: ${hex(ui.bgHover)};
    --item-hover-text-color: ${hex(ui.text)};
    --control-text-color: ${hex(ui.textMid)};
    --select-text-bg-color: ${selectionBg};
    --monospace: "Atkinson Hyperlegible Mono", "JetBrains Mono", "Fira Code", monospace;
}

/* ── Base ── */

html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
}

body {
    font-family: "Atkinson Hyperlegible Next", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    color: var(--text-color);
    line-height: 1.6;
    background: var(--bg-color);
}

#write {
    max-width: 860px;
    margin: 0 auto;
    padding: 30px 30px 100px;
}

@media only screen and (min-width: 1400px) {
    #write { max-width: 960px; }
}

/* ── Headings ── */

h1, h2, h3, h4, h5, h6 {
    position: relative;
    margin-top: 1.5rem;
    margin-bottom: 0.8rem;
    font-weight: bold;
    line-height: 1.35;
    color: var(--text-color);
    cursor: text;
}

h1 { font-size: 2rem; padding-bottom: 0.3rem; border-bottom: 1px solid ${hex(ui.bgHover)}; }
h2 { font-size: 1.625rem; padding-bottom: 0.3rem; border-bottom: 1px solid ${hex(ui.bgHover)}; }
h3 { font-size: 1.375rem; }
h4 { font-size: 1.125rem; }
h5 { font-size: 1rem; }
h6 { font-size: 1rem; color: ${hex(ui.textMid)}; }

/* ── Block elements ── */

p, blockquote, ul, ol, dl, table {
    margin: 0.8em 0;
}

blockquote {
    border-left: 4px solid ${hex(ui.accent)};
    padding: 0 15px;
    color: ${hex(ui.textMid)};
}

hr {
    height: 2px;
    padding: 0;
    margin: 24px 0;
    background-color: ${hex(ui.bgHover)};
    border: 0 none;
}

/* ── Lists ── */

ul { padding-left: 30px; }
ol { padding-left: 30px; }

/* Task lists */
.task-list { padding-left: 0; }
.md-task-list-item { padding-left: 1.25rem; }
.md-task-list-item > input { margin-left: -1.3em; }

/* ── Links and inline ── */

a { color: ${hex(ui.accent)}; text-decoration: none; }
a:hover { text-decoration: underline; }

strong { font-weight: bold; }

mark {
    background: rgba(183, 154, 58, 0.25);
    color: inherit;
    padding: 1px 3px;
    border-radius: 2px;
}

sup.md-footnote {
    background-color: ${hex(ui.textMid)};
    color: ${hex(ui.bg)};
    padding: 0 4px;
    border-radius: 2px;
    font-size: 0.8em;
}

/* ── Tables ── */

table {
    max-width: 100%;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}

table tr { border: 1px solid ${hex(ui.bgHover)}; }
table tr:nth-child(2n), thead { background-color: ${hex(ui.bgPanel)}; }

table th {
    font-weight: bold;
    border: 1px solid ${hex(ui.bgHover)};
    padding: 6px 13px;
}

table td {
    border: 1px solid ${hex(ui.bgHover)};
    padding: 6px 13px;
}

/* ── Code ── */

code, tt {
    border: 1px solid ${hex(ui.bgHover)};
    background-color: ${hex(ui.bgPanel)};
    border-radius: 3px;
    padding: 0 4px;
    font-size: 0.9em;
    font-family: var(--monospace);
}

.md-fences, pre.md-fences {
    background-color: ${hex(ui.bgPanel)};
    border: 1px solid ${hex(ui.bgHover)};
    border-radius: 4px;
    margin: 15px 0;
    padding: 10px 10px 10px 30px;
    font-family: var(--monospace);
    font-size: 0.875em;
    line-height: 1.5;
}

.CodeMirror-gutters {
    background: ${hex(ui.bgPanel)};
    border-right: 1px solid ${hex(ui.bgHover)};
}

/* ── Syntax highlighting (CodeMirror) ── */

.cm-s-inner .cm-keyword    { color: ${hex(syn.keyword)}; font-weight: bold; }
.cm-s-inner .cm-string     { color: ${hex(syn.string)}; }
.cm-s-inner .cm-string-2   { color: ${hex(syn.string)}; }
.cm-s-inner .cm-comment    { color: ${hex(syn.comment)}; font-style: italic; }
.cm-s-inner .cm-number     { color: ${hex(syn.string)}; }
.cm-s-inner .cm-atom       { color: ${hex(syn.keyword)}; }
.cm-s-inner .cm-def        { color: ${hex(syn.function)}; }
.cm-s-inner .cm-variable   { color: ${hex(ui.text)}; }
.cm-s-inner .cm-variable-2 { color: ${hex(syn.type)}; }
.cm-s-inner .cm-variable-3 { color: ${hex(syn.type)}; }
.cm-s-inner .cm-property   { color: ${hex(syn.function)}; }
.cm-s-inner .cm-operator   { color: ${hex(ui.textMid)}; }
.cm-s-inner .cm-builtin    { color: ${hex(syn.function)}; }
.cm-s-inner .cm-tag        { color: ${hex(syn.keyword)}; }
.cm-s-inner .cm-attribute  { color: ${hex(syn.type)}; }
.cm-s-inner .cm-header     { color: ${hex(syn.keyword)}; font-weight: bold; }
.cm-s-inner .cm-quote      { color: ${hex(syn.comment)}; }
.cm-s-inner .cm-hr         { color: ${hex(ui.bgHover)}; }
.cm-s-inner .cm-link       { color: ${hex(ui.accent)}; }
.cm-s-inner .cm-meta       { color: ${hex(ui.textFaint)}; }
.cm-s-inner .cm-bracket    { color: ${hex(ui.textMid)}; }
.cm-s-inner .cm-negative   { color: ${hex(ui.fail)}; }
.cm-s-inner .cm-positive   { color: ${hex(syn.function)}; }

.CodeMirror div.CodeMirror-cursor {
    border-left: 1px solid ${hex(ui.accent)};
}

/* ── YAML front matter ── */

#write pre.md-meta-block {
    padding: 1rem;
    font-size: 85%;
    line-height: 1.45;
    background-color: ${hex(ui.bgPanel)};
    border: 1px solid ${hex(ui.bgHover)};
    border-radius: 4px;
    color: ${hex(ui.textMid)};
    font-family: var(--monospace);
    margin-top: 0 !important;
}

/* ── Selection ── */

::selection {
    background: var(--select-text-bg-color);
}

*.in-text-selection, ::selection {
    background: var(--select-text-bg-color);
}

.CodeMirror-selectedtext, .CodeMirror-selected {
    background: var(--select-text-bg-color) !important;
}

/* ── Sidebar ── */

#typora-sidebar {
    box-shadow: none;
    border-right: 1px solid ${hex(ui.bgHover)};
}

.mac-seamless-mode #typora-sidebar {
    background-color: var(--side-bar-bg-color);
}

.file-list-item.active {
    color: var(--active-file-text-color);
    background-color: var(--active-file-bg-color);
}

.file-library-node.active > .file-node-background {
    background-color: var(--active-file-bg-color);
}

/* ── Focus mode ── */

.on-focus-mode .md-end-block:not(.md-focus):not(.md-focus-container) * {
    color: ${hex(ui.textFaint)} !important;
}

.on-focus-mode .md-end-block:not(.md-focus) img,
.on-focus-mode .md-task-list-item:not(.md-focus-container) > input {
    opacity: 0.5;
}

/* ── Keyboard shortcut ── */

kbd {
    padding: 2px 6px;
    font-size: 90%;
    color: ${hex(ui.text)};
    background-color: ${hex(ui.bgPanel)};
    border: 1px solid ${hex(ui.bgHover)};
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 ${hex(ui.bgHover)};
}

/* ── Scrollbars ── */

::-webkit-scrollbar-thumb {
    background: ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'};
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:active {
    background: ${isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.20)'};
}

/* ── Print ── */

@media print {
    html { font-size: 13px; }
    pre { page-break-inside: avoid; word-wrap: break-word; }
    .typora-export * { -webkit-print-color-adjust: exact; }
}
`;
}
