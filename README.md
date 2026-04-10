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
- 108 contrast checks enforced at build time (36 per variant)
- CVD-verified under simulated deuteranopia, protanopia, and tritanopia
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

### Syntax (Light)

| Token | Hex | L | Style | Color |
|-------|-----|---|-------|-------|
| Keyword | `#002c85` | 0.33 | bold | Blue |
| Type | `#682b68` | 0.40 | | Purple |
| Comment | `#5e5a55` | 0.47 | italic | Gray |
| Function | `#00756b` | 0.50 | | Teal |
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

## Building from Source

```bash
npm install
npm run build
```

The build script:
1. Derives Dark and HC variants from the Light OKLCH palette
2. Validates all 108 contrast ratios (fails if any pairing is below target)
3. Generates all 31 theme files in `dist/`

## Design Rationale

See [docs/design-rationale.md](docs/design-rationale.md) for the full research basis behind every design decision — including color space choice, colorblind safety strategy, lightness staircase, warm backgrounds, and font recommendations.

## License

MIT
