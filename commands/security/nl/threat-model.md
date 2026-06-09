---
description: Produceer een STRIDE-dreigingsmodel voor een systeemonderdeel of de volledige applicatie
argument-hint: "[component, feature, or diagram description]"
---
Produceer een STRIDE-dreigingsmodel voor `$ARGUMENTS`. Indien geen argument wordt gegeven, model dan de volledige applicatie op basis van de codebase, README, en alle architectuurdocumentatie in de repo.

**Stap 1 — Begrijp het systeem**

Beantwoord voor het modelleren deze vragen aan de hand van de code en documentatie:
- Wat zijn de toegangspunten? (HTTP-eindpunten, berichtenwachtrijen, bestandsinname, CLI)
- Welke gegevensopslagplaatsen worden gebruikt en wat bevatten ze?
- Welke externe services roept het systeem aan?
- Wat zijn de vertrouwensgrenzen? (internetgericht vs intern, gebruiker vs beheerder vs service-to-service)
- Wat zijn de gevoeligste gegevens die het systeem verwerkt?

Produceer een korte samenvatting van de gegevensstroom: actoren → toegangspunten → verwerking → gegevensopslagplaatsen → externe services.

**Stap 2 — Pas STRIDE toe**

Voor elk geïdentificeerd onderdeel of gegevensstroom beoordeelt u elke bedreigingscategorie:

| Bedreiging | Vraag om te stellen |
|---|---|
| **Spoofing** | Kan een aanvaller zich voordoen als een gebruiker, service of onderdeel? |
| **Tampering** | Kunnen gegevens tijdens overdracht of in rust worden gewijzigd zonder detectie? |
| **Repudiation** | Kan een actor ontkennen een actie uit te voeren vanwege ontbrekende logboeken of zwakke toewijzing? |
| **Information Disclosure** | Kunnen gevoelige gegevens lekken via fouten, logboeken, zijkanalen of te brede API-reacties? |
| **Denial of Service** | Kan een aanvaller resources uitputten (CPU, geheugen, verbindingen, snelheidslimieten)? |
| **Elevation of Privilege** | Kan een actor met lager vertrouwen capaciteiten verkrijgen die zijn gereserveerd voor actoren met hoger vertrouwen? |

**Stap 3 — Beoordeel elke bedreiging**

Gebruik DREAD-lite-scoring voor elke bevinding:
- **Damage**: 1–3 (laag / gemiddeld / hoog effect bij exploitatie)
- **Reproducibility**: 1–3 (moeilijk / soms / altijd reproduceerbaar)
- **Exploitability**: 1–3 (expert / matig / ongeschoolde aanvaller)
- Score = som (max 9). ≥7 = Kritiek, 5–6 = Hoog, 3–4 = Gemiddeld, ≤2 = Laag

**Stap 4 — Uitvoer**

```
## Threat Model: [Component/System]

### System Overview
[Data flow summary from Step 1]

### Threats

#### [STRIDE category] — [Threat title]
Component: [entry point, data flow, or store]
Description: what the attacker does and achieves
DREAD score: D=N R=N E=N → Total=N (Severity)
Mitigations:
  - [current control, if any]
  - [recommended control]

### Risk Summary Table
| # | Threat | Severity | Mitigated? |
```

**Stap 5 — Geprioriteerde aanbevelingen**

Geef de top 5 risicobeperkingen op score, met specifieke implementatierichtlijnen voor deze codebase.
