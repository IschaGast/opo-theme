/**
 * Opo Theme — TextMate Scope Mapping
 *
 * Maps 5 syntax categories to TextMate grammar scopes.
 * Used by VS Code tokenColors and adapted for other editors.
 */

export const scopeMap = {
  keyword: [
    'keyword',
    'keyword.control',
    'keyword.operator.new',
    'keyword.operator.delete',
    'keyword.operator.expression',
    'keyword.operator.logical',
    'keyword.operator.typeof',
    'storage',
    'storage.type',
    'storage.modifier',
    'variable.language.this',
    'variable.language.self',
    'variable.language.super',
    'constant.language',
    'constant.language.boolean',
    'constant.language.null',
    'constant.language.undefined',
  ],
  string: [
    'string',
    'string.quoted',
    'string.quoted.single',
    'string.quoted.double',
    'string.quoted.triple',
    'string.template',
    'string.regexp',
    'constant.numeric',
    'constant.numeric.integer',
    'constant.numeric.float',
    'constant.numeric.hex',
    'constant.character',
    'constant.character.escape',
    'constant.other.symbol',
    'markup.inline.raw',
  ],
  comment: [
    'comment',
    'comment.line',
    'comment.line.double-slash',
    'comment.line.number-sign',
    'comment.block',
    'comment.block.documentation',
    'punctuation.definition.comment',
  ],
  type: [
    'entity.name.type',
    'entity.name.type.class',
    'entity.name.type.interface',
    'entity.name.type.enum',
    'entity.name.type.module',
    'entity.name.class',
    'entity.name.namespace',
    'entity.name.struct',
    'support.type',
    'support.type.primitive',
    'support.class',
    'meta.type.annotation',
    'entity.name.tag',
    'entity.other.attribute-name',
    'support.type.property-name.css',
  ],
  function: [
    'entity.name.function',
    'entity.name.function.method',
    'support.function',
    'meta.function-call',
    'entity.name.function.decorator',
    'meta.decorator',
    'punctuation.decorator',
    'variable.function',
  ],
};

/**
 * JetBrains attribute name mapping.
 * JetBrains uses different names than TextMate.
 */
export const jetbrainsMap = {
  keyword:  'DEFAULT_KEYWORD',
  string:   'DEFAULT_STRING',
  comment:  'DEFAULT_LINE_COMMENT',
  type:     'DEFAULT_CLASS_NAME',
  function: 'DEFAULT_FUNCTION_DECLARATION',
};

/**
 * Additional JetBrains attributes for broader coverage.
 */
export const jetbrainsExtended = {
  keyword: [
    'DEFAULT_KEYWORD',
    'KOTLIN_KEYWORD',
    'JAVA_KEYWORD',
  ],
  string: [
    'DEFAULT_STRING',
    'DEFAULT_VALID_STRING_ESCAPE',
    'DEFAULT_NUMBER',
  ],
  comment: [
    'DEFAULT_LINE_COMMENT',
    'DEFAULT_BLOCK_COMMENT',
    'DEFAULT_DOC_COMMENT',
  ],
  type: [
    'DEFAULT_CLASS_NAME',
    'DEFAULT_INTERFACE_NAME',
    'DEFAULT_CLASS_REFERENCE',
  ],
  function: [
    'DEFAULT_FUNCTION_DECLARATION',
    'DEFAULT_FUNCTION_CALL',
    'DEFAULT_STATIC_METHOD',
  ],
};

/**
 * Neovim highlight group mapping.
 * Covers legacy Vim groups, Treesitter @groups, and LSP semantic tokens.
 */
export const neovimGroups = {
  keyword: [
    'Keyword', 'Statement', 'Conditional', 'Repeat', 'Label',
    'Exception', 'StorageClass', 'Structure', 'Typedef',
    'Boolean', 'Include', 'Define', 'Macro', 'PreProc', 'PreCondit',
    '@keyword', '@keyword.function', '@keyword.operator', '@keyword.return',
    '@keyword.conditional', '@keyword.repeat', '@keyword.exception',
    '@keyword.import', '@keyword.export',
    '@boolean', '@constant.builtin',
    '@lsp.type.keyword',
  ],
  string: [
    'String', 'Character', 'Number', 'Float',
    'SpecialChar', 'Tag',
    '@string', '@string.regex', '@string.escape', '@string.special',
    '@number', '@number.float', '@character', '@character.special',
    '@lsp.type.string', '@lsp.type.number',
  ],
  comment: [
    'Comment', 'SpecialComment', 'Todo',
    '@comment', '@comment.documentation',
    '@lsp.type.comment',
  ],
  type: [
    'Type', 'Identifier',
    '@type', '@type.builtin', '@type.definition', '@type.qualifier',
    '@constructor', '@namespace', '@module',
    '@tag', '@tag.attribute',
    '@lsp.type.type', '@lsp.type.class', '@lsp.type.interface',
    '@lsp.type.enum', '@lsp.type.namespace', '@lsp.type.struct',
  ],
  function: [
    'Function', 'Operator',
    '@function', '@function.call', '@function.builtin', '@function.method',
    '@method', '@method.call',
    '@lsp.type.function', '@lsp.type.method', '@lsp.type.decorator',
  ],
};

/**
 * Zed syntax scope mapping.
 * Zed uses its own scope names.
 */
export const zedScopes = {
  keyword:  'keyword',
  string:   'string',
  comment:  'comment',
  type:     'type',
  function: 'function',
};
