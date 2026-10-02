/**
 * Opo Theme — Contrast Ratio Validator
 *
 * Validates all foreground/background pairings against WCAG targets.
 * Light/Dark: AA (4.5:1 normal text, 3:1 UI elements)
 * High Contrast: AAA (7:1 normal text)
 */

import {
  differenceCiede2000, filterDeficiencyDeuter, filterDeficiencyProt,
  filterDeficiencyTrit, formatHex, interpolate, wcagContrast,
} from 'culori';
import { tintAlpha } from './palette.js';

const TEXT_KEYS = ['text', 'textMid', 'textFaint', 'accent', 'pass', 'fail', 'warn', 'neutral'];
const SYNTAX_KEYS = ['keyword', 'string', 'comment', 'type', 'function'];
const BG_KEYS = [
  'bg', 'bgPanel', 'bgHover',
  'listSelection', 'textSelection', 'passTint', 'failTint', 'warnTint', 'neutralTint',
];
// Solid backgrounds drawn with bg-colored text (inverted selection, search)
const INVERTED_KEYS = ['accent', 'warn', 'fail'];

/**
 * Validate contrast ratios for a variant.
 * Returns { passed, failed, report }.
 */
export function validateVariant(variant, mode) {
  const target = mode === 'hc' ? 7.0 : 4.5;
  const label = mode === 'hc' ? 'AAA (7:1)' : 'AA (4.5:1)';
  const results = [];
  let passed = 0;
  let failed = 0;

  // Check all text/semantic colors against all backgrounds
  // Tinted backgrounds, composited as the tools draw them (see tintAlpha)
  const tint = tintAlpha[mode];
  // Alpha is rounded to 8-bit, as it ends up in #rrggbbaa
  const over = (base, color, alpha) => interpolate([base, color])(Math.round(alpha * 255) / 255);
  const { bg, bgPanel, accent, pass, fail, warn, neutral } = variant.ui;
  const backgrounds = {
    ...variant.ui,
    listSelection: over(bgPanel, accent, tint.listSelection),
    textSelection: over(bg, accent, tint.textSelection),
    passTint: over(bg, pass, tint.highlight),
    failTint: over(bg, fail, tint.highlight),
    warnTint: over(bg, warn, tint.highlight),
    neutralTint: over(bg, neutral, tint.listSelection),
  };

  for (const bgKey of BG_KEYS) {
    const bgColor = backgrounds[bgKey];
    const bgHex = formatHex(bgColor);

    for (const fgKey of TEXT_KEYS) {
      const fgColor = variant.ui[fgKey];
      if (!fgColor) continue;
      const fgHex = formatHex(fgColor);
      const ratio = wcagContrast(fgHex, bgHex);
      const ok = ratio >= target;
      if (ok) passed++; else failed++;
      results.push({ fg: fgKey, bg: bgKey, fgHex, bgHex, ratio, ok });
    }

    // Check syntax colors
    for (const synKey of SYNTAX_KEYS) {
      const synColor = variant.syntax[synKey];
      if (!synColor) continue;
      const synHex = formatHex(synColor);
      const ratio = wcagContrast(synHex, bgHex);
      const ok = ratio >= target;
      if (ok) passed++; else failed++;
      results.push({ fg: synKey, bg: bgKey, fgHex: synHex, bgHex, ratio, ok });
    }
  }

  // Inverted: bg-colored text on a solid color, which must also stand out
  // from the background as a UI state (3:1, WCAG 1.4.11)
  for (const key of INVERTED_KEYS) {
    const fillHex = formatHex(variant.ui[key]);
    const bgHex = formatHex(bg);
    const ratio = wcagContrast(bgHex, fillHex);
    const ok = ratio >= target && wcagContrast(fillHex, bgHex) >= 3;
    if (ok) passed++; else failed++;
    results.push({ fg: 'bg', bg: key, fgHex: bgHex, bgHex: fillHex, ratio, ok });
  }

  // Build report
  const lines = [`\n${mode.toUpperCase()} variant — Target: ${label}`];
  lines.push('─'.repeat(73));
  lines.push(
    'Foreground'.padEnd(12) +
    'Background'.padEnd(15) +
    'FG hex'.padEnd(10) +
    'BG hex'.padEnd(10) +
    'Ratio'.padEnd(10) +
    'Result'
  );
  lines.push('─'.repeat(73));

  for (const r of results) {
    const status = r.ok ? '  OK' : ' FAIL';
    lines.push(
      r.fg.padEnd(12) +
      r.bg.padEnd(15) +
      r.fgHex.padEnd(10) +
      r.bgHex.padEnd(10) +
      (r.ratio.toFixed(2) + ':1').padEnd(10) +
      status
    );
  }

  lines.push('─'.repeat(73));
  lines.push(`Passed: ${passed}  Failed: ${failed}  Total: ${passed + failed}`);

  return {
    passed,
    failed,
    report: lines.join('\n'),
  };
}

/**
 * Validate the 16 ANSI colors against the terminal background and the
 * terminal selection tint. The slot that matches the background by
 * convention (black on dark, white and bright white on light) is skipped.
 */
