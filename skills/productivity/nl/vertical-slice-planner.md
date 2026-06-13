# Vertical Slice Planner

## Wanneer activeren

- Een nieuwe functie of project plannen voordat de bouw begint
- Gebruiker wil een functie in werkeenheden opsplitsen voordat code wordt geschreven
- Claude werd standaard op sequentieel plan "database → API → frontend" en u wilt dwarsdoorsneden in plaats daarvan
- U moet werk ordenen op risico of waarde in plaats van op technische laag
- Functie scope is onduidelijk en heeft decompositie nodig in onafhankelijk uitvoerbare incrementen

## Wanneer niet gebruiken

- Eenvoudige single-endpoint-taken of kleine bugfixes beperkt tot één laag
- Taken die al een enkele verticale eenheid zijn (bijv. "voeg een nieuw veld toe aan dit formulier")
- Zeer kleine taken onder een half dag geschatte werk — samenvoegen, niet splitsen
- Wanneer het team zich al aan een specifiek gestaffelde afleveringscontract heeft verbonden en werk niet opnieuw kan ordenen

## Instructies

**Het probleem met opeenvolgende fasen:**

AI-modellen standaard op: Fase 1 = databaseschema, Fase 2 = API-eindpunten, Fase 3 = frontend. Dit vertraagt end-to-end integratief terugkoppeling tot de laatste fase, waar architecturale problemen te laat oppervlakken om goedkoop op te lossen. U ziet geen werkend pad door het systeem tot fase 3 klaar is.

**Verticale snij-aanpak:**

Elke snede is een dunne snede over alle lagen — database + API + frontend + acceptatievoorwaarden — die een werkende, testbare end-to-end mogelijkheid levert. Elke snede wordt onafhankelijk verzonden. Een snede is gereed wanneer een gebruiker ermee kan interageren, niet wanneer een laag gereed is.

---

**Stap 1 — Identificeer hoofdgebruikersacties (niet technische componenten)**

Vraag: "Wat kan de gebruiker eigenlijk *doen*?" — niet "Welke tabellen hebben we nodig?"

Slechte decompositie: `gebruikerstabel → /users eindpunt → UserList component`
Goede decompositie: `gebruiker kan zoeken op naam → gebruiker kan filteren op status → gebruiker kan resultaten exporteren`

Vermeld elke afzonderlijke gebruikersactie. Dit worden uw snede-kandidaten.

---

**Stap 2 — Rangschik sneden op waarde en risico**

Rangschik sneden:
- Hoogste bedrijfswaarde eerst — wat ontgrendelt het meeste stroomafwaarts werk of gebruikerstest?
- Hoogste integratierisico eerst — wat heeft het meeste onbekenden over lagen heen?
- Tracer kogel eerst in uitvoering — het dunst mogelijke pad dat architectuur valideert voordat inhoud wordt gebouwd

---

**Stap 3 — Definieer elke snede**

Gebruik deze sjabloon voor elke snede:

```
Slice: [Naam]
User action: [Wat de gebruiker doet — geschreven als gebruikersactie, geen technische taak]
Layers:
  Database: [schemawijziging, migratie of betrokken query]
  API:      [eindpunt(en) — methode, pad, request/response vorm]
  Frontend: [betreffende component(en)]
  Integration: [externe servicecalls, wachtrijen of event emissies]
Acceptance criteria:
  - [Specifieke, testbare voorwaarde — waarneembaar gedrag, geen implementatiedetail]
  - [Aanvullende voorwaarde]
Definition of done: [Hoe verifiëren dat deze snede volledig voltooid is en klaar om samen te voegen]
Estimate: [dagen]
```

---

**Stap 4 — Groottesnede**

Doel 1–3 dagen werk per snede. Als een snede langer duurt, split het. Signalen een snede is te groot:
- Meer dan twee API-eindpunten gemaakt in één snede
- Schemamigratatie en bedrijfslogica in dezelfde snede
- Frontend en een nieuwe achtergrondtaak in dezelfde snede

Sneden korter dan een half uur zijn te granulair — voeg ze samen met een aangrenzende snede.

---

**Stap 5 — Begin met een tracer kogel**

De eerste snede om uit te voeren is het dunst mogelijke pad over alle lagen heen — zelfs als het lege resultaten of stub-gegevens retourneert. Dit valideert:
- De database kan vanuit de API worden bevraagd
- De API-respons bereikt het frontend
- Het frontend kan de vorm van een echte reactie weergeven

Als de tracer kogel breekt, hebt u uw moeilijkste probleem op dag één gevonden — wanneer het goedkoopst op te lossen is.

