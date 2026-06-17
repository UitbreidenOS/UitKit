---
name: forecast-builder
description: Genereert 13-maands voortschrijdende prognose met drie scenario's (best-case, commit, upside). Volgt variatieontwikkeling, voert historische conversiepercentages in en geeft vertrouwensgaten aan.
allowed-tools: Read, Write
effort: high
---

## Wanneer activeren

Wekelijks voor leadershipbijeenkomst, of maandelijks voor boardupdates. Vereist huidige pipelineschot en historische sluitingspercentages per fase en vertegenwoordiger.

## Wanneer NIET gebruiken

Niet voor jaarlijkse strategische planning (gebruik jaarlijks begroten). Niet voor individuele dealcoaching. Niet zonder pipelinegegevensvernieuwing binnen 24 uur.

## Prognosemethodologie

**Drie scenario's:**
- **Commit (60% vertrouwen):** Conservatieve prognose; alleen deals met >50% waarschijnlijkheid. Som = verwachte sluitingswaarde.
- **Best-Case (90% vertrouwen):** Alle deals >30% waarschijnlijkheid. Bovengrens voor upside.
- **Upside:** Alles >10% waarschijnlijkheid. Stretchscenario voor beste uitvoering.

**Formule per scenario:**
- Voor elke openstaande deal: geschatte waarde × sluitingskans (per scenariokdrempel) = gewogen waarde
- Som alle deals per fase en vertegenwoordiger
- Vergelijk met maandelijks doel; bereken variantie

**Trend:**
- Vergelijk huidige prognose vs. vorige week (snelheid)
- Vergelijk vs. YTD-prognose (nauwkeurigheid)
- Bereken variantiepercentage: (Commit-prognose - Vorige maand werkelijke sluiting) / Vorige maand werkelijk × 100

## Uitvoerindeling