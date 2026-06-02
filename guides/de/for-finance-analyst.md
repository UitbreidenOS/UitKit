# Claude für Finanzanalysten und CFOs

Alles, was ein Finanzanalyst, FP&A-Manager oder CFO benötigt, um KI-gestützte Finanzmodellierung, Berichterstattung, Board-Pack-Erstellung und Investorenkommunikation in Claude Code durchzuführen.

---

## Für wen dieser Leitfaden gedacht ist

Sie sind Finanzfachkraft — FP&A-Analyst, Finanzmanager, VP Finance oder CFO — deren Aufgabe es ist, Zahlen in Entscheidungen umzuwandeln. Sie bauen Modelle, schließen die Bücher, erklären Abweichungen, bereiten Board-Materialien vor und managen Investoren. Sie ertrinken in Tabellenkalkulationen und verbringen zu viel Zeit mit Formatierung statt mit Analyse.

**Vor Claude Code:** 3 Stunden für eine erste DCF-Version. Ein halber Tag für den Managementkommentar im Board-Pack. Ein ganzer Tag für ein Budget-vs.-Ist-Deck mit Abweichungserklärungen. Nachtschichten vor Board-Meetings.

**Danach:** DCF-Framework in 20 Minuten. Board-Pack-Narrativ in 45 Minuten. BvI-Abweichungskommentar in 15 Minuten. Szenarioanalyse für jedes Modell in unter 10 Minuten.

---

## Installation in 30 Sekunden

```bash
# Den vollständigen Finanz-Stack installieren
npx claudient add skills finance
npx claudient add skills gtm/commercial-forecaster
npx claudient add skills gtm/revenue-operations
npx claudient add agents advisors/cfo-advisor
npx claudient add agents roles/quant-analyst

# Oder einzeln auswählen:
npx claudient add skill finance/dcf-model
npx claudient add skill finance/3-statement-model
npx claudient add skill finance/financial-plan
npx claudient add skill finance/ic-memo
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/gl-reconciler
npx claudient add skill finance/board-pack-builder
npx claudient add skill finance/budget-vs-actual
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/revenue-operations
```

---

## Ihr Claude Code Finanz-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/board-pack-builder` | Vollständiges Board-Pack: Finanzkennzahlen, KPIs, strategische Initiativen, Risiken, Anfragen | Monatliche/vierteljährliche Board-Meetings |
| `/budget-vs-actual` | BvI-Analyse: Abweichungstabellen, Kommentar, Trend, Neuprognose | Monatlicher Abschluss |
| `/dcf-model` | DCF-Bewertung: WACC, FCF-Projektionen, Terminal Value, Sensitivität | Bewertungsarbeiten, Transaktionen |
| `/3-statement-model` | Integriertes GuV-, Bilanz- und Cashflow-Modell | Finanzplanung, Fundraising |
| `/financial-plan` | Jahresbetriebsplan: Personalbestand, Umsatz, Kostenaufbau, Szenarien | Jahresplanungszyklus |
| `/ic-memo` | Investment-Committee-Memo: alle 9 Abschnitte, Renditeanalyse | PE-/VC-Transaktionsdokumentation |
| `/pitch-deck` | Fundraising-Pitch-Deck: Struktur, Narrativ, Kennzahlen, Geschichte | Investor-Fundraising |
| `/gl-reconciler` | Hauptbuch-Abstimmung: Kontoanalyse, Abweichungsverfolgung, Buchungsprüfungen | Monatsabschluss |
| `/commercial-forecaster` | Umsatzprognose: pipeline-gesteuert, Kohortenanalyse, Szenarien | Gemeinsame Vertriebs- und Finanzplanung |
| `/revenue-operations` | RevOps-Analyse: ARR-Wasserfall, NRR-Zerlegung, Churn-Attribution | SaaS-/Abonnement-Unternehmen |

### Agenten

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `cfo-advisor` | Opus | Strategische Finanzfragen, Investorennarrativ, Fundraising-Positionierung |
| `quant-analyst` | Sonnet | Statistische Analyse, Finanzmodellierung, quantitative Forschung |

