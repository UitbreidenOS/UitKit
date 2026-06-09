---
description: Refactor componentstate om complexiteit te verminderen, juist op te tillen/samen te voegen en prop drilling te elimineren
argument-hint: "[file-or-component-name]"
---
Refactor state management in: $ARGUMENTS

Lees het doelbestand (en de directe consumenten ervan, indien identificeerbaar) voordat je wijzigingen voorstelt.

**Stap 1 — Classificeer bestaande state**
Voor elke `useState`, `useReducer`, `useRef`, `useContext` of store selector die je vindt, label je deze als:
- `local` — alleen gebruikt in deze component
- `shared` — doorgegeven als props aan 2+ kindercomponenten
- `derived` — kan worden berekend uit andere state of props, hoeft niet opgeslagen te worden
- `server` — gegevens die van een API komen en in een query cache moeten leven, niet in componentstate
- `url` — state die in de URL hoort (filters, paginering, geselecteerde ID's)

**Stap 2 — Identificeer problemen**
- Prop drilling: props doorgegeven via 2+ intermediate componenten die deze niet gebruiken → kandidaat voor context of colocatie
- Derived state opgeslagen als `useState` die in `useEffect` wordt ingesteld → vervangen met `useMemo` of inline berekening
- State die wordt opnieuw ingesteld bij elke render omdat initializer wordt gerecreëerd (object/array literal in useState call) → stabiliseer met `useRef` initializer of module-level constante
- Redundante state die props dupliceert of kan worden berekend uit andere state
- Stale closures: `useEffect` mist deps of gebruikt `deps: []` met verwijzingen naar mutable values

**Stap 3 — Pas refactors toe**
Prioriteitsvolgorde:
1. Verwijder eerst derived state — pure simplificatie, nul risico
2. Colocate state die hoger was opgetild dan nodig — verplaats terug naar het leaf-component dat het bezit
3. Til state op die werkelijk gedeeld is — verplaats naar laagste gemeenschappelijke voorouder, niet willekeurig hoger
4. Vervang prop drilling chains met een narrow context (niet een global store) scoped naar de subtree die het nodig heeft
5. Verplaats servergegevens naar de bestaande query library (React Query, SWR, RTK Query — gebruik wat al in het project staat)
6. Verplaats URL-vormige state naar de router (Next.js `useSearchParams`, React Router `useSearchParams`)

**Stap 4 — Output**
Pas alle wijzigingen direct toe op de bestanden. Na edits, vat samen:
- State vars verwijderd: N
- Props geëlimineerd uit intermediate componenten: N
- `useEffect` calls verwijderd: N
- Elke architecturale beslissing waar het team zich van bewust moet zijn (bijv. nieuwe context geïntroduceerd)

Voeg geen state management library toe die niet al in het project staat.
