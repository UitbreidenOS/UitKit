# Handleiding voor agentorkestratie

Hoe u werk delegeert, paralleliseert en specialiseert met het sub-agentsysteem van Claude Code.

---

## Wat sub-agents zijn

Een sub-agent is een aparte Claude-instantie die door de oudersessie wordt gestart om een specifieke, afgebakende taak af te handelen. Het krijgt:
- Een vers contextvenster (geen sessiegeschiedenis)
- Een specifieke tool-subset (indien geconfigureerd)
- Een modelselectie (kan afwijken van de ouder)
- Een prompt die u expliciet schrijft

Sub-agents zijn geen magie — het zijn specifieke tools voor specifieke problemen.

---

## Wanneer een sub-agent gebruiken

Gebruik een sub-agent wanneer de taak **duidelijke invoer** en **duidelijke uitvoer** heeft en **onafhankelijk is van de huidige sessiestatus**.

**Goede kandidaten:**
- 10 bestanden controleren op beveiligingsproblemen
- Een specifieke zoekopdracht uitvoeren in de codebase
- Boilerplate genereren voor een nieuwe module op basis van een spec
- Een logbestand analyseren en een samenvatting teruggeven

**Slechte kandidaten:**
- Taken die de volledige sessiecontext vereisen
- Taken die heen-en-weer vereisen — sub-agents zijn eenmalig
- Taken waarbij de opstartoverhead het werk overtreft

---

## 1. Delegatiepatroon

De oudersessie identificeert een afgebakende taak en geeft deze door.

**Sleutelregel:** De sub-agent prompt moet op zichzelf staan. Het heeft geen toegang tot wat de oudersessie heeft gedaan. Brief het als een collega die net de kamer is binnengekomen.

**Wat op te nemen in de sub-agent prompt:**
- Wat u probeert te bereiken en waarom
- De specifieke bestanden of mappen
- Het gewenste resultaatformaat
- Al genomen beslissingen

---

## 2. Parallelisatiepatroon

Meerdere sub-agents die gelijktijdig aan onafhankelijke taken werken.

**Wanneer te paralleliseren:**
- Dezelfde bewerking moet op veel bestanden/modules worden toegepast
- Twee echt onafhankelijke taken moeten beide worden voltooid
- Onderzoekstaken die verschillende gebieden bestrijken

**Git worktrees gebruiken voor parallelle codewijzigingen:**
```bash
git worktree add ../feature-branch-a feature-a
git worktree add ../feature-branch-b feature-b
```

**Parallelisatie anti-patronen:**
- Taken paralleliseren die staat delen (schrijfconflicten)
- Parallelle taken waarbij de ene afhangt van de uitvoer van de andere

---

## 3. Specialisatiepatroon (cavecrew)

Pas het model en de tools van de sub-agent aan op de aard van de taak. Geïnspireerd door het **cavecrew**-patroon (bron: [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)) — bespaart ~60% tokens vergeleken met het gebruik van Opus voor elke sub-agent.

| Rol | Model | Tools | Gebruik wanneer |
|---|---|---|---|
| Onderzoeker | Haiku 4.5 | Read, Bash (alleen grep/find) | Dingen lokaliseren in de codebase — alleen-lezen, snel |
| Bouwer | Sonnet 4.6 | Read, Edit, Write, Bash | Chirurgische 1–2 bestandswijzigingen |
| Reviewer | Haiku 4.5 | Read | Een diff of set bestanden beoordelen |
| Orkestrator | Opus 4.7 | Alle | Complexe meerstaps coördinatie, architectuurbeslissingen |

---

## 4. Context overdrachtspatroon

Wanneer een sessie significante context heeft opgebouwd en u werk moet overdragen aan een nieuwe agent.

**Structuur van de overdracht prompt:**
```
## Context
[Wat dit project doet, kort]
[Waar we aan werkten]
[Beslissingen genomen tijdens deze sessie]

## Files modified
[Lijst met korte reden voor elke wijziging]

## Current state
[Wat klaar, wat niet, wat blokkeert]

## Your task
[Specifieke, afgebakende taak voor de nieuwe agent]

## Constraints
[Genomen beslissingen die niet opnieuw besproken moeten worden]
```

---

## 5. Harde vs. zachte afhankelijkheden

**Harde afhankelijkheid:** De stroomafwaartse taak faalt expliciet zonder de stroomopwaartse setup.
- Signaleer dit expliciet: "Deze skill vereist setup — voer eerst `/setup` uit."

**Zachte afhankelijkheid:** De taak werkt maar produceert lagere kwaliteit uitvoer zonder setup.
- Niet stoppen. Graceful degraderen en de kloof noteren.

---

## 6. Scopecontrole voor sub-agents

Elke sub-agent moet een expliciete scopelimiet hebben.

**Op te nemen in elke sub-agent prompt:**
```
## Scope
- Read: yes
- Write/Edit: [alleen specifieke bestanden OF nee]
- Shell commands: [specifieke toegestane commando's OF geen]
- Network: [ja/nee]

## Do not
- Do not modify files outside [directory]
- Do not make git commits
- Do not install packages
```

---

## 7. Resultaten teruggeven van sub-agents

**Bestanden prefereren voor:**
- Resultatenlijsten waar de ouder over zal itereren
- Gegenereerde code die de ouder zal beoordelen
- Rapporten die meerdere keren worden gerefereerd

**Terugkeerberichten prefereren voor:**
- Eenvoudige ja/nee-antwoorden
- Korte gestructureerde gegevens
- Statusrapporten

---

## Snelle referentie

| Doel | Patroon |
|---|---|
| Afgebakende, op zichzelf staande taak | Delegatie |
| Zelfde taak op veel bestanden | Parallelisatie |
| Alleen-lezen zoeken/lokaliseren | Onderzoeker (Haiku) |
| Chirurgische codewijziging | Bouwer (Sonnet) |
| Diff/bestand review | Reviewer (Haiku) |
| Complexe meerstaps coördinatie | Orkestrator (Opus) |
| Sessieoverdracht | Context overdrachtspatroon |
| Grote sub-agent uitvoer | Naar bestand schrijven, ouder leest |
| Kort gestructureerd resultaat | Terurkerbericht |

---

## Werk met ons samen