---

## Täglicher Workflow

### Morgen — Finanzdatenabruf (15–30 Minuten)

**1. Täglicher Finanzpuls**
```
/budget-vs-actual

Heutigen Morgen-Snapshot abrufen:
- Kassenlage vs. gestern
- Zahlungen oder Eingänge über $[Schwellenwert] über Nacht verarbeitet
- Monatsumsatz bis heute vs. Budget (falls aus dem System verfügbar)
- Abweichungen, die vor dem 9-Uhr-Standup erklärt werden müssen

Geben Sie mir ein 5-Stichpunkte-Morgen-Briefing.
```

**2. Modell-Updates**
```
/commercial-forecaster

Meine Umsatzprognose mit gestrigen Ist-Werten aktualisieren:
- Neue Buchungen: $[X]
- Abgewanderter MRR: $[X]
- Expansion: $[X]

Wie liegt der aktuelle Monat im Vergleich zum Budget? Gibt es einen Trend, der eine Neuprognose erfordert?
```

---

### Modellarbeit (variabel — 1–4 Stunden)

**3. Ein Finanzmodell erstellen oder aktualisieren**
```
/3-statement-model

Erstelle ein 3-Statements-Modell für [Unternehmen].

Historische Daten (letzte 3 Jahre oder was verfügbar ist einfügen):
[GuV, Bilanz, Cashflow-Daten]

Wesentliche Annahmen für die Projektion:
- Umsatzwachstumsrate: [X]% pro Jahr
- Bruttomarge: [X]%
- OpEx als % des Umsatzes: [X]%
- CapEx: [X]% des Umsatzes
- Veränderungen des Betriebskapitals: [kurz]

3 Jahre vorwärts projizieren. Basis-/Aufwärts-/Abwärtsszenarien erstellen.
```

**4. Abweichungsanalyse**
```
/budget-vs-actual

Das monatliche BvI für [MONAT] durchführen.

[Ist-Werte vs. Budget-Daten für jede GuV-Position einfügen]

Kontext:
- Warum Umsatz verfehlt wurde: [kurz]
- Warum S&M unterausgegeben hat: [Einstellung langsamer als geplant]
- Einmalige Posten: [beschreiben]

Erstellen Sie: Abweichungstabelle, Managementkommentar, Neuprognose-Implikation.
```

---

### Berichterstattung und Stakeholder-Kommunikation (variabel)

**5. Board-Pack-Vorbereitung**
```
/board-pack-builder

Das Board-Pack dieses Monats für [Unternehmen] erstellen.

[Alle 7 Eingabeabschnitte bereitstellen: Finanzdaten, KPIs, strategische Updates, Risiken, Anfragen]

Board-Zusammensetzung: [Investoren + Unabhängige]
Letztes Board-Meeting: [Datum, besprochene Hauptpunkte]
Hauptnarrativ dieses Monats: [was die Geschichte ist — im Plan / vorne / hinten und warum]
```

**6. Investorenupdate**
```
/cfo-advisor

Das monatliche Investorenupdate-E-Mail für [Unternehmen] entwerfen.

Zielgruppe: [VC-Investoren / Angels / strategische Investoren]
Zu behandelnde Schlüsselkennzahlen: [ARR, Wachstum, Burn, Runway, wichtige Meilensteine]
Was gut lief: [Liste]
Was nicht: [Liste + kurze Erklärung]
Was wir von Investoren brauchen: [Kontakte / Ratschläge / Genehmigungen]

Tonalität: Transparent, selbstsicher, kurz. Kein Spin — Investoren schätzen Offenheit.
```

---

### Wöchentlicher und monatlicher Zyklus

**7. Monatsabschluss-Checkliste**
Den vollständigen Workflow unter [workflows/finance-month-end.md](../workflows/finance-month-end.md) nachschlagen.

