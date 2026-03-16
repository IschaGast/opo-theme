# Design Rationale

The research and reasoning behind every design decision in Opo.

## Backgrounds: Warm Creme, Not Pure White

Opo uses warm off-white backgrounds (OKLCH hue 85°, L=0.94-0.98) instead of pure white (#ffffff).

**Why:**

- **CMU reading study** — warm-tinted backgrounds improve reading speed and reduce eye strain compared to pure white ([Buchner & Baumgartner, 2007](https://doi.org/10.1080/00140130701306413))
- **British Dyslexia Association** — recommends "dark text on a light (not white) background" for dyslexia-friendly design ([BDA Style Guide](https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide))
- **Established precedent** — Solarized, Kindle, and Apple Books all use warm off-white in the L=96-98% range

The specific hue (85° — warm yellow-cream) was chosen to feel natural and paper-like without introducing noticeable color cast.

## Color Space: OKLCH

All colors are defined in [OKLCH](https://oklch.com/) (Oklab Lightness-Chroma-Hue), not hex or HSL.

**Why:**

- **Perceptual uniformity** — equal steps in L produce equal perceived brightness changes, unlike HSL where L=50% yellow looks much brighter than L=50% blue ([Bjorn Ottosson, 2020](https://bottosson.github.io/posts/oklab/))
- **Predictable contrast** — lightness values directly correspond to perceived brightness, making WCAG contrast ratios predictable during design
- **Clean variant derivation** — dark and high-contrast variants can be derived by remapping lightness values, preserving the perceptual relationships between colors

## Colorblind Safety: Blue/Orange, Not Red/Green

Opo uses blue and orange as its primary semantic pair (pass/fail, success/error) instead of the traditional red and green.

**Why:**

- **Okabe & Ito (2008)** — the [Color Universal Design](https://jfly.uni-koeln.de/color/) guidelines identify blue and orange as the most universally distinguishable color pair across all types of color vision deficiency (CVD)
- **Wong, B. (2011)** — ["Color blindness"](https://doi.org/10.1038/nmeth.1618) in Nature Methods 8(6) confirms blue-orange as the safest semantic pair
- **8% of men** have some form of CVD, predominantly affecting red-green discrimination — the exact pair most themes rely on

### ANSI Terminal Color Remapping

Traditional ANSI terminal colors (red, green, yellow, magenta) are remapped to colorblind-safe equivalents:

| ANSI Slot | Traditional | Opo        | Rationale                           |
|-----------|-------------|------------|-------------------------------------|
| 1 (red)   | Red         | Orange     | Universally distinct from blue      |
| 2 (green) | Green       | Teal       | Distinguishable from orange for all CVD types |
| 3 (yellow)| Yellow      | Amber      | Distinct from both orange and blue  |
| 5 (magenta)| Magenta    | Purple     | From Okabe-Ito palette              |
| 6 (cyan)  | Cyan        | Blue-teal  | Distinct from teal and blue         |

## Syntax Highlighting: Lightness Staircase

Opo's 5 syntax token colors are placed at unique OKLCH lightness levels:

| Token    | L     | Hex       | Color  |
|----------|-------|-----------|--------|
| Keyword  | 0.36  | `#00358e` | Blue   |
| Type     | 0.41  | `#6b2e6b` | Purple |
| Comment  | 0.45  | `#58554f` | Gray   |
| Function | 0.50  | `#00756b` | Teal   |
| String   | 0.52  | `#a44d00` | Orange |

**Why:**

- **CVD users can distinguish tokens by brightness alone** — even if two colors look identical due to a color vision deficiency, they remain distinguishable because they have different lightness
- **All 10 syntax pairs verified** under simulated deuteranopia, protanopia, and tritanopia using [culori](https://culorijs.org/) CVD simulation
- **Hue selection** uses maximally spread axes from the Okabe-Ito palette to maximize chromatic distance even for partial CVD

### Comment: Italic as Non-Color Differentiator

Comments use italic styling in addition to their color (warm gray).

**Why:** WCAG 1.4.1 (Use of Color) states that color must not be the only visual means of conveying information. Italic provides a second, non-chromatic signal that text is a comment — useful for CVD users and in low-contrast viewing conditions.

## Contrast Validation

Every foreground/background pairing is validated at build time:

| Variant        | Target        | Standard   |
|----------------|---------------|------------|
| Light          | 4.5:1         | WCAG AA    |
| Dark           | 4.5:1         | WCAG AA    |
| High Contrast  | 7.0:1         | WCAG AAA   |

The build fails if any pairing is below its target. This is enforced for:
- 7 UI text colors against 3 background levels (21 pairings)
- 5 syntax colors against 3 background levels (15 pairings)
- **Total: 36 contrast checks per variant, 108 total**

## Dark Variant: Lightness Remapping

The dark variant is derived from the light palette by remapping OKLCH lightness, not by picking new colors.

**Why:**

- **Consistency** — the same hues and relative chroma ensure both variants feel like the same theme
- **CVD safety preserved** — the lightness staircase is maintained in the dark range (L=0.65-0.80), preserving brightness-based token discrimination
- **Non-linear curve** — backgrounds map to L=0.18-0.24 (dark but not true black, reducing halation and eye strain on OLED screens)

## High Contrast Variant: WCAG AAA

The high-contrast variant pushes all lightness deltas by 25% and chroma by 15%.

**Why:**

- **WCAG AAA (7:1)** is the enhanced contrast standard, required by some accessibility policies and preferred by users with low vision
- The same derivation approach (lightness remapping + chroma boost) preserves color relationships while increasing readability

## Recommended Fonts

Opo defines colors only — font choice is left to the application. These fonts pair well with the theme's accessibility goals:

### Code (Monospace)

- **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** — increased x-height and letter spacing for readability, programming ligatures, open source
- **[Monaspace](https://monaspace.githubnext.com/)** — texture healing for more even typographic color, multiple widths
- **[Fira Code](https://github.com/tonsky/FiraCode)** — wide language support, programming ligatures

### UI and Reading (Proportional)

- **[Atkinson Hyperlegible Next](https://www.brailleinstitute.org/freefont/)** — designed by the Braille Institute specifically for maximum character legibility, with exaggerated letter differentiation (e.g., distinct I/l/1, O/0) for low vision and dyslexia

## References

- Okabe, M. & Ito, K. (2008). [Color Universal Design (CUD)](https://jfly.uni-koeln.de/color/). University of Tokyo.
- Wong, B. (2011). [Color blindness](https://doi.org/10.1038/nmeth.1618). Nature Methods 8(6), 441.
- Ottosson, B. (2020). [A perceptual color space for image processing](https://bottosson.github.io/posts/oklab/). OKLCH/Oklab.
- Buchner, A. & Baumgartner, N. (2007). [Text-background polarity affects performance irrespective of ambient illumination and color contrast](https://doi.org/10.1080/00140130701306413). Ergonomics, 50(7).
- Stripe. [Designing Accessible Color Systems](https://stripe.com/blog/accessible-color-systems). (CIELAB approach to accessible palette design.)
- Schoonover, E. [Solarized](https://ethanschoonover.com/solarized/). (CIELAB-based theme with warm backgrounds.)
- British Dyslexia Association. [Dyslexia Friendly Style Guide](https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide).
- W3C. [WCAG 2.1 — 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html).
- W3C. [WCAG 2.1 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html).
