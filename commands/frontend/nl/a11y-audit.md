---
description: Audit een component of pagina op WCAG 2.1 AA schendingen en emit een geprioriteerde fixlijst
argument-hint: "[file-or-directory]"
---
Voer een WCAG 2.1 AA toegankelijkheidsaudit uit op: $ARGUMENTS

Als geen argument wordt gegeven, audit het momenteel geopende bestand of de `src/` directory.

Audit checklist — evalueer elk criterium en markeer schendingen met file:line verwijzingen:

**Waarneembaar**
- 1.1.1 Niet-tekstinhoud: elke `<img>`, `<svg>`, `<canvas>` heeft betekenisvol `alt` of `aria-label`; decoratieve afbeeldingen gebruiken `alt=""`
- 1.3.1 Info en relaties: semantische HTML (`<nav>`, `<main>`, `<header>`, `<section>`, `<article>`) correct gebruikt; geen layouttabellen
- 1.3.2 Betekenisvolle volgorde: DOM-volgorde komt overeen met visuele volgorde; geen CSS-only hervolgording die schermlezer flow breekt
- 1.4.1 Gebruik van kleur: informatie wordt niet alleen door kleur overgebracht
- 1.4.3 Contrast: tekstcontrast ≥ 4.5:1 (normaal), ≥ 3:1 (groot); controleer berekende kleurwaarden
- 1.4.4 Tekst vergroten: lay-out overleeft 200% zoom zonder horizontaal scrollen of content verlies
- 1.4.10 Reflow: geen tweedimensionaal scrollen bij 320px viewportbreedte

**Bedienbaar**
- 2.1.1 Toetsenbord: alle interactieve elementen bereikbaar en bedienbaar via toetsenbord alleen
- 2.1.2 Geen toetsenbord val: focus kan altijd elk component verlaten
- 2.4.3 Focusvolgorde: logische tab volgorde komt overeen met visuele flow
- 2.4.7 Focus zichtbaar: alle focusbare elementen hebben een zichtbare focusindicator (niet alleen browserstandaard)
- 2.4.6 Koppen en labels: koppen zijn hiërarchisch correct (h1 → h2 → h3); geen overgeslagen niveaus

**Begrijpelijk**
- 3.1.1 Pagina taal: `<html lang="...">` is correct ingesteld
- 3.2.2 Bij invoer: geen onverwachte contextveranderingen bij focus of invoer
- 3.3.1 Foutidentificatie: formulierfouten worden in tekst geïdentificeerd en gekoppeld aan het veld via `aria-describedby`
- 3.3.2 Labels of instructies: elk formulierveld heeft een zichtbaar label of `aria-label`

**Robuust**
- 4.1.2 Naam, rol, waarde: aangepaste interactieve componenten stellen correct ARIA-rol, -status en -eigenschap bloot
- 4.1.3 Statusberichten: dynamische inhoud gebruikt `aria-live` regio's op passende wijze

Uitvoerformaat:
1. Samenvattingregel: `N schendingen gevonden (X kritiek, Y ernstig, Z gematigd)`
2. Schendingentabel: `| file:line | criterium | ernst | probleem | fix |`
3. Na de tabel, emit de vastgestelde code voor elke schending inline — niet alleen veranderingen beschrijven, deze toepassen

Ernstnischaal: kritiek (blokkeert gebruikers van schermlezer), ernstig (WCAG-fout), gematigd (best-practice gat).
