---
name: scrum-master
description: "Scrum facilitatie: sprint ceremonies, retrospectieve formaten, blokkade verwijdering, velocity coaching, schaalvergroting van scrum over meerdere teams — praktische Scrum Master patronen"
---

# Scrum Master Skill

## Wanneer activeren
- Faciliteren van sprint ceremonies (planning, standup, review, retro)
- Retrospectives uitvoeren die echte problemen oppervlakten (niet alleen "wat is goed gegaan")
- Een team helpen dat worstelt met velocity, scope of commitment
- Schaalvergroting van één team naar meerdere teams (Scrum of Scrums, SAFe basics)
- Een nieuw team coachen in Scrum-praktijken
- Agenda's schrijven voor sprint ceremonies

## Wanneer NIET gebruiken
- Jira-configuratie — gebruik de jira-expert skill
- Productroute-beslissingen — dat is het domein van de PM
- Technische engineeringbeslissingen — geen Scrum Master zorg
- Een echte Scrum Master vervangen voor teams in conflict — menselijke facilitatie nodig

## Instructies

### Sprint retrospectief

```
Ontwerp een retrospectief voor [teamcontext].

Teamgrootte: [X personen]
Sprint-lengte: [2 weken]
Teamgezondheid: [gezond / wat spanning / worstelt]
Laatste retro: [welk format / wat kwam eruit]
Opvallende gebeurtenis van deze sprint: [incident / leveringsdruk / teamwisseling / geen]

Kies een retrospectief format gebaseerd op context:

1. Start / Stop / Continue (standaard, alle teamcontexten):
   - Start: wat moeten we beginnen?
   - Stop: wat moeten we stoppen?
   - Continue: wat werkt en moeten we beschermen?
   Duur: 60 min voor een 2-weken sprint

2. 4Ls (na een moeilijke sprint):
   - Mocht: wat heb je genoten?
   - Geleerd: wat heb je ontdekt?
   - Miste: wat ontbrak?
   - Verlangde naar: wat zou je anders willen?

3. Zeilboot (voor teams die zich radeloos voelen):
   - Wind (die ons vooruitdrijft): wat helpt ons vooruit?
   - Ankers (die ons vertragen): wat houdt ons tegen?
   - Rotsen (komende risico's): wat zou ons kunnen zinken?
   - Zon (bestemming): waar varen we heen?

4. Tijdlijn (na incidenten of grote leveringen):
   - Sprint op een tijdlijn afbeelden
   - Hoogtepunten en dieptepunten als team markeren
   - Bespreken wat elk hoogtepunt en dieptepunt veroorzaakte
   - Patronen identificeren

Faciliteringshandleiding voor [gekozen format]:
1. Ton zetten (5 min): psychologische veiligheidsframing
2. Gegevens verzamelen (15 min): stille notitieblokjes op het bord
3. Inzichten (20 min): notities in thema's groeperen, bespreken
4. Beslissen wat te doen (15 min): stemmen op top 2-3 actie-items
5. Sluiten (5 min): eigenaren en vervaldatums voor elk actie-item bevestigen

Regel: geen retro eindigt zonder benoemde eigenaar en vervaldatum voor elk actie-item. "Het team zal..." = niemand zal het doen.

Genereer de volledige agenda voor mijn specifieke context.
```

### Standup facilitatie

```
Verbeter onze dagelijkse standup.

Huidige standup: [beschrijf — hoe lang, format, problemen]
Teamgrootte: [X personen]
Op afstand / ter plaatse / hybride: [geef aan]
Veelvoorkomende problemen: [duurt te lang / mensen zijn niet aanwezig / geen blokkades gedeeld / statusrapport in plaats van sync]

Standup-formaten:

Klassieke 3 vragen (per persoon):
1. Wat heb ik gisteren gedaan?
2. Wat doe ik vandaag?
3. Zijn er blokkades?
Probleem: wordt een statusrapport — mensen spreken TEGEN de Scrum Master, niet met elkaar.

Het bord doorlopen (beter voor focus in uitvoering):
- Kijk naar elk "In Progress" item, niet elke persoon
- "Wie werkt hieraan? Zijn er blokkades?"
- Richt zich op voltooiing, niet op starten
- Beter voor Kanban-naburige teams

Twee-vraagmodel (lichter):
1. Waar werk ik aan?
2. Heb ik hulp nodig?
Geen "gisteren" = beperkt standup tot < 10 minuten met < 10 personen

Remote standup tips:
- Gebruik een gedeeld bord (Jira, Linear) op het scherm — voorkomt abstracte statusrapporten
- Begin op tijd, eindig op tijd — laatkomers voegen zonder samenvatting toe
- Blokkades gaan naar Slack async; standup is voor coördinatie, niet oplossing

Veelvoorkomende standup anti-patronen om te repareren:
- "Geen blokkades" elke dag → blokkades bestaan; mensen voelen zich niet comfortabel om te delen
  Reparatie: vraag "wat zou je sneller maken?" in plaats daarvan
- Eén persoon spreekt 5+ minuten → gebruik een timer (2 min/persoon)
- Niemand verplaatst zijn tickets erna → blokkades of tickets zijn verkeerd

Herformuleer mijn standup voor mijn teamcontext.
```

### Velocity coaching

