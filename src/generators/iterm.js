/**
 * Opo Theme — iTerm2 Theme Generator
 * Output: XML plist (.itermcolors)
 */

import { formatHex, parse } from 'culori';

function xmlEscape(s) {
  return s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]
  );
}

function hexToComponents(hexColor) {
  const c = parse(hexColor);
  return {
    r: c.r.toFixed(8),
    g: c.g.toFixed(8),
    b: c.b.toFixed(8),
  };
}

function colorEntry(name, hexColor) {
  const { r, g, b } = hexToComponents(hexColor);
  return `\t<key>${xmlEscape(name)}</key>
\t<dict>
\t\t<key>Color Space</key>
\t\t<string>sRGB</string>
\t\t<key>Red Component</key>
\t\t<real>${r}</real>
\t\t<key>Green Component</key>
\t\t<real>${g}</real>
\t\t<key>Blue Component</key>
\t\t<real>${b}</real>
\t\t<key>Alpha Component</key>
\t\t<real>1</real>
\t</dict>`;
}

export function generateIterm(variant, ansi, mode) {
  const entries = [];

  // ANSI colors 0-15
  const all = [...ansi.normal, ...ansi.bright];
  for (let i = 0; i < 16; i++) {
    entries.push(colorEntry(`Ansi ${i} Color`, formatHex(all[i])));
  }

  // UI colors
  entries.push(colorEntry('Background Color', formatHex(variant.ui.bg)));
  entries.push(colorEntry('Foreground Color', formatHex(variant.ui.text)));
  entries.push(colorEntry('Cursor Color', formatHex(variant.ui.accent)));
  entries.push(colorEntry('Cursor Text Color', formatHex(variant.ui.bg)));
  entries.push(colorEntry('Selection Color', formatHex(variant.ui.bgHover)));
  entries.push(colorEntry('Selected Text Color', formatHex(variant.ui.text)));
  entries.push(colorEntry('Bold Color', formatHex(variant.ui.text)));
  entries.push(colorEntry('Link Color', formatHex(variant.ui.accent)));

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${entries.join('\n')}
</dict>
</plist>
`;
}
