/**
 * Opo Theme — Design Tool Swatches Generator
 * Output, per variant: macOS color list (.clr), Adobe Swatch Exchange (.ase)
 * and DTCG design tokens (.tokens.json, imported by Figma as variables)
 *
 * Each holds the same swatches: the backgrounds, the text colors and the
 * named hues, named as the --opo- custom properties in dist/css.
 */

import { formatHex, parse } from 'culori';
import { hues } from '../palette.js';

const BASE = { bg: 'bg', 'bg-panel': 'bgPanel', 'bg-hover': 'bgHover', text: 'text', 'text-mid': 'textMid', 'text-faint': 'textFaint' };

// [name, hex, [r, g, b] in 0-1] for every swatch, from the 8-bit hex so all
// formats match the other themes exactly
function swatches(variant) {
  const pick = (path) => { const [group, key] = path.split('.'); return variant[group][key]; };
  return [
    ...Object.entries(BASE).map(([name, key]) => [name, variant.ui[key]]),
    ...Object.entries(hues).map(([name, path]) => [name, pick(path)]),
  ].map(([name, color]) => {
    const hex = formatHex(color);
    const { r, g, b } = parse(hex);
    return [name, hex, [r, g, b]];
  });
}

// macOS color list: an NSKeyedArchiver plist with NSKeys and NSColors.
// macOS reads it as XML as well as binary; NSID 7 is the sRGB color space.
// Install by copying into ~/Library/Colors
export function generateClr(variant) {
  const list = swatches(variant);
  const n = list.length;
  const uid = (i) => `<dict><key>CF$UID</key><integer>${i}</integer></dict>`;
  const data = (s) => `<data>${Buffer.from(s).toString('base64')}</data>`;
  const classDef = (...names) => `<dict><key>$classes</key><array>${names.map(c => `<string>${c}</string>`).join('')}</array><key>$classname</key><string>${names[0]}</string></dict>`;
  // Object indexes: 0 $null, 1 keys array, then the key strings, the array
  // class, the colors array, the colors, the color space and two classes
  const arrayClass = 2 + n;
  const colorsArray = 3 + n;
  const space = 4 + 2 * n;
  const objects = [
    '<string>$null</string>',
    `<dict><key>$class</key>${uid(arrayClass)}<key>NS.objects</key><array>${list.map((_, i) => uid(2 + i)).join('')}</array></dict>`,
    ...list.map(([name]) => `<string>${name}</string>`),
    classDef('NSMutableArray', 'NSArray', 'NSObject'),
    `<dict><key>$class</key>${uid(arrayClass)}<key>NS.objects</key><array>${list.map((_, i) => uid(4 + n + i)).join('')}</array></dict>`,
    ...list.map(([, , rgb]) => {
      const c = rgb.map(v => +v.toFixed(6)).join(' ');
      return `<dict><key>$class</key>${uid(space + 2)}<key>NSColorSpace</key><integer>1</integer><key>NSComponents</key>${data(`${c} 1`)}<key>NSCustomColorSpace</key>${uid(space)}<key>NSRGB</key>${data(`${c}\0`)}</dict>`;
    }),
    `<dict><key>$class</key>${uid(space + 1)}<key>NSID</key><integer>7</integer></dict>`,
    classDef('NSColorSpace', 'NSObject'),
    classDef('NSColor', 'NSObject'),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>$archiver</key>
\t<string>NSKeyedArchiver</string>
\t<key>$objects</key>
\t<array>
${objects.map(o => `\t\t${o}`).join('\n')}
\t</array>
\t<key>$top</key>
\t<dict><key>NSColors</key>${uid(colorsArray)}<key>NSKeys</key>${uid(1)}</dict>
\t<key>$version</key>
\t<integer>100000</integer>
</dict>
</plist>
`;
}

// Adobe Swatch Exchange: big-endian blocks after an ASEF 1.0 header, with
// the swatches in one group named after the variant
export function generateAse(variant, title) {
  const name = (s) => {
    const buf = Buffer.alloc(2 + (s.length + 1) * 2);
    buf.writeUInt16BE(s.length + 1, 0);
    for (let i = 0; i < s.length; i++) buf.writeUInt16BE(s.charCodeAt(i), 2 + i * 2);
    return buf;
  };
  const block = (type, body) => {
    const head = Buffer.alloc(6);
    head.writeUInt16BE(type, 0);
    head.writeUInt32BE(body.length, 2);
    return Buffer.concat([head, body]);
  };
  const color = ([label, , rgb]) => {
    const values = Buffer.alloc(4 + 12 + 2);
    values.write('RGB ', 0, 'ascii');
    rgb.forEach((v, i) => values.writeFloatBE(v, 4 + i * 4));
    values.writeUInt16BE(2, 16); // normal (process) color
    return block(0x0001, Buffer.concat([name(label), values]));
  };
  const list = swatches(variant);
  const blocks = [block(0xc001, name(title)), ...list.map(color), block(0xc002, Buffer.alloc(0))];
  const header = Buffer.alloc(12);
  header.write('ASEF', 0, 'ascii');
  header.writeUInt16BE(1, 4);
  header.writeUInt16BE(0, 6);
  header.writeUInt32BE(blocks.length, 8);
  return Buffer.concat([header, ...blocks]);
}

// Design tokens in the DTCG format, one file per variant. Figma imports
// each file as a mode of one variable collection.
export function generateFigmaTokens(variant) {
  return Object.fromEntries(swatches(variant).map(([name, hex, rgb]) => [name, {
    $type: 'color',
    $value: { colorSpace: 'srgb', components: rgb.map(v => +v.toFixed(4)), alpha: 1, hex },
  }]));
}
