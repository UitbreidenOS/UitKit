---
description: Herstructureer componentstatus om complexiteit te verminderen, correct op te tillen/samen te voegen en prop drilling te elimineren
argument-hint: "[bestand-of-componentnaam]"
---
Herstructureer statusbeheer in: $ARGUMENTS

Lees het doelbestand (en zijn directe consumenten als identificeerbaar) voordat je wijzigingen voorstelt.

**Stap 1 — Classificeer bestaande status**
Voor elke `useState`, `useReducer`, `useRef`, `useContext`, of winkelkiezer die wordt gevonden, label het als:
- `local` — alleen gebruikt binnen deze component
- `shared` — doorgegeven als props aan 2+ kinderen
- `derived` — kan worden berekend uit andere status of props, hoeft niet te worden opgeslagen
- `server` — gegevens die afkomstig zijn van een API en in een querycache moeten leven, niet in componentstatus
- `url` — status die in de URL hoort (filters, paginering, geselecteerde ID's)

**Stap 2 — Identificeer problemen**
- Prop drilling: props doorgegeven via 2+ tussenliggende componenten die ze niet gebruiken → kandidaat voor context of samenvoeging
- Afgeleide status opgeslagen als `useState` die wordt ingesteld binnen `useEffect` → vervangen met `useMemo` of inline berekening
- Status die wordt gereset bij elke weergave omdat initializer opnieuw wordt gemaakt (object/array letterlijk in useState-oproep) → stabiliseer met `useRef` initializer of moduleniveau constant
- Redundante status die props dupliceert of kan worden berekend uit andere status
- Verouderde sluitingen: `useEffect` ontbreekt deps of gebruikt `deps: []` met verwijzingen naar muteerbare waarden

**Stap 3 — Pas refactorings toe**
Prioriteitsvolgorde:
1. Verwijder eerst afgeleide status — zuivere vereenvoudiging, nul risico
2. Breng status samen die hoger werd opgetild dan nodig — verplaats het terug naar het blad dat het bezit
3. Til status op die werkelijk gedeeld wordt — verplaats naar laagste gemene voorouder, niet willekeurig hoger
4. Vervang prop drilling ketens met een nauwe context (niet een globale winkel) beperkt tot de subtree die het nodig heeft
5. Verplaats servergegevens naar de bestaande querybibliotheek (React Query, SWR, RTK Query — gebruik wat al in het project aanwezig is)
6. Verplaats URL-vormige status naar de router (Next.js `useSearchParams`, React Router `useSearchParams`)

**Stap 4 — Output**
Pas alle wijzigingen rechtstreeks toe op de bestanden. Na bewerkingen, vat samen:
- Statusvariabelen verwijderd: N
- Props verwijderd uit tussenliggende componenten: N
- `useEffect` oproepen verwijderd: N
- Elke architecturale beslissing die teambekendheid nodig heeft (bijv. geïntroduceerde nieuwe context)

Voeg geen statusbeheerbibliotheek toe die niet al in het project aanwezig is.
