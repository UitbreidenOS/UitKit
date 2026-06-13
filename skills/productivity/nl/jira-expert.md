---
name: jira-expert
description: "Jira projectmanagement: board setup, issue hiërarchie, workflow design, JQL queries, sprint planning, reporting, en Jira best practices voor engineering teams"
---

# Jira Expert Skill

## Wanneer activeren
- Een nieuw Jira-project opzetten of een bestaande herstructureren
- JQL-queries schrijven om specifieke issues te vinden
- Een workflow ontwerpen die bij uw ontwikkelingsproces past
- Sprints, epics en story hiërarchie configureren
- Jira-rapporten en dashboards bouwen
- Debuggen waarom Jira-boards of automatisering niet zoals verwacht werken

## Wanneer NIET gebruiken
- Productroute-planning — dit is een product-roadmap skill conversation
- Sprint retrospectives — gebruik een echte team facilitation process
- Migratie weg van Jira — evalueer hulpmiddelen eerst, migreer dan

## Instructies

### Project setup

```
Zet een Jira-project op voor [team/product].

Team: [X engineers, Scrum / Kanban / gemengd]
Methodologie: [Scrum (timeboxed sprints) / Kanban (continuous flow) / Scrumban]
Project type: [Software / Business / Service management]
Integratiebehoeften: [GitHub / GitLab / Confluence / Slack]

Aanbevolen configuratie:

Project type: [Software] — geeft u sprints, backlog en velocity reporting

Issue hiërarchie:
Epic → Story → Sub-task (standaard)
of
Initiative → Epic → Story → Sub-task (voor grotere programma's)

Workflow design:
Eenvoudig (aanbevolen voor de meeste teams):
  To Do → In Progress → In Review → Done

Met meer granulariteit:
  Backlog → Selected for Dev → In Progress → In Review → In QA → Done

Te vermijden statuses:
- "Wachten" zonder duidelijkheid over wie op wat wacht
- Te veel statuses — elke status is een handoff die een ritual nodig heeft

Story points vs. tijd estimates:
- Gebruik story points voor relatieve complexiteit schatting (Fibonacci: 1,2,3,5,8,13)
- Gebruik nooit uren — valse precisie die discussietijd kost

Components: gebruik om in te delen naar technisch gebied (Frontend, Backend, Infrastructure, Mobile)
Labels: gebruik voor cross-cutting concerns (performance, security, debt)

Configureer dit project en zet het initial board op.
```

### JQL queries

```
Schrijf JQL queries voor [use case].

Ik moet vinden: [beschrijf wat u zoekt]
Project: [project key — bijv. ENG, BACKEND]

Gemeenschappelijke JQL patronen:

Alle openstaande issues die aan mij zijn toegewezen:
  assignee = currentUser() AND resolution = Unresolved

Issues toegevoegd aan huidige sprint na het begin (scope creep):
  sprint = "Sprint 23" AND created > startOfSprint()

Alle high-priority bugs open voor meer dan 7 dagen:
  issuetype = Bug AND priority in (High, Critical) AND created <= -7d AND resolution = Unresolved

Issues in review zonder opmerkingen in 2+ dagen (verouderde PRs):
  status = "In Review" AND updated <= -2d AND issuetype = Story

Alle issues in een epic:
  "Epic Link" = ENG-123
  of (Next-gen): parentEpic = ENG-123

Velocity blockers (in-progress langer dan sprint gemiddelde):
  status = "In Progress" AND updated <= -5d AND sprint in openSprints()

Issues deze week afgerond (voor standup / release notes):
  status = Done AND resolved >= startOfWeek()

Alle issues zonder assignee in de backlog:
  assignee is EMPTY AND status = "To Do" AND sprint is EMPTY

Schrijf een JQL query voor mijn specifieke use case. Voeg een beschrijving toe van wat het retourneert.
```

### Sprint planning

```
Help me sprint planning voor [team] uit te voeren.

Team: [X engineers]
Sprint lengte: [1 week / 2 weken]
Team velocity: [X story points gemiddelde over laatste 3 sprints]
Sprint doel voor deze sprint: [wat we willen bereiken]
Backlog status: [gegroeid / moet groeien]

Sprint planning checklist:

Pre-planning (dag ervoor):
□ Backlog gegroeid: top 20 items geschat en begrepen
□ Sprint doel conceptueel (1 zin — hoe succes eruit ziet)
□ Capaciteit bevestigd: wie is weg? (PTO, on-call, interviews)
□ Aangepaste capaciteit: [team velocity × beschikbaarheid %]

Tijdens planning (2-uur sessie voor 2-weken sprint):

Deel 1 — Doel alignment (15 min):
- PO presenteert sprint doel
- Team bevestigt het is haalbaar en waardevol
- Zijn er blockers om de sprint te starten?

Deel 2 — Backlog refinement (45 min, als nog niet gedaan):
- Loop door top backlog items
- Team stelt verduidelijkingsvragen → voeg acceptance criteria toe
- Herschat als begrip veranderde

Deel 3 — Commitment (45 min):
- Team trekt stories van top backlog totdat velocity bereikt is
- Engineers breken stories in subtasks (helpt verborgen complexiteit bloot te leggen)
- Roep afhankelijkheden tussen items aan
- Laatste 10 min: lees de sprint terug — stemt iedereen in?

Deel 4 — Sprint gestart (15 min):
- Start de sprint in Jira
- Verplaats ieders eerste taak naar "In Progress"

JQL voor capaciteitscontrole:
  sprint = "Sprint [X]" AND assignee = [engineer] ORDER BY priority

Output: sprint planning agenda template + JQL queries voor de sessie.
```

