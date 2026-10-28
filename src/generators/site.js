/**
 * Opo Theme — Project Site Generator
 * Output: a self-contained home page for the theme (dist/site/index.html)
 *
 * The page shows the palette per variant with OKLCH values and contrast,
 * live previews of an editor and a terminal, the build-time checks and the
 * supported apps with links to their files and install instructions. All
 * colors come from the derived variants, so the page cannot drift from the
 * themes. The contrast grid is published next to it at contrast/.
 *
 * The page itself lives in src/site/template.html; this file computes the
 * data and injects it as JSON, together with opo.css: the page uses only
 * Opo's custom properties for its own colors.
 */

import { formatHex, wcagContrast } from 'culori';
import { hues } from '../palette.js';
import { ansiPairs, contrastPairs, cvdPairs } from '../validate.js';
import { fillTemplate, opoPageData } from './contrast.js';
import { generateRaycastLink, generateRaycastTheme } from './raycast.js';

const TEMPLATE = new URL('../site/template.html', import.meta.url);
const REPO = 'https://github.com/IschaGast/opo-theme';
const NAMES = { light: 'Opo Light', dark: 'Opo Dark', hc: 'Opo High Contrast' };

// Supported apps, grouped. `readme` is the README heading with the install
// steps, `files` the folder in dist/.
const APPS = [
  ['Editors', [
    { name: 'VS Code', files: 'dist/vscode', readme: 'VS Code', how: 'Install the extension folder or a packaged .vsix.' },
    { name: 'Zed', files: 'dist/zed', readme: 'Zed', how: 'Copy opo.json to ~/.config/zed/themes/.' },
    { name: 'JetBrains', files: 'dist/jetbrains', readme: 'JetBrains (IntelliJ, WebStorm, etc.)', how: 'Import an .icls file under Editor > Color Scheme.' },
    { name: 'Neovim', files: 'dist/neovim/opo.nvim', readme: 'Neovim', how: 'Add opo.nvim with your plugin manager, then :colorscheme opo.' },
  ]],
  ['Terminals', [
    { name: 'Ghostty', files: 'dist/ghostty', readme: 'Ghostty', how: 'Copy to ~/.config/ghostty/themes/ and set theme = opo-light.' },
    { name: 'cmux', files: 'dist/ghostty', readme: 'cmux', how: 'Reads the Ghostty config, so it uses the Ghostty themes.' },
    { name: 'Alacritty', files: 'dist/alacritty', readme: 'Alacritty', how: 'Import a .toml file from alacritty.toml.' },
    { name: 'iTerm2', files: 'dist/iterm', readme: 'iTerm2', how: 'Double-click an .itermcolors file.' },
    { name: 'Windows Terminal', files: 'dist/windows-terminal', readme: 'Windows Terminal', how: 'Add the schemes to settings.json.' },
    { name: 'Warp', files: 'dist/warp', readme: 'Warp', how: 'Copy a .yaml file to ~/.warp/themes/.' },
  ]],
  ['Apps', [
    { name: 'Raycast', files: 'dist/raycast', readme: 'Raycast', how: 'Add with one click (needs Raycast Pro), then pick it under Appearance.', raycast: true },
    { name: 'Firefox', files: 'dist/firefox', readme: 'Firefox', how: 'One add-on that follows the Firefox light/dark setting.' },
    { name: 'Slack', files: 'dist/slack', readme: 'Slack', how: 'Paste the color string under Themes > Custom Theme.' },
    { name: 'Bear', files: 'dist/bear', readme: 'Bear', how: 'Replaces one of Bear’s bundled themes, as Bear only lists its own.' },
    { name: 'Typora', files: 'dist/typora', readme: 'Typora', how: 'Copy a .css file to Typora’s themes folder.' },
  ]],
  ['Slides and web', [
    { name: 'iA Presenter', files: 'dist/ia-presenter', readme: 'iA Presenter', how: 'A custom theme folder with light and dark presets.' },
    { name: 'Slidev', files: 'dist/slidev', readme: 'Slidev', how: 'A local Slidev theme: theme: ./path/to/dist/slidev.' },
    { name: 'CSS', files: 'dist/css', readme: 'CSS', how: 'Custom properties with --opo- prefix, or opo.css for auto light/dark.' },
    { name: 'npm package', files: 'dist/json', readme: 'Use in another project', how: 'Import the CSS in a bundler, or read every color as hex from opo.json.' },
  ]],
];

// GitHub's heading anchor for a README heading
function anchor(heading) {
  return heading.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s/g, '-');
}

function oklch(color) {
  return [color.l, color.c, color.h || 0].map((n, i) => Number(n.toFixed(i === 2 ? 1 : 3)));
}

function variantData(variant, ansi, mode) {
  // Named hues resolve to their role or syntax color, as a third group
  const groups = {
    ...variant,
    hues: Object.fromEntries(Object.entries(hues).map(([name, path]) => {
      const [group, key] = path.split('.');
      return [name, variant[group][key]];
    })),
  };
  const hexes = (group) => Object.fromEntries(Object.entries(groups[group]).map(([k, c]) => [k, formatHex(c)]));
  const oklchs = (group) => Object.fromEntries(Object.entries(groups[group]).map(([k, c]) => [k, oklch(c)]));
  const bg = formatHex(variant.ui.bg);
  const ratios = (group) => Object.fromEntries(Object.entries(groups[group]).map(([k, c]) =>
    [k, Math.round(wcagContrast(formatHex(c), bg) * 100) / 100]));
  const count = (list) => [list.filter(r => r.ok).length, list.length];
  const { target, label, results } = contrastPairs(variant, mode);
  const ansiResult = ansiPairs(variant, ansi, mode);

  return {
    name: NAMES[mode],
    target,
    label,
    ui: hexes('ui'),
    syntax: hexes('syntax'),
    hues: hexes('hues'),
    oklch: { hues: oklchs('hues'), ui: oklchs('ui'), syntax: oklchs('syntax') },
    ratio: { hues: ratios('hues'), ui: ratios('ui'), syntax: ratios('syntax') },
    ansi: [...ansi.normal, ...ansi.bright].map(c => formatHex(c)),
    // Editor selection tint, composited as validated
    selection: results.find(r => r.bg === 'textSelection').bgHex,
    stats: {
      contrast: count(results),
      cvd: count(cvdPairs(variant)),
      ansi: count([...ansiResult.contrast, ...ansiResult.cvd]),
    },
    raycast: generateRaycastLink(generateRaycastTheme(variant, ansi, mode)),
  };
}

export function generateSite(variants, ansiSets) {
  const modes = {};
  for (const mode of Object.keys(variants)) {
    modes[mode] = variantData(variants[mode], ansiSets[mode], mode);
  }
  const apps = APPS.map(([group, list]) => [group, list.map(({ readme, files, ...app }) => ({
    ...app,
    files: `${REPO}/tree/main/${files}`,
    ...(readme && { readme: `${REPO}#${anchor(readme)}` }),
  }))]);
  return fillTemplate(TEMPLATE, variants, opoPageData(variants, { modes, apps, repo: REPO }));
}
