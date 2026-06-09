---
description: Controleer code tegen Lighthouse-doelen voor prestaties, toegankelijkheid en best practices, en pas fixes toe
argument-hint: "[file-or-route] [target-score: 90|95|100]"
---
Optimaliseer $ARGUMENTS om Lighthouse-audits op de opgegeven doelscore (standaard: 90) te doorstaan.

Dit command voert een statische code-analyse uit — het start geen browser. Pas fixes toe die bekende Lighthouse-foutpatronen aanpakken.

**Prestaties — Core Web Vitals**

LCP (Largest Contentful Paint):
- Voeg `fetchpriority="high"` toe aan de hero-afbeelding boven de vouw of het grootste tekstblok
- Verwijder `loading="lazy"` van afbeeldingen die waarschijnlijk boven de vouw liggen
- Zorg dat kritieke CSS inline is geplaatst of synchroon wordt geladen; controleer op render-blocking `<link rel="stylesheet">` in `<head>`
- Vervang `<img src="...">` door `<Image>` (Next.js) of voeg expliciete `width`/`height` toe om lay-outschuiving te voorkomen

CLS (Cumulative Layout Shift):
- Elke `<img>`, `<video>` en `<iframe>` moet expliciete `width`- en `height>`-attributen of een `aspect-ratio` CSS-eigenschap hebben
- Lettypeloading: voeg `font-display: swap` toe aan alle `@font-face`-declaraties
- Vermijd het invoegen van inhoud boven bestaande inhoud na paginalading (advertenties, banners, cookie-kennisgevingen)

INP / TBT (Interaction to Next Paint / Total Blocking Time):
- Verplaats dure berekeningen van de hoofdthread of verpak in `startTransition`
- Splits grote componenten met `React.lazy` + `Suspense` als ze onder de vouw liggen
- Debounce of throttle event handlers op scroll, resize en input

**Best Practices**
- Alle `<a>`-doelen met `target="_blank"` moeten `rel="noopener noreferrer"` hebben
- Geen `console.log` / `console.error` oproepen in productiecodepaden
- Geen verouderde HTML-attributen (`border`, `align`, `bgcolor` op elementen)
- `<meta name="viewport">` moet aanwezig zijn en mag gebruikersscaling niet uitschakelen

**SEO**
- Elke pagina/route moet een unieke `<title>` en `<meta name="description">` hebben
- Koppelingshiërarchie moet beginnen met `<h1>` zonder overgeslagen niveaus
- Links moeten beschrijvende tekst hebben — vlag "click here" en "read more" ankers

**Toegankelijkheid (Lighthouse-subset)**
- Knop- en koppelingsteksten: elk interactief element moet een toegankelijke naam hebben
- Afbeeldingsalttekst: alle niet-decoratieve afbeeldingen hebben beschrijvende `alt` nodig
- Formurierlabels: elke invoer heeft een bijbehorend `<label>` of `aria-label`

**Uitvoer**
Voor elk gevonden probleem: `file:line | audit category | issue | fix applied`
Pas alle fixes rechtstreeks toe. Als een fix een runtimewijziging vereist (bijvoorbeeld werkelijke bundlesplitsing), noteer dit als een handmatige actie met de exacte benodigde wijziging.