### Jira reporting en dashboards

```
Bouw een Jira dashboard voor [publiek].

Publiek: [engineering team / product manager / executive]
Metriek nodig: [velocity / bug rate / sprint health / OKR progress]

Dashboard gadgets voor engineering teams:
- Sprint Health: issues done vs. committed (burndown)
- Velocity Chart: laatste 6-8 sprints — trend op/af/vlak?
- Created vs. Resolved: lossen we bugs sneller op dan ze worden aangemaakt?
- Cycle Time: gemiddelde tijd van "In Progress" naar "Done" per issue type

Dashboard voor product managers:
- Epics progress: % compleet voor elke epic in vlucht
- Release burndown: story points resterend naar release target
- Issues zonder estimates: plan gaps markeren
- Gedaan deze sprint: wat is verstuurd (gebruik in wekelijkse review)

Executive dashboard:
- OKR health: [custom — link epics naar OKRs via labels of custom field]
- Team velocity trend: [worden we sneller of langzamer?]
- Bug count per ernst: [hoeveel kritiek/hoog bugs open?]
- Release cadence: [data van laatste 5 releases]

JQL voor veelgebruikte dashboard gadgets:
Bug rate (bugs aangemaakt afgelopen 30 dagen):
  issuetype = Bug AND created >= -30d

Cycle time (opgelost deze sprint):
  status = Done AND sprint in closedSprints() ORDER BY resolved DESC

Ungeschat backlog:
  story_points is EMPTY AND status = "To Do" AND sprint is EMPTY

Bouw de dashboard gadget configuratie voor mijn publiek.
```

### Automation recipes

```
Zet Jira automation in voor [workflow].

Use case: [beschrijf wat u wilt automatiseren]

Veelgebruikte Jira automation recipes:

Auto-assign bij status change:
  Trigger: Issue transitioned naar "In Review"
  Condition: Assignee is [engineer]
  Action: Wijs toe aan [reviewer] + Voeg opmerking toe "Ready for review"

Auto-close verouderde bugs:
  Trigger: Geplanned (wekelijks)
  Condition: status = "To Do" AND updated <= -90d AND priority = Low
  Action: Overgezet naar "Won't Fix" + Opmerking "Auto-gesloten na 90 dagen inactiviteit"

Notify Slack bij kritieke bug:
  Trigger: Issue aangemaakt
  Condition: issuetype = Bug AND priority = Critical
  Action: Stuur Slack bericht naar #engineering-alerts met issue link

Sync GitHub PRs naar Jira:
  Trigger: GitHub PR geopend (via GitHub integration)
  Action: Overgezet gekoppelde issue naar "In Review"

Auto-transition bij PR merge:
  Trigger: GitHub PR gemerged
  Action: Overgezet gekoppelde Jira issue naar "Done"

Sprint velocity warning:
  Trigger: Geplanned (dagelijks, tijdens sprint)
  Condition: Sprint % compleet > 70% AND punten afgerond / punten committed < 0.5
  Action: Notificeer PO via opmerking op sprint board

Schrijf de automation rules voor mijn specifieke use case.
```

## Voorbeeld

**Gebruiker:** Ons Jira-board is een warboel — 200+ issues in de backlog, helft zonder estimates, geen duidelijke sprint doelen, en velocity is in 3 maanden van 45 naar 28 gezakt. Waar begin ik?

**Claudies herstelplan:**

Velocity daling van 45→28 in 3 maanden = 38% daling. Dat is geen Jira probleem — Jira maakt een teamprobleem zichtbaar. Herconfigureer Jira niet zonder het echte oorzaak te begrijpen.

**Stap 1 — Diagnose voordat je het repareert (deze week):**

JQL: wat werd in elk van de laatste 3 sprints afgerond?
```
sprint in closedSprints() AND status = Done ORDER BY resolved DESC
```
Verschijnen dezelfde soorten issues herhaaldelijk? Zo ja: terugkerende bugs of onopgeloste technische schuld vreetissues velocity.

JQL: hoeveel bugs zijn de afgelopen 90 dagen aangemaakt?
```
issuetype = Bug AND created >= -90d
```
Als bug volume stijgt, wordt velocity daling veroorzaakt door ongepland werk, niet planningsdysfunctie.

**Stap 2 — Backlog chirurgie (1 team sessie, 90 min):**
- Sorteer op "Last Updated" oplopend
- Elk issue ongeraakt > 3 maanden zonder sprint toegewezen → archiveer (zal niet doen of doet niet)
- Schat ze niet — verwijder gewoon de ruis
- Doel: backlog onder 80 items voor volgende sprint

**Stap 3 — Sprint hygiene herstellen:**
- Sprint doel: één zin, afgesproken voordat sprint start
- Geen items toevoegen midden-sprint zonder gelijkwaardige items te verwijderen
- Retrospective: voer "wat heeft ons deze sprint vertraagd?" uit aan het einde van elke sprint voor 4 sprints

**Stap 4 — Volg cycle time, niet alleen velocity:**
Voeg een "Cycle Time" gadget toe aan uw board. Als cycle time toeneemt (stories duren langer om af te ronden), is het probleem WIP limiet — te veel dingen tegelijkaertijd in progress.

---
