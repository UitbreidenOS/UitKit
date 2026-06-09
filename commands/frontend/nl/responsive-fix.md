---
description: Identificeer en herstel responsive layout-breuken voor een bepaald bestand of component
argument-hint: "[file] [breakpoint: sm|md|lg|xl]"
---
Fix responsive layout-problemen in: $ARGUMENTS

Parse args: het eerste token is het doelbestand; optionele breakpoint-naam beperkt het bereik tot alleen die breakpoint. Als geen breakpoint is gegeven, controleer alle standaard breakpoints.

**Step 1 — Identificeer het breakpoint-systeem**
Scan het project voor:
- Tailwind config (`tailwind.config.*`) om aangepaste breakpoints uit te pakken
- CSS-aangepaste eigenschappen of SCSS-variabelen die breakpoints definiëren
- Media query-waarden die worden gebruikt in bestaande stylesheets
Gebruik de breakpoint-namen/waarden van het project zelf overal — verzin of overschrijf ze niet.

**Step 2 — Controleer layout bij elke breakpoint**
Controleer op deze foutpatronen:

Overflow en afsnijding:
- Vaste `width` of `height`-waarden op containers die fluid moeten zijn
- `min-width` groter dan de viewport bij die breakpoint
- `white-space: nowrap` op tekst die op smalle schermen overloopt

Flexbox / Grid:
- `flex-wrap: nowrap` veroorzaakt overflow op kleine schermen
- Grid-kolommen met `fr` eenheden die samen met onleesbare breedtes ineenstorten
- Ontbrekende `min-width: 0` op flex/grid-kinderen die overloopende inhoud bevatten

Spacing:
- Vaste `padding` of `margin`-waarden die onevenredig veel ruimte in beslag nemen op mobiel
- Absoluut gepositioneerde elementen met vaste offsets die hun container ontvluchten bij smalle breedtes

Typografie:
- `font-size`-waarden die niet afschalen — markeer als geen `clamp()` of responsive class wordt gebruikt
- Regellengte (`max-width`) niet aangepast voor kleine schermen

Afbeeldingen en media:
- Ontbrekende `max-width: 100%` op afbeeldingen in fluid containers
- `aspect-ratio` niet ingesteld op media die layoutverschuiving veroorzaakt

**Step 3 — Pas fixes toe**
Voor elk gevonden probleem:
- Bewerk het bestand rechtstreeks
- Gebruik de responsieve hulpklassen van het project (bijv. Tailwind `sm:`, `md:`) of mediaquery's die overeenkomen met het bestaande patroon
- Schrijf werkende code niet om — alleen chirurgische, minimale bewerkingen

**Step 4 — Rapport**
Na het toepassen van fixes, lijst op: `file:line | breakpoint | issue | fix applied`

Als de component visuele verificatie vereist, noteer welke breakpoints handmatig in de browser moeten worden gecontroleerd.
