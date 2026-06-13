---
description: Controleer een component of pagina op WCAG 2.1 AA schendingen en geef een geprioriteerde fixlijst
argument-hint: "[bestand-of-map]"
---
Voer een WCAG 2.1 AA toegankelijkheidsaudit uit op: $ARGUMENTS

Indien geen argument wordt gegeven, controleer het momenteel geopende bestand of de `src/` map.

Audit controlelijst — evalueer elk criterium en markeer schendingen met bestand:regelverwijzingen:

**Waarneembaar**
- 1.1.1 Niet-tekstuele inhoud: elke `<img>`, `<svg>`, `<canvas>` heeft een betekenisvol `alt` of `aria-label`; decoratieve afbeeldingen gebruiken `alt=""`
- 1.3.1 Informatie en relaties: semantische HTML (`<nav>`, `<main>`, `<header>`, `<section>`, `<article>`) correct gebruikt; geen layouttabellen
- 1.3.2 Betekenisvolle volgorde: DOM-volgorde komt overeen met visuele volgorde; geen CSS-alleen herschikking die de schermlezerenstroom verbreekt
- 1.4.1 Gebruik van kleur: informatie wordt niet alleen via kleur overbracht
- 1.4.3 Contrast: tekstcontrast ≥ 4,5:1 (normaal), ≥ 3:1 (groot); controleer berekende kleurwaarden
- 1.4.4 Tekst vergroten: indeling overleeft 200% zoom zonder horizontaal scrollen of inhoudsverlies
- 1.4.10 Herschikken: geen tweedimensionaal scrollen bij 320px viewportbreedte

**Bedienbaar**
- 2.1.1 Toetsenbord: alle interactieve elementen bereikbaar en bedienbaar via alleen toetsenbord
- 2.1.2 Geen toetsenbordval: focus kan altijd elk component verlaten
- 2.4.3 Focusvolgorde: logische tabvolgorde komt overeen met visuele stroom
- 2.4.7 Focus zichtbaar: alle focusbare elementen hebben een zichtbare focusindicator (niet alleen browserstandaard)
- 2.4.6 Koppen en labels: koppen zijn hiërarchisch correct (h1 → h2 → h3); geen overgeslagen niveaus

**Begrijpelijk**
- 3.1.1 Paginalanguage: `<html lang="...">` is correct ingesteld
- 3.2.2 Bij invoer: geen onverwachte contextwijzigingen bij focus of invoer
- 3.3.1 Foutidentificatie: formulierfouten worden in tekst geïdentificeerd en gekoppeld aan het veld via `aria-describedby`
- 3.3.2 Labels of instructies: elk formulierveld heeft een zichtbaar label of `aria-label`

**Robuust**
- 4.1.2 Naam, rol, waarde: aangepaste interactieve componenten geven de juiste ARIA-rol, -status en -eigenschap bloot
- 4.1.3 Statusberichten: dynamische inhoud gebruikt `aria-live` regio's op passende wijze

Uitvoerformaat:
1. Samenvattingsregel: `N schendingen gevonden (X kritiek, Y serieus, Z matig)`
2. Schendingentabel: `| bestand:regel | criterium | ernst | probleem | fix |`
3. Na de tabel, zend de vaste code voor elke schending inline — beschrijf wijzigingen niet alleen, pas ze toe

Ernstigheidsschaal: kritiek (blokkeert schermlezers), serieus (WCAG fout), matig (best-practice lacune).
