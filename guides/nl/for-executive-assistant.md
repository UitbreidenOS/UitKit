# Claude voor Directiesecretaresses en Chiefs of Staff

Alles wat een EA, Senior EA of Chief of Staff nodig heeft om AI-ondersteunde executive ondersteuning te bieden — briefings, vergaderbeheer, stakeholdercommunicatie, boardvoorbereiding en projectopvolging in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een Executive Assistant of Chief of Staff die een C-suite executive ondersteunt. Je taak is om je executive effectiever te maken door te bewaken wat hen bereikt, hen voor te bereiden op wat belangrijk is en alles te regelen wat niet hun directe aandacht vereist. Je dag bestaat uit voortdurend van context wisselen — boardvoorbereiding, stakeholdercommunicatie, briefings, logistiek en alles wat tussen de mazen valt.

Claude Code wordt je voorbereidingsmotor: briefings in minuten opgesteld, gevoelige communicatie beoordeeld voordat die op het bureau van je executive belandt, en boardpresentaties gestructureerd voordat de directeur er aan begint.

**Voor Claude Code:** 90 minuten om een gedegen executive briefing voor te bereiden. 45 minuten om een gevoelige all-hands-aankondiging op te stellen. 2 uur om een boardvoorbereidingsdocument van nul te bouwen.

**Erna:** Executive briefing in 20 minuten. Aankondigingsconcept in 15 minuten. Boardvoorbereiding in 30 minuten.

---

## Installatie in 30 seconden

```bash
# Installeer EA- en CoS-vaardigheden
npx claudient add skill small-business/meeting-to-action
npx claudient add skill small-business/monday-brief
npx claudient add skill productivity/board-deck-builder
npx claudient add skill productivity/confluence-expert
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms

# Installeer de chief of staff-agent
npx claudient add agent advisors/chief-of-staff
```

---

## Jouw Claude Code EA- en CoS-stack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/exec-briefing` | Pre-meeting briefing: aanwezigenprofielen, gespreks­punten, agenda, gewenste uitkomsten, wat NIET toe te zeggen | Elke vergadering met hoge inzet |
| `/stakeholder-comms` | Bedrijfsaankondigingen, gevoelige updates, all-hands voorbereiding, boardcommunicatie, crisiscommunicatie | Elk significant communicatieconcept |
| `/meeting-to-action` | Transcript of notities → actiepunten, beslissingen, eigenaren, deadlines | Na elke belangrijke vergadering |
| `/monday-brief` | Wekelijks briefingdocument voor de executive — prioriteiten, belangrijke vergaderingen, watchlist | Elke maandagochtend |
| `/board-deck-builder` | Boardvergaderingspresentatiestructuur, narratief en inhoudsvoorbereiding | Maandelijkse of kwartaalboardvergaderingen |
| `/confluence-expert` | Documentbeheer, wikistructuur, teamkennisbank | Documentatie en kennisbeheer |

### Agent

| Agent | Model | Wanneer te starten |
|---|---|---|
| `chief-of-staff` | Sonnet | Complexe strategische planning, multi-stakeholdercoördinatie, operationeel ritmeontwerp |

---

## Dagelijkse workflow

### Ochtend (30 minuten)

**1. Maandagbriefing — wat je executive deze week moet weten**

Voer elke maandagochtend uit voordat de executive met de dag begint:

```
/monday-brief

Wekelijkse briefing voor [naam executive] — week van [datumbereik].

BELANGRIJKE VERGADERINGEN DEZE WEEK:
- [Dag, tijd]: [Naam vergadering] — [korte context — wie, wat staat op het spel]
- [Dag, tijd]: [Naam vergadering] — [korte context]
- [Dag, tijd]: [Naam vergadering] — [context]

DELIVERABLES DIE DE EXEC DEZE WEEK MOET OPLEVEREN:
- [Item] — te leveren op [datum] — [wie het nodig heeft]
- [Item]

DINGEN DIE ZE MOETEN WETEN (maar waarschijnlijk nog niet weten):
- [Belangrijke ontwikkeling — concurrentienieuws, teamsituatie, stakeholdersentiment]
- [Item]

OPENSTAANDE BESLISSINGEN (exec moet deze week beslissen):
- [Beslissing] — context: [kort] — deadline: [datum]

WAT TE VOLGEN:
[Iets dat zich ontwikkelt en nog niet urgent is maar dat zal worden als het niet wordt beheerd]

Opmaak: maximaal 1 pagina. Opsommings­punten. Geen opvulling. De exec leest dit in 3 minuten.
```

**2. Pre-meeting briefings — voorbereiding op dezelfde dag**

Voor elke vergadering met hoge inzet vandaag:

```
/exec-briefing

[Exec] heeft een vergadering met [aanwezige(n)] om [tijd].

Doel vergadering: [waar deze vergadering over gaat]
Aanwezigen: [naam, titel, bedrijf — kernfeiten voor iedereen]
Wat we van deze vergadering willen: [uitkomst]
Wat zij van ons willen: [hun doelstelling]
Achtergrond: [eventuele relevante voorgeschiedenis]
Wat NIET toe te zeggen: [eventuele beperkingen]

Genereer de briefing. Ik heb die nodig voor [tijd — 1-2 uur voor de vergadering].
```

