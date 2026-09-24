---
theme: ./
title: Layout-voorbeelden
layout: cover
---

# cover

Titelslide. Gebruik `layout: cover` in de frontmatter van een slide.

---
layout: intro
---

# intro

Introductie van spreker of onderwerp.

Naam · functie · datum

---

# default

Zonder `layout:` krijg je deze. Titel bovenaan, inhoud eronder.

- Een opsomming
- Met **nadruk** en een [link](https://sli.dev)
- En `inline code`

---
layout: section
---

# section

Tussenslide voor een nieuw hoofdstuk.

---
layout: center
---

# center

Verticaal in het midden, links uitgelijnd. De enige layout die niet bovenaan begint.

---
layout: statement
---

# statement

Eén uitspraak, groot.

---
layout: fact
---

# 4 van 4

`fact`: één getal of feit met toelichting.

---

# big-number

Een vraag, en na een klik het antwoord groot in beeld.

<div v-click class="big-number">159</div>

---
layout: quote
---

# "Wat doet déze afbeelding op déze plek?"

`quote`: een citaat met bron.

---
layout: two-cols
---

# two-cols

Linkerkolom. Alles vóór `::right::`.

::right::

## Rechts

Alles na `::right::` komt hier.

---
layout: two-cols-header
---

# two-cols-header

Kop over de volle breedte, daaronder twee kolommen.

::left::

Links: `::left::`

::right::

Rechts: `::right::`

---
layout: image-right
image: /voorbeeld.svg
---

# image-right

Tekst links, afbeelding rechts. Zet `image:` in de frontmatter. Ideale maat: 960 × 1080 px (8:9), dan vult hij de helft precies. 4K: 1920 × 2160.

---
layout: image-left
image: /voorbeeld.svg
---

# image-left

Afbeelding links, tekst rechts.

---

# code-panel

Tekst links, code rechts op de hele halve slide. Werkt ook met `v-click`.

<div class="code-panel absolute top-0 right-0 w-1/2 h-full">

```html
<figure>
  <img src="example.webp" alt="">
</figure>
```

</div>

---

# image-panel

Tekst links, afbeelding rechts op dezelfde achtergrond als `code-panel`. Handig als je bij klikken wisselt tussen afbeelding en code.

<div class="image-panel">
  <img src="/voorbeeld.svg" alt="Voorbeeldafbeelding">
</div>

---

# image-code

Afbeelding boven, code eronder, met wat de schermlezer voorleest.

<div class="image-code">
  <img src="/voorbeeld.svg" alt="Voorbeeldafbeelding">
  <div class="code-panel">

```html
<img alt="customname-15380" …>
```

<p class="sr-output"><strong>VoiceOver:</strong> "customname-15380, afbeelding"</p>

  </div>
</div>

---
layout: image
image: /voorbeeld.svg
---

---
layout: iframe-right
url: /voorbeeld.svg
---

# iframe-right

Tekst links, een webpagina rechts. Zet `url:` in de frontmatter. Werkt alleen als de site insluiten toestaat.

---
layout: iframe-left
url: /voorbeeld.svg
---

# iframe-left

Webpagina links, tekst rechts.

---
layout: iframe
url: /voorbeeld.svg
---

---
layout: none
---

# none

Helemaal geen styling, ook geen padding. Voor als je alles zelf wilt bepalen.

---
layout: full
---

# full

Geen padding: de inhoud gebruikt de hele slide. Handig voor eigen HTML of een grote afbeelding.

---
layout: end
---

# end

Afsluitende slide.

---

# Presenter notes

Tekst in een HTML-comment aan het eind van een slide verschijnt alleen in de presenter-weergave.

<!--
Dit zie je alleen op /presenter.
-->
