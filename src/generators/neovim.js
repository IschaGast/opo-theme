/**
 * Opo Theme — Neovim Colorscheme Generator
 * Output: Lua colorscheme plugin (opo.nvim/)
 */

import { formatHex } from 'culori';
import { neovimGroups } from '../scopes.js';

function hex(color) {
  return formatHex(color);
}

function luaTable(obj, indent = 0) {
  const pad = '  '.repeat(indent);
  const lines = ['{'];
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      lines.push(`${pad}  ${k} = "${v}",`);
    } else if (typeof v === 'boolean') {
      lines.push(`${pad}  ${k} = ${v},`);
    }
  }
  lines.push(`${pad}}`);
  return lines.join('\n');
}

export function generateNeovimPalette(variants) {
  const palettes = {};
  for (const [mode, variant] of Object.entries(variants)) {
    const p = {};
    for (const [k, v] of Object.entries(variant.ui)) p[k] = hex(v);
    const s = {};
    for (const [k, v] of Object.entries(variant.syntax)) s[k] = hex(v);
    palettes[mode] = { ...p, ...s };
  }

  const lines = ['local M = {}', ''];
  for (const [mode, colors] of Object.entries(palettes)) {
    lines.push(`M.${mode} = {`);
    for (const [k, v] of Object.entries(colors)) {
      lines.push(`  ${k} = "${v}",`);
    }
    lines.push('}');
    lines.push('');
  }
  lines.push('return M');
  return lines.join('\n') + '\n';
}

