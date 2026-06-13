# Claude voor Data-analisten en BI-analisten

Alles wat een data-analist of BI-analist nodig heeft voor AI-ondersteund SQL-werk, dashboard-interpretatie, stakeholderrapportage, datakwaliteitsaudits en ad-hocanalyse in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een data-analist of BI-analist ingebed in een bedrijfs-, product- of marketingteam. Je krijgt 15 ad-hocverzoeken per week, onderhoudt 8 dashboards, schrijft een wekelijks rapport voor leiderschap en bent altijd één schemawijziging verwijderd van een kapotte pipeline. Claude Code wordt je pair programmer voor query's, je editor voor rapporten en je kwaliteitscontroleur voor alles wat je oplevert.

**Voor Claude Code:** 2 uur om een complexe SQL-query van scratch te schrijven. 1 uur om het maandelijkse stakeholderrapport te schrijven vanuit ruwe metrics. 3 uur om een datakwaliteitsprobleem over 10 tabellen te onderzoeken.

**Na:** Complexe query in 15 minuten. Stakeholderrapport in 20 minuten. Datakwaliteitsaudit in 30 minuten inclusief herstel-SQL.

---

## Installatie in 30 seconden

```bash
# Installeer data-analist-skills
npx claudient add skill data-ml/sql
npx claudient add skill data-ml/pandas-polars
npx claudient add skill data-ml/dbt-data-pipelines
npx claudient add skill data-ml/dashboard-narrator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill data-ml/data-quality-checker
npx claudient add skill product/product-analytics
npx claudient add skill marketing/analytics-tracking

# Installeer relevante agents
npx claudient add agent roles/data-pipeline-architect
npx claudient add agent roles/quant-analyst
```

---

## Jouw Claude Code data-stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/sql` | Schrijven, optimaliseren en debuggen van complexe SQL — CTE's, vensterfuncties, queryplannen | Elk SQL-querywerk |
| `/pandas-polars` | Python datamanipulatie — opschonen, transformatie, aggregatie, exports | Ad-hocanalyse in Python |
| `/dbt-data-pipelines` | dbt-modelontwerp, incrementele modellen, tests, documentatie | Pipeline- en transformatiewerk |
| `/dashboard-narrator` | Vertaal dashboarddata naar directieklaar narratief — inzichten, anomalieën, aanbevelingen | Wekelijkse en ad-hocrapportage |
| `/stakeholder-report` | Wekelijks/maandelijks rapport: kernmetrics, oorzaakanalyse, actiepunten | Reguliere rapportagecadansen |
| `/data-quality-checker` | Datakwaliteitsaudit: nullwaarden, duplicaten, uitschieters, schemadrift, herstel-SQL | Elke nieuwe databron of anomalie-onderzoek |
| `/product-analytics` | Trechteranalyse, retentie, cohorten, A/B-testen — productgroei-metrics | Productteamanalyse |
| `/analytics-tracking` | Event tracking-schemaontwerp, tracking-plannen, tagaudits | Tracking-implementatie |

### Agents

| Agent | Model | Wanneer in te schakelen |
|---|---|---|
| `data-pipeline-architect` | Opus | Complex pipeline-ontwerp, architectuurbeslissingen |
| `quant-analyst` | Opus | Statistische analyse, A/B-testmethodologie, forecasting |

---

## Dagelijkse workflow

### Ochtend (15-20 minuten)

**1. Datagelzondheidcheck — verificeer productiedata voor stakeholders vragen**
```
/data-quality-checker

Snelle gezondheidscheck op onze productietabellen voor de werkdag begint.

Voer deze checks uit op de volgende tabellen:
- [tabel_1]: controleer nullwaarden op [kernkolommen], duplicaat [primaire sleutel]
- [tabel_2]: controleer op toekomstige datums in [datumkolom], negatieve waarden in [bedragkolom]

[Plak het rijgetal van gisteren of anomalie als je die hebt]

Markeer alles dat er vreemd uitziet. Genereer SQL-query's die ik kan uitvoeren om te bevestigen.
```

**2. Trieer overdag ad-hocverzoeken**
Kopieer het verzoek naar Claude → krijg een SQL-concept of analyseplan voor je begint te werken.

---

### Ad-hocanalyse (op aanvraag)

