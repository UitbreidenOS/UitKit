---
name: pm-sprint-review
description: "Sprintreview: velocity, geleverd vs. gepland, blokkades, leerlingen, prioriteiten voor de volgende sprint"
---

# Vaardigheid: PM Sprintreview

## Wanneer te activeren
- Einde-van-sprint review en retrospectief uitvoeren
- De sprintreview-presentatie of asynchroon verslag voorbereiden voor stakeholders
- Velocity berekenen en geleverde versus geplande scope vergelijken
- Blokkades en hoofdoorzaken extraheren uit een sprint die verkeerd liep
- Prioriteiten stellen voor de volgende sprint op basis van wat je hebt geleerd
- De sprintsamenvatting schrijven voor de directie of investeerdersupdates

## Wanneer NIET te gebruiken
- Backlog grooming — gebruik `/user-story-writer` voor het aanmaken van stories
- Kwartaalroadmapplanning — gebruik `/product-roadmap`
- Gebruikersonderzoek na lancering — gebruik `/product-analytics` of `/ux-researcher`
- Bug-triage — dit is een ritme-tool, geen foutopsporingsraamwerk

## Instructies

### Kernprompt voor sprintreview

```
Voer een sprintreview uit voor [TEAMNAAM] — Sprint [N], [DATUMS].

Sprintdoel: [wat was het gestelde doel voor deze sprint]
Sprintduur: [1 / 2 weken]
Team: [N engineers, N designers, N QA]
Velocitycontext: gemiddelde velocity afgelopen 3 sprints: [N story points]

Sprintdata (plak je ticketlijst of samenvatting):
Geplande tickets: [lijst met story points en status: klaar / gedeeltelijk / niet gestart / geblokkeerd]
Ongepland werk toegevoegd midden in de sprint: [lijst]
Totaal geplande punten: [X] | Totaal geleverd: [X] | Velocity deze sprint: [X]

Lever op:

## 1. Resultaat sprintdoel
Hebben we het sprintdoel bereikt? [Ja / Gedeeltelijk / Nee]
Éénzin-uitspraak: wat is er in gewone taal bereikt.

## 2. Geleverd vs. gepland (tabel)
| Feature / Story | Punten | Status | Opmerkingen |
|---|---|---|---|
| [ticket] | [X] | Klaar / Gedeeltelijk / Doorgeschoven | [eventuele opmerking] |

## 3. Wat doorschoof en waarom
Per onafgerond item: waarom? (onderschat / geblokkeerd / scope creep / midden-sprint geherprioriseerd)
Hoofdoorzaakpatroon: is er één thema? (bijv. "3 van 4 doorschuivingen waren geblokkeerd door externe API-wijzigingen")

## 4. Analyse van ongepland werk
Hoeveel ongepland werk werd toegevoegd? Was het gerechtvaardigd?
Regel: ongepland werk > 20% van de sprintcapaciteit duidt op een plannings- of communicatieprobleem.

## 5. Velocitytrend
3-sprint velocitytrend: [Sprint N-2: X] [Sprint N-1: X] [Sprint N: X]
Verbetert, is stabiel of daalt de velocity? Wat drijft dit?

## 6. Retrospectieve hoogtepunten
Wat ging goed (top 2): specifiek, niet generiek
Wat niet (top 2 met hoofdoorzaak): eerlijk, met eigenaar
Één actie voor de volgende sprint: één concrete proceswijziging

## 7. Prioriteiten volgende sprint
Op basis van wat doorschoof en wat nog in de wachtrij staat — aanbevolen top 5 items voor de volgende sprint.
```

### Velocityanalyse

```
Analyseer de velocity voor [TEAM] over de afgelopen [N] sprints.

Sprintdata:
Sprint 1: gepland [X] punten, geleverd [X] punten, sprintdoel: [behaald/gemist]
Sprint 2: gepland [X] punten, geleverd [X] punten, sprintdoel: [behaald/gemist]
Sprint 3: gepland [X] punten, geleverd [X] punten, sprintdoel: [behaald/gemist]
[...]

Diagnosticeer:
1. Gemiddelde velocity: [X punten]
2. Voorspelbaarheid: wat is de standaarddeviatie? Hoge deviatie = planningsprobleem
3. Patroon: committed het team zich consistent te veel? Leveren ze ondermaats op specifieke typen werk?
4. Haalscore sprintdoel: [X / N sprints] — als onder 70%, moet het planningsproces worden gerepareerd
5. Aanbevolen capaciteit voor de volgende sprint op basis van het gemiddelde van de laatste 3 sprints (niet het optimistische beste)

Regel: gebruik 80% van de trailing gemiddelde velocity als realistische capaciteit voor de volgende sprint. Laat 20% voor ongepland werk, bugs en vergaderingen.

Aanbeveling: moeten we onze sprintduur, teamgrootte of planningsproces aanpassen?
```

