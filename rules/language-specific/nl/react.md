# React-regels

## Van toepassing op
Alle React-bestanden (`*.tsx`, `*.jsx`) in elk project.

## Regels

1. **Één component per bestand** — geef het bestand de naam van de component. `UserCard.tsx` exporteert `UserCard`. Barrel-bestanden (`index.ts`) zijn acceptabel voor herexportatie, niet voor het samenpakken van meerdere componenten.

2. **Geef de voorkeur aan functiecomponenten met hooks boven klassecomponenten** — klassecomponenten zijn verouderd. De enige geldige reden om een klassecomponent te gebruiken is een foutgrens op klassbasis.

3. **Houd componenten onder ~150 regels** — als een component meer nodig heeft, extraheer dan subcomponenten of verplaats logica naar aangepaste hooks. Lange componenten schenden het principe van enkele verantwoordelijkheid.

4. **Til de status naar de laagste gemeenschappelijke voorouder — niet hoger** — hef de status niet naar een bovenliggend element op als het gewoon handig is. Globale status (Context, Zustand, enz.) is voor echt globale gegevens: auth, thema, landinstelling.

5. **Aangepaste hooks voor logica, componenten voor rendering** — gegevens ophalen, afgeleide status, ereignisafhandeling horen thuis in `use*` hooks, niet inline in JSX. De componenttekst moet meestal JSX zijn.

6. **Muteer status nooit direct** — retourneer altijd nieuwe objecten/arrays. `setState(prev => ({ ...prev, key: value }))` niet `state.key = value; setState(state)`.

7. **Geef sleutels op lijstitems — gebruik nooit array-index als sleutel voor dynamische lijsten** — indexsleutels verbreken verzoening wanneer items opnieuw worden ingedeeld of worden ingevoegd/verwijderd. Gebruik stabiele, unieke ID's.

8. **Memoïseer correct of helemaal niet** — `useMemo` en `useCallback` voegen overhead toe. Gebruik ze wanneer een berekening echt duur is of een wijziging van referentie-identiteit onnodige herweergave van onderliggende elementen veroorzaakt. Benchmark voordat je het toevoegt.

9. **Plaats status, effecten en hun gebruikersinterface samen** — strooi gerelateerde status niet over de bovenkant van een bestand. Groepeer `useState`/`useEffect`-paren in de buurt van de JSX waarop ze van invloed zijn, of extraheer naar een hook.

10. **Vermijd `useEffect` voor afgeleide status** — als een waarde synchroon kan worden berekend op basis van bestaande status/props, bereken deze dan inline. `useEffect` voor afgeleide status introduceert een rendercyclus en een venster met verouderde lezen.

11. **Typ alle props met TypeScript-interfaces, niet `any`** — `React.FC<Props>` is optioneel; het typen van de parameter direct (`({ name }: Props) => ...`) is even geldig en vermijdt `FC`'s impliciete `children` voetangel.

12. **Behandel laad-, fout- en lege toestanden expliciet** — elke asynchrone gebruikersinterface heeft drie niet-gelukkige paden. Render ze opzettelijk, niet via doorvoer.

13. **Houd `useEffect` afhankelijkheidarray's nauwkeurig** — `eslint-plugin-react-hooks` handhaaft dit. Onderdruk de waarschuwing voor uitputtende-deps nooit zonder een opmerking uit te leggen waarom.

14. **Vermijd propositie-boren verder dan twee niveaus** — geef door via Context of een state manager. Drie niveaus van propositie-threading is een teken van een ontbrekende abstractie.

15. **Test gedrag, niet implementatie** — gebruik React Testing Library. Voer uit op wat de gebruiker ziet en waarmee hij kan communiceren, niet op interne status of boomstructuur van componenten.


---