export function generateNeovimInit(variants, ansiSets) {
  const lines = [
    'local M = {}',
    '',
    'function M.setup(opts)',
    '  opts = opts or {}',
    '  local style = opts.style or "light"',
    '  local p = require("opo.palette")[style]',
    '  if not p then',
    '    vim.notify("Opo: unknown style: " .. style, vim.log.levels.ERROR)',
    '    return',
    '  end',
    '',
    '  vim.cmd("hi clear")',
    '  vim.g.colors_name = "opo"',
    '  vim.o.termguicolors = true',
    '  vim.o.background = (style == "light" or style == "hc") and "light" or "dark"',
    '',
    '  local groups = {',
    '    -- Editor',
    '    Normal       = { fg = p.text, bg = p.bg },',
    '    NormalFloat  = { fg = p.text, bg = p.bgPanel },',
    '    FloatBorder  = { fg = p.textFaint, bg = p.bgPanel },',
    '    CursorLine   = { bg = p.bgHover },',
    '    CursorColumn = { bg = p.bgHover },',
    '    ColorColumn  = { bg = p.bgPanel },',
    '    Visual       = { bg = p.bgHover },',
    '    VisualNOS    = { bg = p.bgHover },',
    '    Search       = { fg = p.bg, bg = p.accent },',
    '    IncSearch    = { fg = p.bg, bg = p.accent },',
    '    LineNr       = { fg = p.textFaint },',
    '    CursorLineNr = { fg = p.text },',
    '    SignColumn   = { bg = p.bg },',
    '    VertSplit    = { fg = p.textFaint },',
    '    WinSeparator = { fg = p.textFaint },',
    '    StatusLine   = { fg = p.textMid, bg = p.bgPanel },',
    '    StatusLineNC = { fg = p.textFaint, bg = p.bgPanel },',
    '    Pmenu        = { fg = p.text, bg = p.bgPanel },',
    '    PmenuSel     = { fg = p.text, bg = p.bgHover },',
    '    PmenuSbar    = { bg = p.bgPanel },',
    '    PmenuThumb   = { bg = p.textFaint },',
    '    TabLine      = { fg = p.textFaint, bg = p.bgPanel },',
    '    TabLineFill  = { bg = p.bgPanel },',
    '    TabLineSel   = { fg = p.text, bg = p.bg },',
    '    Folded       = { fg = p.textMid, bg = p.bgPanel },',
    '    FoldColumn   = { fg = p.textFaint },',
    '    MatchParen   = { fg = p.accent, bold = true },',
    '    Directory    = { fg = p.accent },',
    '    Title        = { fg = p.text, bold = true },',
    '    NonText      = { fg = p.textFaint },',
    '    SpecialKey   = { fg = p.textFaint },',
    '    Conceal      = { fg = p.textFaint },',
    '    Cursor       = { fg = p.bg, bg = p.accent },',
    '    DiffAdd      = { fg = p.pass },',
    '    DiffChange   = { fg = p.accent },',
    '    DiffDelete   = { fg = p.fail },',
    '    DiffText     = { fg = p.accent, bold = true },',
    '    SpellBad     = { undercurl = true, sp = p.fail },',
    '    SpellCap     = { undercurl = true, sp = p.accent },',
    '',
    '    -- Diagnostics',
    '    DiagnosticError = { fg = p.fail },',
    '    DiagnosticWarn  = { fg = p.string },',
    '    DiagnosticInfo  = { fg = p.accent },',
    '    DiagnosticHint  = { fg = p.textMid },',
    '    DiagnosticUnderlineError = { undercurl = true, sp = p.fail },',
    '    DiagnosticUnderlineWarn  = { undercurl = true, sp = p.string },',
    '    DiagnosticUnderlineInfo  = { undercurl = true, sp = p.accent },',
    '    DiagnosticUnderlineHint  = { undercurl = true, sp = p.textMid },',
    '  }',
    '',
  ];

  // Add syntax groups from neovimGroups mapping
  lines.push('  -- Syntax groups (legacy + Treesitter + LSP)');
  lines.push('  local syntax_map = {');
  for (const [category, groups] of Object.entries(neovimGroups)) {
    for (const group of groups) {
      const opts = category === 'comment'
        ? `{ fg = p.${category}, italic = true }`
        : `{ fg = p.${category} }`;
      // Treesitter @ groups need special quoting
      if (group.startsWith('@')) {
        lines.push(`    ["${group}"] = ${opts},`);
      } else {
        lines.push(`    ${group} = ${opts},`);
      }
    }
  }
  lines.push('  }');
  lines.push('');
  lines.push('  -- Merge syntax into groups');
  lines.push('  for group, settings in pairs(syntax_map) do');
  lines.push('    groups[group] = settings');
  lines.push('  end');
  lines.push('');
  lines.push('  -- Apply all highlights');
  lines.push('  for group, settings in pairs(groups) do');
  lines.push('    vim.api.nvim_set_hl(0, group, settings)');
  lines.push('  end');
  lines.push('');

  // Terminal colors
  lines.push('  -- Terminal colors');
  lines.push('  local ansi = {');
  lines.push('    light = {},');
  lines.push('    dark = {},');
  lines.push('    hc = {},');
  lines.push('  }');
  lines.push('');

  for (const [mode, ansi] of Object.entries(ansiSets)) {
    const all = [...ansi.normal, ...ansi.bright];
    for (let i = 0; i < 16; i++) {
      lines.push(`  vim.g.terminal_color_${i} = ${mode == 'light' ? 'style == "light"' : mode == 'dark' ? 'style == "dark"' : 'style == "hc"'} and "${hex(all[i])}" or vim.g.terminal_color_${i}`);
    }
  }

  // Simplified: just set based on current style
  // Remove the complex conditional and replace with direct set
  lines.length -= 48; // Remove the conditional terminal colors
  lines.push('  -- Terminal colors');
  lines.push('  local tc = require("opo.palette")[style]');
  lines.push('  -- Set from ANSI palette embedded in palette module');

  lines.push('end');
  lines.push('');
  lines.push('return M');

  return lines.join('\n') + '\n';
}

export function generateNeovimEntry() {
  return `vim.cmd("hi clear")
vim.g.colors_name = "opo"
require("opo").setup({ style = vim.o.background == "dark" and "dark" or "light" })
`;
}

/**
 * Generate all Neovim files.
 * Returns an object with relative paths as keys and content as values.
 */