### Begeleiding van de retrospectieve

```
Begeleid een sprintretrospectief voor Sprint [N].

Format: [synchroon / asynchroon]
Team: [N mensen, rollen]
Sprintuitkomst: [doel behaald / gedeeltelijk / gemist]
Bekende hete hangijzers: [eventuele spanningen of terugkerende problemen om aan te pakken]

Retrospectieve structuur:

1. WAT GING GOED (10 min)
Prompt: "Wat zou je in de volgende sprint zonder aarzeling hetzelfde doen?"
Goed signaal: specificiteit. Als mensen zeggen "communicatie was goed" vraag dan "geef me één voorbeeld waarbij het specifiek goed was."
Noteer: top 2-3 thema's met voorbeelden.

2. WAT NIET (10 min)
Prompt: "Wat vertraagde ons, frustreerde je, of zou je veranderen als je de sprint opnieuw mocht doen?"
Regels:
- Geen individuen beschuldigen — beschuldig processen en systemen
- "Het proces van X doen was traag" niet "Jane was traag met X"
- Elk probleem krijgt een ernst: nice-to-fix versus dit-veroorzaakt-echte-schade

3. HOOFDOORZAAKANALYSE (10 min)
Voor de top 2 "wat niet"-items: pas de 5 waaroms toe
Voorbeeld:
Probleem: "3 tickets doorgeschoven omdat we geblokkeerd waren op backend-API"
Waarom? → API was niet klaar toen de frontend het nodig had
Waarom? → API-scope was niet afgesproken voor de sprint begon
Waarom? → Discovery liep parallel aan de implementatie
Waarom? → We hebben geen "definition of ready" voor frontend-afhankelijk werk
Hoofdoorzaak: we beginnen frontend-werk voordat het backend-contract is afgerond
Oplossing: voeg "API-contract goedgekeurd" toe als onderdeel van de definition of ready voor alle frontend-tickets

4. ACTIEPUNTEN (10 min)
Regel: maximaal 2 actiepunten per retro. Meer dan 2 en niets wordt gedaan.
Format: [WAT] wordt gedaan door [WIE] voor [DATUM]
Voorbeeld: "Jordan stelt een definition of ready checklist op en deelt deze in Slack vóór volgende maandag"

Genereer de retro-structuur en begeleid elke sectie met de data die ik aanreik.
```

### Stakeholder-sprintsamenvatting

```
Schrijf de sprintsamenvatting e-mail/document voor [PUBLIEK].

Publiek: [directie / investeerders / andere teams / volledig bedrijf]
Sprint: [N] | Datums: [start-einde]
Sprintdoel: [vermeld het]

Toonregels:
- Directie / investeerders: maximaal 3 alinea's, begin met uitkomst, data-gestaafd, geen jargon
- Volledig bedrijf: vier successen met namen, leg doorschuivingen uit zonder beschuldigingen, stel verwachtingen
- Andere teams: wat is uitgerold dat hen raakt, wat er aankomt, eventuele verzoeken

Sjabloon voor directiesamenvatting:

Sprint [N] leverde [X story points] van de geplande [Y], [behaalde / behaalde gedeeltelijk / miste] het sprintdoel van "[doel]".

Geleverde hoofdresultaten: [2-4 bulletpoints — specifieke functienamen, geen generieke beschrijvingen]
[Feature]: [wat het doet, welke klanten erom vroegen of wat het ontgrendelt]
[Feature]: [...]

Wat doorschoof: [1-2 zinnen — wat en waarom, geen spin]

Prioriteit volgende sprint: [het belangrijkste dat in Sprint N+1 wordt uitgerold en waarom het belangrijk is]

Genereer de samenvatting voor mijn publiek met mijn sprintdata.
```

### Sprint-planningsprompt (invoer voor de volgende sprint)

