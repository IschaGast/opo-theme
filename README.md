# Opo

Colorblind-safe, OKLCH-based accessible color theme for editors, terminals, and web.

Named after the Sranantongo word **opo** (to rise, to open), from the Surinamese national anthem.

## Variants

- **Opo Light** — primary, light background
- **Opo Dark** — dark background, derived from light via OKLCH lightness mapping
- **Opo High Contrast** — WCAG AAA (7:1) for all text pairings

## Color Philosophy

- All colors defined in [OKLCH](https://oklch.com/) for perceptual consistency
- **Blue + orange** instead of green + red for colorblind safety ([Okabe-Ito, 2008](https://jfly.uni-koeln.de/color/))
- Every foreground/background pairing validated against WCAG contrast targets
- 360 contrast checks enforced at build time (120 per variant), including selection, find and diff tints
- Color pairs (UI, syntax and ANSI) checked for CVD distance at build time under simulated deuteranopia, protanopia, and tritanopia
- Selections are solid accent with background-colored text wherever a tool allows it, so they are clearly visible and readable
- 5 syntax token colors with lightness staircase + font style differentiators

### Palette (Light)

| Role | Hex | Contrast vs bg |
|------|-----|----------------|
| Text | `#24292f` | 13.82:1 |
| Text mid | `#57606a` | 6.03:1 |
| Text faint | `#5c646d` | 5.66:1 |
| Accent | `#005ccc` | 5.82:1 |
| Pass/success | `#002c85` | 11.66:1 |
| Fail/error | `#a75000` | 5.23:1 |
| Warning | `#583500` | 10.30:1 |

### Syntax (Light)

| Token | Hex | L | Style | Color |
|-------|-----|---|-------|-------|
| Keyword | `#002c85` | 0.33 | bold | Blue |
| Type | `#742651` | 0.40 | | Plum |
| Comment | `#5e5a55` | 0.47 | italic | Gray |
| Function | `#007570` | 0.50 | | Teal |
| String | `#a75000` | 0.53 | | Orange |

## Installation

### VS Code

Copy `dist/vscode/` to your extensions directory, or install the `.vsix`:

```bash
cd dist/vscode && npx @vscode/vsce package && code --install-extension opo-theme-1.0.0.vsix
```

### Ghostty

Copy a theme file to `~/.config/ghostty/themes/`:

```bash
cp dist/ghostty/opo-light ~/.config/ghostty/themes/
```

Add to your Ghostty config:

```
theme = opo-light
```

### Alacritty

Copy a theme file and import in your `alacritty.toml`:

```bash
cp dist/alacritty/opo-light.toml ~/.config/alacritty/themes/
```

```toml
import = ["~/.config/alacritty/themes/opo-light.toml"]
```

### iTerm2

Double-click a `.itermcolors` file from `dist/iterm/`, or import via Preferences > Profiles > Colors > Color Presets.

### Windows Terminal

Copy the contents of `dist/windows-terminal/opo-themes.json` into the `schemes` array in your `settings.json`. Then set `colorScheme` to `"Opo Light"`, `"Opo Dark"`, or `"Opo High Contrast"`.

### Zed

Copy `dist/zed/opo.json` to `~/.config/zed/themes/`:

```bash
cp dist/zed/opo.json ~/.config/zed/themes/
```

### JetBrains (IntelliJ, WebStorm, etc.)

Import a `.icls` file from `dist/jetbrains/` via Settings > Editor > Color Scheme > Import Scheme.

### Neovim

Copy `dist/neovim/opo.nvim/` to your Neovim runtime path, or use a plugin manager:

```lua
-- lazy.nvim
{ dir = "/path/to/opo-theme/dist/neovim/opo.nvim" }
```

```lua
-- Usage
vim.cmd("colorscheme opo")

-- Or with explicit variant
require("opo").setup({ style = "dark" })
```

### Warp

Copy a theme file to `~/.warp/themes/`:

```bash
cp dist/warp/opo-light.yaml ~/.warp/themes/
```

### Slack

Open a theme file from `dist/slack/` and copy the comma-separated color string. Then go to Slack > Preferences > Themes > Custom Theme and paste it.

### CSS

Include a CSS file in your web project:

```html
<link rel="stylesheet" href="opo-light.css">
```

Or use `opo.css` for automatic light/dark switching via `prefers-color-scheme`.

All custom properties are prefixed with `--opo-`:

```css
body {
  background: var(--opo-bg);
  color: var(--opo-text);
}
a {
  color: var(--opo-accent);
}
```

### Slidev

`dist/slidev/` is a local [Slidev](https://sli.dev) theme: Slidev's default theme with Opo colors (light and dark), Atkinson Hyperlegible Next, and an iA Presenter-style layer on top. Every layout is top left, so text does not jump between slides; only `layout: center` centers vertically. Heading sizes, weights and line heights follow iA Presenter, with balanced line wrapping. Code blocks use the VS Code theme for highlighting.

The default theme's layouts and styles are vendored unchanged in `src/slidev-default/` (MIT), because a theme outside the project cannot import `@slidev/theme-default`.

Point to it from the frontmatter of your `slides.md`:

```yaml
---
theme: ../opo-theme/dist/slidev
---
```

`dist/slidev/example.md` has one slide per built-in layout. Run it from a Slidev project:

```bash
npx slidev ../opo-theme/dist/slidev/example.md
```

## Recommended Font

Opo pairs best with **[Atkinson Hyperlegible Mono](https://www.brailleinstitute.org/freefont/)** — designed by the Braille Institute for maximum character legibility, with exaggerated letter differentiation (distinct I/l/1, O/0) for low vision and dyslexia.

For terminals and CLI tools (Claude Code, starship, etc.) that use Unicode symbols, install the **Nerd Font** variant which adds 3000+ icons:

```bash
brew install --cask font-atkynson-mono-nerd-font
```

### VS Code settings

Add to your `settings.json` for the full Opo experience:

```json
{
  "editor.fontFamily": "AtkynsonMono Nerd Font Mono, monospace",
  "editor.fontSize": 15,
  "terminal.integrated.fontFamily": "AtkynsonMono Nerd Font Mono",
  "editor.fontLigatures": false,
  "editor.bracketPairColorization.enabled": false
}
```

### Ghostty

Set your terminal font in `~/.config/ghostty/config`:

```
font-family = AtkynsonMono Nerd Font Mono
```

### Slack

Set **Atkinson Hyperlegible Next** via Preferences > Themes > Font.

## Building from Source

```bash
npm install
npm run build
```

The build script:
1. Derives Dark and HC variants from the Light OKLCH palette
2. Validates contrast and CVD distance for every variant, tint and ANSI color (fails if any check is below target)
3. Generates all 31 theme files in `dist/`

`npm run audit` then checks the generated files themselves: the foreground/background pairs each tool actually uses, tints composited the way the tool draws them, and accessibility-relevant keys that would otherwise fall back to a tool default.

## Design Rationale

See [docs/design-rationale.md](docs/design-rationale.md) for the full research basis behind every design decision — including color space choice, colorblind safety strategy, lightness staircase, warm backgrounds, and font recommendations.

## License

MIT