**8. Neuprognose**
```
/budget-vs-actual

[Nach dem Monatsabschluss] Jahres-Neuprognose durchführen.

Jahresumsatz bis dato (einfügen):
[Daten]

Wesentliche Annahmenänderungen gegenüber dem ursprünglichen Budget:
- Umsatz: [was sich geändert hat und warum]
- Personalbestand: [Ist vs. Planung]
- Einmalige Posten: [Liste]

Erstellen Sie: revidierte Jahresprognose, 3 Szenarien (Basis/Aufwärts/Abwärts),
revidierter Cash-Runway für jedes Szenario.
```

---

## 30-Tage-Einstiegsplan (neue Finanzanalysten)

### Woche 1 — Das Unternehmen kennenlernen
- Alle Finance-Skills installieren: `npx claudient add skills finance`
- `/gl-reconciler` für den letzten Monatsabschluss ausführen — den Kontenplan verstehen
- `/budget-vs-actual` für die letzten 3 Monate der Ist-Werte ausführen — Muster erkennen
- Die letzten 3 Board-Packs lesen — das Narrativ des CFO verstehen
- Das Finanzmodell kartieren: Woher kommt der Umsatz? Was treibt die Bruttomarge? Was ist diskretionäres OpEx?

### Woche 2 — Den Abschlussprozess beherrschen
- Den Monatsabschluss mit `/gl-reconciler` begleiten oder durchführen
- Ihre Abweichungskommentarvorlage mit `/budget-vs-actual` erstellen
- Das Budget verstehen: Was waren die Annahmen? Wo liegen wir im Plan-Tracking?
- Ihr Finanz-Dashboard in Ihrem bevorzugten BI-Tool einrichten (Looker, Metabase oder auch Google Sheets)

### Woche 3 — Das Modell erstellen
- Das vollständige 3-Statements-Modell mit `/3-statement-model` erstellen oder überprüfen
- Eine DCF für das Unternehmen durchführen (auch wenn Sie sie nicht sofort benötigen — Bewertungstreiber verstehen ist wichtig)
- Eine Sensitivitätsanalyse erstellen: Welche einzelne Variable beeinflusst den Cash-Runway am stärksten?
- Ihren ersten Board-Pack-Entwurf mit `/board-pack-builder` erstellen

### Woche 4 — Entscheidungen vorantreiben
- Ihr erstes monatliches BvI dem CEO oder CFO präsentieren
- `/commercial-forecaster` nutzen, um eine pipeline-verknüpfte Umsatzprognose zu erstellen
- Das eine finanzielle Risiko identifizieren, das nicht diskutiert wird — es ansprechen
- Ihren Monatsabschluss-Kalender einrichten: was wann abschließt, wer verantwortlich ist

---

## Tool-Integrationen

### QuickBooks / Xero / NetSuite

```
Trial Balance oder GuV aus Ihrem Buchhaltungssystem als CSV oder Excel exportieren.
In Claude einfügen:

"/gl-reconciler — hier ist die Trial Balance für [Monat]. Identifizieren Sie Konten
mit ungewöhnlichen Salden, großen MoM-Schwankungen oder Posten, die Abstimmung benötigen."

"/budget-vs-actual — hier ist der Management-GuV-Export. Erstellen Sie ein BvI gegen
dieses Budget [Budget einfügen]. Schreiben Sie den Managementkommentar."
```

### Excel / Google Sheets

```python
# Für Python-basierte Analysten — Claude mit Ihren Tabellendaten verbinden
import anthropic
import pandas as pd

client = anthropic.Anthropic()

# Ihre Finanzdaten laden
df = pd.read_excel('monthly_financials.xlsx')

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    system="You are a financial analyst. Analyse the provided financial data and identify variances, trends, and anomalies. All figures are in USD thousands. Mark any calculations that need verification with [VERIFY].",
    messages=[{
        "role": "user",
        "content": f"""Run a budget vs actuals analysis on this data:

{df.to_markdown()}

Produce: variance table, management commentary, reforecast recommendation."""
    }]
)
```

### Salesforce / HubSpot (Umsatzprognose)

