# Claude für Data Analysts und BI Analysts

Alles, was ein Data Analyst oder BI Analyst benötigt, um KI-gestützte SQL-Arbeit, Dashboard-Interpretation, Stakeholder-Reporting, Datenqualitäts-Audits und Ad-hoc-Analysen in Claude Code durchzuführen.

---

## Für wen dieser Leitfaden ist

Du bist Data Analyst oder BI Analyst, eingebettet in ein Business-, Produkt- oder Marketing-Team. Du erhältst 15 Ad-hoc-Anfragen pro Woche, pflegst 8 Dashboards, schreibst einen wöchentlichen Bericht für die Führung und bist immer eine Schema-Änderung von einer kaputten Pipeline entfernt. Claude Code wird dein Pair-Programmer für Queries, dein Editor für Berichte und dein Qualitätsprüfer für alles, was du auslieferst.

**Vor Claude Code:** 2 Stunden, um eine komplexe SQL-Abfrage von Grund auf zu schreiben. 1 Stunde, um den monatlichen Stakeholder-Bericht aus Roh-Metriken zu verfassen. 3 Stunden, um ein Datenqualitätsproblem über 10 Tabellen zu untersuchen.

**Danach:** Komplexe Abfrage in 15 Minuten. Stakeholder-Bericht in 20 Minuten. Datenqualitäts-Audit in 30 Minuten inklusive Remediation-SQL.

---

## 30-Sekunden-Installation

```bash
# Data-Analyst-Skills installieren
npx claudient add skill data-ml/sql
npx claudient add skill data-ml/pandas-polars
npx claudient add skill data-ml/dbt-data-pipelines
npx claudient add skill data-ml/dashboard-narrator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill data-ml/data-quality-checker
npx claudient add skill product/product-analytics
npx claudient add skill marketing/analytics-tracking

# Relevante Agenten installieren
npx claudient add agent roles/data-pipeline-architect
npx claudient add agent roles/quant-analyst
```

---

## Dein Claude Code Data-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/sql` | Komplexe SQL schreiben, optimieren und debuggen — CTEs, Window-Funktionen, Query-Pläne | Jede SQL-Abfragearbeit |
| `/pandas-polars` | Python-Datenmanipulation — Bereinigung, Transformation, Aggregation, Exporte | Ad-hoc-Analyse in Python |
| `/dbt-data-pipelines` | dbt-Modell-Design, inkrementelle Modelle, Tests, Dokumentation | Pipeline- und Transformationsarbeit |
| `/dashboard-narrator` | Dashboard-Daten in executive-ready Narrativ übersetzen — Erkenntnisse, Anomalien, Empfehlungen | Wöchentliches und Ad-hoc-Reporting |
| `/stakeholder-report` | Wöchentlicher/monatlicher Bericht: Headline-Metriken, Grundursache, Action Items | Regelmäßige Reporting-Zyklen |
| `/data-quality-checker` | Datenqualitäts-Audit: Nullwerte, Duplikate, Ausreißer, Schema-Drift, Remediation-SQL | Jede neue Datenquelle oder Anomalie-Untersuchung |
| `/product-analytics` | Funnel-Analyse, Retention, Kohorten, A/B-Testing — Produktwachstumsmetriken | Produktteam-Analyse |
| `/analytics-tracking` | Event-Tracking-Schema-Design, Tracking-Pläne, Tag-Audits | Tracking-Implementierung |

### Agenten

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `data-pipeline-architect` | Opus | Komplexes Pipeline-Design, Architekturentscheidungen |
| `quant-analyst` | Opus | Statistische Analyse, A/B-Test-Methodik, Forecasting |

---

## Täglicher Workflow

### Morgen (15–20 Minuten)

**1. Daten-Health-Check — Produktionsdaten vor Stakeholder-Anfragen prüfen**
```
/data-quality-checker

Schneller Health-Check unserer Produktionstabellen vor dem Geschäftstag.

Diese Checks auf folgenden Tabellen ausführen:
- [tabelle_1]: Nullwerte in [Schlüsselspalten] prüfen, Duplikate in [Primärschlüssel]
- [tabelle_2]: Zukünftige Daten in [Datumsspalte] prüfen, negative Werte in [Betragsspalte]

[Gestrige Zeilenzahlen oder Anomalie einfügen, falls vorhanden]

Alles Auffällige markieren. SQL-Abfragen generieren, die ich zur Bestätigung ausführen kann.
```

**2. Über-Nacht eingegangene Ad-hoc-Anfragen triagieren**
Die Anfrage in Claude einfügen → einen SQL-Entwurf oder Analyseplan erhalten, bevor mit der Arbeit begonnen wird.

---

### Ad-hoc-Analyse (bei Bedarf)

