# RIPER-Workflow

Vijf-fase gestructureerd agentisch coderingskader. Elke fase heeft strikte modus, gedefinieerde inputs en concrete artefactuitvoer. Het verplaatsen naar volgende fase vereist voltooiing van huidig.

---

## Wanneer te gebruiken

- Complexe functies waar bereikverandering voorspelbaar risico is
- Onbekende codebases waar springing naar implementatie te vroeg duur rework veroorzaakt
- Taken waar correctie meer importeert dan snelheid van eerste poging
- Elke situatie waar medewerker (mens of agent) moet herzien voor werk doorgaat

---

## Fasen

### 1. Onderzoek

**Modus-verklaring:** "Ik ben in RESEARCH-modus."

**Wat gebeurt:** Verzamel alleen informatie. Lees relevante bestanden, controleer documentatie, identificeer onbekenden. Stel verduidelijking vragen als nodig. Stel geen oplossingen voor. Schrijf geen code.

**Verboden in deze fase:** Benaderingen suggereren, implementatiecode schrijven, bestanden bewerken.

**Uitvoer:** Een contextsamenvattingsuitvoer — wat werd gevonden, wat is onbekend en concrete vraag die volgende fase moet beantwoorden.

```
Context samenvatting:
- Relevante bestanden: [zet op lijst]
- Huidig gedrag: [beschrijving]
- Onbekend: [specifieke gaten]
- Vraag voor Innovate-fase: [precieze vraag]
```

---

### 2. Innovatie

**Modus-verklaring:** "Ik ben in INNOVATE-modus."

**Wat gebeurt:** Brainstorm mogelijke benaderingen gebaseerd op onderzoeksuitvoer. Zet elke benadering op lijst met compromissen. Geen implementatie. Geen code. Geen projectbestandbewerking.

**Verboden in deze fase:** Implementatiecode schrijven, benadering selecteren, projectbestanden bewerken.

**Uitvoer:** Genummerde lijst benaderingen, elk met pros, cons en context-fit assessment.

```
Opties:
1. [Benadering] — pros: [...] cons: [...] fit: [hoog/middelmatig/laag]
2. ...
```

---

### 3. Plan

**Modus-verklaring:** "Ik ben in PLAN-modus."

**Wat gebeurt:** Selecteer benadering uit Innovate-uitvoer en maak stapsgewijze implementatieplan. Elke stap moet atoom zijn: één bestandwijziging, één functie, één databasemigratie — niet "implementeer de functie". Nummer elke stap. Identificeer eventuele vereiste stappen.

**Poort:** Plan moet worden goedgekeurd (door gebruiker of herzienagent) voordat Fase 4 begint.

**Uitvoer:** Genummerde checklist zonder dubbelzinnigheid.

```
Implementatieplan:
[ ] 1. Maak src/lib/export.ts met exportToCsv(rows: Row[]): string
[ ] 2. Voeg GET /api/export route in src/routes/export.ts toe met exportToCsv
[ ] 3. Voeg Exportknop toe aan OrdersTable-component in src/components/OrdersTable.tsx
[ ] 4. Schrijf unittests in src/lib/export.test.ts bedekkend lege, enkelvoudige-rij en meervoudige-rij gevallen
```

---

### 4. Uitvoeren

**Modus-verklaring:** "Ik ben in EXECUTE-modus."

**Wat gebeurt:** Implementeer plan exact zoals geschreven, één stap tegelijk. Zet elke stap af na voltooiing. Improviseer niet. Voeg geen functies niet in plan toe. Wanneer iets onverwachts wordt aangetroffen — bestand dat niet bestaat, typconflict, ontbrekende afhankelijkheid — stop, documenteer de blokkade en keer terug naar Plan-modus om op te lossen.

**Verboten in deze fase:** Stappen overslaan, bereik toevoegen, ontwerpbeslissingen niet door plan afgedekt nemen.

**Blokkadeprotocol:** Wanneer geblokkeerd, uitvoer:

```
GEBLOKKEERD bij stap N: [beschrijving van probleem]
Terugkeer naar PLAN-modus om op te lossen.
```

Werk dan plan bij om blokkade aan te pakken en hervat Uitvoeren.

**Uitvoer:** Werkende implementatie met elke planstap afgevinkt.

---

### 5. Beoordeling

**Modus-verklaring:** "Ik ben in REVIEW-modus."

**Wat gebeurt:** Vergelijk implementatie met origineel plan lijn voor lijn. Identificeer alle afwijkingen (toevoegingen, weglating of vervangingen). Verifieer elk acceptatiecriterium uit Planfase wordt opgeleverd. Documenteer bevindingen.

**Uitvoer:** Beoordelingsrapport.

```
Beoordelingsrapport:
- Voltooide stappen: [N/N]
- Afwijkingen: [zet op lijst of "geen"]
- Vereisten opgeleverd: [ja / gedeeltelijk — details]
- Vervolgzaken: [zet op lijst of "geen"]
```

---

## Regels

1. Sla fases nooit over. Sequence is altijd Onderzoek → Innoveren → Plan → Uitvoeren → Beoordelen.
2. Verklaar modus expliciet aan begin van fase-antwoord.
3. In Uitvoeren: doen alleen wat plan zegt. Onverwachte bevindingen keren terug naar Plan, niet Innoveren of Onderzoeken.
4. Elke fase produceert concreet artefact voor volgende start.
5. Goedkeuring tussen Plan en Uitvoeren vereist — expliciete gebruikershandtekening of herzieningsagent.

---

## Voorbeeld

```
Gebruiker: Gebruik RIPER om rate limiting tot API toe te voegen.

Claude: Ik ben in RESEARCH-modus.
[leest middleware-stack, bestaande routes, requestpipeline...]
Context samenvatting: Geen rate-limiting middleware aanwezig. express-rate-limit al in package.json, ongebruikt. Onbekend: per-route-limits vs globaal. Vraag: Moeten limits globaal of per-route zijn?

Gebruiker: Per-route, 100 req/min voor openbare endpoints, 1000 voor geverifieerd.

Claude: Ik ben in INNOVATE-modus.
[zet benaderingen op lijst: middleware factory, decorator pattern, config-driven...]

Gebruiker: Gebruik middleware factory-benadering.

Claude: Ik ben in PLAN-modus.
[produceert genummerde checklist van 6 stappen...]

Gebruiker: Goedgekeurd.

Claude: Ik ben in EXECUTE-modus.
[implementeert stap voor stap, vinkje af...]

Claude: Ik ben in REVIEW-modus.
[vergelijkt met plan, bevestigt 6/6 stappen voltooid, geen afwijkingen, vereisten opgeleverd]
```

---
