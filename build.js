#!/usr/bin/env node

/**
 * Opo Theme — Build Script
 *
 * Generates all theme files from OKLCH source definitions.
 * Usage: node build.js
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Source data
import { light, syntax } from './src/palette.js';
import { normal, bright } from './src/ansi.js';
import { deriveVariant, deriveAnsi } from './src/variants.js';
import { validateAll } from './src/validate.js';

// Generators
import { generateTheme, generatePackageJson } from './src/generators/vscode.js';
import { generateGhostty } from './src/generators/ghostty.js';
import { generateAlacritty } from './src/generators/alacritty.js';
import { generateIterm } from './src/generators/iterm.js';
import { generateWindowsTerminal } from './src/generators/windows-terminal.js';
import { generateWarp } from './src/generators/warp.js';
import { generateZed } from './src/generators/zed.js';
import { generateJetBrains } from './src/generators/jetbrains.js';
import { generateNeovim } from './src/generators/neovim.js';
import { generateCssVariant, generateCssCombined } from './src/generators/css.js';

const DIST = 'dist';
const MODES = ['light', 'dark', 'hc'];

function dir(...parts) {
  const p = join(DIST, ...parts);
  mkdirSync(p, { recursive: true });
  return p;
}

function write(filePath, content) {
  writeFileSync(filePath, content, 'utf-8');
  console.log(`  ${filePath}`);
}

// ── Step 1: Derive variants ──
console.log('\n🎨 Deriving variants from OKLCH palette...');
const variants = {};
const ansiSets = {};

for (const mode of MODES) {
  variants[mode] = deriveVariant(light, syntax, mode);
  ansiSets[mode] = deriveAnsi(normal, bright, mode);
}
console.log('  Light, Dark, High Contrast — done');

// ── Step 2: Validate contrast ratios ──
console.log('\n🔍 Validating contrast ratios...');
const allPassed = validateAll(variants);

if (!allPassed) {
  console.error('\n❌ Contrast validation FAILED. Fix palette before generating themes.');
  process.exit(1);
}
console.log('\n✅ All contrast ratios pass.');

// ── Step 3: Generate all formats ──
console.log('\n📦 Generating theme files...');
let fileCount = 0;

// VS Code
console.log('\n  VS Code:');
const vscodeDir = dir('vscode', 'themes');
for (const mode of MODES) {
  const label = mode === 'hc' ? 'hc' : mode;
  const theme = generateTheme(variants[mode], ansiSets[mode], mode);
  write(join(vscodeDir, `opo-${label}-color-theme.json`), JSON.stringify(theme, null, 2));
  fileCount++;
}
write(join(dir('vscode'), 'package.json'), JSON.stringify(generatePackageJson(), null, 2));
fileCount++;

// Ghostty
console.log('\n  Ghostty:');
const ghosttyDir = dir('ghostty');
for (const mode of MODES) {
  const label = mode === 'hc' ? 'hc' : mode;
  write(join(ghosttyDir, `opo-${label}`), generateGhostty(variants[mode], ansiSets[mode], mode));
  fileCount++;
}

// Alacritty
console.log('\n  Alacritty:');
const alacrittyDir = dir('alacritty');
for (const mode of MODES) {
  const label = mode === 'hc' ? 'hc' : mode;
  write(join(alacrittyDir, `opo-${label}.toml`), generateAlacritty(variants[mode], ansiSets[mode], mode));
  fileCount++;
}

// iTerm2
console.log('\n  iTerm2:');
const itermDir = dir('iterm');
const itermNames = { light: 'Opo Light', dark: 'Opo Dark', hc: 'Opo High Contrast' };
for (const mode of MODES) {
  write(join(itermDir, `${itermNames[mode]}.itermcolors`), generateIterm(variants[mode], ansiSets[mode], mode));
  fileCount++;
}

// Windows Terminal
console.log('\n  Windows Terminal:');
const wtDir = dir('windows-terminal');
write(join(wtDir, 'opo-themes.json'), generateWindowsTerminal(variants, ansiSets));
fileCount++;

// Warp
console.log('\n  Warp:');
const warpDir = dir('warp');
for (const mode of MODES) {
  const label = mode === 'hc' ? 'hc' : mode;
  write(join(warpDir, `opo-${label}.yaml`), generateWarp(variants[mode], ansiSets[mode], mode));
  fileCount++;
}

// Zed
console.log('\n  Zed:');
const zedDir = dir('zed');
write(join(zedDir, 'opo.json'), generateZed(variants, ansiSets));
fileCount++;

// JetBrains
console.log('\n  JetBrains:');
const jbDir = dir('jetbrains');
const jbNames = { light: 'Opo Light', dark: 'Opo Dark', hc: 'Opo High Contrast' };
for (const mode of MODES) {
  write(join(jbDir, `${jbNames[mode]}.icls`), generateJetBrains(variants[mode], ansiSets[mode], mode));
  fileCount++;
}

// Neovim
console.log('\n  Neovim:');
const nvimFiles = generateNeovim(variants, ansiSets);
for (const [relPath, content] of Object.entries(nvimFiles)) {
  const fullPath = join(DIST, 'neovim', 'opo.nvim', relPath);
  mkdirSync(join(fullPath, '..'), { recursive: true });
  write(fullPath, content);
  fileCount++;
}

// CSS
console.log('\n  CSS:');
const cssDir = dir('css');
for (const mode of MODES) {
  const label = mode === 'hc' ? 'hc' : mode;
  write(join(cssDir, `opo-${label}.css`), generateCssVariant(variants[mode], mode));
  fileCount++;
}
write(join(cssDir, 'opo.css'), generateCssCombined(variants.light, variants.dark));
fileCount++;

// ── Summary ──
console.log(`\n✨ Build complete! ${fileCount} files generated in dist/`);
console.log('   Variants: Opo Light, Opo Dark, Opo High Contrast');
console.log('   Formats: VS Code, Ghostty, Alacritty, iTerm2, Windows Terminal,');
console.log('            Warp, Zed, JetBrains, Neovim, CSS\n');
