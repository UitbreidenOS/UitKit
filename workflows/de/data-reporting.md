# Daten-Reporting-Workflow

Ein wiederholbarer Prozess für Datenanalysten, um von Rohdaten zu veröffentlichten Stakeholder-Berichten zu gelangen — in wöchentlichen und monatlichen Zyklen — unter Einsatz von Claude Code-Skills in jedem Schritt.

---

## Überblick

Dieser Workflow deckt zwei Berichtszeiträume ab:
- **Wochenbericht:** 45-minütiger Prozess vom Daten-Pull bis zur Verteilung
- **Monatsbericht:** 2-stündiger Prozess vom Daten-Pull bis zum vorstandsreifen Bericht

Beide folgen derselben Struktur: Daten → Qualitätsprüfung → Analyse → Narrativ → Review → Veröffentlichung.

---

## Wöchentlicher Reporting-Workflow (jeden Montagmorgen)

**Zielzeit:** 45 Minuten gesamt

---

### Schritt 1: Daten der Vorwoche abrufen (10 Minuten)

Führe deinen Standard-Datenabruf aus deinem BI-Tool oder Data Warehouse durch.

Erforderliche Metriken für die meisten wöchentlichen Geschäftsberichte:
```sql
-- Template: Weekly metrics pull
-- Run this each Monday for the prior week (Mon-Sun)

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
    -- Same query for the week before
    SELECT ... FROM events WHERE ...
)
SELECT
    c.*,
    ROUND(100.0 * (c.revenue - p.revenue) / NULLIF(p.revenue, 0), 2) AS revenue_wow_pct,
    ROUND(100.0 * (c.weekly_active_users - p.weekly_active_users) / NULLIF(p.weekly_active_users, 0), 2) AS wau_wow_pct
FROM week_current c
CROSS JOIN week_prior p;
```

Speichere die Ergebnisse in einer Tabellenzeile oder der Metriktabelle deiner Pipeline.

---

### Schritt 2: Datenqualität prüfen (5 Minuten)

Bevor du ein einziges Wort schreibst, überprüfe, ob die Zahlen stimmen:

```
/data-quality-checker

Quick sanity check on this week's metrics before I write the report.

This week vs. last week:
- WAU: [X] vs [X] ([+/-X%])
- Revenue: $[X] vs $[X] ([+/-X%])
- [Other metrics]

Red flags to check:
- Any metric moving more than 25% week over week unexpectedly
- Does revenue math check out? (transactions × avg order value ≈ total revenue)
- Anything that doesn't pass the "does this make sense" test?

Context: [any known events — outage, campaign, holiday, data pipeline change]
```

Wenn die Daten plausibel sind, fahre fort. Falls etwas merkwürdig aussieht, untersuche es vor dem Schreiben.

---

### Schritt 3: Kontext sammeln (5 Minuten)

Die Daten sagen dir, was passiert ist. Du musst wissen, warum. Bevor du schreibst:

- Prüfe Slack auf Ankündigungen von Produkt, Marketing oder Engineering aus der letzten Woche
- Notiere alle Produktveröffentlichungen (prüfe deine Release Notes oder Jira)
- Notiere alle Marketing-Kampagnen oder Aktionen, die durchgeführt wurden
- Notiere alle Vorfälle oder Ausfälle
- Prüfe, ob ein bekannter saisonaler Effekt vorlag

Dieser Kontext ist der Unterschied zwischen „Umsatz sank um 8 %" (wertlos) und „Umsatz sank um 8 % in der ersten Woche nach Ende der Q3-Kampagne — erwartete Reversion, jetzt zurück zum Basistrend" (nützlich).

---

### Schritt 4: Wochenbericht schreiben (15 Minuten)