**3. Complexe SQL-query — elk verzoek**
```
/sql

Schrijf een SQL-query om deze zakelijke vraag te beantwoorden:
"[Verzoek van stakeholder in hun eigen woorden]"

Ons schema:
- [tabelnaam]: kolommen [lijst], primaire sleutel [kol], relaties met [andere tabellen]
- [tabelnaam]: [zelfde]

Database: [PostgreSQL / BigQuery / Snowflake / Redshift]
Ik heb nodig: [beschrijf de output — tabelformaat, granulariteitsniveau, filters]
```

**4. Trechter- of cohortanalyse**
```
/product-analytics

Bouw een [trechter / cohortretentie / A/B-test] analyse.

Eventstabel: [schema]
Vraag: [wat proberen we te beantwoorden]
Tijdsperiode: [datumbereik]
Segmenteer op: [gebruikerstype / acquisitiekanaal / plantier]

Output: [SQL + interpretatie van resultaten]
```

---

### Rapportage (wekelijkse cadans)

**5. Wekelijks stakeholderrapport**
```
/stakeholder-report

Schrijf het wekelijkse datarapport voor [leiderschap / productteam / marketing].

Week van: [datums]
Metrics deze week:
[Plak je metrics met WoW-wijzigingen en vs-plan]

Kerngebeurtenissen: [productreleases, campagnes, incidenten]
```

**6. Dashboard-narratief — wanneer leiderschap vraagt "wat betekent dit?"**
```
/dashboard-narrator

Vertaal deze dashboarddata naar een 5-minuten-leesrapport voor onze CEO.

Dashboard: [naam]
Periode: [deze maand]
Doelgroep: CEO + directieteam — niet technisch

[Plak je metricwaarden, wijzigingen en context die je kent]
```

---

### Maandelijks diepgaand werk (eerste week van de maand)

**7. Maandrapport**
```
/stakeholder-report

Maandelijks datarapport voor [doelgroep].
Maand: [naam]
[Volledige metriektabel — huidige maand, vorige maand, MoM%, vorig jaar, YoY%, vs plan]
Oorzaak van grootste wijzigingen: [jouw notities]
Acties en eigenaren: [lijst]
```

**8. Datakwaliteitsaudit — maandelijkse productieaudit**
```
/data-quality-checker

Maandelijkse datakwaliteitsaudit over onze [N] productietabellen.

Voor elke tabel:
- [tabel_1]: [rijgetal, primaire sleutel, kernzakelijke kolommen]
- [tabel_2]: [zelfde]

Genereer het Python-auditscript dat ik moet uitvoeren. Nadat ik de resultaten plak, genereer het gezondheidsrapport en herstel-SQL.
```

---

### Lopend (pipelinewerk)

**9. dbt-modelontwerp**
```
/dbt-data-pipelines

Ik moet een dbt-model bouwen voor [zakelijk concept — bijv. wekelijks actieve gebruikers per cohort].

Brontabellen: [lijst met schema's]
Gewenste output: [granulariteit, kolommen, waarvoor het model wordt gebruikt]
Materialisatie: [tabel / incrementeel / view]

Genereer: de model-SQL, schema.yml met tests en documentatie.
```

---

## 30-daags inwerklist (nieuwe data-analist of nieuw stack)

### Week 1 — SQL-meesterschap in je nieuwe schema
- Installeer alle data-skills: `npx claudient add skill data-ml/[naam]`
- Documenteer je kernta tabellen in een CLAUDE.md in je analytics-repo — Claude leest dit voor context
- Gebruik `/sql` om 10 query's te schrijven die veelgestelde zakelijke vragen beantwoorden — bouw je query-bibliotheek
- Voer `/data-quality-checker` uit op je 3 belangrijkste productietabellen — begrijp je baseline datakwaliteitsgezonheid

### Week 2 — Rapportageworkflows
- Gebruik `/dashboard-narrator` om de wekelijkse zakelijke review te schrijven — vergelijk met wat je handmatig had geschreven
- Gebruik `/stakeholder-report` om het maandrapport te schrijven — deel met je manager en krijg feedback
- Identificeer welke stakeholders rapporten daadwerkelijk lezen en kalibreer lengte/formaat dienovereenkomstig