---

### Na de vergadering (15 minuten na belangrijke vergaderingen)

**3. Vergadering naar actiepunten**

```
/meeting-to-action

Extraheer actiepunten uit deze vergadering.

Vergadering: [naam]
Datum: [datum]
Aanwezigen: [lijst]

[Plak notities, transcript of jouw samenvatting]

Extraheer:
- Genomen beslissingen
- Actiepunten (wie bezit wat en wanneer)
- Openstaande vragen (geen beslissing genomen, follow-up nodig)
- Benodigde follow-up­communicatie
```

---

### Communicatieopstelling (op aanvraag)

**4. Gevoelige bedrijfscommunicatie**

```
/stakeholder-comms

Opstellen: [type communicatie]
Van: [naam en titel executive]
Aan: [doelgroep]

Het nieuws: [wat er gebeurt]
Waarom het gebeurt: [motivatie]
Wat het betekent voor de doelgroep: [impact]
Toon: [empathisch / direct / vierend / voorzichtig]
Beperkingen: [wat juridische zaken/HR heeft gezegd dat we niet kunnen opnemen]

Beoordeel op: toon, helderheid, alles dat verkeerd begrepen kan worden, wat ontbreekt.
```

**5. Boardcommunicatie**

```
/stakeholder-comms

Board [type: vergaderingsamenvatting / tussentijdse update / verzoek / mijlpaalaan­kondiging].

Wat er is gebeurd of wat er gebeurt: [feiten]
Wat de board moet doen of weten: [actie of informatie]
Tijdlijn: [wanneer beslissing nodig of wanneer meer informatie beschikbaar]

Maximaal 400 woorden. Direct. Feiten eerst.
```

---

### Boardvergaderingsvoor­bereiding (maandelijks of per kwartaal)

**6. Boardpresentatievoorbereiding**

```
/board-deck-builder

Bouw de boardvergaderingsstructuur voor [bedrijfsnaam] — [Kwartaal? Maand] [Jaar].

Datum boardvergadering: [datum]
Boardsamenstelling: [lijst sleutelleden]
Belangrijkste onderwerpen dit kwartaal: [lijst agendapunten]
Prestatie­hoogtepunten om te benadrukken: [statistieken en mijlpalen]
Uitdagingen om eerlijk te presenteren: [wat niet zoals gepland verliep]
Beslissingen die de board nodig heeft: [lijst]

Genereer: presentatieoverzicht, slide-voor-slide inhoudsstructuur, gespreks­punten per sectie, verwachte boardvragen.
```

---

### Wekelijks afsluiting (vrijdag)

**7. Einde-van-week-samenvatting**

```
/monday-brief

Einde-van-week-samenvatting voor [executive].

WAT ER DEZE WEEK IS GEDAAN:
[Lijst grote afgeronde items]

OPENSTAANDE ITEMS VOOR VOLGENDE WEEK:
[Lijst]

WAT EXEC-AANDACHT VEREIST VOOR MAANDAG:
[Urgente items om te regelen voordat de week sluit]

VOORUITBLIK VOLGENDE WEEK:
[Belangrijke vergaderingen, deliverables en situaties om te volgen]
```

---

## 30-dagenplan (nieuwe EA of CoS)

### Week 1 — Breng het landschap in kaart
- Installeer alle EA/CoS-vaardigheden: `npx claudient add skill productivity/[naam]`
- Leer de agenda van de executive: welke vergaderingen zijn terugkerend, welke zijn met hoge inzet, welke vermijden ze liever
- Leg het maandagbriefingformat voor aan de exec — willen ze meer of minder detail? andere focus?
- Identificeer de 5 belangrijkste stakeholders in de wereld van de exec en bouw profielen met `/exec-briefing`

### Week 2 — Communicatieworkflow
- Stel de volgende boardupdate of significante aankondiging op met `/stakeholder-comms`
- Laat de exec voor en na het concept zien — laat ze de tijdsbesparing en kwaliteit inzien
- Stel het communicatiereviewproces vast: wie beoordeelt gevoelige concepten voordat ze verstuurd worden?
- Gebruik `/meeting-to-action` op elke vergadering gedurende een week — volg wat er gedaan wordt vs. wat niet

### Week 3 — Board- en stakeholdervoorbereiding
- Gebruik `/exec-briefing` om de exec voor te bereiden op hun volgende significante externe vergadering
- Gebruik `/board-deck-builder` voor de aankomende boardvergadering
- Bekijk de uitvoer met de exec — kalibreer detailniveau en wat toe te voegen vanuit interne kennis

### Week 4 — Systemen en automatisering
- Documenteer je wekelijkse ritme — welke Claude-vaardigheden je op welke dagen uitvoert
- Bouw een bibliotheek van herbruikbare prompts voor je meest frequente taken
- Identificeer waaraan je nog te veel tijd besteedt — er is waarschijnlijk een Claude-workflow voor
- Stel benchmarks in: hoe lang duurt elke taak? Volg verbeteringen over de volgende 90 dagen