```
/stakeholder-report

Write the weekly data report for [team name].

WEEK OF: [date range]
AUDIENCE: [leadership team / department heads]

METRICS (paste your data with WoW changes and vs-target if applicable):
- WAU: [X] ([+/-X%] WoW, target [X])
- Revenue: $[X] ([+/-X%] WoW, target $[X])
- Conversion rate: [X]% ([+/-X]pp WoW)
- [Other metrics]

EVENTS THIS WEEK:
- [Event 1 — e.g., new onboarding flow launched Tuesday]
- [Event 2]

WHAT I KNOW ABOUT THE MOVEMENTS:
- [Revenue drop likely due to campaign ending]
- [WAU up driven by new user cohort from [source]]
- [Conversion rate change unexplained — needs investigation]

Generate: headline summary, wins, concerns, anomalies, recommended actions, watch list for next week.
```

---

### Schritt 5: Review und Faktencheck (5 Minuten)

Vor der Veröffentlichung:

```
/stakeholder-report

Review this weekly report draft for quality.

[Paste your draft]

Check:
- Is every claim quantified? (no "significantly" without a number)
- Are wins and concerns balanced?
- Is the recommended action specific and owned by someone?
- Is anything phrased as causal that's only correlational?
- Would someone who didn't know our business understand this?
```

Behebe alle Probleme, die Claude markiert.

---

### Schritt 6: Verteilen (5 Minuten)

