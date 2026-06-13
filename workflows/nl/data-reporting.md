# Gegevensrapportage Workflow

Een herhaalbaar proces voor data-analisten om van ruwe statistieken naar gepubliceerde stakeholderrapporten te gaan — wekelijkse en maandelijkse cadans — met Claude Code-vaardigheden bij elke stap.

---

## Overzicht

Deze workflow omvat twee rapportagecadansen:
- **Weekrapport:** 45 minuten van dataverzameling tot distributie
- **Maandrapport:** 2 uur van dataverzameling tot rapport klaar voor directie

Beide volgen dezelfde structuur: data → kwaliteitscontrole → analyse → verhaal → review → publiceren.

---

## Wekelijkse Rapportage Workflow (elke maandagochtend)

**Doeltijd:** 45 minuten totaal

---

### Stap 1: Haal de data van de afgelopen week op (10 minuten)

Voer je standaard dataverzameling uit vanuit je BI-tool of datawarehouse.

Vereiste statistieken voor de meeste zakelijke weekrapporten:
```sql
-- Sjabloon: Wekelijkse statistieken ophalen
-- Voer dit elke maandag uit voor de vorige week (ma-zo)

WITH week_current AS (
    SELECT
        DATE_TRUNC('week', created_at) AS week,
        COUNT(DISTINCT user_id) AS weekly_active_users,
        SUM(revenue) AS revenue,
        COUNT(DISTINCT order_id) AS transactions,
        SUM(revenue) / COUNT(DISTINCT order_id) AS avg_order_value
    FROM events
    WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '7 days')
      AND created_at <  DATE_TRUNC('week', CURRENT_DATE)
    GROUP BY 1
),
week_prior AS (
    -- Zelfde query voor de week daarvoor
    SELECT ... FROM events WHERE ...
)
SELECT
    c.*,
    ROUND(100.0 * (c.revenue - p.revenue) / NULLIF(p.revenue, 0), 2) AS revenue_wow_pct,
    ROUND(100.0 * (c.weekly_active_users - p.weekly_active_users) / NULLIF(p.weekly_active_users, 0), 2) AS wau_wow_pct
FROM week_current c
CROSS JOIN week_prior p;
```

Sla de resultaten op in een spreadsheetrij of de statistiekentabel van je pipeline.

---

### Stap 2: Spot-check gegevenskwaliteit (5 minuten)

Verifieer de cijfers voordat je ook maar één woord schrijft:

```
/data-quality-checker

Snelle sanity-check op de statistieken van deze week voordat ik het rapport schrijf.

Deze week vs. vorige week:
- WAU: [X] vs [X] ([+/-X%])
- Omzet: $[X] vs $[X] ([+/-X%])
- [Overige statistieken]

Rode vlaggen om te controleren:
- Elke statistiek die meer dan 25% week-over-week beweegt zonder verwachte reden
- Klopt de omzetberekening? (transacties × gemiddelde orderwaarde ≈ totale omzet)
- Is er iets dat de "klopt dit eigenlijk?"-test niet doorstaat?

Context: [eventuele bekende gebeurtenissen — storing, campagne, feestdag, wijziging datapipeline]
```

Als de data klopt, ga verder. Als er iets vreemd uitziet, onderzoek dit dan eerst.

---

### Stap 3: Verzamel context (5 minuten)

De data vertelt je wat er is gebeurd. Je moet weten waarom. Controleer voor het schrijven:

- Slack voor aankondigingen van product, marketing of engineering van de afgelopen week
- Eventuele productreleases (controleer je release notes of Jira)
- Eventuele marketingcampagnes of promoties die hebben gelopen
- Eventuele incidenten of storingen
- Of er een bekend seizoenseffect was

Deze context is het verschil tussen "omzet daalde 8%" (nutteloos) en "omzet daalde 8% in de eerste week na afloop van de Q3-campagne — verwachte terugkeer naar baseline, nu terug op trendlijn" (nuttig).

---

### Stap 4: Schrijf het weekrapport (15 minuten)

```
/stakeholder-report

Schrijf het wekelijkse datarapport voor [teamnaam].

WEEK VAN: [datumbereik]
DOELGROEP: [leiderschapsteam / afdelingshoofden]

STATISTIEKEN (plak je data met WoW-wijzigingen en vs-doelstelling indien van toepassing):
- WAU: [X] ([+/-X%] WoW, doelstelling [X])
- Omzet: $[X] ([+/-X%] WoW, doelstelling $[X])
- Conversieratio: [X]% ([+/-X]pp WoW)
- [Overige statistieken]

GEBEURTENISSEN DEZE WEEK:
- [Gebeurtenis 1 — bijv. nieuwe onboarding-flow gelanceerd op dinsdag]
- [Gebeurtenis 2]

WAT IK WEET OVER DE BEWEGINGEN:
- [Omzetdaling waarschijnlijk door einde van campagne]
- [WAU omhoog gedreven door nieuw gebruikerscohort van [bron]]
- [Wijziging conversieratio onverklaard — vereist onderzoek]

Genereer: samenvattende kop, successen, zorgen, anomalieën, aanbevolen acties, aandachtspunten voor volgende week.
```