```json
// CRM mit Claude für pipeline-gesteuerte Prognose verbinden
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@anthropic/salesforce-mcp"],
      "env": {
        "SF_USERNAME": "your-username",
        "SF_PASSWORD": "your-password",
        "SF_TOKEN": "your-security-token"
      }
    }
  }
}
```

Mit verbundenem CRM:
- Pipeline nach Phase abrufen und Claude nach einer Bottom-up-Umsatzprognose fragen
- Pipeline-Deckung mit Quota vergleichen: "Haben wir genug Pipeline, um die Zahl zu erreichen?"
- Deals mit Risiko basierend auf dem letzten Aktivitätsdatum identifizieren

### Notion / Confluence (Board-Pack-Verteilung)

```
Nach dem Erstellen Ihres Board-Packs mit /board-pack-builder:
1. Als Markdown exportieren
2. In Notion oder Confluence einfügen
3. Schreibgeschützten Link mit Board-Mitgliedern vor dem Meeting teilen
4. Im Meeting Claude nutzen, um "Was wäre wenn"-Fragen zum Modell zu beantworten
```

---

## Benchmarks zum Verfolgen

| Kennzahl | Frühes Startup | Wachstumsphase | Öffentlich/reif |
|---|---|---|---|
| Abschlusstage (Monatsende) | 10–15 | 5–7 | 3–5 |
| Board-Pack vor Meeting verteilt | 48 Stunden | 72 Stunden | 5 Tage |
| Prognosegenauigkeit (Umsatz) | ±20% | ±10% | ±5% |
| Erklärte Budget-Abweichung (% der GuV-Positionen) | 60% | 85% | 95% |
| Cash-Runway-Sichtbarkeit | 3 Monate | 6 Monate | 12+ Monate |
| Zeit für BvI-Analyse | 4 Stunden | 2 Stunden | 1 Stunde |
| Zeit für Finanzmodell-Update | 2 Stunden | 45 Minuten | 30 Minuten |

---

## Häufige Fehler (und wie Claude Code sie verhindert)

**Fehler 1: Narrative ohne Zahlen**
Board-Packs, die eine Geschichte erzählen, ohne spezifische Zahlen zu nennen, verlieren an Glaubwürdigkeit. `/board-pack-builder` erstellt zuerst die Finanztabellen und generiert dann ein Narrativ, das an spezifische Zahlen geknüpft ist.

**Fehler 2: Unerklärte Abweichungen**
"Der Umsatz lag unter Budget" ist kein Kommentar. `/budget-vs-actual` strukturiert die Ursachenanalyse, sodass Sie immer erklären *warum*, nicht nur *was*.

**Fehler 3: Einszenarien-Prognosen**
Jede Prognose sollte drei Szenarien haben. `/3-statement-model` und `/budget-vs-actual` bauen Szenarioanalysen standardmäßig ein.

**Fehler 4: Übertriebene Versprechen gegenüber dem Board**
`/board-pack-builder` erstellt den "Anfragen"-Abschnitt — klar und spezifisch angeben, was vom Board benötigt wird, anstatt Anfragen in Folien zu vergraben.

**Fehler 5: Nicht offengelegte Annahmen**
Alle Claude-Finanzoutputs sind mit `[VERIFY]` markiert. Diese Disziplin zwingt Sie dazu, jede Zahl zu überprüfen, bevor Sie veröffentlichen — kritisch für Board-Materialien.

---

## Ressourcen

- [Erste Schritte mit Claude Code](../getting-started.md)
- [Finanz-Monatsabschluss-Workflow](../workflows/finance-month-end.md)
- [DCF-Modell-Skill](../skills/finance/dcf-model.md)
- [Board-Pack-Builder-Skill](../skills/finance/board-pack-builder.md)
- [Budget-vs.-Ist-Skill](../skills/finance/budget-vs-actual.md)
- [3-Statements-Modell-Skill](../skills/finance/3-statement-model.md)

---

> **Arbeiten Sie mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