```
Help teamvelocity verbeteren.

Huidige velocity: [X story points / sprint-gemiddelde laatste 3 sprints]
Sprint-lengte: [2 weken]
Teamgrootte: [X engineers]
Bekende problemen: [scope creep / onrealistische schattingen / onderbrekingen / technische schuld / onduidelijke stories]

Velocity-diagnosekader:

Stap 1 — Onderscheid soorten velocityproblemen:
a) Commitment probleem: team begaat zich aan X, levert Y < X → planning is kapot
b) Schattingsprobleem: team levert X maar stories worden constant midden-sprint hoger herschat
c) Onderbrekingsprobleem: ongeplande werk (bugs, incidents, slack-verzoeken) etend capaciteit
d) Leveringsprobleem: stories zitten meestal "In Progress" gedurende sprint

Stap 2 — Meet het echte probleem:
- Onderbrekingspercentage: volg ongeplande werk dat midden-sprint voor 3 sprints is toegevoegd. Als > 20% van vastgelegd werk, dat is het probleem — niet schatting.
- Cyclusduur: als stories gemiddeld > 5 dagen duren, WIP-limiet is te hoog
- Commitment-ratio: vastgelegd / geleverd over laatste 3 sprints

Stap 3 — Interventies per probleemtype:
a) Commitment: voer sprint planning met het team uit, niet voor hen. Stop met zich vastleggen aan ongeraffineerde stories.
b) Schatting: voer een puntschaalsessie uit (vergelijk eerdere schattingen met werkelijk)
c) Onderbrekingen: budget voor onderbrekingen (reserve 20% van velocity voor ongeplande werk)
d) Cyclusduur: dwing WIP-limiet van maximum 2 stories per engineer af

Stap 4 — Optimaliseer velocity niet rechtstreeks:
Velocity is een planningshulpmiddel, geen prestatiemetriek. Een team dat 40 punten betekenisvol werk doet, is beter dan een die 60 punten werk van lage waarde doet.

Diagnose mijn teamvelocity-probleem en beveel de enige hoogste leverage-verandering aan.
```

### Scrum-ceremonies kalender

```
Ontwerp de sprintceremonies-kalender voor [team].

Team: [X personen — engineers, PM, designer, QA]
Sprint-lengte: [2 weken]
Tijdzone: [allemaal hetzelfde / verdeeld]
Overlappende werkuren: [X uur/dag overlap]

Twee-weken sprintceremonie-schema:

Maandag, Sprint Start:
- 10:00 — Sprint Planning (2 uur)
  Wie: Volledig team
  Doel: Sprint backlog afgesproken, sprint doel ingesteld

Dagelijks maandag–vrijdag:
- 09:30 — Dagelijkse Standup (max 15 min)
  Wie: Volledig team
  Format: Het bord doorlopen

Vrijdag van Week 1:
- 15:00 — Backlog Refinement (1 uur)
  Wie: PM + 2-3 engineers (roterend)
  Doel: Top 10 backlog items geschat en verduidelijkt

Donderdag van Week 2 (dag voordat sprint eindigt):
- 14:00 — Sprint Review (1 uur)
  Wie: Volledig team + belanghebbenden
  Doel: Demo voltooid werk, feedback verzamelen
- 15:30 — Retrospective (1 uur)
  Wie: Alleen team (geen belanghebbenden)
  Doel: 2-3 actionable verbeteringen voor volgende sprint

Vrijdag van Week 2 (Sprint End):
- Team voltooit restwerkt
- PM sluit sprint in Jira, bereidt velocity-grafiek voor

Ontwerp de kalender voor mijn teamgrootte, tijdzone en werkstijl.
```

## Voorbeeld

**Gebruiker:** Onze retrospectives eindigen altijd met dezelfde 3 actie-items ("betere tickets schrijven", "meer communiceren", "scope creep verminderen") en nooit verandert er iets. Hoe zet ik dit recht?

**Claudies diagnose:**

Deze 3 actie-items zijn procesplatitudes — ze noemen symptomen zonder oorzaken aan te pakken, en ze hebben geen eigenaar. Daarom verandert er niets. De retro doet de juiste ceremonie, maar het verkeerde ding.

**Oorzaak van "betere tickets schrijven":**
Dit betekent: tickets die in de sprint gaan, zijn ondergespecificeerd, wat rework of verkeerde implementatie veroorzaakt.
Echte vraag om te stellen: "Welke ticket in de afgelopen 3 sprints veroorzaakte de meeste rework? Waarom was het onduidelijk? Wie schreef het? Wat ontbrak?"
Specifieke actie: "Vóór de volgende sprintplanning controleert de PM alle tickets met de engineer die deze bezit — duurt 30 min elke donderdag."

**Oorzaak van "meer communiceren":**
Dit is meestal een symptoom van onduidelijk eigenaarschap, geen communicatieprobleem.
Echte vraag om te stellen: "Wanneer wist je afgelopen sprint niet wat je moest doen en moest je iemand vragen? Waarom werd je niet eerder verteld?"
Specifieke actie: "Voeg een "afhankelijkheden" veld toe aan elk verhaal > 3 punten — wie anders moet betrokken zijn?"

**Oorzaak van "scope creep verminderen":**
Dit betekent: items worden midden-sprint toegevoegd zonder anderen te verwijderen.
Echte vraag om te stellen: "Wie goedheurde de midden-sprint additions in de afgelopen 3 sprints? Was het dringend of vermijdbaar?"
Specifieke actie: "Nieuw item toegevoegd midden-sprint vereist expliciete PM + tech lead goedkeuring EN verwijdering van gelijkwaardige punten."

**Retro-format wijziging:**
Stop met Start/Stop/Continue. Switch naar een Timeline retro — ga dag voor dag terug door de afgelopen sprint. Dit dwingt specifieke voorbeelden af in plaats van algemene klachten, en specifieke voorbeelden hebben specifieke oorzaken.

---