**3. Komplexe SQL-Abfrage — jede Anfrage**
```
/sql

Eine SQL-Abfrage schreiben, um diese Business-Frage zu beantworten:
"[Anfrage des Stakeholders in seinen eigenen Worten]"

Unser Schema:
- [tabellenname]: Spalten [Liste], Primärschlüssel [Spalte], Beziehungen zu [anderen Tabellen]
- [tabellenname]: [gleich]

Datenbank: [PostgreSQL / BigQuery / Snowflake / Redshift]
Ich brauche: [gewünschten Output beschreiben — Tabellenform, Granularitätsstufe, Filter]
```

**4. Funnel- oder Kohortenanalyse**
```
/product-analytics

Eine [Funnel- / Kohortenretentions- / A/B-Test]-Analyse erstellen.

Events-Tabelle: [Schema]
Frage: [was wir zu beantworten versuchen]
Zeitraum: [Datumsbereich]
Segmentieren nach: [Nutzertyp / Akquisitionskanal / Plan-Tier]

Output: [SQL + Interpretation der Ergebnisse]
```

---

### Reporting (wöchentlicher Rhythmus)

**5. Wöchentlicher Stakeholder-Bericht**
```
/stakeholder-report

Wöchentlichen Datenbericht für [Führung / Produktteam / Marketing] schreiben.

Woche: [Daten]
Metriken dieser Woche:
[Metriken mit WoW-Änderungen und vs. Plan einfügen]

Wichtige Ereignisse: [Produkt-Releases, Kampagnen, Incidents]
```

**6. Dashboard-Narrativ — wenn die Führung fragt "Was bedeutet das?"**
```
/dashboard-narrator

Diese Dashboard-Daten in einen 5-Minuten-Lesestoff für unseren CEO übersetzen.

Dashboard: [Name]
Zeitraum: [diesen Monat]
Zielgruppe: CEO + Exec-Team — nicht technisch

[Metrikwerte, Änderungen und bekannten Kontext einfügen]
```

---

### Monatliche Tiefenarbeit (erste Woche des Monats)

**7. Monatsbericht**
```
/stakeholder-report

Monatlicher Datenbericht für [Zielgruppe].
Monat: [Name]
[Vollständige Metrik-Tabelle — aktueller Monat, letzter Monat, MoM%, letztes Jahr, YoY%, vs. Plan]
Grundursache der größten Änderungen: [Notizen]
Maßnahmen und Verantwortliche: [Liste]
```

**8. Datenqualitäts-Audit — monatliches Produktions-Audit**
```
/data-quality-checker

Monatliches Datenqualitäts-Audit über unsere [N] Produktionstabellen.

Für jede Tabelle:
- [tabelle_1]: [Zeilenanzahl, Primärschlüssel, wichtige Business-Spalten]
- [tabelle_2]: [gleich]

Python-Audit-Skript generieren, das ich ausführen soll. Nach dem Einfügen der Ergebnisse den Health-Bericht und das Remediation-SQL generieren.
```

---

### Laufend (Pipeline-Arbeit)

**9. dbt-Modell-Design**
```
/dbt-data-pipelines

Ich muss ein dbt-Modell für [Business-Konzept — z. B. wöchentlich aktive Nutzer nach Kohorte] erstellen.

Quelltabellen: [Liste mit Schemas]
Gewünschter Output: [Granularität, Spalten, wofür das Modell verwendet wird]
Materialisierung: [table / incremental / view]

Generieren: das Modell-SQL, schema.yml mit Tests und Dokumentation.
```

---

## 30-Tage-Einarbeitungsplan (neuer Data Analyst oder neuer Stack)

### Woche 1 — SQL-Beherrschung im neuen Schema
- Alle Data-Skills installieren: `npx claudient add skill data-ml/[name]`
- Schlüsseltabellen in einer CLAUDE.md im Analytics-Repo dokumentieren — Claude liest diese für Kontext
- `/sql` verwenden, um 10 Abfragen für häufige Business-Fragen zu schreiben — Query-Bibliothek aufbauen
- `/data-quality-checker` für die 3 wichtigsten Produktionstabellen ausführen — Basis-Datenqualitäts-Health verstehen

### Woche 2 — Reporting-Workflows
- `/dashboard-narrator` verwenden, um das wöchentliche Business-Review zu schreiben — mit manuell erstelltem vergleichen
- `/stakeholder-report` verwenden, um den Monatsbericht zu schreiben — mit Manager teilen und Feedback einholen
- Identifizieren, welche Stakeholder Berichte tatsächlich lesen und Länge/Format entsprechend anpassen

