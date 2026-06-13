---
name: deal-velocity-analyzer
description: Analyseert vooruitgang van deals per fase, cycli-tijd trends, bottleneck-identificatie en win/loss-patronen per fase. Benchmarkt tegen historische baselines en industrienormen.
allowed-tools: Read, Write
effort: medium
---

## Wanneer activeren

Wekelijks of maandelijks, of op aanvraag om cycli-tijd vertragingen onderzoeken. Vereist dealgeschiedenis met fase-wijzigingstijdstempels.

## Wanneer NIET gebruiken

Niet voor individuele deal-coaching (gebruik deal-risk-analyzer). Niet voor forecast-nauwkeurigheid (gebruik forecast-builder). Niet voor vertegenwoordigersprestaties (gebruik quota-tracker).

## Cycli-Tijd Analyseraamwerk

**Gemiddelde tijd-in-fase** = (Vandaag - laatste fase-invoerdatum) voor alle deals in fase, gemiddeld.

**Benchmarking:**
- Enterprise: Onderhandeling 45+ dagen verwacht; Voorstel 30–45 dagen.
- Mid-Market: Onderhandeling 20–30 dagen; Voorstel 15–25 dagen.
- Commercial: Onderhandeling 10–15 dagen; Voorstel 5–10 dagen.

**Bottleneck-identificatie:**
- Elke fase waar gemiddelde tijd >30% boven benchmark = bottleneck.
- Analyseer: ontbrekende stakeholder-goedkeuring, technische evaluatie, juridische beoordeling, budgetbevestiging.

## Uitvoersjabloon