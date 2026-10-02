/**
 * Opo Theme — Accessibility audit of the generated files
 *
 * Where src/validate.js checks the palette, this checks what each tool
 * actually gets: the foreground/background pairs in every file in dist/,
 * including tints composited the way the tool draws them, and keys that
 * would otherwise fall back to a tool default.
 *
 * Usage: npm run audit (after npm run build). Exits 1 on any issue.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { wcagContrast, parse, formatHex, interpolate } from 'culori';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const issues = [];
let checks = 0;
const modeOf = f => /hc|High/i.test(f) ? 'hc' : /dark|Dark/.test(f) ? 'dark' : 'light';
const target = (mode, kind) => kind === 'ui' ? 3 : mode === 'hc' ? 7 : 4.5;

// Composite a possibly-alpha color over an opaque background
function flat(c, bg) {
  const x = parse(c.length === 9 || c.length === 5 ? c : c);
  if (!x) throw new Error('bad color ' + c);
  if (x.alpha === undefined || x.alpha === 1) return formatHex(x);
  return formatHex(interpolate([parse(bg), { ...x, alpha: 1 }])(x.alpha));
}
function check(tool, file, what, fg, bg, kind = 'text') {
  checks++;
  const mode = modeOf(file);
  if (!fg || !bg) { issues.push({ tool, mode, what: what + ' (color missing)', fg: fg || '?', bg: bg || '?', ratio: '-', target: '-' }); return 0; }
  const b = flat(bg, '#808080');
  const f = flat(fg, b);
  const r = wcagContrast(f, b);
  const t = target(mode, kind);
  if (r < t) issues.push({ tool, mode, what, fg: f, bg: b, ratio: r.toFixed(2), target: t });
  return r;
}

const info = [];
const note = (tool, mode, what, fg, bg) => info.push(`[${tool} ${mode}] ${what}: ${wcagContrast(flat(fg, bg), bg).toFixed(2)}:1`);
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const ls = d => fs.readdirSync(path.join(root, d)).filter(f => !f.startsWith('.'));

// --- Terminals: ANSI vs background (white in light / black in dark are bg-ish by design) ---
function term(tool, file, bg, fg, ansi, selBg, selFg, cursor) {
  const mode = modeOf(file);
  check(tool, file, 'foreground', fg, bg);
  ansi.forEach((c, i) => {
    if (!c) return;
    const isBgSlot = mode === 'dark' ? (i === 0 || i === 8 && false) : (i === 7 || i === 15);
    if (mode === 'dark' && i === 0) return;
    if (isBgSlot) return;
    check(tool, file, `ansi ${i}`, c, bg);
  });
  if (selBg) {
    if (selFg) check(tool, file, 'selection visible vs bg', selBg, bg, 'ui'); else note(tool, mode, 'selection tint vs bg', selBg, bg);
    if (selFg) check(tool, file, 'selection text', selFg, selBg);
    else ansi.slice(1, 7).forEach((c, i) => check(tool, file, `ansi ${i + 1} on selection`, c, selBg));
  }
  if (cursor) check(tool, file, 'cursor vs bg', cursor, bg, 'ui');
}
for (const f of ls('dist/ghostty')) {
  const kv = {}; const pal = [];
  for (const line of read(`dist/ghostty/${f}`).split('\n')) {
    const m = line.match(/^([\w-]+) = (.+)$/); if (!m) continue;
    if (m[1] === 'palette') { const [i, c] = m[2].split('='); pal[+i] = c; } else kv[m[1]] = m[2];
  }
  term('ghostty', f, kv.background, kv.foreground, pal, kv['selection-background'], kv['selection-foreground'], kv['cursor-color']);
}
for (const f of ls('dist/alacritty')) {
  const t = read(`dist/alacritty/${f}`);
  const sec = s => Object.fromEntries([...t.split(`[colors.${s}]`)[1].split('[')[0].matchAll(/(\w+)\s*=\s*"(#\w+)"/g)].map(m => [m[1], m[2]]));
  const n = sec('normal'), b = sec('bright'), order = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
  const pr = sec('primary'), s = sec('selection'), cu = sec('cursor');
  term('alacritty', f, pr.background, pr.foreground, [...order.map(k => n[k]), ...order.map(k => b[k])], s.background, s.text, cu.cursor);
}
for (const f of ls('dist/warp')) {
  const t = read(`dist/warp/${f}`);
  const g = k => t.match(new RegExp(`^${k}: "(#\\w+)"`, 'm'))[1];
  const blk = s => Object.fromEntries([...t.split(`  ${s}:`)[1].split(/\n  \w+:/)[0].matchAll(/(\w+): "(#\w+)"/g)].map(m => [m[1], m[2]]));
  const order = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
  const n = blk('normal'), b = blk('bright');
  term('warp', f, g('background'), g('foreground'), [...order.map(k => n[k]), ...order.map(k => b[k])], null, null, g('cursor'));
}
{
  const wt = JSON.parse(read('dist/windows-terminal/opo-themes.json'));
  for (const s of (wt.schemes || wt)) {
    const order = ['black', 'red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'white'];
    const pal = [...order.map(k => s[k]), ...order.map(k => s['bright' + k[0].toUpperCase() + k.slice(1)])];
    term('windows-terminal', s.name, s.background, s.foreground, pal, s.selectionBackground, null, s.cursorColor);
  }
}
for (const f of ls('dist/iterm')) {
  const t = read(`dist/iterm/${f}`);
  const col = {};
  for (const m of t.matchAll(/<key>([^<]+)<\/key>\s*<dict>([\s\S]*?)<\/dict>/g)) {
    const comp = k => parseFloat((m[2].match(new RegExp(`<key>${k} Component</key>\\s*<real>([^<]+)`)) || [])[1]);
    const r = comp('Red'), g = comp('Green'), b = comp('Blue');
    if (!isNaN(r)) col[m[1]] = formatHex({ mode: 'rgb', r, g, b });
  }
  const pal = Array.from({ length: 16 }, (_, i) => col[`Ansi ${i} Color`]);
  term('iterm', f, col['Background Color'], col['Foreground Color'], pal, col['Selection Color'], col['Selected Text Color'], col['Cursor Color']);
}

// --- VS Code ---
for (const f of ls('dist/vscode/themes')) {
  const th = JSON.parse(read(`dist/vscode/themes/${f}`)); const c = th.colors;
  const ed = c['editor.background'];
  const pairs = [
    ['editor.foreground', 'editor.background'], ['foreground', 'sideBar.background'], ['descriptionForeground', 'sideBar.background'],
    ['sideBar.foreground', 'sideBar.background'], ['sideBarTitle.foreground', 'sideBar.background'], ['sideBarSectionHeader.foreground', 'sideBarSectionHeader.background'],
    ['activityBar.foreground', 'activityBar.background'], ['activityBar.inactiveForeground', 'activityBar.background'], ['activityBarBadge.foreground', 'activityBarBadge.background'],
    ['badge.foreground', 'badge.background'], ['button.foreground', 'button.background'], ['button.foreground', 'button.hoverBackground'],
    ['button.secondaryForeground', 'button.secondaryBackground'],
    ['statusBar.foreground', 'statusBar.background'], ['statusBar.debuggingForeground', 'statusBar.debuggingBackground'], ['statusBar.foreground', 'statusBar.noFolderBackground'],
    ['statusBarItem.remoteForeground', 'statusBarItem.remoteBackground'], ['statusBarItem.errorForeground', 'statusBarItem.errorBackground'], ['statusBarItem.warningForeground', 'statusBarItem.warningBackground'],
    ['titleBar.activeForeground', 'titleBar.activeBackground'], ['titleBar.inactiveForeground', 'titleBar.inactiveBackground'],
    ['tab.activeForeground', 'tab.activeBackground'], ['tab.inactiveForeground', 'tab.inactiveBackground'],
    ['panelTitle.activeForeground', 'panel.background'], ['panelTitle.inactiveForeground', 'panel.background'],
    ['input.foreground', 'input.background'], ['input.placeholderForeground', 'input.background'], ['dropdown.foreground', 'dropdown.background'],
    ['notifications.foreground', 'notifications.background'], ['breadcrumb.foreground', 'editor.background'], ['breadcrumb.focusForeground', 'editor.background'],
    ['editorLineNumber.foreground', 'editor.background'], ['editorLineNumber.activeForeground', 'editor.background'],
    ['editorError.foreground', 'editor.background'], ['editorWarning.foreground', 'editor.background'], ['editorInfo.foreground', 'editor.background'],
    ['textLink.foreground', 'editor.background'], ['textLink.activeForeground', 'editor.background'], ['errorForeground', 'sideBar.background'],
    ['list.activeSelectionForeground', 'list.activeSelectionBackground'], ['list.inactiveSelectionForeground', 'list.inactiveSelectionBackground'], ['list.highlightForeground', 'list.activeSelectionBackground'],
    ['editorInlayHint.foreground', 'editorInlayHint.background'], ['editorCodeLens.foreground', 'editor.background'], ['editorGhostText.foreground', 'editor.background'],
    ['terminal.foreground', 'terminal.background'], ['disabledForeground', 'sideBar.background'],
    ['quickInput.foreground', 'quickInput.background'], ['editorWidget.foreground', 'editorWidget.background'], ['editorSuggestWidget.foreground', 'editorSuggestWidget.background'],
    ['editorSuggestWidget.highlightForeground', 'editorSuggestWidget.background'], ['editorSuggestWidget.selectedForeground', 'editorSuggestWidget.selectedBackground'],
    ['editorHoverWidget.foreground', 'editorHoverWidget.background'], ['peekViewResult.fileForeground', 'peekViewResult.background'], ['peekViewTitleLabel.foreground', 'peekViewTitle.background'],
    ['keybindingLabel.foreground', 'keybindingLabel.background'], ['textPreformat.foreground', 'editor.background'],
  ];
  const missing = [];
  for (const [fg, bg] of pairs) {
    if (!c[fg] || !c[bg]) { missing.push(!c[fg] ? fg : bg); continue; }
    const base = c[bg].length > 7 ? flat(c[bg], ed) : c[bg];
    check('vscode', f, `${fg} on ${bg}`, c[fg], base);
  }
  for (const k of Object.keys(c).filter(k => /^(gitDecoration\.|list\.\w*Foreground|testing\.icon)/.test(k)))
    for (const bg of ['sideBar.background', 'list.activeSelectionBackground']) check('vscode', f, `${k} on ${bg}`, c[k], flat(c[bg], c['sideBar.background']), k.startsWith('testing') ? 'ui' : 'text');
  for (const k of ['editorCursor.foreground', 'focusBorder', 'list.focusAndSelectionOutline']) if (c[k]) check('vscode', f, `${k} visible`, c[k], ed, 'ui');
  const hcSel = !!c['editor.selectionForeground'];
  const lineBg = (k) => c[k] ? flat(c[k], ed) : ed;
  const synBgs = {
    editor: ed, lineHighlight: c['editor.lineHighlightBackground'], selection: hcSel ? null : c['editor.selectionBackground'],
    diffInserted: flat(c['diffEditor.insertedTextBackground'], lineBg('diffEditor.insertedLineBackground')),
    diffRemoved: flat(c['diffEditor.removedTextBackground'], lineBg('diffEditor.removedLineBackground')),
    findMatch: c['editor.findMatchBackground'], findHighlight: c['editor.findMatchHighlightBackground'],
    wordHighlight: c['editor.wordHighlightBackground'], inactiveSelection: c['editor.inactiveSelectionBackground'],
    mergeCurrent: c['merge.currentContentBackground'], mergeIncoming: c['merge.incomingContentBackground'],
    mergeCurrentHeader: c['merge.currentHeaderBackground'], mergeIncomingHeader: c['merge.incomingHeaderBackground'],
    bracketMatch: c['editorBracketMatch.background'], peekMatch: c['peekViewEditor.matchHighlightBackground'],
  };
  for (const tc of th.tokenColors) {
    if (!tc.settings.foreground) continue;
    for (const [n, b] of Object.entries(synBgs)) if (b) check('vscode', f, `token ${[].concat(tc.scope)[0]} on ${n}`, tc.settings.foreground, flat(b, ed));
  }
  if (hcSel) { check('vscode', f, 'selection visible vs editor bg', c['editor.selectionBackground'], ed, 'ui'); check('vscode', f, 'selectionForeground', c['editor.selectionForeground'], c['editor.selectionBackground']); }
  else note('vscode', modeOf(f), 'editor selection tint vs bg', c['editor.selectionBackground'], ed);
  check('vscode', f, 'terminal selection text', c['terminal.selectionForeground'], c['terminal.selectionBackground']);
  check('vscode', f, 'terminal selection visible', c['terminal.selectionBackground'], c['terminal.background'], 'ui');
  for (const k of ['editor.findMatchBorder', 'editor.findMatchHighlightBorder', 'editorBracketMatch.border', 'editor.wordHighlightBorder', 'editorUnnecessaryCode.border', 'list.inactiveFocusOutline']) check('vscode', f, `${k} visible`, c[k], ed, 'ui');
  for (let i = 1; i <= 6; i++) check('vscode', f, `bracket pair ${i}`, c[`editorBracketHighlight.foreground${i}`], ed);
  for (const k of missing) issues.push({ tool: 'vscode', mode: modeOf(f), what: `${k} not set (VS Code default used)`, fg: '', bg: '', ratio: '-', target: '-' });
}

// --- Zed ---
{
  const z = JSON.parse(read('dist/zed/opo.json'));
  for (const t of z.themes) {
    const s = t.style, f = t.name, ed = s['editor.background'], panel = s['panel.background'];
    for (const k of ['text', 'text.muted', 'text.placeholder', 'text.accent', 'text.disabled', 'created', 'modified', 'deleted', 'conflict', 'renamed', 'ignored', 'hidden', 'error', 'warning', 'info', 'hint', 'success', 'predictive', 'unreachable'])
      for (const [bn, bg] of [['panel', panel], ['editor', ed], ['element.selected', flat(s['element.selected'], panel)], ['ghost_element.selected', s['ghost_element.selected'] ? flat(s['ghost_element.selected'], panel) : null], ['ghost_element.hover', s['ghost_element.hover'] ? flat(s['ghost_element.hover'], panel) : null]])
        if (s[k] && bg) check('zed', f, `${k} on ${bn}`, s[k], bg);
    for (const k of ['icon', 'icon.muted', 'icon.accent', 'border.focused', 'editor.line_number', 'editor.active_line_number']) if (s[k]) check('zed', f, k, s[k], ed, k.startsWith('editor.') ? 'text' : 'ui');
    const syn = s.syntax;
    const sel = s.players?.[0]?.selection;
    for (const [k, v] of Object.entries(syn)) {
      check('zed', f, `syntax ${k} on editor`, v.color, ed);
      check('zed', f, `syntax ${k} on active line`, v.color, flat(s['editor.active_line.background'], ed));
      if (sel) check('zed', f, `syntax ${k} on selection`, v.color, flat(sel, ed));
    }
    if (sel) note('zed', f, 'editor selection tint vs bg', sel, ed);
    for (const k of ['error', 'warning', 'info', 'hint', 'success', 'created', 'modified', 'deleted', 'conflict', 'ignored', 'hidden', 'renamed'])
      if (s[k + '.background']) for (const fg of ['text', k]) check('zed', f, `${fg} on ${k}.background`, s[fg], flat(s[k + '.background'], ed));
    for (const k of ['predictive', 'unreachable']) if (s[k + '.background']) check('zed', f, `${k} on own bg`, s[k], s[k + '.background']);
    for (const [i, a] of (s.accents || []).entries()) check('zed', f, `bracket accent ${i}`, a, ed);
    for (const k of Object.keys(s).filter(k => k.startsWith('editor.document_highlight'))) for (const [n, v] of Object.entries(syn)) check('zed', f, `syntax ${n} on ${k}`, v.color, flat(s[k], ed));
    for (const k of Object.keys(s).filter(k => k.startsWith('terminal.ansi.') && !/black|white|background/.test(k))) check('zed', f, k, s[k], s['terminal.background']);
    const crit = ['players', 'ghost_element.selected', 'ghost_element.hover', 'predictive', 'icon', 'icon.muted', 'text.disabled', 'error.background', 'warning.background', 'hint.background', 'accents', 'terminal.dim_foreground', 'link_text.hover', 'unreachable', 'editor.document_highlight.read_background'];
    for (const k of crit.filter(k => !(k in s))) issues.push({ tool: 'zed', mode: modeOf(f), what: `${k} not set (Zed default used)`, fg: '', bg: '', ratio: '-', target: '-' });
  }
}

// --- JetBrains ---
for (const f of ls('dist/jetbrains')) {
  const t = read(`dist/jetbrains/${f}`);
  const colors = Object.fromEntries([...t.matchAll(/<option name="(\w+)" value="([0-9a-f]{6})" \/>/g)].map(m => [m[1], '#' + m[2]]));
  const bg = colors.CONSOLE_BACKGROUND_KEY;
  const textAttr = t.match(/name="TEXT">\s*<value>([\s\S]*?)<\/value>/);
  const edBg = textAttr ? '#' + (textAttr[1].match(/BACKGROUND" value="(\w+)"/) || [, bg.slice(1)])[1] : bg;
  for (const m of t.matchAll(/<option name="(\w+)">\s*<value>([\s\S]*?)<\/value>/g)) {
    const fg = m[2].match(/FOREGROUND" value="(\w+)"/), b = m[2].match(/"BACKGROUND" value="(\w+)"/);
    if (fg) check('jetbrains', f, `${m[1]}`, '#' + fg[1], b ? '#' + b[1] : edBg);
    if (fg) check('jetbrains', f, `${m[1]} on caret row`, '#' + fg[1], colors.CARET_ROW_COLOR);
  }
  check('jetbrains', f, 'LINE_NUMBERS_COLOR', colors.LINE_NUMBERS_COLOR, colors.GUTTER_BACKGROUND);
  check('jetbrains', f, 'selection visible vs bg', colors.SELECTION_BACKGROUND, edBg, 'ui');
  check('jetbrains', f, 'caret', colors.CARET_COLOR, edBg, 'ui');
  check('jetbrains', f, 'selection foreground', colors.SELECTION_FOREGROUND, colors.SELECTION_BACKGROUND);
  if (colors.SELECTION_BACKGROUND === colors.CARET_ROW_COLOR) issues.push({ tool: 'jetbrains', mode: modeOf(f), what: 'selection identical to caret row color', fg: '', bg: colors.SELECTION_BACKGROUND, ratio: '1.00', target: '-' });
}

// --- Neovim: resolve highlight groups against the palette ---
{
  const pal = read('dist/neovim/opo.nvim/lua/opo/palette.lua');
  const init = read('dist/neovim/opo.nvim/lua/opo/init.lua');
  for (const mode of ['light', 'dark', 'hc']) {
    const blk = pal.split(`M.${mode} = {`)[1].split('}')[0];
    const p = Object.fromEntries([...blk.matchAll(/(\w+) = "(#\w+)"/g)].map(m => [m[1], m[2]]));
    for (const m of init.matchAll(/hl\(0, "([@\w.]+)",\s*\{([^}]*)\}/g)) {
      const fg = (m[2].match(/fg = p\.(\w+)/) || [])[1], bg = (m[2].match(/bg = p\.(\w+)/) || [])[1];
      if (fg) check('neovim', mode, `${m[1]}`, p[fg], p[bg || 'bg']);
    }
    const vis = (init.match(/"Visual",\s*\{[^}]*bg = p\.(\w+)/) || [])[1], cl = (init.match(/"CursorLine",\s*\{ bg = p\.(\w+)/) || [])[1];
    check('neovim', mode, 'Visual visible vs bg', p[vis], p.bg, 'ui');
    if (vis === cl) issues.push({ tool: 'neovim', mode, what: 'Visual identical to CursorLine', fg: '', bg: p[vis], ratio: '1.00', target: '-' });
  }
}

// --- Slack: [column bg, menu bg hover, active item, active item text, hover item, text, active presence, mention badge] ---
for (const f of ls('dist/slack')) {
  const c = read(`dist/slack/${f}`).match(/#\w{6}(,#\w{6}){7}/)[0].split(',');
  check('slack', f, 'text on column', c[5], c[0]);
  check('slack', f, 'text on hover item', c[5], c[4]);
  check('slack', f, 'active item text on active item', c[3], c[2]);
  check('slack', f, 'presence dot', c[6], c[0], 'ui');
  check('slack', f, 'mention badge vs column', c[7], c[0], 'ui');
  check('slack', f, 'white mention text on badge', '#ffffff', c[7]);
}

// --- CSS-based (css, typora, bear, slidev, ia-presenter): every color declaration vs page bg ---
function cssAudit(tool, file, text) {
  for (const block of text.split('}')) {
    const sel = block.split('{')[0].trim().split('\n').pop();
    const fg = (block.match(/(?:^|[\s;{])color:\s*(#[0-9a-fA-F]{3,8})/) || [])[1];
    const bg = (block.match(/background(?:-color)?:\s*(#[0-9a-fA-F]{3,8})/) || [])[1];
    if (fg && bg) check(tool, file, `${sel} color on own bg`, fg, bg);
  }
}
for (const f of ls('dist/css')) cssAudit('css', f, read(`dist/css/${f}`));
for (const f of ls('dist/typora')) cssAudit('typora', f, read(`dist/typora/${f}`));
for (const f of ls('dist/slidev/styles')) cssAudit('slidev', f, read(`dist/slidev/styles/${f}`));


// --- Typora: syntax on code blocks and code selection, mark, selection ---
for (const mode of ['light', 'dark', 'hc']) {
  const file = `opo-${mode}.css`;
  const css = read(`dist/typora/${file}`);
  const v = k => css.match(new RegExp(`--${k}: (#\\w+)`))[1];
  const bg = v('bg-color'), panel = css.match(/\.md-fences[^}]*background-color: (#\w+)/)[1];
  const codeSel = flat(css.match(/\.CodeMirror-selected \{\s*background: (#\w+)/)[1], panel);
  const hr = css.match(/\.cm-hr\s*\{ color: (#\w+)/)[1];
  for (const [, cls, c] of css.matchAll(/\.cm-s-inner \.cm-([\w-]+)\s*\{ color: (#\w+)/g)) {
    if (c === hr) continue;
    check('typora', file, `cm-${cls} on code block`, c, panel);
    check('typora', file, `cm-${cls} on code selection`, c, codeSel);
  }
  const mark = css.match(/mark \{\s*background: (#\w+);\s*color: (#\w+)/);
  check('typora', file, 'mark text', mark[2], mark[1]);
  check('typora', file, 'mark visible', mark[1], bg, 'ui');
  check('typora', file, 'selection text', bg, v('select-text-bg-color'));
  check('typora', file, 'selection visible', v('select-text-bg-color'), bg, 'ui');
  for (const k of ['text-color', 'md-char-color', 'meta-content-color', 'primary-color', 'control-text-color']) check('typora', file, k, v(k), bg);
  check('typora', file, 'active file', v('active-file-text-color'), v('active-file-bg-color'));
}

// --- Bear: text on background, selection and search; code syntax; sidebar ---
for (const f of ls('dist/bear')) {
  const t = JSON.parse(read(`dist/bear/${f}`)), b = t.base;
  for (const k of ['text color', 'text secondary color', 'text tertiary color', 'accent color'])
    for (const bgk of ['background color', 'selection color', 'search primary color']) check('bear', f, `${k} on ${bgk}`, b[k], b[bgk]);
  for (const [k, c] of Object.entries(t.editor.code['syntax highlight'])) check('bear', f, `syntax ${k} on code`, c, b['background secondary color']);
  for (const [k, h] of Object.entries(t.editor.highlighter)) check('bear', f, `highlighter ${k}`, h['text color'], h['background color']);
  check('bear', f, 'sidebar text', t.sidebar['text color'], t.sidebar['background color']);
  check('bear', f, 'sidebar selected text', t.sidebar['text secondary color'], t.sidebar['background secondary color']);
  check('bear', f, 'note list selection', b['text color'], t.notes['selection background color']);
}

// --- iA Presenter: flat accents work on both light and dark slides (3:1) ---
{
  const presets = JSON.parse(read('dist/ia-presenter/presets.json')).Presets;
  for (const p of presets) {
    check('ia-presenter', p.Name, 'body on light', p.DarkBodyTextColor, p.LightBackgroundColor);
    check('ia-presenter', p.Name + ' Dark', 'body on dark', p.LightBodyTextColor, p.DarkBackgroundColor);
    for (const k of ['Accent2', 'Accent3', 'Accent4', 'Accent5', 'Accent6']) {
      check('ia-presenter', p.Name, `${k} on light`, p[k], p.LightBackgroundColor, 'ui');
      check('ia-presenter', p.Name + ' Dark', `${k} on dark`, p[k], p.DarkBackgroundColor, 'ui');
    }
  }
}

console.log('\nTinted selections (text keeps its colors, so the tint is capped for AA):\n  ' + info.join('\n  '));
console.log(`\n${checks} checks, ${issues.length} issues`);
const byTool = {};
for (const i of issues) (byTool[i.tool] ||= []).push(i);
for (const [t, list] of Object.entries(byTool)) {
  console.log(`\n== ${t} (${list.length})`);
  for (const i of list.slice(0, 60)) console.log(`  [${i.mode}] ${i.what}: ${i.fg} on ${i.bg} = ${i.ratio} (need ${i.target})`);
}

if (issues.length) process.exit(1);
