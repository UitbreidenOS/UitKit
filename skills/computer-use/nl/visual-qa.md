---
name: visual-qa
description: Visuele regressie en lay-out QA via schermafbeeldingen — vergelijk UI-staten, vang CSS-fouten en documenteer visuele verschuivingen.
---

# Visuele QA via Computer Use

## Wanneer activeren

- Gebruiker vraagt om te controleren of een CSS/lay-out-wijziging iets visueel heeft gebroken
- Een UI-component is bewerkt en de gebruiker wil een side-by-side voor-/naveergelijking
- De app heeft geen visuele regressietestsuite (Percy, Chromatic, Playwright-schermafbeeldingen) en een handmatige controle is nodig
- Gebruiker meldt een lay-outbug ("het ziet gebroken uit op mijn scherm") en wil dat je dit reproduceert
- Responsieve breakpoints verifiëren — controleren hoe de UI eruit ziet bij verschillende viewportbreedtes
- Donkere modus, hoog contrast of andere themavarianten visueel controleren
- Gebruiker zegt "ziet dit er goed uit", "controleer de lay-out" of "vergelijk voor en na"

## Wanneer NIET gebruiken

- De gebruiker heeft een Percy/Chromatic/Playwright visuele regressietestsuite — voer die uit
- De lay-out-controle zou vereisen dat je door gevoelige schermen navigeert (betaling, inloggegevens, gezondheidsgegevens)
- Je hebt geen basisschermafbeelding om mee te vergelijken en de gebruiker kan er geen geven
- De controle is puur functioneel (werkt de knop) in plaats van visueel — gebruik in plaats daarvan de ui-testing-skill

## Instructies

### Basislijnen vaststellen

Visuele QA vereist een referentiestatus. Stel basislijnen in voordat wijzigingen worden geïmplementeerd:

1. Maak een volledige schermafbeelding van elke weergave die moet worden gecontroleerd.
2. Geef schermafbeeldingen een consistente naamgeving: `[component]-[state]-[breakpoint]-before.png`
   - Voorbeeld: `nav-menu-open-1280px-before.png`
3. Sla de basislijn op of noteer deze zodat de navaafbeelding ermee kan worden vergeleken.

Als de gebruiker geen "voor"-schermafbeelding kan geven, noteer dit en ga door met een controle van één status (controleer op duidelijke lay-outproblemen zonder regressievergelijking).

### Schermafbeelding-discipline

- Leg altijd de volledige viewport vast, niet een bijgesneden gebied, tenzij de controle beperkt is tot een specifieke component.
- Leg vast op exact dezelfde schuifpositie voor en na.
- Voor responsieve controles wijzigt u de viewport naar het doelbreakpoint voordat u vast gaat:
  - Mobiel: 375px breed
  - Tablet: 768px breed
  - Bureaublad: 1280px breed
  - Breed: 1440px breed
- Schakel animaties/overgangen indien mogelijk uit voordat u vast gaat — een mid-animatie-schermafbeelding is niet nuttig.

### Wat controleren in een visuele audit

Doorloop deze checklist voor elke schermafbeelding:

**Lay-outintegriteit**
- [ ] Geen elementen die uit hun containers overstromen
- [ ] Geen onverwacht afgekapte tekst (controleer koppen, labels, knopcopy)
- [ ] Geen onverwachte horizontale schuifbalk
- [ ] Spacing (opvulling/marge) is consistent met aangrenzende elementen
- [ ] Grid/flexbox-uitlijning is correct — geen verdwaalde items

**Typografie**
- [ ] Lettertypegroottes zijn correct (koppen visueel groter dan lichaam, labels kleiner)
- [ ] Lijnhoogte niet ingestort (tekstregels overlappen niet)
- [ ] Geen onzichtbare tekst (witte tekst op witte achtergrond, enz.)
- [ ] Wijzigingen in lettertypegewicht (vet, normaal) correct weergegeven

**Kleur en contrast**
- [ ] Merkkleur komt overeen met verwachte waarden (controleer tegen designsysteem indien beschikbaar)
- [ ] Interactieve staten (hover, focus, actief) zichtbaar en correct
- [ ] Geen onbedoelde kleuruitlozing van aangrenzende elementen
- [ ] Donkere modus: alle voorgrond-/achtergrondkoppelingen leesbaar

