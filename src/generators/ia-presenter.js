/**
 * Opo Theme — iA Presenter Theme Generator
 * Output: template.json, presets.json for an iA Presenter custom theme
 *
 * iA Presenter themes are a plain folder (no archive). Schema below is
 * verified against an actual app-scaffolded theme folder (Settings →
 * Themes → Create Theme), not just the public docs, which describe an
 * older/looser shape:
 *
 *   template.json: { Name, Version(number), Author, Description, Css,
 *                     TitleFont, BodyFont }
 *   presets.json:   { Presets: [{ Name, TitleFont, BodyFont, Appearance,
 *                     Light/DarkBackgroundColor, Light/DarkBodyTextColor,
 *                     Light/DarkTitleTextColor, Light/DarkAccent1,
 *                     Accent1..Accent6, Light/DarkBgGradient }] }
 *
 * Only Accent1 gets a Light/Dark pair in the real scaffold — Accent2-6
 * are flat (same value in both appearances).
 *
 * Field-naming gotcha (confirmed against iA's own bundled Helvetica
 * theme): "Light*"/"Dark*" name the LIGHTNESS of the color itself, not
 * "used in light/dark mode". They're cross-paired for contrast — a
 * light surface uses LightBackgroundColor with DarkBodyTextColor (dark
 * text), a dark surface uses DarkBackgroundColor with LightBodyTextColor
 * (light text). Get this backwards and you get white-on-white / black-
 * on-black.
 *
 * The theme's own <name>.css is scaffolded by the app for typography
 * only (heading sizes/line-height) and starts with the comment
 * "add below your custom Theme CSS" — colors live in presets.json, not
 * CSS. This generator does not touch that file; it only produces the
 * two JSON files, which are safe to replace wholesale.
 *
 * Docs: https://ia.net/presenter/support/visuals/themes
 */

import { formatHex } from 'culori';

const FONT = 'Atkinson Hyperlegible Next';

// UI role → Accent slot. Opo has 3 core semantic colors + 2 syntax hues;
// mapped to iA's 6 accent slots so charts/highlights stay colorblind-safe.
const ACCENT_KEYS = [
  ['Accent1', (ui) => ui.accent],         // primary accent — blue
  ['Accent2', (ui) => ui.pass],           // pass / emphasis — deep blue
  ['Accent3', (ui) => ui.fail],           // fail / warm callout — orange
  ['Accent4', (ui, syn) => syn.function], // teal
  ['Accent5', (ui, syn) => syn.type],     // purple
  ['Accent6', (ui) => ui.neutral],        // muted / neutral
];

// Theme name must match the app-scaffolded folder name exactly
// (the folder the user created via Settings → Themes → Create Theme).
export const THEME_NAME = 'OPO-theme';
export const CSS_FILENAME = 'opo-theme.css';

export function generateTemplateJson() {
  const template = {
    Name: THEME_NAME,
    Version: 1,
    Author: 'Ischa Gast',
    Description:
      'Colorblind-safe, OKLCH-based accessible theme. Blue/orange instead of green/red (Okabe-Ito), warm off-white background, WCAG AA+ contrast throughout. https://github.com/IschaGast/opo-theme',
    Css: CSS_FILENAME,
    TitleFont: FONT,
    BodyFont: FONT,
  };
  return JSON.stringify(template, null, 2) + '\n';
}

function buildPreset(name, appearance, variants) {
  const light = variants.light.ui;
  const dark = variants.dark.ui;
  const lightSyn = variants.light.syntax;
  const hex = (c) => formatHex(c);

  const preset = {
    Name: name,
    TitleFont: FONT,
    BodyFont: FONT,
    Appearance: appearance,
    // Surfaces: genuinely light/dark backgrounds.
    LightBackgroundColor: hex(light.bg),
    DarkBackgroundColor: hex(dark.bg),
    // Text: cross-paired for contrast (see field-naming gotcha above).
    LightBodyTextColor: hex(dark.text),
    DarkBodyTextColor: hex(light.text),
    LightTitleTextColor: hex(dark.text),
    DarkTitleTextColor: hex(light.text),
    // Accent1: same cross-pairing — the light-toned accent shows up
    // against the dark surface, the dark-toned one against the light surface.
    LightAccent1: hex(dark.accent),
    DarkAccent1: hex(light.accent),
  };

  // Accent2-6 are flat only, per the verified scaffold shape — use the
  // light-surface set as the single shared value.
  for (const [slot, pick] of ACCENT_KEYS) {
    preset[slot] = hex(pick(light, lightSyn));
  }

  return preset;
}

export function generatePresetsJson(variants) {
  const presets = [
    buildPreset('Opo', 'light', variants),
    buildPreset('Opo Dark', 'dark', variants),
  ];
  return JSON.stringify({ Presets: presets }, null, 2) + '\n';
}