export function validateAnsi(variant, ansi, mode) {
  const target = mode === 'hc' ? 7.0 : 4.5;
  const skip = mode === 'dark' ? [0] : [7, 15];
  const { bg, accent } = variant.ui;
  const alpha = Math.round(tintAlpha[mode].terminalSelection * 255) / 255;
  const backgrounds = { bg, terminalSelection: interpolate([bg, accent])(alpha) };
  const failures = [];
  let passed = 0;

  [...ansi.normal, ...ansi.bright].forEach((color, i) => {
    if (skip.includes(i)) return;
    for (const [bgKey, bgColor] of Object.entries(backgrounds)) {
      const ratio = wcagContrast(formatHex(color), formatHex(bgColor));
      if (ratio >= target) passed++;
      else failures.push(`ANSI ${i} on ${bgKey}: ${formatHex(color)} ${ratio.toFixed(2)}:1`);
    }
  });

  // The six chromatic colors (red..cyan) must stay apart under CVD
  const deltaE = differenceCiede2000();
  for (const set of ['normal', 'bright']) {
    for (let i = 1; i <= 6; i++) {
      for (let j = i + 1; j <= 6; j++) {
        const d = Math.min(...Object.values(CVD_SIMULATIONS).map(sim => deltaE(sim(ansi[set][i]), sim(ansi[set][j]))));
        if (d >= ANSI_CVD_MIN) passed++;
        else failures.push(`ANSI ${set} ${i} / ${j}: CIEDE2000 ${d.toFixed(1)} under CVD (min ${ANSI_CVD_MIN})`);
      }
    }
  }

  const lines = [`ANSI (${mode}): Passed: ${passed}  Failed: ${failures.length}`, ...failures.map(f => `  FAIL ${f}`)];
  return { passed, failed: failures.length, report: lines.join('\n') };
}

// Color pairs that must stay distinguishable under color vision deficiency.
// Minimum CIEDE2000 distance, taken over normal vision and full-strength
// deuteranopia, protanopia and tritanopia simulation. Pairs where bold or
// italic also differs (keyword, comment) may be closer than color-only pairs.
const CVD_SIMULATIONS = {
  normal: (c) => c,
  deuteranopia: filterDeficiencyDeuter(1),
  protanopia: filterDeficiencyProt(1),
  tritanopia: filterDeficiencyTrit(1),
};
const ANSI_CVD_MIN = 5;
const CVD_PAIRS = [
  // UI semantics: pass/fail, error/warning, modified/created
  ['ui.pass', 'ui.fail', 9], ['ui.fail', 'ui.warn', 9], ['ui.accent', 'ui.pass', 9],
  ['ui.accent', 'ui.fail', 9], ['ui.accent', 'ui.warn', 9],
  // Syntax pairs without a font-style difference
  ['syntax.type', 'syntax.function', 8], ['syntax.type', 'syntax.string', 8],
  ['syntax.function', 'syntax.string', 8],
  // Syntax pairs that also differ in bold (keyword) or italic (comment)
  ['syntax.keyword', 'syntax.type', 4.5], ['syntax.keyword', 'syntax.function', 4.5],
  ['syntax.comment', 'syntax.type', 4.5], ['syntax.comment', 'syntax.function', 4.5],
];

/**
 * Validate that semantic and syntax color pairs stay distinguishable under
 * simulated color vision deficiency.
 */
export function validateCvd(variant, mode) {
  const deltaE = differenceCiede2000();
  const pick = (path) => { const [group, key] = path.split('.'); return variant[group][key]; };
  const failures = [];
  let passed = 0;

  for (const [a, b, min] of CVD_PAIRS) {
    let worst = { d: Infinity };
    for (const [name, simulate] of Object.entries(CVD_SIMULATIONS)) {
      const d = deltaE(simulate(pick(a)), simulate(pick(b)));
      if (d < worst.d) worst = { d, name };
    }
    if (worst.d >= min) passed++;
    else failures.push(`${a} / ${b}: ${worst.d.toFixed(1)} under ${worst.name} (min ${min})`);
  }

  const lines = [`CVD (${mode}): Passed: ${passed}  Failed: ${failures.length}`, ...failures.map(f => `  FAIL ${f}`)];
  return { passed, failed: failures.length, report: lines.join('\n') };
}

/**
 * Validate all variants and print combined report.
 * Returns true if all pass, false if any fail.
 */
export function validateAll(variants, ansiSets = {}) {
  let allPassed = true;

  for (const [mode, variant] of Object.entries(variants)) {
    const { failed, report } = validateVariant(variant, mode);
    console.log(report);
    if (failed > 0) allPassed = false;
  }

  for (const [mode, variant] of Object.entries(variants)) {
    const { failed, report } = validateCvd(variant, mode);
    console.log(report);
    if (failed > 0) allPassed = false;
  }

  for (const [mode, ansi] of Object.entries(ansiSets)) {
    const { failed, report } = validateAnsi(variants[mode], ansi, mode);
    console.log(report);
    if (failed > 0) allPassed = false;
  }

  return allPassed;
}
