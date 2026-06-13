# /analyze-pipeline

**Trigger:** Wekelijks uitvoeren (elke maandag) vóór leiderschapsbijeenkomst, of op aanvraag voor pipelinezichtbaarheid.

**Doel:** Geneer een real-time snapshot van pipelinegezondheidsstatus: aantaldeals per fase, gemiddelde ouderdom per fase, prognosegezondheidsstatus, conversietarief per fase en identificatie van atrisicolopende deals.

**Wat het doet:**
1. Haalt huidige CRM-export op (Salesforce, HubSpot of Pipedrive)
2. Valideert gegevensfreshheid (waarschuwt indien >24 uur oud)
3. Segmenteert deals per fase, tier (Enterprise/Mid/Commercial) en vertegenwoordiger
4. Berekent belangrijkste indicatoren: pipelinewaarde, fase-ouderdom, conversietarieven, prognoseaccuraatheid
5. Identificeert atrisicoddeals (>30 dagen in fase, <50% waarschijnlijkheid)
6. Genereert samenvattingsdashboard: toprisico's, quotumsnelheid, aanbevolen maatregelen
7. Slaat rapport op in `reports/pipeline-snapshot-{YYYY-MM-DD}.md`
8. Logt samenvatting in `session-log.md`

**Invoer:** CRM-verbinding (vereist API-gegevens of exportbestand)

**Uitvoer:** `reports/pipeline-snapshot-{date}.md` — Volledig gezondheidrapport met indicatoren, atrisicoddeals, conversietrends en acties

**Eigenaar:** Sales Ops Lead | **Frequentie:** Wekelijks + op aanvraag

**Voorbeeld:**

```bash
/analyze-pipeline