### Woche 3 — Pipeline und Tracking
- `/dbt-data-pipelines` verwenden, um Tests zu nicht getesteten Modellen im Projekt hinzuzufügen
- `/analytics-tracking` verwenden, um Event-Tracking zu auditieren — Lücken finden, bevor sie zu Datenqualitätsproblemen werden
- dbt-Tests, die Claude generiert, einrichten — automatisiertes Qualitätsmonitoring in Betrieb nehmen

### Woche 4 — Fortgeschrittene Analyse
- `/product-analytics` verwenden, um eine vollständige Funnel-Analyse zu erstellen — größten Drop-off im Produkt identifizieren
- `/quant-analyst`-Agenten für A/B-Test-Analysen verwenden — Methodik vor der Präsentation korrekt aufstellen
- Zeit benchmarken: Wie viele Minuten dauert jede häufige Anfrage jetzt vs. vor Claude?

---

## Tool-Integrationen

### dbt Core / dbt Cloud

```bash
# Claude liest deine dbt-Projektstruktur
# Claude auf dein models/-Verzeichnis verweisen und es versteht dein Schema
ls models/marts/ models/staging/  # Ordnerstruktur für Claude zeigen
cat dbt_project.yml               # Für Projektkontext einfügen
```

### BigQuery / Snowflake / Redshift

```json
// Data Warehouse per MCP verbinden
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

Mit dem Warehouse verbunden: Claude kann Tabellen-Schemas direkt lesen, Abfragen ausführen und SQL vor der Ausführung validieren.

### Looker / Tableau / Metabase
Dashboard-Daten als CSV exportieren oder Metrikwerte einfügen → `/dashboard-narrator` konvertiert zu Narrativ. Für LookML: View-Datei einfügen und Claude hilft beim Schreiben oder Refactoring von Dimensions-/Measure-Definitionen.

### Jupyter Notebooks
Claude schreibt Python-Analysecode → in Notebook einfügen → ausführen → Output zum Interpretieren zurückeinfügen. `/pandas-polars` für den Code und `/dashboard-narrator` für die Interpretation verwenden.

### Slack (Stakeholder-Lieferung)
Claudes Wochenbericht in eine Slack-Nachricht einfügen. Wöchentliche Erinnerung einrichten → Claude öffnen → `/stakeholder-report` ausführen → in Slack einfügen. Gesamtzeit: 15 Minuten von Daten bis zur Lieferung.

---

## Zu verfolgende Metriken

| Aktivität | Manuell | Mit Claude |
|---|---|---|
| Komplexe SQL-Abfrage (3+ Tabellen) | 2 Stunden | 20 Min |
| Wöchentlicher Stakeholder-Bericht | 60 Min | 15 Min |
| Monatlicher Stakeholder-Bericht | 3 Stunden | 30 Min |
| Datenqualitäts-Audit (5 Tabellen) | 3 Stunden | 30 Min |
| dbt-Modell + Tests + Docs | 2 Stunden | 25 Min |
| Dashboard-Narrativ | 45 Min | 8 Min |
| A/B-Test-Analyse | 3 Stunden | 45 Min |

---

## Häufige Fehler (und wie Claude Code sie verhindert)

**Fehler 1: Einen Bericht mit schlechten Daten ausliefern**
`/data-quality-checker` vor jedem Monatsbericht ausführen. Den Gesundheitszustand der Daten kennen, bevor Stakeholder ihn sehen.

**Fehler 2: SQL schreiben, das korrekt, aber unleserlich ist**
`/sql` generiert standardmäßig CTEs und dokumentierte Abfragen. Das zukünftige Ich wird dem heutigen Ich danken.

**Fehler 3: Stakeholder-Berichte, die Daten-Dumps sind**
`/stakeholder-report` erzwingt Narrativ: Was ist passiert, warum, was zu tun ist. Nicht nur eine Zahlentabelle.

**Fehler 4: Dashboard-Anomalien, die unerklärt bleiben**
`/dashboard-narrator` strukturiert die Anomalie-Untersuchung: Was ist das Signal, was sind die Hypothesen, wie verifizieren.

**Fehler 5: dbt-Modelle ohne Tests**
`/dbt-data-pipelines` generiert schema.yml mit Tests als Teil jedes Modells. Tests sind kein Nachgedanke.

---

## Ressourcen

- [Erste Schritte mit Claude Code](getting-started.md)
- [SQL-Skill](../skills/data-ml/sql.md)
- [Dashboard-Narrator-Skill](../skills/data-ml/dashboard-narrator.md)
- [Stakeholder-Report-Skill](../skills/data-ml/stakeholder-report.md)
- [Data-Quality-Checker-Skill](../skills/data-ml/data-quality-checker.md)
- [Daten-Reporting-Workflow](../workflows/data-reporting.md)

---