- Per E-Mail an deine Verteilerliste, ODER
- In Slack posten (#data-updates oder entsprechend), ODER
- Das geteilte Dokument in Notion/Confluence aktualisieren

Füge eine „Fragen?"-Zeile ein — du möchtest, dass Stakeholder sich einbringen, nicht nur lesen und ablegen.

---

## Monatlicher Reporting-Workflow (erster Montag jedes Monats)

**Zielzeit:** 2 Stunden gesamt

---

### Schritt 1: Monatsdaten abrufen (20 Minuten)

Monatsberichte benötigen mehr Tiefe als wöchentliche. Abrufen:
- Vollständige Monatsmetriken mit MoM- und YoY-Vergleichen
- Vergleich mit Plan/Budget (sofern Ziele vorhanden)
- Segmentaufschlüsselungen (nach Produktlinie, Region, Kanal)
- Kohortendaten (wie haben die Neukunden des letzten Monats diesen Monat gehalten?)
- Frühindikatoren für den nächsten Monat

```sql
-- Monthly metrics template
WITH monthly AS (
    SELECT
        DATE_TRUNC('month', created_at) AS month,
        [your key metrics]
    FROM [your tables]
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

### Schritt 2: Vollständiges Datenqualitäts-Audit (20 Minuten)

Monatlicher Rhythmus = monatliches Audit. Führe das vollständige Audit-Skript aus:

```
/data-quality-checker

Monthly data quality audit for [current month].

Run a full audit on these production tables:
- [table_1]: primary key [col], key metrics [cols]
- [table_2]: [same]
- [table_3]: [same]

Generate the Python audit script. I'll run it and paste results back.
```

Führe das generierte Skript aus. Füge die Ergebnisse zurück in Claude ein. Erhalte den Daten-Gesundheitsbericht und das Korrektur-SQL.

**Regel:** Veröffentliche keinen Monatsbericht, wenn es KRITISCHE Datenqualitätsprobleme gibt. Behebe sie zuerst.

---

### Schritt 3: Ursachenanalyse — Erfolge (20 Minuten)

Für jede Metrik, die den Plan um >10 % übertroffen hat:

```
/stakeholder-report

Write a root cause analysis for [metric] overperforming by [X%] this month.

Performance: [metric] was [X] vs. plan [X] — [X]% above plan.
Segment breakdown: [how does this break down by key segments?]
Timeline: [when did outperformance start?]
Correlated events: [product launch, campaign, pricing change, etc.]

Hypotheses:
1. [most likely cause]
2. [second hypothesis]
3. [third hypothesis]

Which hypothesis is best supported by the data? What's the repeatability — is this a one-time event or a sustainable improvement?
```

---

### Schritt 4: Ursachenanalyse — Verfehlungen (20 Minuten)

Für jede Metrik, die den Plan um >10 % verfehlt hat:

```
/stakeholder-report

Write a root cause analysis for [metric] underperforming by [X%] this month.

[Same format as above, but for the miss]

Additional: What is the plan to course-correct? Who owns it? What's the expected impact and timeline?
```

---

### Schritt 5: Vollständigen Monatsbericht schreiben (30 Minuten)

```
/stakeholder-report

Write the monthly data report for [audience].

MONTH: [Month Year]

EXECUTIVE SUMMARY: [One sentence on the month — honest]

FULL METRICS TABLE:
[Metric] | [This Month] | [Last Month] | [MoM%] | [Last Year] | [YoY%] | [vs. Plan]
[paste all rows]

ROOT CAUSE — WINS:
[Your analysis from Step 3]

ROOT CAUSE — MISSES:
[Your analysis from Step 4]

COHORT/SEGMENT INSIGHTS:
[Paste any cohort or segment analysis]

FORECAST UPDATE:
[Updated Q/annual forecast if you have one]

ACTIONS AND OWNERS:
[List actions, owners, due dates]

Generate the full monthly report in narrative format. Include a table of metrics. End with an action table. Total target: 1,000 words max.
```

---

### Schritt 6: Präsentationsversion (bei Bedarf — 20 Minuten)

Falls der Monatsbericht als Folien für ein Vorstands- oder Führungsteam-Meeting vorgestellt wird:

```
/stakeholder-report

Convert this monthly report into a 5-slide executive presentation outline.

[Paste your monthly report]

Slide structure:
1. HEADLINE: [single metric or one-sentence verdict]
2. SCORECARD: [key metrics vs. plan table]
3. WHAT DROVE PERFORMANCE: [wins and misses, with root cause]
4. ACTIONS AND OWNERS: [table]
5. FORWARD LOOK: [next month's key watch items, any forecast change]

For each slide: title, 3-5 bullet points or data points, talking points for the presenter.
```

---

### Schritt 7: Review und Veröffentlichung (10 Minuten)

```
/stakeholder-report

Final review of this monthly report before publication.

[Paste full report]

Check:
[ ] Every metric has a comparison (no orphan numbers without context)
[ ] Every miss has a cause and a plan
[ ] Actions have owners and due dates
[ ] No jargon that the CEO wouldn't understand
[ ] No spin — is this honest about what went wrong?
[ ] Consistent date references throughout
```

Verteile per E-Mail, Notion, Confluence oder als All-Hands-Dokument.

---

## Berichtsvorlagen nach Zielgruppe

### Für den CEO (maximal eine Seite)
```
Month: [name]
Status: [Green / Yellow / Red]

Top 3 things you need to know:
1. [Most important finding]
2. [Second finding]
3. [Third finding]

What we're doing about the miss: [1-2 sentences]
Next month's primary watch item: [1 sentence]
```

### Für den Vorstand (Datenteil des Board-Decks)
```
[Performance vs. plan table]
[3 bullets: what worked, what didn't, what we're doing]
[Revised forecast if changed]
```

### Für das Team (vollständiger Bericht)
Vollständiges monatliches Narrativ mit allen Abschnitten — keine Kürzungen.

---

## Automatisierungsideen

### Woche-über-Woche-Vergleich automatisieren

```python
# Run every Monday via cron or GitHub Actions
import pandas as pd
from datetime import datetime, timedelta

# Pull metrics (replace with your actual data source)
def pull_weekly_metrics(week_start: datetime) -> dict:
    """Pull metrics for the week starting on week_start."""
    # Your query here
    pass

current_week = pull_weekly_metrics(datetime.now() - timedelta(days=7))
prior_week = pull_weekly_metrics(datetime.now() - timedelta(days=14))

# Format for Claude prompt
metrics_text = "\n".join([
    f"- {k}: {current_week[k]} (WoW: {round(100*(current_week[k]-prior_week[k])/prior_week[k], 1)}%)"
    for k in current_week
])

# Pipe to Claude CLI
import subprocess
prompt = f"Write a weekly report for these metrics:\n{metrics_text}"
result = subprocess.run(['claude', '-p', prompt], capture_output=True, text=True)
print(result.stdout)
```

---