Inhoud bouwen (echte query's, echte UI, echte validatie) in volgende snedes op een bewezen basis.

---

**Uitvoerformaat:**

```
VERTICAL SLICE PLAN — [Functienaam]

User actions identified: [lijst]
Slice order rationale: [één zin waarom deze volgorde]

Slice 1 (Tracer): [naam] — [eénregelbeschrijving]
Slice 2: [naam] — [eénregelbeschrijving]
...

[Volledige snedefinitie voor elke snede met behulp van bovenstaande sjabloon]
```

## Voorbeeld

**Invoer:** "Plan de zoekfunctie voor onze productcatalogus. Verdeel het in verticale sneden geordend op risico."

**Verwachte uitvoer:**

```
VERTICAL SLICE PLAN — Product Catalog Search

User actions identified: zoeken op trefwoord, filteren op categorie/prijs, resultaten sorteren, resultaten pagineren
Slice order rationale: tracer kogel eerst om zoekinfrastructuur te valideren, kernzoekopdracht volgende, filters laatst (hoogste implementatiecomplexiteit)

Slice 1 (Tracer): Basis zoekeindpunt retourneert lege resultaten
Slice 2: Trefwoord zoekt retourneert overeenkomende producten
Slice 3: Filteren op categorie en prijsreeks
Slice 4: Paginering

---

Slice 1 (Tracer): Basis zoekeindpunt retourneert lege resultaten
User action: Gebruiker dient zoekopdracht in en ontvangt een antwoord (leeg is acceptabel)
Layers:
  Database: Producttabel toevoegen met naam, beschrijving, prijs, categoriekolommen; zaad 10 records
  API:      GET /search?q= → retourneert { results: [], total: 0 }
  Frontend: Zoekvak + resultatenlij geeft een leeg statusbericht weer
  Integration: geen
Acceptance criteria:
  - Het indienen van elke query retourneert HTTP 200 met de juiste antwoordvorm
  - Frontend geeft weer zonder fouten wanneer resultatarray leeg is
Definition of done: End-to-end aanvraag van zoekvak naar database en terug voltooid zonder fouten
Estimate: 0.5 dagen

Slice 2: Trefwoord zoekt retourneert overeenkomende producten
User action: Gebruiker zoekt op trefwoord en ziet overeenkomende producten
Layers:
  Database: Volledige tekstindex op naam- en beschrijvingskolommen
  API:      GET /search?q= → retourneert { results: [{ id, name, price, category }], total: N }
  Frontend: Resultatenlij geeft productkaarten weer met naam en prijs
  Integration: geen
Acceptance criteria:
  - Zoeken naar "laptop" retourneert producten met "laptop" in naam of beschrijving
  - Resultaten worden op relevantie gerangschikt (naamovereenkomst boven beschrijvingsovereenkomst gerangschikt)
  - Lege query retourneert alle producten tot paginagrootte
Definition of done: Zoeken retourneert nauwkeurige resultaten voor 10 testquery's; resultaatkaarten geven correct weer
Estimate: 2 dagen

Slice 3: Filteren op categorie en prijsreeks
User action: Gebruiker verfijnt resultaten met behulp van categoriedropdown en prijsbereik-invoeren
Layers:
  Database: Query bijgewerkt om categorie- en prijs_min/prijs_max parameters te accepteren
  API:      GET /search?q=&category=&price_min=&price_max=
  Frontend: Filterpaneel met categoriedropdown en prijsbereik-invoeren; resultaten bijgewerkt bij toepassen
  Integration: geen
Acceptance criteria:
  - Het toepassen van een categoriefilter retourneert alleen producten in die categorie
  - Prijsbereikhilter retourneert alleen producten binnen bereik
  - Filters combineren correct met trefwoordzoeking
Definition of done: Alle filtercombinaties getest; filterstatus blijft behouden bij paginavernieuwing
Estimate: 1.5 dagen

Slice 4: Paginering
User action: Gebruiker navigeert door meerdere pagina's met resultaten
Layers:
  Database: LIMIT/OFFSET toegepast op query
  API:      GET /search?q=&page=&page_size= → voegt { page, total_pages } aan reactie toe
  Frontend: Pagineringsbesturingselementen weergegeven; paginastatus werkt URL bij
  Integration: geen
Acceptance criteria:
  - Pagina 2 retourneert de juiste offset van resultaten
  - Totale pagina's weerspiegelen daadwerkelijk aantal resultaten
  - Navigatie naar een gepagineerde URL direct retourneert de juiste pagina
Definition of done: Paginering werkt op alle filter- en zoeken combinaties
Estimate: 1 dag
```

---
