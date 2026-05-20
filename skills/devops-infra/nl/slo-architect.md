---
name: slo-architect
description: "SLO-ontwerp: SLI's definiëren, betrouwbaarheidsdoelstellingen instellen, error budgetten berekenen, waarschuwingsrichtlijnen ontwerpen, runbooks bouwen — Google SRE-methodologie"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../slo-architect.md).

# SLO-Architect-vaardigheid

## Wanneer activeren
- Definitie van Service Level Objectives (SLO's) voor een service
- Berekening van error budgetten en instelling van burn rate alerts
- Overgang van reactief "is het online?" monitoring naar proactief SLO-gebaseerd alerting
- Schrijven van SLA's voor klanten op basis van interne SLO's
- Opbouwen van een betrouwbaarheidscultuur van nul af aan

## Wanneer NIET gebruiken
- Specifieke monitoring-tool-configuratie (gebruik tool-documentatie voor Prometheus/Datadog-syntax)
- Incident response procedures — gebruik de runbook-vaardigheid
- Puur uptime monitoring — Uptime Robot is eenvoudiger voor basiscontroles

## Instructies

### Definieer SLI's (Service Level Indicators)

```
Definieer SLI's voor deze service.

Service: [beschrijf — API / web app / data pipeline / betalingsverwerker]
Gebruikers: [wie hangt af van deze service?]
Wat "werkt" voor gebruikers betekent: [hun ervaring als alles goed werkt]

Gangbare SLI-types:
1. Beschikbaarheid: % van de tijd dat de service bereikbaar is
   Meting: geslaagde aanvragen / totale aanvragen
   
2. Latentie: hoe snel reacties komen
   Meting: % aanvragen die onder drempelniveau voltooien (bijv. p99 < 200ms)
   
3. Foutfrequentie: % mislukte aanvragen
   Meting: foutreacties / totaalreacties
   
4. Doorvoer: capaciteit om belasting af te handelen
   Meting: aanvragen per seconde verwerkt
   
5. Gegevensfrisheid: hoe verouderd zijn de gegevens?
   Meting: % query's die gegevens terugbrengen < X minuten oud
   
6. Juistheid: zijn resultaten correct?
   Meting: % outputs die overeenkomen met verwacht (vereist synthetische testing)

Voor mijn service: definieer 2-4 SLI's met exacte meetformules.
```

### Stel SLO-doelstellingen in

```
Help mij passende SLO-doelstellingen in te stellen.

Service kritikaliteit: [kritiek / belangrijk / alleen intern]
Huidige betrouwbaarheidsbasislijn: [uptime / foutfrequentie afgelopen 90 dagen]
Bedrijfsimpact van downtime: [beschrijf — omzetverlies / klantimpact]
Team volwassenheid: [geen SRE / klein SRE-team / ervaren SRE]

SLO-doelstellingsgids:
- 99% (2 negen): ~7,3 uur downtime/maand — OK voor interne tools
- 99,5%: ~3,6 uur downtime/maand — typisch B2B SaaS
- 99,9% (3 negen): ~43 minuten downtime/maand — standaard voor klantgericht
- 99,95%: ~21 minuten — hoge betrouwbaarheidsverwachting
- 99,99% (4 negen): ~4,3 minuten — betalingen, gezondheidszorg, kritieke infrastructuur

Regel: SLO moet haalbaar maar betekenisvol zijn. Stel nooit 100% in — het is onhaalbaar en creëert verkeerde prikkels.

Voor mijn service: welk SLO-doel is passend en waarom?
```

### Bereken error budget

```
Bereken error budget voor deze SLO's.

SLO 1: [metriek] = [X]% over [28 dagen / kalendermaand / rolling]
SLO 2: [metriek] = [X]%

Error budget = 1 - SLO doel
Voor 28-daags venster:
- 99,9% SLO → 0,1% error budget = 40,3 minuten downtime toegestaan
- 99,5% SLO → 0,5% error budget = 3,36 uur toegestaan

Huideig error budget verbruik:
- Hoeveel budget hebben we tot dusver in deze periode gebruikt? [%]
- Hoeveel dagen blijven in de periode?
- Zijn we op koers om binnen budget te blijven?

Als over budget: wat moeten we stoppen (nieuwe feature launches) tot budget herstelt?
Als onder budget: welk risico kunnen we nemen (geplanned onderhoud, experimenten)?
```

### Waarschuwingsontwerp (Burn Rate Alerts)

```
Ontwerp burn rate alerts voor dit SLO.

SLO: [X]% beschikbaarheid over 28 dagen
Error budget: [berekend hierboven]

Waarschuwingsstrategie (Google SRE handboek):
1. Snelle brand (kritiek): budget 14x sneller verbruikt dan normaal
   → Activeert in: 1 uur aanhoudende brand
   → Alert: onmiddellijk pagen, zal budget in ~2 dagen uitputten
   
2. Trage brand (waarschuwing): budget 6x sneller verbruikt dan normaal  
   → Activeert in: 6 uur aanhoudende brand
   → Alert: ticket, beoordeel bij volgende standup, geen oproep
   
3. Budget bij X%: absolute drempel alert
   → Wanneer 50% budget in eerste 14 dagen wordt gebruikt
   → Alert: "op koers budget uit te putten, controleer snelheid"

Voor mijn SLO, genereer:
- Alertdrempels (actuele getallen, geen X)
- Aletnamen en ernstniveaus
- On-call escalatiebeleid
- Runbook-referentie voor elk alerttype
```

### SLO-dashboardontwerp

```
Ontwerp een SLO-dashboard voor [service].

Sleutelstakeholders die dit bekijken:
- Engineering: moet error budget en burn rate zien
- Product: moet betrouwbaarheidstrends, impact op gebruikers zien
- Leadership: moet algehele gezondheid zien, niets te technisch

Dashboard-secties:
1. Huidge SLO-status: groen/geel/rood voor elk SLO
2. Resterend error budget: gauge chart, % resterend deze periode
3. Burn rate: 1-uur en 6-uur burn rate vs doel
4. Historische trend: 90-daagse SLO-performance
5. Incidentcorrelatie: recente incidenten en hun budgetimpact

Werktuigen: [Grafana / Datadog / Google Cloud Monitoring / New Relic / Honeycomb]
```

## Voorbeeld

**Gebruiker:** Ik heb een REST-API gebruikt door betalende klanten. Geen SLO's momenteel, alleen "is het online?" alerting. Waar begin ik?

**Claude's SLO-starterpakket:**

**Stap 1 — 3 SLI's definiëren:**
- Beschikbaarheid: `succesvolle_aanvragen / totale_aanvragen` (sluit 400s uit, tel 500s + timeouts als fouten)
- Latentie: `p99_response_time < 500ms` als verhouding van alle aanvragen
- Foutfrequentie: `5xx_responses / total_responses`

**Stap 2 — initiale SLO-doelstellingen instellen (voorzichtig):**
- Beschikbaarheid: 99,5% (3,6 uur budget/maand)
- p99 latentie: 99% aanvragen onder 500ms
- Foutfrequentie: < 0,5%

**Stap 3 — één alert om mee te starten:**
Burn rate alert: als beschikbaarheid onder 99,5% valt gedurende 1 uur → on-call engineer pagen.

**Stap 4 — na 90 dagen beoordelen:**
Bekijk werkelijke performance vs SLO. Als je nooit budget hebt gebruikt, kan doel te los zijn. Als je constant over bent, moet doel aangepast of geïnvesteerd worden.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
