/**
 * Opo Theme — JetBrains Theme Generator
 * Output: .icls XML
 */

import { formatHex } from 'culori';
import { jetbrainsExtended } from '../scopes.js';

function xmlEscape(s) {
  return s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]
  );
}

function hexNoHash(color) {
  return formatHex(color).slice(1);
}

function option(name, value) {
  return `    <option name="${xmlEscape(name)}" value="${xmlEscape(value)}" />`;
}

function attribute(name, fg, fontType = null) {
  const parts = [`    <option name="${xmlEscape(name)}">`];
  parts.push('      <value>');
  parts.push(`        <option name="FOREGROUND" value="${fg}" />`);
  if (fontType !== null) {
    parts.push(`        <option name="FONT_TYPE" value="${fontType}" />`);
  }
  parts.push('      </value>');
  parts.push('    </option>');
  return parts.join('\n');
}

export function generateJetBrains(variant, ansi, mode) {
  const p = {};
  for (const [k, v] of Object.entries(variant.ui)) p[k] = hexNoHash(v);
  const s = {};
  for (const [k, v] of Object.entries(variant.syntax)) s[k] = hexNoHash(v);

  const isDark = mode === 'dark';
  const label = mode === 'hc' ? 'High Contrast' : mode.charAt(0).toUpperCase() + mode.slice(1);
  const parentScheme = isDark ? 'Darcula' : 'Default';

  const colors = [
    option('CARET_COLOR', p.accent),
    option('CARET_ROW_COLOR', p.bgHover),
    option('CONSOLE_BACKGROUND_KEY', p.bg),
    option('GUTTER_BACKGROUND', p.bgPanel),
    option('LINE_NUMBERS_COLOR', p.textFaint),
    option('LINE_NUMBER_ON_CARET_ROW_COLOR', p.text),
    option('SELECTION_BACKGROUND', p.bgHover),
    option('SELECTION_FOREGROUND', p.text),
    option('INDENT_GUIDE', p.textFaint),
    option('RIGHT_MARGIN_COLOR', p.bgHover),
    option('TEARLINE_COLOR', p.textFaint),
  ];

  const attributes = [];

  // Font types: 0=normal, 1=bold, 2=italic, 3=bold+italic
  const fontTypes = { keyword: null, string: null, comment: 2, type: null, function: null };

  for (const [category, attrNames] of Object.entries(jetbrainsExtended)) {
    for (const attrName of attrNames) {
      attributes.push(attribute(attrName, s[category], fontTypes[category]));
    }
  }

  // Additional attributes
  attributes.push(attribute('DEFAULT_IDENTIFIER', p.text));
  attributes.push(attribute('DEFAULT_LOCAL_VARIABLE', p.text));
  attributes.push(attribute('DEFAULT_PARAMETER', p.text));
  attributes.push(attribute('DEFAULT_INSTANCE_FIELD', p.text));
  attributes.push(attribute('DEFAULT_CONSTANT', s.string));
  attributes.push(attribute('TEXT', p.text));

  return `<?xml version="1.0" encoding="UTF-8"?>
<scheme name="Opo ${label}" version="142" parent_scheme="${parentScheme}">
  <metaInfo>
    <property name="created">2026-03-15</property>
    <property name="ide">Idea</property>
    <property name="ideVersion">2025.1</property>
    <property name="originalScheme">Opo ${label}</property>
  </metaInfo>
  <colors>
${colors.join('\n')}
  </colors>
  <attributes>
${attributes.join('\n')}
  </attributes>
</scheme>
`;
}
