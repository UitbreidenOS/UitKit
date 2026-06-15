# Multi-Agent-systemen: Productieberaadheid Checklist

Uitgebreide checklist om ervoor te zorgen dat een multi-agent-systeem produktiebereid is — beheerstoelichting, betrouwbaarheid, kostenbeheersing en incidentrespons.

---

## Checklist vóór Implementatie

### Architectuur

- [ ] Agenten hebben niet-overlappende rollen (geen domeinoverlapping)
- [ ] Gereedschapstoegang volgt het beginsel van minste bevoegdheid (elke agent heeft alleen benodigde gereedschappen)
- [ ] Orkestratietopologie is gedocumenteerd (DAG, blackboard, supervisor, enz.)
- [ ] Circulaire afhankelijkheden worden opgespoord en afgewezen
- [ ] Timeout- en herondernemingsbeleid gedefinieerd voor alle agenten
- [ ] Foutenherstellingstrategie gedefinieerd (opnieuw proberen, escaleren, compenseren)

### Tests

- [ ] Eenheidstests voor elke agent (gemockt gereedschap)
- [ ] Integratietests voor agent-handoffs (met echte inter-agentcommunicatie)
- [ ] End-to-end tests voor volledige workflows (50+ testgevallen)
- [ ] Chaosten: agent-fouten, netwerkvertragingen, timeouts injecteren
- [ ] Loadtests: prestaties met gelijktijdige aanvragen verifiëren
- [ ] Kostensimulatie: tokens/kosten voor typische workflows schatten

### Toestandsbeheer

- [ ] Blackboard-schema is gedefinieerd en gevalideerd
- [ ] Mechanisme voor toestandspersistentie (bestand, DB) getest
- [ ] Versiebeheer en conflictresolutie getest
- [ ] Vergrendelmechanisme voorkomt gelijktijdig schrijven
- [ ] Herstel van gedeeltelijke fouten getest

### Observeerbaarheid

- [ ] Tracecorrelatie-ID verspreid over alle agentaanroepen
- [ ] Logregistratie dekt alle kritieke paden (succes, opnieuw proberen, fout, escalatie)
- [ ] Metriek verzameld voor latentie, tokens, kosten
- [ ] Agentaanroeptelemetrie geëxporteerd (Datadog, Prometheus, enz.)
- [ ] Bemonsteringstrategie gedefinieerd (100% tracering of sample?)

### Betrouwbaarheid

- [ ] Timeouts ingesteld voor alle agentaanroepen (met monitoringwaarschuwingen)
- [ ] Herundernemingslogica met exponentiële backoff (max 3 pogingen)
- [ ] Dead-letter-wachtrij voor onherstelbare fouten
- [ ] SLO gedefinieerd voor beschikbaarheid en latentie
- [ ] Foutbudget berekend en gemonitord
- [ ] Escalatietrajecten gedefinieerd (e-mail, Slack, PagerDuty)

### Kostenbeheersing

- [ ] Tokenbudget gedefinieerd per agent en totaal
- [ ] Kostwaarschuwingen ingesteld (waarschuw als > 80% budget, fout als > 100%)
- [ ] Modelkeuze geoptimaliseerd (gebruik Haiku waar mogelijk, Opus alleen nodig)
- [ ] Cachestrategie gedefinieerd (hergebruik resultaten voor dezelfde invoer)
- [ ] Invoertokenisatie-audit (geef geen onnodig context door)

### Documentatie

- [ ] README verklaart orkestratieflow met diagram
- [ ] Agentserrollen gedocumenteerd (doel, domein, gereedschap, SLA)
- [ ] Gids voor probleemoplossing bij veelvoorkomende fouten
- [ ] Runbook voor incidentrespons en escalatie
- [ ] Handleiding voor ontwikkelaars voor het toevoegen van nieuwe agenten of workflows

---

## Monitoring en Waarschuwingen

### Belangrijkste Metriek

**Beschikbaarheid:**
```
success_rate = (successful_runs / total_runs) × 100%
Doel: 99.5% (foutbudget 0.5%)
Waarschuwingsdrempel: < 95%
```

**Latentie:**
```
p50_latency_ms = 50e percentiel van uitvoeringsduur
p99_latency_ms = 99e percentiel van uitvoeringsduur
Doel: p99 < 5 minuten
Waarschuwingsdrempel: p99 > 4 minuten
```

**Kosten:**
```
cost_per_run_cents = total_tokens × cost_per_token
Doel: < $1.00 per uitvoering
Waarschuwingsdrempel: > $0.80 per uitvoering
```

**Agentspecifiek:**
```
Voor elke agent :
├─ call_count (totaal gemaakte oproepen)
├─ success_rate (% succesvol)
├─ avg_latency_ms
├─ p99_latency_ms
├─ avg_tokens
└─ cost_cents
```

### Waarschuwingsregels