**Componentspecifiek**
- [ ] Modalen en overlays gecentreerd en op de juiste manier achtergrond dimmen
- [ ] Vervolgkeuzelijsten en tooltips niet afgesneden door overflow:hidden containers
- [ ] Afbeeldingen geladen (geen pictogrammen voor verbroken afbeeldingen)
- [ ] Pictogrammen weergegeven op correcte grootte en kleur
- [ ] Formulierinvoeren uitgelijnd met hun labels

### Voor- en naveergelijking

Wanneer beide staten beschikbaar zijn:

1. Plaats voor- en naafbeeldingen naast elkaar of beschrijf verschillen expliciet.
2. Voor elk zichtbaar verschil classificeren:
   - **Beoogde wijziging** — komt overeen met wat de ontwikkelaar heeft gewijzigd (overslaan)
   - **Regressie** — iets dat juist was, is nu gebroken (vlag)
   - **Ongelaboreerde verschuiving** — verschillende scherminhoud (gegevens gewijzigd, negeren)
3. Regressies rapporteren met: componentnaam, wat is gewijzigd, ernst (cosmetisch / functioneel / kritiek).

Ernstsgraad-gids:
- **Cosmetisch**: geringe spacing af met enkele pixels, geen gevolgen voor gebruikers
- **Functioneel**: knop gedeeltelijk verborgen, tekst onleesbaar, interactief element onbereikbaar
- **Kritiek**: paginaindeling volledig gebroken, primaire CTA onzichtbaar of ontoegankelijk

### Veiligheidsregels

- Navigeer niet naar enig scherm dat financiële transacties, inloggegevenswijzigingen of blootstelling van gezondheidsgegevens kan triggeren tijdens een visuele controle.
- Als u een scherm vastlegt dat toevallig gevoelige gegevens toont, noteer dit en voeg de schermafbeelding niet in in een rapport dat extern wordt gedeeld.
- Alleen visuele waarneming met alleen-lezen — klik niet op interactieve elementen tenzij dit expliciet wordt gevraagd als onderdeel van het visuele QA-bereik.

### Rapportageformaat

```
Visual QA Report
Component/View: [name]
Breakpoints checked: [list]
Themes checked: [light / dark / both]

Regressions found: [n]

[1] [Component name] — [Severity]
    Before: [description or screenshot ref]
    After: [description or screenshot ref]
    Issue: [what broke and why it matters]

Cosmetic notes (not blocking):
- [list of minor issues]

Passed checks: [list of what looked correct]
```

## Voorbeeld

**Scenario**: een ontwikkelaar heeft de CSS van de navbar bijgewerkt. De gebruiker wil een visuele QA voordat hij samenvoegt.

**Uitvoering**:

1. Gebruiker biedt een "voor"-schermafbeelding: `navbar-desktop-before.png` — toont nav met logo links, links in het midden, CTA-knop rechts.
2. Navigeer naar de app bij 1280px viewport. Maak schermafbeelding: `navbar-desktop-after.png`.
3. Vergelijken:
   - Logopositie: hetzelfde. SLAGEN.
   - Nav-links: nu naar rechts geduwd en overlappend met de CTA-knop. REGRESSIE.
   - CTA-knop: gedeeltelijk verborgen achter nav-links. Ernst: Functioneel.
4. Formaat wijzigen naar 375px. Maak schermafbeelding: `navbar-mobile-after.png`.
   - Hamburgerpictogram: aanwezig en zichtbaar. SLAGEN.
   - Gesloten status van menu: ziet er correct uit. SLAGEN.

**Rapport**:
```
Visual QA Report
Component/View: Global Navbar
Breakpoints checked: 1280px, 375px
Themes checked: light

Regressions found: 1

[1] Nav links — Functional
    Before: links centered between logo and CTA button
    After: links overflowing into CTA button, button 40% occluded
    Issue: CTA "Get Started" is partially unreachable on desktop — primary conversion action blocked

Cosmetic notes (not blocking):
- None

Passed checks:
- Mobile hamburger icon visible
- Logo position unchanged
- Mobile menu closed state correct
```

Ontwikkelaar moet de flex/grid-eigenschap die nav-link-overloop veroorzaakt, corrigeren voordat hij samenvoegt.
