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
- 5 syntax token colors: keywords, strings, comments, types, functions

### Palette (Light)

| Role | Hex | Contrast vs white |
|------|-----|-------------------|
| Text | `#24292f` | 14.65:1 |
| Text mid | `#57606a` | 6.39:1 |
| Text faint | `#646c75` | 5.32:1 |
| Accent | `#0867d7` | 5.34:1 |
| Pass/success | `#0550ae` | 7.59:1 |
| Fail/error | `#ab5200` | 5.33:1 |

### Syntax (Light)

| Token | Hex | Color |
|-------|-----|-------|
| Keyword | `#0550ae` | Blue |
| String | `#ab5200` | Orange |
| Comment | `#65696f` | Gray (italic) |
| Type | `#81427f` | Purple |
| Function | `#006964` | Teal |

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
2. Validates all contrast ratios (fails if any pairing is below target)
3. Generates all 28 theme files in `dist/`

## Scientific Basis

- **Okabe & Ito (2008)** — Color Universal Design, University of Tokyo
- **Wong, B. (2011)** — "Color blindness," Nature Methods 8(6)
- **Bjorn Ottosson (2020)** — OKLCH color space
- **Stripe** — Designing Accessible Color Systems (CIELAB)
- **Ethan Schoonover** — Solarized (CIELAB-based theme)

## License

MIT