### Week 3 — Pipeline en tracking
- Gebruik `/dbt-data-pipelines` om tests toe te voegen aan niet-geteste modellen in je project
- Gebruik `/analytics-tracking` om je event tracking te auditen — vind gaten voor ze datakwaliteitsproblemen worden
- Stel de dbt-tests in die Claude genereert — krijg geautomatiseerde kwaliteitsmonitoring aan de gang

### Week 4 — Geavanceerde analyse
- Gebruik `/product-analytics` om een volledige trechteranalyse uit te voeren — identificeer de grootste uitval in je product
- Gebruik de `/quant-analyst`-agent voor elke A/B-testanalyse — krijg de methodologie goed voor je resultaten presenteert
- Benchmark je tijd: hoeveel minuten duurt elk veelgesteld verzoek nu vs. voor Claude?

---

## Tool-integraties

### dbt Core / dbt Cloud

```bash
# Claude leest je dbt-projectstructuur
# Wijs Claude naar je models/-directory en het begrijpt je schema
ls models/marts/ models/staging/  # toon Claude je mappenstructuur
cat dbt_project.yml               # plak dit voor projectcontext
```

### BigQuery / Snowflake / Redshift

```json
// Verbind je datawarehouse via MCP
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/bigquery-mcp"],
      "env": {
        "GOOGLE_PROJECT_ID": "your-project",
        "GOOGLE_CREDENTIALS": "/path/to/credentials.json"
      }
    }
  }
}
```

Met je warehouse verbonden: Claude kan tabelschema's direct lezen, query's uitvoeren en SQL valideren voor jij dat doet.

### Looker / Tableau / Metabase
Exporteer dashboarddata als CSV of plak metricwaarden → `/dashboard-narrator` converteert naar narratief. Voor LookML: plak je view-bestand en Claude helpt dimensie-/maatdefinities te schrijven of te refactoren.

### Jupyter Notebooks
Claude schrijft Python-analysecode → plak in notebook → voer uit → plak output terug voor interpretatie. Gebruik `/pandas-polars` voor de code en `/dashboard-narrator` voor de interpretatie.

### Slack (stakeholderlevering)
Plak het wekelijkse rapport van Claude in een Slack-bericht. Stel een wekelijkse herinnering in → open Claude → voer `/stakeholder-report` uit → plak naar Slack. Totale tijd: 15 minuten van data tot geleverd.

---

## Te volgen metrics

| Activiteit | Handmatige tijd | Met Claude |
|---|---|---|
| Complexe SQL-query (3+ tabellen) | 2 uur | 20 min |
| Wekelijks stakeholderrapport | 60 min | 15 min |
| Maandelijks stakeholderrapport | 3 uur | 30 min |
| Datakwaliteitsaudit (5 tabellen) | 3 uur | 30 min |
| dbt-model + tests + docs | 2 uur | 25 min |
| Dashboard-narratief | 45 min | 8 min |
| A/B-testanalyse | 3 uur | 45 min |

---

## Veelgemaakte fouten (en hoe Claude Code ze voorkomt)

**Fout 1: Een rapport verzenden met slechte data**
Voer `/data-quality-checker` uit voor elk maandrapport. Ken de gezondheid van je data voor stakeholders het zien.

**Fout 2: SQL schrijven die correct maar onleesbaar is**
`/sql` genereert standaard CTE's en gedocumenteerde query's. Je toekomstige zelf zal je huidige zelf dankbaar zijn.

**Fout 3: Stakeholderrapporten die data-dumps zijn**
`/stakeholder-report` dwingt narratief: wat er is gebeurd, waarom, wat te doen. Niet alleen een tabel met cijfers.

**Fout 4: Dashboard-anomalieën die onverklaard blijven**
`/dashboard-narrator` structureert anomalie-onderzoek: wat is het signaal, wat zijn de hypothesen, hoe te verifiëren.

**Fout 5: dbt-modellen zonder tests**
`/dbt-data-pipelines` genereert schema.yml met tests als onderdeel van elk model. Tests zijn geen bijzaak.

---

## Bronnen

- [Aan de slag met Claude Code](getting-started.md)
- [SQL skill](../skills/data-ml/sql.md)
- [Dashboard narrator skill](../skills/data-ml/dashboard-narrator.md)
- [Stakeholder report skill](../skills/data-ml/stakeholder-report.md)
- [Data quality checker skill](../skills/data-ml/data-quality-checker.md)
- [Data reporting workflow](../workflows/data-reporting.md)

---
