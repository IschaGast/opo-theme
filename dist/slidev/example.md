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

Alles in het midden van de slide.

---
layout: statement
---

# statement

Eén uitspraak, groot en gecentreerd.

---
layout: fact
---

# 4 van 4

`fact`: één getal of feit met toelichting.

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

Tekst links, afbeelding rechts. Zet `image:` in de frontmatter. Met `backgroundSize: contain` wordt de afbeelding niet bijgesneden.

---
layout: image-left
image: /voorbeeld.svg
---

# image-left

Afbeelding links, tekst rechts.

---
layout: image
image: /voorbeeld.svg
---

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