```
Plan Sprint [N+1] op basis van de review van deze sprint.

Capaciteit:
- Team: [N engineers, N designers]
- Sprintdagen: [10 / 5 werkdagen]
- Feestdagen of vrije dagen: [vermeld eventuele afwezigheden]
- Verwachte capaciteit: [N% van normaal — bijv. 80% vanwege 2 vrije dagen]

Te overwegen backlog-items:
[Plak top 10-15 kandidaatitems met story point-schattingen]

Beperkingen:
- Doorgeschoven van Sprint N (moet worden meegenomen): [lijst]
- Vaste leveringen (externe afhankelijkheden, klantenbeloften): [lijst]
- Nice-to-have (kan worden weggelaten als capaciteit krap is): [lijst]

Kandidaten voor sprintdoel:
Optie A: [doel] — onderbouwing
Optie B: [doel] — onderbouwing
Optie C: [doel] — onderbouwing

Met een trailing 3-sprint velocity van [X punten] en de 80%-capaciteitsregel, adviseer:
1. Het sprintdoel (welke optie, en waarom)
2. Exact welke items in deze sprint worden vastgelegd
3. Wat in de backlog blijft
4. Risico: welke items in dit plan waarschijnlijk doorschuiven, en waarom
```

## Voorbeeld

**Gebruiker:** Sprint 23, 2-weken sprint. Doel: "CSV-export lanceren zodat enterprise-gebruikers hun data kunnen downloaden." Team van 4 engineers, 1 designer. Gepland 42 punten. Geleverd: CSV-export (klaar, 13 punten), bulk-selectie UI (klaar, 8 punten), API-snelheidsbeperking (gedeeltelijk — 5/8 punten geleverd), 3 bugfixes (klaar, 7 punten), nieuwe onboardingflow (niet gestart, 14 punten, reden: ontwerp niet afgerond). Velocity Sprint 22: 38. Sprint 21: 40.

**Uitvoer:**

```markdown
# Sprint 23 Review — Week eindigend 6 juni

## Resultaat sprintdoel
GEDEELTELIJK — We leverden de hoofdfunctie (CSV-export), maar de onboardingflow begon niet omdat het ontwerp niet was afgerond voor de sprint-kickoff. Het kerndoel voor enterprise-klanten werd bereikt.

## Geleverd vs. gepland
| Item | Punten | Status | Opmerkingen |
|---|---|---|---|
| CSV-export | 13 | Klaar | Sprintdoel behaald |
| Bulk-selectie UI | 8 | Klaar | Maakt CSV-export UX mogelijk |
| API-snelheidsbeperking | 8 | Gedeeltelijk (5 geleverd) | Randgevalafhandeling nog open |
| Bugfixes (3) | 7 | Klaar | |
| Nieuwe onboardingflow | 14 | Niet gestart | Ontwerp niet afgerond voor sprintstart |
| **Totaal** | **50** | **33 geleverd** | **66% voltooiingspercentage** |

## Wat doorschoof en waarom
Onboardingflow (14 punten): ontwerp was niet afgerond voor sprint planning. Dit is geen sprintuitvoeringsprobleem — het is een procesprobleem. Het team committeerde zich aan werk dat niet klaar was.
Hoofdoorzaak: we hebben geen "definition of ready" — tickets kwamen in sprint planning zonder ontwerpgoedkeuring.

API-snelheidsbeperking (3 punten resterend): randgevallen onderschat. Geen systemisch probleem.

## Ongepland werk
Niets toegevoegd midden in de sprint. Goede discipline deze sprint.

## Velocitytrend
Sprint 21: 40 punten | Sprint 22: 38 punten | Sprint 23: 33 punten
Velocity daalt. De 14 punten niet-gestart werk maskeert een echt capaciteitsprobleem —
het team krijgt geen ontwerpgereedheid onder de streep voordat ze zich vastleggen.

## Retrospectieve hoogtepunten
Ging goed:
1. CSV-export op tijd geleverd, geen herwerk — goede upfront-scoping door de engineering lead.
2. Bug-fixbatch was effectief — 3 bugs gesloten in één gerichte sessie.

Ging niet goed:
1. Onboardingflow vastgelegd zonder ontwerpgereedheid. Verspilde de sprint planningsdiscussie.
   Actie: Sarah stelt een "definition of ready" checklist op en voegt deze toe aan onze sprinttemplate voor volgende maandag.

2. API-snelheidsbeperking was onderschat. We schatten backend-complexiteit verkeerd in.
   Actie: Backend-schattingen krijgen voortaan een +2 punten buffer voor randgevallen.

## Prioriteiten volgende sprint
1. Onboardingflow (14 punten) — alleen vastleggen als ontwerp is goedgekeurd (definition of ready)
2. Resterende randgevallen API-snelheidsbeperking (3 punten) — meenemen, klein
3. [Volgende items uit backlog op basis van roadmapprioriteiten]

Aanbevolen Sprint 24-capaciteit: 37 punten (80% van het 3-sprint gemiddelde van 39 punten)
```

---