---

### Stap 5: Review en feitencheck (5 minuten)

Voor publicatie:

```
/stakeholder-report

Beoordeel dit concept weekrapport op kwaliteit.

[Plak je concept]

Controleer:
- Is elke bewering gekwantificeerd? (geen "significant" zonder een getal)
- Zijn successen en zorgen in balans?
- Is de aanbevolen actie specifiek en heeft iemand er eigenaarschap over?
- Is er iets als causaal geformuleerd dat slechts correlationeel is?
- Zou iemand die ons bedrijf niet kent dit begrijpen?
```

Los alle problemen op die Claude aangeeft.

---

### Stap 6: Distribueer (5 minuten)

- E-mail naar je distributielijst, OF
- Post in Slack (#data-updates of equivalent), OF
- Update het gedeelde document in Notion/Confluence

Voeg een "Vragen?" regel toe — je wil dat stakeholders meedoen, niet alleen lezen en archiveren.

---

## Maandelijkse Rapportage Workflow (eerste maandag van elke maand)

**Doeltijd:** 2 uur totaal

---

### Stap 1: Haal maandelijkse data op (20 minuten)

Maandrapporten hebben meer diepgang nodig dan weekrapporten. Haal op:
- Volledige maandstatistieken met MoM- en YoY-vergelijkingen
- Vergelijking vs. plan/budget (als je doelstellingen hebt)
- Segmentanalyses (per productlijn, geografie, kanaal)
- Cohortdata (hoe behielden de nieuwe gebruikers van vorige maand zich deze maand?)
- Voorlopende indicatoren voor de volgende maand

```sql
-- Maandelijkse statistiekensjabloon
WITH monthly AS (
    SELECT
        DATE_TRUNC('month', created_at) AS month,
        [jouw kernstatistieken]
    FROM [jouw tabellen]
    GROUP BY 1
),
with_changes AS (
    SELECT
        month,
        [metric],
        LAG([metric]) OVER (ORDER BY month) AS prior_month,
        [metric] - LAG([metric]) OVER (ORDER BY month) AS mom_change,
        ROUND(100.0 * ([metric] - LAG([metric]) OVER (ORDER BY month))
              / NULLIF(LAG([metric]) OVER (ORDER BY month), 0), 2) AS mom_pct_change
    FROM monthly
)
SELECT * FROM with_changes ORDER BY month DESC LIMIT 3;
```

---

### Stap 2: Volledige gegevenskwaliteitsaudit (20 minuten)

Maandelijkse cadans = maandelijkse audit. Voer het volledige auditscript uit:

```
/data-quality-checker

Maandelijkse gegevenskwaliteitsaudit voor [huidige maand].

Voer een volledige audit uit op deze productietabellen:
- [table_1]: primaire sleutel [col], kernstatistieken [cols]
- [table_2]: [hetzelfde]
- [table_3]: [hetzelfde]

Genereer het Python-auditscript. Ik voer het uit en plak de resultaten terug.
```

Voer het gegenereerde script uit. Plak de resultaten terug naar Claude. Ontvang het gegevensgezondheidrapport en de herstel-SQL.

**Regel:** Publiceer geen maandrapport als er KRITIEKE gegevenskwaliteitsproblemen zijn. Los ze eerst op.

---

### Stap 3: Grondoorzaakanalyse — successen (20 minuten)

Voor elke statistiek die meer dan 10% boven plan uitkomt:

```
/stakeholder-report

Schrijf een grondoorzaakanalyse voor [statistiek] die deze maand [X%] beter presteert dan verwacht.

Prestatie: [statistiek] was [X] vs. plan [X] — [X]% boven plan.
Segmentanalyse: [hoe verdeelt dit zich over de kernssegmenten?]
Tijdlijn: [wanneer begon de outperformance?]
Gecorreleerde gebeurtenissen: [productlancering, campagne, prijswijziging, enz.]

Hypothesen:
1. [meest waarschijnlijke oorzaak]
2. [tweede hypothese]
3. [derde hypothese]

Welke hypothese wordt het best ondersteund door de data? Wat is de herhaalbaarheid — is dit een eenmalige gebeurtenis of een duurzame verbetering?
```

---

### Stap 4: Grondoorzaakanalyse — misses (20 minuten)

Voor elke statistiek die meer dan 10% onder plan blijft:

```
/stakeholder-report

Schrijf een grondoorzaakanalyse voor [statistiek] die deze maand [X%] onderpresteert.

[Zelfde format als hierboven, maar voor de miss]

Aanvullend: Wat is het plan om bij te sturen? Wie is er verantwoordelijk voor? Wat is de verwachte impact en tijdlijn?
```

---

### Stap 5: Schrijf het volledige maandrapport (30 minuten)

```
/stakeholder-report

Schrijf het maandelijkse datarapport voor [doelgroep].

MAAND: [Maand Jaar]

MANAGEMENTSAMENVATTING: [Één zin over de maand — eerlijk]

VOLLEDIGE STATISTIEKENTABEL:
[Statistiek] | [Deze maand] | [Vorige maand] | [MoM%] | [Vorig jaar] | [YoY%] | [vs. Plan]
[plak alle rijen]

GRONDOORZAAK — SUCCESSEN:
[Jouw analyse uit Stap 3]

GRONDOORZAAK — MISSES:
[Jouw analyse uit Stap 4]

COHORT/SEGMENT INZICHTEN:
[Plak eventuele cohort- of segmentanalyse]

PROGNOSE-UPDATE:
[Bijgewerkte kwartaal-/jaarprognose indien beschikbaar]

ACTIES EN EIGENAREN:
[Lijst met acties, eigenaren, vervaldatums]

Genereer het volledige maandrapport in verhalende vorm. Voeg een statistiekentabel toe. Eindig met een actietabel. Totaaldoelstelling: maximaal 1.000 woorden.
```

---

### Stap 6: Diaversie (indien nodig — 20 minuten)

Als het maandrapport naar een bestuursvergadering of directieteamvergadering gaat als presentatie:

```
/stakeholder-report

Zet dit maandrapport om in een overzicht van een directiepresentatie van 5 dia's.

[Plak je maandrapport]

Diastructuur:
1. KOP: [enkele statistiek of één-zinsverdeling]
2. SCOREKAART: [tabel kernstatistieken vs. plan]
3. WAT PRESTATIES AANDREEF: [successen en misses, met grondoorzaak]
4. ACTIES EN EIGENAREN: [tabel]
5. VOORUITBLIK: [aandachtspunten voor volgende maand, eventuele prognosewijziging]

Voor elke dia: titel, 3-5 opsommingstekens of datapunten, spreekpunten voor de presentator.
```

---

### Stap 7: Review en publiceer (10 minuten)

```
/stakeholder-report

Definitieve review van dit maandrapport voor publicatie.

[Plak volledig rapport]

Controleer:
[ ] Elke statistiek heeft een vergelijking (geen alleenstaande cijfers zonder context)
[ ] Elke miss heeft een oorzaak en een plan
[ ] Acties hebben eigenaren en vervaldatums
[ ] Geen jargon dat de CEO niet zou begrijpen
[ ] Geen mooipraterij — is dit eerlijk over wat er mis ging?
[ ] Consistente datumverwijzingen door het hele document
```

Distribueer via e-mail, Notion, Confluence of all-hands-document.

---

## Rapportsjablonen per doelgroep

### Voor de CEO (maximaal één pagina)
```
Maand: [naam]
Status: [Groen / Geel / Rood]

Top 3 dingen die je moet weten:
1. [Belangrijkste bevinding]
2. [Tweede bevinding]
3. [Derde bevinding]

Wat we doen aan de miss: [1-2 zinnen]
Primair aandachtspunt volgende maand: [1 zin]
```

### Voor het bestuur (datasectie van bestuurspresentatie)
```
[Prestatietabel vs. plan]
[3 opsommingstekens: wat werkte, wat niet, wat we doen]
[Herziene prognose indien gewijzigd]
```

### Voor het team (volledig rapport)
Volledig maandelijks verhaal met alle secties — geen afkortingen.

---

## Automatiseringsideeën

### Week-over-week vergelijkingsautomatisering

```python
# Voer elke maandag uit via cron of GitHub Actions
import pandas as pd
from datetime import datetime, timedelta

# Haal statistieken op (vervang door je eigen databron)
def pull_weekly_metrics(week_start: datetime) -> dict:
    """Haal statistieken op voor de week die begint op week_start."""
    # Jouw query hier
    pass

current_week = pull_weekly_metrics(datetime.now() - timedelta(days=7))
prior_week = pull_weekly_metrics(datetime.now() - timedelta(days=14))

# Formatteer voor Claude-prompt
metrics_text = "\n".join([
    f"- {k}: {current_week[k]} (WoW: {round(100*(current_week[k]-prior_week[k])/prior_week[k], 1)}%)"
    for k in current_week
])

# Doorsturen naar Claude CLI
import subprocess
prompt = f"Write a weekly report for these metrics:\n{metrics_text}"
result = subprocess.run(['claude', '-p', prompt], capture_output=True, text=True)
print(result.stdout)
```

---