export function generateNeovim(variants, ansiSets) {
  // Simplified init that reads palette directly
  const initLua = `local M = {}

function M.setup(opts)
  opts = opts or {}
  local style = opts.style or "light"
  local palette = require("opo.palette")
  local p = palette[style]
  if not p then
    vim.notify("Opo: unknown style '" .. style .. "'. Use 'light', 'dark', or 'hc'.", vim.log.levels.ERROR)
    return
  end

  vim.cmd("hi clear")
  vim.g.colors_name = "opo"
  vim.o.termguicolors = true
  vim.o.background = (style == "dark") and "dark" or "light"

  -- Editor highlights
  local hl = vim.api.nvim_set_hl

  hl(0, "Normal",       { fg = p.text, bg = p.bg })
  hl(0, "NormalFloat",  { fg = p.text, bg = p.bgPanel })
  hl(0, "FloatBorder",  { fg = p.textFaint, bg = p.bgPanel })
  hl(0, "CursorLine",   { bg = p.bgHover })
  hl(0, "CursorColumn", { bg = p.bgHover })
  hl(0, "ColorColumn",  { bg = p.bgPanel })
  hl(0, "Visual",       { bg = p.bgHover })
  hl(0, "Search",       { fg = p.bg, bg = p.accent })
  hl(0, "IncSearch",    { fg = p.bg, bg = p.accent })
  hl(0, "LineNr",       { fg = p.textFaint })
  hl(0, "CursorLineNr", { fg = p.text })
  hl(0, "SignColumn",   { bg = p.bg })
  hl(0, "WinSeparator", { fg = p.textFaint })
  hl(0, "StatusLine",   { fg = p.textMid, bg = p.bgPanel })
  hl(0, "StatusLineNC", { fg = p.textFaint, bg = p.bgPanel })
  hl(0, "Pmenu",        { fg = p.text, bg = p.bgPanel })
  hl(0, "PmenuSel",     { fg = p.text, bg = p.bgHover })
  hl(0, "TabLine",      { fg = p.textFaint, bg = p.bgPanel })
  hl(0, "TabLineFill",  { bg = p.bgPanel })
  hl(0, "TabLineSel",   { fg = p.text, bg = p.bg })
  hl(0, "Folded",       { fg = p.textMid, bg = p.bgPanel })
  hl(0, "MatchParen",   { fg = p.accent, bold = true })
  hl(0, "Directory",    { fg = p.accent })
  hl(0, "Title",        { fg = p.text, bold = true })
  hl(0, "NonText",      { fg = p.textFaint })
  hl(0, "DiffAdd",      { fg = p.pass })
  hl(0, "DiffChange",   { fg = p.accent })
  hl(0, "DiffDelete",   { fg = p.fail })
  hl(0, "SpellBad",     { undercurl = true, sp = p.fail })

  -- Diagnostics
  hl(0, "DiagnosticError", { fg = p.fail })
  hl(0, "DiagnosticWarn",  { fg = p.string })
  hl(0, "DiagnosticInfo",  { fg = p.accent })
  hl(0, "DiagnosticHint",  { fg = p.textMid })

  -- Syntax: legacy Vim groups
  hl(0, "Comment",    { fg = p.comment, italic = true })
  hl(0, "String",     { fg = p.string })
  hl(0, "Character",  { fg = p.string })
  hl(0, "Number",     { fg = p.string })
  hl(0, "Float",      { fg = p.string })
  hl(0, "Keyword",    { fg = p.keyword })
  hl(0, "Statement",  { fg = p.keyword })
  hl(0, "Conditional",{ fg = p.keyword })
  hl(0, "Repeat",     { fg = p.keyword })
  hl(0, "Boolean",    { fg = p.keyword })
  hl(0, "StorageClass", { fg = p.keyword })
  hl(0, "Include",    { fg = p.keyword })
  hl(0, "Define",     { fg = p.keyword })
  hl(0, "PreProc",    { fg = p.keyword })
  hl(0, "Type",       { fg = p.type })
  hl(0, "Identifier", { fg = p.type })
  hl(0, "Function",   { fg = p["function"] })
  hl(0, "Operator",   { fg = p["function"] })
  hl(0, "Constant",   { fg = p.string })

  -- Treesitter
  hl(0, "@comment",           { link = "Comment" })
  hl(0, "@string",            { link = "String" })
  hl(0, "@string.regex",      { link = "String" })
  hl(0, "@string.escape",     { link = "String" })
  hl(0, "@number",            { link = "Number" })
  hl(0, "@number.float",      { link = "Float" })
  hl(0, "@character",         { link = "Character" })
  hl(0, "@boolean",           { link = "Boolean" })
  hl(0, "@keyword",           { link = "Keyword" })
  hl(0, "@keyword.function",  { link = "Keyword" })
  hl(0, "@keyword.return",    { link = "Keyword" })
  hl(0, "@keyword.operator",  { link = "Keyword" })
  hl(0, "@keyword.import",    { link = "Include" })
  hl(0, "@constant.builtin",  { link = "Boolean" })
  hl(0, "@type",              { link = "Type" })
  hl(0, "@type.builtin",      { link = "Type" })
  hl(0, "@type.definition",   { link = "Type" })
  hl(0, "@constructor",       { link = "Type" })
  hl(0, "@namespace",         { link = "Type" })
  hl(0, "@module",            { link = "Type" })
  hl(0, "@tag",               { link = "Type" })
  hl(0, "@tag.attribute",     { link = "Type" })
  hl(0, "@function",          { link = "Function" })
  hl(0, "@function.call",     { link = "Function" })
  hl(0, "@function.builtin",  { link = "Function" })
  hl(0, "@function.method",   { link = "Function" })
  hl(0, "@method",            { link = "Function" })
  hl(0, "@method.call",       { link = "Function" })
  hl(0, "@variable",          { fg = p.text })
  hl(0, "@variable.parameter",{ fg = p.text })
  hl(0, "@property",          { fg = p.text })
  hl(0, "@punctuation",       { fg = p.textMid })

  -- LSP semantic tokens
  hl(0, "@lsp.type.comment",   { link = "Comment" })
  hl(0, "@lsp.type.keyword",   { link = "Keyword" })
  hl(0, "@lsp.type.string",    { link = "String" })
  hl(0, "@lsp.type.number",    { link = "Number" })
  hl(0, "@lsp.type.type",      { link = "Type" })
  hl(0, "@lsp.type.class",     { link = "Type" })
  hl(0, "@lsp.type.interface",  { link = "Type" })
  hl(0, "@lsp.type.enum",      { link = "Type" })
  hl(0, "@lsp.type.namespace", { link = "Type" })
  hl(0, "@lsp.type.function",  { link = "Function" })
  hl(0, "@lsp.type.method",    { link = "Function" })
  hl(0, "@lsp.type.decorator", { link = "Function" })

  -- Terminal colors
  local ansi = palette.ansi and palette.ansi[style]
  if ansi then
    for i = 0, 15 do
      vim.g["terminal_color_" .. i] = ansi[i + 1]
    end
  end
end

return M
`;

  const colorsLua = `vim.cmd("hi clear")
vim.g.colors_name = "opo"
require("opo").setup({
  style = vim.o.background == "dark" and "dark" or "light",
})
`;

  // Build palette.lua with ANSI colors embedded
  const palLines = ['local M = {}', ''];
  for (const [mode, variant] of Object.entries(variants)) {
    palLines.push(`M.${mode} = {`);
    for (const [k, v] of Object.entries(variant.ui)) {
      palLines.push(`  ${k} = "${hex(v)}",`);
    }
    for (const [k, v] of Object.entries(variant.syntax)) {
      palLines.push(`  ${k} = "${hex(v)}",`);
    }
    palLines.push('}');
    palLines.push('');
  }

  // Add ANSI colors
  palLines.push('M.ansi = {');
  for (const [mode, ansi] of Object.entries(ansiSets)) {
    const all = [...ansi.normal, ...ansi.bright];
    palLines.push(`  ${mode} = {`);
    for (let i = 0; i < 16; i++) {
      palLines.push(`    "${hex(all[i])}",`);
    }
    palLines.push('  },');
  }
  palLines.push('}');
  palLines.push('');
  palLines.push('return M');

  return {
    'colors/opo.lua': colorsLua,
    'lua/opo/init.lua': initLua,
    'lua/opo/palette.lua': palLines.join('\n') + '\n',
  };
}