```json
{
  "alerts": [
    {
      "name": "success_rate_low",
      "condition": "success_rate < 95%",
      "severity": "page",
      "window": "5 minutes"
    },
    {
      "name": "latency_spike",
      "condition": "p99_latency_ms > 4 minutes",
      "severity": "warning",
      "window": "5 minutes"
    },
    {
      "name": "cost_spike",
      "condition": "cost_per_run_cents > 80",
      "severity": "warning",
      "window": "1 hour"
    },
    {
      "name": "agent_timeout",
      "condition": "agent.latency_ms > timeout_ms × 0.9",
      "severity": "warning",
      "window": "5 minutes"
    },
    {
      "name": "error_budget_depleted",
      "condition": "error_budget_remaining < 0.1%",
      "severity": "critical",
      "window": "1 day"
    }
  ]
}
```

---

## Incidentrespons

### Definities Ernstniveaus Incident

**SEV1 : Volledige Storing**
- Succespercentage < 90% OF latentie > 10 minuten
- Impact: Gebruikers kunnen workflows niet voltooien
- Reactietijd: < 5 minuten
- Escalatie: Alert alle engineers in dienst

**SEV2 : Significante Degradatie**
- Succespercentage 90-95% OF latentie > 5 minuten
- Impact: Sommige gebruikers getroffen, gedeeltelijke functionaliteit
- Reactietijd: < 15 minuten
- Escalatie: Alert engineer in dienst

**SEV3 : Kleine Problemen**
- Succespercentage > 95% EN latentie < 5 minuten
- Kostenpiek (> 50% boven basislijn)
- Impact: Gering, oplossing beschikbaar
- Reactietijd: < 1 uur
- Escalatie: Log naar Slack, handelen tijdens kantooruren

### Runbook: SEV1-respons

```
1. INCIDENT DECLAREREN (1 min)
   └─ Alert engineer in dienst
   └─ Maak #incidents thread
   └─ Wijs incidentcommandant (IC) toe

2. IMPACT BEOORDELEN (5 min)
   └─ Welke workflows mislukken? (% getroffen)
   └─ Welke agenten mislukken?
   └─ Hoe lang gebeurt dit al?
   └─ Omzetimpact?

3. ONDERZOEKEN (5-15 min)
   ├─ Controleer agentenlogs (recente oproepen)
   ├─ Controleer blackboard-status (coherent?)
   ├─ Controleer infrastructuur (beschikbaarheid, latentie)
   ├─ Controleer afhankelijkheden (API's die we aanroepen)
   └─ Controleer modelinbeschikbaarheid (is Anthropic API beschikbaar?)

4. MITIGEREN (5-30 min, kies snelste)
   ├─ Optie A: Functievlag uitschakelen (instant)
   ├─ Optie B: Agent terugrollen (terugdraaien van main)
   ├─ Optie C: Resources opschalen (capaciteitsprobleem)
   └─ Optie D: Hotfix (eenvoudige codefactor)

5. HERSTEL VERIFIËREN (5 min)
   ├─ Metriek 30 minuten monitoren
   ├─ Wanneer success_rate > 99%, herstel verklaren
   └─ Indien nog steeds fout, terug naar ONDERZOEKEN

6. COMMUNICEREN
   ├─ Interne updates elke 30 minuten
   └─ Statuspage-update voor klanten
```

### Veelvoorkomende Oorzaken en Fixes

**Agent-timeout (enkele agent traag) :**
```
Hoofdoorzaak: Systeemsuggestie te uitgebreid, of model traag
Fix:
  1. Model/temperatuurinstellingen controleren
  2. Systeemsuggestie afkorten (uitgebreide preambule verwijderen)
  3. Invoergrootte verminderen (minder contexttokens)
  4. Timeoutdrempel verlagen en snel mislukken
```

**Toestandsinconsistentie (blackboard verruind) :**
```
Hoofdoorzaak: Gelijktijdig schrijfconflict niet gedetecteerd
Fix:
  1. Lees laatste consistente blackboard-snapshot
  2. Terugrollen naar bekende goede versie
  3. Hangende taken vanaf snapshot afspelen
  4. Onderzoek conflictdetectielogica
```

**Kostenpiek (tokens overschreden budget) :**
```
Hoofdoorzaak: Langere invoeren, herondernemingsstormen of modelwijziging
Fix:
  1. Invoergroottenlimiet toevoegen (contextafknippen)
  2. Tokenbudgettoepassing toevoegen (snel mislukken als > 80%)
  3. Naar goedkoper model schakelen (Haiku in plaats van Opus)
  4. Cache implementeren (resultaten voor dezelfde invoer hergebruiken)
```

**Orkestratiedeadlock (agenten wachten voor altijd) :**
```
Hoofdoorzaak: Circulaire afhankelijkheid of agent schreidt niet voort
Fix:
  1. DAG-orkestratiegrafiek controleren op cycli
  2. Agentenlogs controleren (is het geblokkeerd of gewoon traag?)
  3. Timeout afdwingen en escaleren
  4. Afhankelijkheidsgrafiek beoordelen en cycli verwijderen
```

---

## Implementatiestrategie

### Canary-Implementatie

