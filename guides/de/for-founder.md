# Claude für Gründer und CEOs

Alles, was ein Startup-Gründer benötigt, um KI-gestützte Unternehmensoperationen durchzuführen — Investorenupdates, Board-Vorbereitung, OKR-Reviews, Einstellungsentscheidungen, Finanzmodellierung, Wettbewerbsintelligenz und den wöchentlichen Rhythmus, der ein Unternehmen am Laufen hält.

---

## Für wen dieser Leitfaden gedacht ist

Sie sind Gründer oder CEO eines venture-finanzierten Startups, von Pre-Seed bis Series B. Sie machen gleichzeitig 15 Jobs: Strategie, Fundraising, Teamführung, Produktentscheidungen, Kundengespräche und Investorenbeziehungen. Claude Code reduziert den Zeitaufwand für jeden davon um das 5- bis 20-fache.

**Vor Claude Code:** 3 Stunden für das Schreiben eines Board-Decks. 45 Minuten pro Investorenupdate. Ein halber Tag für den Aufbau eines Finanzmodells. Tiefgehende Wettbewerbsrecherche, die eine Woche Kontextwechsel kostet.

**Danach:** Board-Deck in 30 Minuten strukturiert, in 2 Stunden ausgefüllt. Investorenupdate in 10–15 Minuten. Finanzmodell iterativ in einer Session aufgebaut. Wettbewerber-Teardown in einer Stunde.

---

## Installation in 30 Sekunden

```bash
# Das vollständige Gründerpaket installieren
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/board-deck-builder
npx claudient add skill gtm/revenue-operations
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill finance/dcf-model
npx claudient add agents advisors/ceo-advisor
npx claudient add agents advisors/cfo-advisor
npx claudient add agents advisors/cto-advisor
npx claudient add agents advisors/chief-of-staff
```

---

## Ihr Claude Code Gründer-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/founder-weekly-review` | Unternehmensgesundheit, OKR-Check, Team-Pulse, CEO-Prioritäten für die nächste Woche | Jeden Sonntag oder Montagmorgen |
| `/investor-update` | Monatliche Investoren-E-Mail: MRR, Burn, Highlights, Lowlights, Anfrage | Erste Woche jeden Monats |
| `/board-deck-builder` | Vierteljährliches Board-Deck: Kennzahlen, Narrativ, schlechte Nachrichten, Fundraise | 2 Wochen vor dem Board-Meeting |
| `/revenue-operations` | Pipeline-Gesundheit, Vertriebskennzahlen, Prognosegenauigkeit, GTM-Hebel | Wöchentlich mit Ihrem CRO/Head of Sales |
| `/commercial-forecaster` | Umsatzprognose: Bottom-up und Top-down, Szenariomodellierung | Monatlich oder vor dem Fundraise |
| `/pitch-deck` | Investoren-Pitch-Narrativ für neue Runden-Fundraising | Series A / B Raise-Vorbereitung |
| `/financial-plan` | Betriebsmodell, Personalplan, Szenarioplanung, Cash-Management | Vierteljährlich oder vor dem Raise |
| `/dcf-model` | Discounted-Cashflow-Bewertung, Vergleichsanalyse, Cap-Table-Modellierung | M&A, Secondary, Fundraise |

### Agenten

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `ceo-advisor` | Opus | Strategische Entscheidungen, Org-Design, Fundraise-Strategie, schwierige Entscheidungen |
| `cfo-advisor` | Sonnet | Finanzmodellierung, Burn-Analyse, Cap Table, Term Sheets |
| `cto-advisor` | Sonnet | Technische Schulden-Entscheidungen, Einstellungsstandard, Build vs. Buy, Architekturrisiko |
| `chief-of-staff` | Sonnet | Funktionsübergreifende Koordination, Board-Vorbereitung, All-Hands, OKR-Tracking |

---

## Täglicher Workflow

### Morgendlicher Unternehmenspuls (15 Minuten)

