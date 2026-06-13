---
description: Dode CSS verwijderen, duplicaten consolideren, design tokens afdwingen, en specificiteitsproblemen oplossen
argument-hint: "[bestand-of-directory]"
---
CSS/styles opschonen in: $ARGUMENTS

Indien geen argument is gegeven, scan alle `.css`, `.scss`, `.module.css` en Tailwind class strings in `src/`.

**Stap 1 — Dode code verwijdering**
Identificeer en verwijder:
- CSS regels waarvan de selectors geen element in de JSX/HTML van deze codebase matchen (statische analyse — markeer dynamische klassenamen als onzeker, verwijder ze niet)
- `@keyframes` declaraties die niet door enige `animation` of `animation-name` eigenschap worden gerefereerd
- CSS aangepaste eigenschappen (variabelen) gedeclareerd in `:root` of een component scope maar nooit gelezen via `var(--name)`
- Uitgecommentarieerde regelblokken die ouder zijn dan de omringende code (gebruik git blame heuristiek indien beschikbaar)

**Stap 2 — Duplicaat consolidatie**
- Identieke of bijna identieke regelsets toegepast op verschillende selectors → extraheer een gedeelde utility class of CSS aangepaste eigenschap
- Herhaalde `margin`, `padding` of `gap` waarden die overeenkomen met een bestaande design token → vervang met de token
- Media query blokken met dezelfde breekpunt verspreid over het bestand → merge in een enkel blok

**Stap 3 — Design token afdwinging**
Scan het project voor een token bron: CSS aangepaste eigenschappen in `:root`, een Tailwind config `theme.extend`, een `tokens.ts` / `theme.ts` bestand, of een design system import.
Voor elke hardcoded waarde gevonden:
- Kleuren (hex, rgb, hsl): vervang met de dichtst bijzijnde overeenkomende token indien er een bestaat binnen 5% perceptuele afstand; markeer indien geen match
- Afstanden (px, rem waarden): vervang met de overeenkomende afstandsschaal token
- Tekengroottes: vervang met de overeenkomende typografische schaal token
- Vervang geen waarden die geen redelijk token equivalent hebben — markeer ze in plaats daarvan in de uitvoer

**Stap 4 — Specificiteit en cascade problemen**
- Selectors met specificiteit hoger dan `(0, 2, 0)` (twee klassen) → vereenvoudig of herstructureer
- `!important` declaraties: verwijder elk en verifieer dat de cascade zonder het werkt; als verwijdering gedrag verandert, noteer dit maar laat de `!important` op zijn plaats met een commentaar dat uitlegt waarom
- Diep geneste SCSS (meer dan 3 niveaus) → flatten naar BEM of utility classes overeenkomstig de projectconventie
- Universele selector `*` met niet-reset eigenschappen → markeer voor beoordeling

**Stap 5 — Uitvoer**
Pas alle veilige wijzigingen toe (dode code, duplicaten, token vervangingen) rechtstreeks.
Voor destructieve of onzekere wijzigingen (selector verwijdering die dynamische klassen kan beïnvloeden, `!important` verwijdering), emit een lijst:
`bestand:lijn | probleem | aanbevolen actie | reden niet auto-toegepast`

Rapporteer totalen: verwijderde lijnen, geconsolideerde regels, tokens vervangen.