```
Fase 1: Implementeren naar canary (5% verkeer)
├─ Succespercentage, latentie, kosten monitoren
├─ Doel: 1 uur
└─ Als metriek stabiel → ga naar fase 2

Fase 2: Implementeren naar 25% verkeer
├─ 1 uur monitoren
└─ Als metriek stabiel → ga naar fase 3

Fase 3: Implementeren naar 100% verkeer
├─ 4 uur monitoren
└─ Als metriek stabiel → markeer als GA
```

### Terugdraalplan

```
Als metriek degraderen tijdens canary:
├─ Terugrollen naar vorige agentversie
├─ Terugrollen naar vorige orkestratieconfiguratie
└─ Indien terugrollen succesvol, verklaar veilig

Behoud laatste 5 agentversies in productie (terugdraalklaar).
```

---

## Kostenoptimalisatie

### Modelkeuze per Agent

| Agenttype | Doel | Aanbevolen Model | Reden |
|-----------|---------|-------------------|--------|
| Classificeerder | Invoer etiketteren of categoriseren | Haiku | Snel, goedkoop, laag redeneren |
| Samenvatter | Tekst condenseren | Sonnet | Snelheid/kwaliteit evenwichtig |
| Redeneraar | Complexe analyse | Opus | Redenering, synthese |
| Terugvinder | Zoeken/opzoeken | Haiku | Laag redeneren |

### Token-Reductiestrategieën

1. **Contextafknippen:** Geef alleen laatste N tokens (geen volledige geschiedenis)
2. **Samenvatting geschiedenis:** In plaats van volledige context, geef samenvatting + laatste 3 beurten
3. **Cacheresultaten:** Agent-output voor identieke invoer hergebruiken
4. **Batchverwerking:** Meerdere aanvragen samen verwerken (overhead afschrijven)

### Voorbeeld: Kostenoptimalisatie

```
Voor:
├─ Gemiddelde tokens per uitvoering: 12.000
├─ Kosten per uitvoering: $1.20
├─ Kosten voor 10.000 uitvoeringen/maand: $12.000

Optimalisaties:
├─ Wissel onderzoeker Opus naar Sonnet: -30% tokens
├─ Cache implementeren (80% cache hitpercentage): -80% oproepen
├─ Context afkappen tot max 500 tokens: -50% tokens

Na:
├─ Gemiddelde tokens per uitvoering: 2.400 (80% bespaard op 80% van oproepen)
├─ Kosten per uitvoering: $0.24
├─ Kosten voor 10.000 uitvoeringen/maand: $2.400
└─ Besparingen: $9.600/maand (80% kostenbesparing)
```

---

## Compliance en Bestuur

### Auditregistratie

Alle agent-beslissingen en toestandsmutaties moeten worden geregistreerd:

```json
{
  "timestamp": "2026-06-15T14:20:00Z",
  "request_id": "req_abc123",
  "agent": "decision_agent",
  "action": "approve_order",
  "input": {"order_id": "o_789", "amount": 299.99},
  "output": {"approved": true, "reason": "..."},
  "model": "claude-opus-4-20250514",
  "tokens_used": 450,
  "cost_cents": 12
}
```

Locatie: `.claude/audit-log.jsonl` (alleen bijvoeging, manipulatiebewijs-hashing).

### Gegevensprivacy

- [ ] Agentensugesties bevatten geen PII zonder maskering
- [ ] Agentoutput lekt geen gebruikersgegevens
- [ ] Gespreksgeschiedenis versleuteld in rust
- [ ] Toegangslogs voor wie wat wanneer ondervroeg
- [ ] Retentiebeleid (oude traces na 90 dagen verwijderen)

### Beveiligingsbeperkingen

- [ ] Agentuitvoer gevalideerd tegen beveiligingsguardrails
- [ ] Gevaarlijke acties (verwijderen, wijzigen) vereisen uitdrukkelijke toestemming
- [ ] Jailbreak-pogingen gedetecteerd en geregistreerd
- [ ] Snelheidsbeperkingen voorkomen misbruik (max N aanvragen per gebruiker per uur)

---

## Langdurige Operaties

### Voortdurende Verbetering

1. **Wekelijkse beoordelingen:**
   - Foutpercentage, latentie-, kostentrendten controleren
   - Controleer top 10 fouten en storingen
   - Plan optimalisaties voor volgende week

2. **Maandelijkse beoordelingen:**
   - Analyze foutbudgetbrandsnelheid
   - Controleer agentprestaties (welke agent draagt het meest bij aan latentie/kosten?)
   - Plan architectuurverbeteringen

3. **Driemaandelijkse beoordelingen:**
   - Vergelijk metriek met SLO-doelstellingen
   - Plan modelupgrades (nieuwe Claude-versies)
   - Nieuwe agenten of workflows evalueren

### Runbook-updates

Na elk SEV1- of SEV2-incident:
1. Documenter rootcause in RCA
2. Update runbook met preventie-/herstelbewerkingen
3. Team trainen op nieuwe procedures
4. Regressie-testgeval toevoegen

---