```
/founder-weekly-review

Morgen-Puls-Check — [DATUM]:
- Was sind die 3 wichtigsten Dinge, die heute im Unternehmen passieren?
- Gibt es Brände von über Nacht (Kundeneskalation, Teamproblem, Presse)?
- Was ist meine wertvollste Zeitverwendung heute?

Verfügbare Daten: [Slack-Zusammenfassung / MRR-Bewegung / eventuelle Über-Nacht-Updates einfügen]
```

### Investoren- und Board-Kommunikation (bei Bedarf)

```
/investor-update

Entwurf meines [monatlichen Updates / Zwischenmeldung / Ad-hoc-Updates]:
Monat: [MONAT]
Wichtige Kennzahlen-Bewegung: [MRR- oder ARR-Änderung]
Neuigkeiten in diesem Zeitraum: [Erfolge, Herausforderungen, CTO-Abgang, Neueinstellung usw.]
Anfrage: [was ich von Investoren diesen Monat brauche]
```

### Finanzüberprüfung (wöchentlich, 30 Minuten)

```
/financial-plan

Wöchentlicher Finanzcheck:
- Cash: [$X] | Burn: [$X/Monat] | Runway: [X Monate]
- MRR diese Woche: [$X] | vs. letzte Woche: [$X]
- Unerwartete Kosten diese Woche?

Wie sehen die nächsten 90 Tage auf dem aktuellen Kurs aus?
Was würde es brauchen, um den Runway ohne Fundraising um 2 Monate zu verlängern?
```

### Wöchentliche Planung (Freitagnachmittag oder Sonntag)

```
/founder-weekly-review

End-of-Week-Review für die Woche vom [DATUM].

[Einfügen: MRR, Pipeline-Updates, Team-Neuigkeiten, OKR-Check, eventuelle Brände]

Erstellen Sie: Unternehmensgesundheits-Ampel, OKR-Status, 3 Erfolge, 2 Lowlights, CEO-Prioritäten für nächste Woche, die eine Entscheidung, die ich treffen muss.
```

---

## Wichtige Workflows nach Szenario

### Fundraising

```
1. Die Runde recherchieren:
/dcf-model + /financial-plan
Welchen ARR und welche Kennzahlen brauche ich, um bei [Zielbewertung] zu fundraisen?

2. Das Narrativ aufbauen:
/pitch-deck
Series [X] Narrativ — aktueller ARR, Wachstumsrate, Mittelverwendung, Marktthese.

3. Investoren-Meetings vorbereiten:
/ceo-advisor (Agent)
Helfen Sie mir, die 10 schwierigsten Fragen zu antizipieren, die ein [Tier-1-VC] stellen wird.

4. Tracken und abschließen:
/commercial-forecaster
Meine Fundraise-Pipeline modellieren: [N Investoren auf welcher Stufe] → erwartetes Abschlussdatum.
```

### Eine Schlüsselführungskraft einstellen

```
/ceo-advisor

Ich stelle einen [VP Sales / CTO / CFO] ein. Helfen Sie mir:
1. Das Profil definieren (Must-haves vs. Nice-to-haves für unsere Phase)
2. Die Scorecard schreiben (5–7 Dimensionen, jede mit einer Rubrik)
3. Den Interviewprozess strukturieren (wer interviewt, in welcher Reihenfolge, was jede Person bewertet)
4. 3 rote Fahnen zum Herausfiltern identifizieren
5. Das Angebotsschreiben formulieren (Vergütungsphilosophie, Eigenkapital, Erwartungen)

Unternehmenskontext: [Phase, ARR, Teamgröße, größte Herausforderung, die diese Einstellung löst]
```

### Wettbewerbsintelligenz

```
/ceo-advisor

Tiefgehende Wettbewerbsanalyse von [Wettbewerber]:
- Worin sind sie wirklich gut? Was lieben Kunden an ihnen?
- Wo sind sie schwach? Was sagen ihre abgewanderten Kunden?
- Wie sind sie uns gegenüber positioniert — Preis, ICP, GTM?
- Was würden sie tun, wenn wir [Feature/Schachzug] launchen würden?
- Was ist das eine, worüber wir uns am meisten Sorgen machen sollten?

Zu prüfende Quellen: G2-Reviews, Stellenausschreibungen, ihr Blog, jüngste Finanzierung, LinkedIn-Einstellungen.
```

