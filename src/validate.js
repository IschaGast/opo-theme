/**
 * Opo Theme — Contrast Ratio Validator
 *
 * Validates all foreground/background pairings against WCAG targets.
 * Light/Dark: AA (4.5:1 normal text, 3:1 UI elements)
 * High Contrast: AAA (7:1 normal text)
 */

import { formatHex, wcagContrast } from 'culori';

const TEXT_KEYS = ['text', 'textMid', 'textFaint', 'accent', 'pass', 'fail', 'neutral'];
const SYNTAX_KEYS = ['keyword', 'string', 'comment', 'type', 'function'];
const BG_KEYS = ['bg', 'bgPanel', 'bgHover'];

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
  for (const bgKey of BG_KEYS) {
    const bgColor = variant.ui[bgKey];
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

  // Build report
  const lines = [`\n${mode.toUpperCase()} variant — Target: ${label}`];
  lines.push('─'.repeat(70));
  lines.push(
    'Foreground'.padEnd(12) +
    'Background'.padEnd(12) +
    'FG hex'.padEnd(10) +
    'BG hex'.padEnd(10) +
    'Ratio'.padEnd(10) +
    'Result'
  );
  lines.push('─'.repeat(70));

  for (const r of results) {
    const status = r.ok ? '  OK' : ' FAIL';
    lines.push(
      r.fg.padEnd(12) +
      r.bg.padEnd(12) +
      r.fgHex.padEnd(10) +
      r.bgHex.padEnd(10) +
      (r.ratio.toFixed(2) + ':1').padEnd(10) +
      status
    );
  }

  lines.push('─'.repeat(70));
  lines.push(`Passed: ${passed}  Failed: ${failed}  Total: ${passed + failed}`);

  return {
    passed,
    failed,
    report: lines.join('\n'),
  };
}

/**
 * Validate all variants and print combined report.
 * Returns true if all pass, false if any fail.
 */
export function validateAll(variants) {
  let allPassed = true;

  for (const [mode, variant] of Object.entries(variants)) {
    const { passed, failed, report } = validateVariant(variant, mode);
    console.log(report);
    if (failed > 0) allPassed = false;
  }

  return allPassed;
}