---

## Principes voor communicatie met hoge inzet

Deze zijn van toepassing op alles wat je voor je executive opstelt:

**1. Begin met het nieuws, niet de context**
"We sluiten het Londense kantoor per 1 maart." Niet "Terwijl we onze vastgoedvoetafdruk blijven evalueren in de context van onze evoluerende hybride werkstrategie..."

**2. Zeg het moeilijke duidelijk**
Eufemismen verzachten slecht nieuws niet — ze signaleren dat leiderschap het publiek niet met eerlijkheid vertrouwt, wat meer vertrouwen vernietigt dan het nieuws zelf.

**3. Maximaal drie dingen**
Mensen onthouden drie dingen van elke communicatie. Als je zeven punten hebt, kies er drie. De rest gaat in de bijlage of de follow-up.

**4. Vertel ze wat er daarna gebeurt**
Elke significante aankondiging moet eindigen met een specifieke volgende stap — een follow-upvergadering, een contactpersoon, een datum voor meer informatie.

**5. Juridische beoordeling is niet optioneel voor gevoelige communicatie**
Claude stelt efficiënt op en signaleert toonproblemen. Het vervangt HR- en juridische beoordeling niet voor: ontslagrondes, prestatie­maatregelen, regelgevende zaken, materiële bedrijfswijzigingen.

---

## Integraties met hulpmiddelen

### Google Calendar
Claude kan de agenda van je exec niet direct lezen (tenzij je een kalender-MCP gebruikt), maar je kunt de vergaderingen van de week als tekst plakken. Gebruik dit formaat:
```
Maandag 9:00: [vergaderingstitel] — [aanwezigen] — [duur] — [doel]
Maandag 11:00: [vergadering] ...
```
Voer dan `/monday-brief` uit met dat als context.

### Slack / Teams
Stel gevoelige berichten of aankondigingen op in Claude → beoordeel → plak in Slack. Voor terugkerende all-hands-samenvattingen, plak de opsommingspunten van `/meeting-to-action` in je teamkanaal.

### Notion / Confluence
Gebruik `/confluence-expert` om documentatiepagina's te structureren. Claude stelt de inhoud op — jij plakt in je wiki. Voor terugkerende documenten (boardupdates, wekelijkse briefings) bouw sjablonen in Notion en vul ze met Claude-uitvoer.

### Boardportaal (Diligent, Boardvantage)
Claude genereert boardcommunicatie als tekst → formatteer en upload naar je boardportaal. Voor presentatie­inhoud levert Claude de structuur en gespreks­punten — je ontwerper bouwt de visuele versie.

---

## Bij te houden statistieken

| Activiteit | Tijd voor Claude | Tijd met Claude |
|---|---|---|
| Executive briefingdocument | 90 min | 20 min |
| Bedrijfsbrede aankondigingsconcept | 45 min | 15 min |
| Boardvergaderingsvoor­bereiding | 3 uur | 45 min |
| Vergaderings­actiepunten | 30 min | 8 min |
| Maandagbriefing | 30 min | 10 min |
| Gevoelig communicatieconcept | 60 min | 20 min |

---

## Veelgemaakte fouten (en hoe Claude Code ze voorkomt)

**Fout 1: Te lange briefings**
`/exec-briefing` is gestructureerd om beknopte, overzichtelijke documenten te produceren. Executives lezen geen lange briefings — ze krijgen een samenvatting of je die nu schrijft of niet. Maak het intentioneel.

**Fout 2: Aankondigingen die het nieuws begraven**
`/stakeholder-comms` is geprompt om met het nieuws in de eerste zin te beginnen. Als Claude het begraaft, markeer het en vraag om een herschrijving met het nieuws in zin 1.

**Fout 3: Vergaderings­actiepunten die niet worden uitgevoerd**
`/meeting-to-action` structureert actiepunten met eigenaar, vervaldatum en succescriterium. Vage acties worden niet uitgevoerd. Specifieke wel.

**Fout 4: Gevoelige communicatie die de emotionele toon mist**
Claude controleert op helderheid en toonproblemen, maar jij kent je exec en je cultuur. Beoordeel elke gevoelige communicatie voordat die je bureau verlaat — Claude is de eerste redacteur, niet de laatste.

**Fout 5: Boardmaterialen die rapporteren in plaats van informeren**
`/board-deck-builder` is ontworpen om materialen te structureren rondom beslissingen, niet alleen data. Boards moeten dingen beslissen. Maak het hen gemakkelijk.

---

## Bronnen

- [Aan de slag met Claude Code](getting-started.md)
- [Executive briefing-vaardigheid](../skills/productivity/exec-briefing.md)
- [Stakeholdercommunicatie-vaardigheid](../skills/productivity/stakeholder-comms.md)
- [Vergadering naar actie-vaardigheid](../skills/small-business/meeting-to-action.md)
- [Boardpresentatiebouwer-vaardigheid](../skills/productivity/board-deck-builder.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