### Board-Vorbereitung

```
/board-deck-builder

Vierteljährliches Board-Meeting — [QUARTAL]:

Kennzahlen: [ARR, Wachstum, NRR, Burn, Personalbestand]
Besondere Themen: [alles Ungewöhnliche — Pivot, wichtiger Abgang, Fundraise, großer Gewinn]
Vom Board benötigte Entscheidungen: [alles auflisten, das Genehmigung oder Input erfordert]

Erstellen Sie die Deck-Struktur. Ich fülle das Narrativ für jeden Abschnitt aus.
```

---

## 30-Tage-Einstiegsplan (Gründer, der Claude Code zum ersten Mal verwendet)

### Woche 1 — Grundlagen
- Alle Gründer-Skills über die obigen Befehle installieren
- `/founder-weekly-review` für diese Woche ausführen — mit dem Format vertraut werden
- `/financial-plan` mit Ihren aktuellen Ist-Werten ausführen — Ihr Basis-Betriebsmodell erstellen
- `/investor-update` für den letzten Monat ausführen — an Ihre Investoren senden

### Woche 2 — Rhythmus
- `/founder-weekly-review` als Montagmorgen-Ritual verwenden (30 Minuten)
- `/ceo-advisor` für eine strategische Entscheidung einsetzen, die Sie aufgeschoben haben
- Ihre OKR-Tracking-Vorlage erstellen — von nun an wöchentlich ausführen

### Woche 3 — Fundraise und Kommunikation
- `/pitch-deck` oder `/board-deck-builder` für das nächste bevorstehende Event ausführen
- Eine `CLAUDE.md` in Ihrem Root mit Ihrem Unternehmenskontext einrichten (Phase, ARR, Team, Investoren), damit Claude immer Kontext hat
- Eine `/commercial-forecaster`-Session durchführen, um Ihre Umsatztrajektorie zu verstehen

### Woche 4 — Vollständige Integration
- Jedes Investorenupdate mit `/investor-update` entwerfen
- Jedes Board-Meeting mit `/board-deck-builder` vorbereiten
- Jede wichtige Einstellung durch `/ceo-advisor` für das Scorecard-Design laufen lassen
- Jede Woche mit `/founder-weekly-review` reviewen

---

## CLAUDE.md für Gründer

Erstellen Sie eine `CLAUDE.md` in Ihrem Home-Verzeichnis oder Projekt-Root, damit Claude immer Ihren Unternehmenskontext kennt:

```markdown
# Company Context

Company: [NAME]
Stage: [Seed / Series A / Series B]
ARR: [$X]
MRR growth rate: [X% MoM]
Burn rate: [$X/month]
Runway: [X months]
Headcount: [N]
Key investors: [list]
Fundraise status: [not raising / preparing / in market / closed]

## Top 3 priorities this quarter
1. [Priority 1 — e.g., close Series A]
2. [Priority 2 — e.g., hit $1.2M ARR]
3. [Priority 3 — e.g., hire Head of Sales]

## Team
CEO: [name]
CTO: [name]
Head of Product: [name]
Head of Sales: [name]

## Key metrics to know
NRR: [X%]
Gross margin: [X%]
CAC payback: [X months]
Churn: [X% monthly]

## ICP
[2 sentences describing ideal customer — size, vertical, role, pain]
```

Damit hat jede Claude-Session vollständigen Kontext, ohne erneut erklären zu müssen.

---

## Tool-Integrationen

### Notion (für OKRs und Board-Dokumente)

```json
// In ~/.claude/settings.json hinzufügen
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-notion"],
      "env": {
        "NOTION_API_TOKEN": "your-token"
      }
    }
  }
}
```

Damit verbunden kann Claude Ihren OKR-Tracker, Board-Vorbereitungsdokumente und Investoren-Pipeline lesen und aktualisieren.

### Linear (für Engineering-OKRs)

