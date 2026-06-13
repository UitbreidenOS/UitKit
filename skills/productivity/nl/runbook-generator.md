---
name: runbook-generator
description: "Generate runbooks for incidents, deployments, and operational tasks — step-by-step procedures with decision trees, rollback steps, and escalation paths"
---

# Vaardigheid Runbook Generator

## Wanneer activeren
- Het maken van een runbook voor een terugkerende operationele taak
- Documentatie van incident response procedures voordat een incident optreedt
- Schrijven van een deployment runbook voor een complexe release
- Opbouw van een on-call handboek voor nieuwe engineers
- Omzetting van informele tribale kennis in gedocumenteerde procedures

## Wanneer NIET gebruiken
- Eenmalige taken — alleen de moeite waard om te documenteren als het opnieuw gebeurt
- Exploratief debuggen — runbooks zijn voor bekende faalpatronen
- Platform-specifieke runbooks (AWS Console stappen) — verifiëren tegen huidige UI

## Instructies

### Incident response runbook

```
Genereer een incident response runbook voor [faalpatroon].

Faalpatroon: [wat breekt — bv: « databaseverbindingspool uitgeput », « betalingsservice timeout », « schijf vol »]
Beïnvloede service: [welke service/systeem]
Symptomen (wat on-call ziet): [alerts geactiveerd / gebruikersrapporten / dashboards]
Ernst: [P1 kritiek / P2 groot / P3 klein]

Runbook-structuur:
1. Samenvatting: wat dit runbook in 1-2 zinnen dekt
2. Symptomen: exacte alert-namen + wat gebruikers ervaren
3. Initiële triage (< 5 minuten):
   - Gebeurt dit werkelijk? (verifiëren)
   - Hoe groot is de schade? (hoeveel gebruikers getroffen)
   - Is dit een nieuwe deployment? (rollback overwegen)
4. Onderzoeksstappen (geordend, met verwachte uitvoer):
   - Stap 1: [commando/controle → wat u verwacht te zien]
   - Stap 2: [commando/controle → beslissispunt]
5. Mitigatieopsies (snelste tot langzaamste):
   - Optie A: [snelle oplossing, tijdelijk]
   - Optie B: [gemiddelde oplossing]
   - Optie C: [juiste oplossing, vereist deployment]
6. Rollback-procedure (indien veroorzaakt door deployment):
   - [exacte stappen]
7. Na het incident: [wat controleren voordat sluiten]
8. Escalatie: [wanneer wie bellen]
```

### Deployment runbook

```
Genereer een deployment runbook voor [service/functie].

Service: [naam]
Deploymenttype: [rolling / blue-green / canary / all-at-once]
Risiconiveau: [laag / gemiddeld / hoog]
Afhankelijkheden: [services die vóór/na moeten worden bijgewerkt]
Database migraties: [ja/nee — beschrijf indien ja]

Runbook-structuur:
1. Pre-deployment checklist (30-60 min daarvoor):
   □ Alle tests slagen in CI?
   □ Migratie getest op staging?
   □ Rollback-plan gedocumenteerd?
   □ Team bericht (indien hoog risico)?
   □ Monitoring dashboards open?

2. Deployment stappen (exacte commando's of UI-stappen):
   Stap 1: [actie] → Verwachte output: [X]
   Stap 2: [actie] → Verifiëren: [controle Y]
   
3. Validatie (onmiddellijk na deployment):
   □ Health endpoint retourneert 200?
   □ Foutpercentage in normaal bereik?
   □ Belangrijkste gebruikersflows werken? (smoke test)
   □ Database migratie schoon voltooid?

4. Rollback procedure (als iets misgaat):
   Stap 1: [exact rollback commando]
   Stap 2: [database rollback indien nodig]
   Beslissispunt: rollback vs. hotfix?

5. Post-deployment (1 uur later):
   □ Foutpercentages stabiel?
   □ Performance metriek normaal?
   □ Sluit deployment issue/ticket
```

### Operationele taak runbook

```
Genereer een runbook voor deze terugkerende operationele taak.

Taak: [beschrijf — bv: « maandelijkse databaseback-up verificatie », « SSL-certificaat vernieuwing », « driemaandelijkse toegangscontrole »]
Frequentie: [dagelijks / wekelijks / maandelijks / driemaandelijks / ad-hoc]
Wie voert uit: [rol — elke engineer / senior engineer / DBA / devops]
Geschatte tijd: [X minuten]

Secties:
1. Doel: waarom deze taak bestaat, wat breekt als het wordt overgeslagen
2. Vereisten: vereiste toegang/machtigingen, benodigde tools
3. Stappen: genummerd, met exacte commando's en verwachte uitvoer
4. Verificatie: hoe taakvoltooing bevestigen
5. Foutafhandeling: wat doen als een stap mislukt
6. Documentatie: waar voltooing registreren (ticket / spreadsheet / runbook tool)

Maak het uitvoerbaar voor iemand die het systeem niet kent.
```

### On-call handleidingssectie

```
Schrijf een on-call handleidingssectie voor [team/service].

Publiek: engineer die voor het eerst on-call gaat
Service context: [beschrijf wat de service doet en wie het gebruikt]

Dekt af:
1. Waarvoor je verantwoordelijk bent (en waarvoor NIET)
2. Hoe een alert in de eerste 5 minuten triage
3. Communicatieverwachtingen (wanneer incident channel bijwerken, wie betrekken)
4. Escalatiematrix: [rol] → [contact] → [wanneer escaleren]
5. De 3 meest voorkomende alerts en wat voor elk doen
6. Tools die u nodig hebt: [lijst met links]
7. Wat doen na incident sluiting (post-mortem trigger, ticket opschoning)
8. Overlevingstips (van het team dat dit schreef)
```

## Voorbeeld

**Gebruiker:** Genereer een runbook voor « hoog geheugengebruik »-alert op onze Node.js API.

**Claude genereert:**

---
**RUNBOOK: Hoog geheugengebruik — Node.js API**
*Ernst: P2 (P1 als OOMKilled)*

**Symptomen:**
- Alert: `api_memory_usage_percent > 85` voor > 10 minuten
- Gebruikerseffect: potentiële vertraging of herstarts als geheugen limiet bereikt

**Triage (eerste 5 minuten):**
1. `kubectl top pods -n production | grep api` → Beïnvloedt dit één pod of alle pods?
2. `kubectl logs [beïnvloede-pod] --tail=200 | grep -i "memory\|heap\|gc"` → Iets GC logs?
3. Deployment historie controleren: `kubectl rollout history deployment/api` → Begon dit na een deployment?

**Als enkel pod:**
```bash
kubectl delete pod [beïnvloede-pod]  # pod herstart met vers geheugen
```
Monitor: klimt geheugen binnen 30 min opnieuw? → waarschijnlijk geheugenlek, escaleren.

**Als alle pods (systemisch):**
- Controleer op recente traffic spike: kijk naar RPS op dashboard
- Indien traffic spike: schaal op `kubectl scale deployment api --replicas=X`
- Indien geen traffic spike: dit is een geheugenlek, pagina senior engineer

**Rollback trigger:** Als geheugenprobleem na vandaags deployment begon:
```bash
kubectl rollout undo deployment/api
```

**Escalatie:** Indien geheugen > 90% na herstart EN geen deployment → pagina on-call senior engineer.

---