Linear via MCP verbinden, um Sprint-Daten direkt in Ihr wöchentliches Review zu ziehen. Claude kann Ihnen sagen, was geliefert wurde, was verschoben wurde und was gefährdet ist — ohne Ihren CTO um einen Bericht zu bitten.

### QuickBooks / Xero

Ihre GuV und Ihr Cashflow als CSV exportieren. In `/financial-plan` für Burn-Analyse und Szenariomodellierung einfügen. Für Gründer mit einer Echtzeit-Verbindung gibt das QuickBooks-MCP Claude Live-Finanzdaten.

---

## Kennzahlen, die wichtig sind (nach Phase)

### Seed

| Kennzahl | Ziel | Warum |
|---|---|---|
| Zeit bis zum ersten zahlenden Kunden | < 90 Tage | Zahlungsbereitschaft validieren |
| Woche-2-Retention | > 30% | PMF-Signal |
| NPS | > 40 | Signal für Produktliebe |
| Burn Multiple | < 5x | Kapitaleffizienz der Frühphase |
| Gründer: Kundengespräche pro Woche | 5+ | Kundennähe wahren |

### Series A

| Kennzahl | Ziel | Warum |
|---|---|---|
| MoM ARR-Wachstum | > 15% | Nachweisbare Geschwindigkeit |
| NRR | > 110% | Land and Expand funktioniert |
| CAC Payback | < 18 Monate | Unit Economics tragfähig |
| Burn Multiple | < 3x | Effizientes Wachstum |
| Pipeline-Deckung | > 3x Ziel | Vorhersehbarer Umsatz |
| Zeit bis zur Quota (Vertriebsmitarbeiter) | < 4 Monate | GTM ist wiederholbar |

### Series B

| Kennzahl | Ziel | Warum |
|---|---|---|
| YoY ARR-Wachstum | > 100% | Rule-of-40-Komponente |
| Bruttomarge | > 70% | Software-Level-Marge |
| NRR | > 120% | Expansions-getriebenes Wachstum |
| Burn Multiple | < 2x | Kapitaleffizienz |
| CAC Payback | < 12 Monate | Bewährte Unit Economics |

---

## Häufige Gründerfehler, bei denen Claude Code hilft

**Fehler 1: Investorenupdates verstreichen lassen**
Setzen Sie eine monatliche Erinnerung. `/investor-update` reduziert den Zeitaufwand auf 10–15 Minuten. Konsistente Updates bauen Vertrauen auf, selbst wenn die Zahlen schwierig sind.

**Fehler 2: Überraschungen in Board-Meetings**
Das Bad-News-Framework von `/board-deck-builder` nutzen. Jeden Board-Mitglied einzeln anrufen, bevor das Meeting schlechte Nachrichten übermittelt. Nie das Deck die erste Gelegenheit sein lassen, bei der sie etwas Schwieriges hören.

**Fehler 3: OKRs im Januar gesetzt, im Dezember reviewed**
`/founder-weekly-review` enthält jede Woche einen OKR-Check. Zurückliegende KRs werden in Woche 5 bemerkt, nicht in Woche 13.

**Fehler 4: Einstellung nach Intuition statt Scorecard**
`/ceo-advisor` nutzen, um vor jeder Senior-Einstellung eine Scorecard zu erstellen. Die Rubrik dokumentieren. Jedes Panel gegen die Rubrik nachbesprechen.

**Fehler 5: Finanzmodell nur für das Fundraising**
Ihr Betriebsmodell sollte ein lebendiges Dokument sein. `/financial-plan` monatlich nutzen. Den Runway innerhalb von 2 Wochen kennen, nicht innerhalb von 2 Monaten.

---

## Ressourcen

- [Erste Schritte mit Claude Code](getting-started.md)
- [Gründer-Wochen-Workflow](../workflows/founder-weekly.md)
- [Board-Deck-Builder-Skill](../skills/productivity/board-deck-builder.md)
- [Investorenupdate-Skill](../skills/productivity/investor-update.md)
- [Finanzplan-Skill](../skills/finance/financial-plan.md)
- [CEO-Berater-Agent](../agents/advisors/ceo-advisor.md)

---

> **Arbeiten Sie mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
