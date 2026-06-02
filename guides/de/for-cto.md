# Claude für CTOs und Tech Leads

Alles, was ein CTO, VP Engineering oder Tech Lead für KI-gestützte Engineering-Leadership benötigt — Architekturentscheidungen, Engineering-Strategie, technische Einstellungen, Team-Topologie, Priorisierung von technischen Schulden und Board-Reporting.

---

## Für wen dieser Leitfaden ist

Du bist CTO, VP Engineering, Principal Engineer oder Tech Lead und verantwortlich für die technische Ausrichtung eines Unternehmens oder einer Engineering-Organisation. Du verbindest Business-Strategie mit Engineering-Execution. Du triffst Build-vs.-Buy-Entscheidungen, legst Team-Topologie fest, führst Incident-Reviews durch, bewertest Architektur-Trade-offs und berichtest dem Board — oft in derselben Woche.

**Vor Claude Code:** ADR: 90 Minuten. Engineering-Strategie-Dokument: eine Woche abendlicher Arbeit. Interview-Kit für eine neue Senior-Stelle: 3 Stunden. Board-Bericht zur technischen Gesundheit: ein halber Tag.

**Danach:** ADR in 20 Minuten. Engineering-Strategie-Outline in 45 Minuten. Interview-Kit in 30 Minuten. Board-Tech-Bericht in 25 Minuten.

---

## 30-Sekunden-Installation

```bash
# Den vollständigen CTO/Tech-Lead-Stack installieren
npx claudient add skills productivity/adr-writer
npx claudient add skills productivity/tech-debt-tracker
npx claudient add skills devops-infra/platform-engineering
npx claudient add skills productivity/vertical-slice-planner
npx claudient add skills productivity/spec-driven-workflow
npx claudient add skills productivity/engineering-strategy
npx claudient add skills productivity/tech-interview-kit
npx claudient add agents advisors/cto-advisor
npx claudient add agents advisors/vpe-advisor
npx claudient add agents core/architect
```

---

## Dein Claude Code CTO-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/engineering-strategy` | Engineering-Strategie-Dokument: Tech-Vision, Build vs. Buy, Team-Topologie, 12-Monats-Roadmap | Jährliche/halbjährliche Planung, Board-Vorbereitung, neue CTO-Rolle |
| `/adr-writer` | Architecture Decision Record — dokumentiert die Entscheidung, Kontext, Trade-offs, Konsequenzen | Nach jeder bedeutenden Architekturentscheidung |
| `/tech-interview-kit` | Coding-Challenges, System-Design-Prompts, Bewertungsrubriken, Debrief-Vorlagen | Vor jeder technischen Einstellungsrunde |
| `/tech-debt-tracker` | Schulden-Inventar, Priorisierungsrahmen, Investitionsvorschlag für die Führung | Quartalsweise Überprüfungen technischer Schulden |
| `/vertical-slice-planner` | Epics in lieferbare Verticals mit klaren Akzeptanzkriterien aufteilen | Sprint- und Release-Planung |
| `/spec-driven-workflow` | Technische Spezifikation schreiben — Problembeschreibung, Anforderungen, Designoptionen | Vor dem Entwickeln komplexer Features |
| `/platform-engineering` | Plattformstrategie, Developer Experience, CI/CD, internes Tooling | Platform/Infra-Teamarbeit |

### Agenten

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `cto-advisor` | Opus | Strategische Entscheidungen mit hohem Risiko — Org-Design, Build vs. Buy, Technologie-Wetten |
| `vpe-advisor` | Sonnet | Execution und Team-Gesundheit — Velocity, Einstellungen, operative Exzellenz |
| `architect` | Opus | Komplexes System-Design — verteilte Systeme, Datenarchitektur, Skalierbarkeit |

---

## Täglicher Workflow

### Morgen-Engineering-Health-Check (15 Minuten)

```
Quick Engineering-Org-Health-Check für [DATUM]:

Metriken von gestern:
- Deployments in Produktion: [X] (Ziel: [N pro Tag])
- Fehlgeschlagene Deployments / Rollbacks: [X]
- Offene Incidents: [X] / P1-Incidents in den letzten 7 Tagen: [X]
- P1-Reaktionszeit (letzter Incident): [X Minuten] (Ziel: < 30 Min)
- Zusammengeführte Pull Requests: [X] / offen > 5 Tage: [X] (langlebige PRs = Merge-Risiko)
- On-Call-Eskalationen: [X]

Team-Puls:
- Ein Engineer seit > 1 Tag blockiert? [ja/nein + wer]
- Ein Team unter 70 % Sprint-Commitment-Tracking? [ja/nein]
- Kritische Deadlines in den nächsten 14 Tagen? [Liste]

Markieren: Was erfordert heute meine Aufmerksamkeit (nach Dringlichkeit × Wirkung geordnet)?
```

---

### Architektur- und Design-Arbeit

**Für jede bedeutende technische Entscheidung:**

```
/adr-writer

Entscheidung: [was wird entschieden?]
Kontext: [warum ist diese Entscheidung jetzt notwendig? Was ist der Business- oder technische Treiber?]
Betrachtete Optionen:
1. [Option A Name]: [kurze Beschreibung]
2. [Option B Name]: [kurze Beschreibung]
3. [Option C Name oder "nichts tun"]

Einschränkungen: [Budget, Zeitplan, bestehende Stack-Abhängigkeiten, Team-Expertise]
Bewertungskriterien: [was am wichtigsten ist — Performance / Wartbarkeit / Kosten / Geschwindigkeit]

Vollständigen ADR schreiben mit: Status, Kontext, Entscheidung, Konsequenzen und Trade-offs.
```

**Für komplexe neue Features:**

```
/spec-driven-workflow

Feature: [Name]
Business-Ziel: [welches Ergebnis dies dient]
Problembeschreibung: [welches Nutzer- oder Systemproblem wir lösen]
Einschränkungen: [technisch, Zeitplan, Team-Kapazität]

Produzieren: Technische Spezifikation mit Problembeschreibung, Anforderungen (funktional + nicht-funktional), Designoptionen mit Trade-off-Analyse, empfohlenem Ansatz und offenen Fragen, die vor dem Start geklärt werden müssen.
```

---

### Team-1:1s und Coaching

Den `vpe-advisor`-Agenten verwenden, um schwierige Engineering-Management-Gespräche vorzubereiten:

```
@vpe-advisor

Ich habe morgen ein 1:1 mit [Rolle, Senioritätsstufe].
Kontext: [was los ist — Performance, Karriereentwicklung, Team-Reibung, Scope-Frage]

Hilf mir:
- Das Gespräch produktiv zu rahmen (nicht als Beschwerde oder Performance-Warnung)
- Fragen zu stellen, die mir echte Informationen geben
- Eine Antwort vorzubereiten, wenn sie [spezifisches Anliegen] ansprechen
- Ein konkretes Ergebnis für das Gespräch festzulegen
```

---

### Board- und Führungsreporting

```
/engineering-strategy

Den Engineering-Abschnitt des Board-Decks für [QUARTAL/MONAT] schreiben.

Zielgruppe: Board und C-Suite (nicht-technisch, fokussiert auf Risiko und ROI)
Zu berichtende Schlüsselmetriken:
- Deployment-Frequenz: [aktuell vs. letztes Quartal vs. Ziel]
- Zuverlässigkeit (Uptime): [aktuell vs. Ziel]
- Sicherheit: [alle Incidents, behobene Schwachstellen]
- Engineering-Velocity: [übergeordnet: beschleunigen oder verlangsamen wir?]
- Headcount: [aktuell / geplante Einstellungen / Fluktuation]
- Tech-Debt-Investition: [% der Sprint-Kapazität, die dieses Quartal dafür genutzt wurde]

Highlights: [wesentliche gelieferte Dinge]
Risiken: [was Engineering in den nächsten 90 Tagen entgleisen könnte]
Anforderungen: [was vom Board benötigt wird — Budget, Entscheidungen, Unterstützung]

Format: 3–5 Folien-würdiger Inhalt (Executive Summary + Details). Klare Sprache, kein Fachjargon.
```

---

### Priorisierung technischer Schulden

```
/tech-debt-tracker

Aktuelles Tech-Debt-Inventar:
[Bekannte Schulden-Items auflisten oder beschreiben — oder aus einem Dokument/Jira einfügen]

Für jedes Item: Name, was es verlangsamt, geschätzte Behebungskosten, Risiko wenn unbehandelt

Priorisierungsrahmen:
Jedes Item bewerten:
- Business-Wirkung wenn NICHT behoben: 1–5 (5 = existenzgefährdendes Risiko)
- Developer-Velocity-Steuer: 1–5 (5 = Team verbringt > 20 % der Zeit damit, es zu umgehen)
- Aufwand zur Behebung: 1–5 (1 = Schnellfix, 5 = Multi-Sprint-Aufwand)

Prioritätsscore = (Business-Wirkung + Velocity-Steuer) / Aufwand

Produzieren:
- Gerankte Liste mit Scores
- Top-3-Items für nächstes Quartal mit Business-Case für jedes
- Vorgeschlagene Kapazitätszuteilung (% der Sprint-Kapazität für Tech Debt)
- Exec-freundliche Zusammenfassung: "Was unsere technischen Schulden kosten und was die Behebung freischaltet"
```

---

## Wöchentlicher Rhythmus

### Montag — Engineering-Strategie-Ausrichtung

```
/engineering-strategy

Wöchentlicher Ausrichtungs-Check:
- Setzen wir die 12-Monats-Strategie um? Was driftet ab?
- Welche OKRs sind dieses Quartal gefährdet?
- Funktioniert die Team-Topologie? Koordinationsprobleme, die ich ansprechen muss?
- Wichtige Entscheidungen, die ich diese Woche treffen muss: [Liste]

5-Punkte-Wochenfokus-Memo ausgeben, das ich mit meinen Team Leads teilen kann.
```

### Mittwoch — Technische Einstellungsüberprüfung

`/tech-interview-kit` verwenden, wenn eine Stelle besetzt wird:

```
/tech-interview-kit

Ich habe eine [LEVEL] [ROLLE]-Interview-Schleife laufen.
Interviewer: [Liste + welche Phase jeder übernimmt]

Hilf mir:
- Die Interview-Phasen auf Lücken zu prüfen (testen wir die richtigen Dinge für dieses Level?)
- Eine Debrief-Vorlage für Freitag vorzubereiten
- Zu kalibrieren, wie "Messlatte" für diese spezifische Rolle vs. allgemeiner Rubrik aussieht

[Falls Take-home eingereicht wurde: Einreichung einfügen und um einen Review-Rahmen bitten]
```

### Freitag — Build-vs.-Buy-Review und Stakeholder-Kommunikation

```
@cto-advisor

Build-vs.-Buy-Entscheidung, mit der ich ringe: [die Fähigkeit, Optionen, Zeitplan, Kosten beschreiben]

Meine Einschränkungen:
- Engineering-Kapazität: [aktuelle Auslastung — sind wir am Limit?]
- Budget: [verfügbar für Tooling/Services]
- Zeitplan: [wann diese Fähigkeit benötigt wird]
- Expertise unseres Teams in diesem Bereich: [stark / schwach / keine]
- Strategische Bedeutung: [ist das ein Differenzierungsmerkmal oder eine Commodity?]

Empfehlung mit deinen stärksten 3 Gründen und was deine Meinung ändern würde.
```

---

## 30-Tage-Einarbeitungsplan (neuer CTO)

### Woche 1 — Zuhören und diagnostizieren

- Alle CTO-Skills installieren und Tooling konfigurieren
- `/engineering-strategy` im Audit-Modus ausführen: "Den aktuellen Stand des Engineerings hier beschreiben. Was funktioniert? Was ist kaputt? Was sind die wichtigsten Risiken?"
- Die Top-3-technischen Pain Points vom Team identifizieren (fragen, nicht annehmen)
- Aktuelle Team-Topologie kartieren — wer besitzt was, wo sind Übergaben langsam
- Die letzten 12 Monate ADRs lesen (falls vorhanden) um frühere Entscheidungen zu verstehen

### Woche 2 — Bereits getroffene Entscheidungen dokumentieren

- ADRs für undokumentierte Architekturentscheidungen schreiben, die du entdeckst
- `/tech-debt-tracker` ausführen — Basis-Inventar erstellen, auch wenn unvollständig
- Die Einstellungspipeline prüfen — offene Stellen und welche Level-Messlatte gesetzt wurde
- DORA-Metriken-Baseline prüfen (Deployment-Frequenz, MTTR, Change-Failure-Rate)

### Woche 3 — Erste strategische Kommunikation

- Erstes Engineering-Strategie-Dokument mit `/engineering-strategy` entwerfen
- Mit 2–3 der erfahrensten Engineers validieren, bevor es veröffentlicht wird
- CEO oder Führung präsentieren: Was ich sehe, was mein Plan für 12 Monate ist
- Erstes technisches Interview mit dem neuen Kit aus `/tech-interview-kit` durchführen

### Woche 4 — Prozess und Rhythmus

- Engineering-Health-Check als tägliches 15-Minuten-Ritual etablieren
- Tech-Debt-Priorisierungs-Session mit Team Leads starten
- DORA-Metrik-Ziele festlegen und dem Team veröffentlichen
- Ersten Board-Engineering-Bericht liefern

---

## Tool-Integrationen

### GitHub (Code und PRs)

```bash
# Claude Code hat native GitHub-Integration per gh CLI
# PR-Reviews, Code-Gesundheit, Deployment-Status direkt abrufen

gh pr list --state open
gh run list --limit 10  # CI/CD-Pipeline-Status
```

### Linear / Jira (Engineering-Planung)

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-api-key"
      }
    }
  }
}
```

Verwenden für: Sprint-Planung mit `/vertical-slice-planner`, Tech-Debt-Tracking, Roadmap-Transparenz.

### Datadog / Honeycomb (Observability)

Incident-Daten und DORA-Metriken exportieren → in den Engineering-Health-Check-Prompt einfügen für Trendanalyse.

### Notion / Confluence (Dokumentation)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-token"
      }
    }
  }
}
```

Verwenden für: Engineering-Strategie-Dokumente, ADRs, Team-Topologie, Tech-Debt-Backlog.

---

## Zu verfolgende Metriken

| Metrik | Ziel (Wachstumsphase) | Warnsignal |
|---|---|---|
| Deployment-Frequenz | Täglich oder mehrmals pro Woche | < 1/Woche |
| Lead Time für Änderungen | < 1 Tag | > 1 Woche |
| Change Failure Rate | < 10 % | > 20 % |
| MTTR (Mean Time to Restore) | < 1 Stunde | > 4 Stunden |
| Engineering-Verfügbarkeit (Team) | > 85 % | < 70 % |
| Tech Debt % der Sprint-Kapazität | 15–20 % | > 30 % oder < 10 % |
| Time-to-Hire (Engineering-Rollen) | < 45 Tage | > 90 Tage |
| Angebotsannahmequote | > 80 % | < 60 % |
| Time-to-First-PR für neue Engineers | < 3 Tage | > 1 Woche |

---

## Häufige Fehler und wie Claude Code hilft, sie zu vermeiden

**Fehler 1: Architekturentscheidungen, die mündlich getroffen und nie aufgeschrieben werden**
`/adr-writer` dauert 20 Minuten pro Entscheidung. Ohne ADRs wird implizites Wissen zu technischen Schulden.

**Fehler 2: Einstellungen ohne kalibrierte Rubrik**
`/tech-interview-kit` erzwingt Kalibrierung vor dem ersten Kandidaten. Interviewer, die sich nicht einigen können, was "gut" bedeutet, werden inkonsistent einstellen.

**Fehler 3: Tech Debt reaktiv angegangen (nur wenn etwas kaputt geht)**
`/tech-debt-tracker` macht Schulden zu einem Business-Case. Führung finanziert, was einen definierten Kostenfaktor und ROI hat.

**Fehler 4: Engineering-Strategie, die nur als Folienpräsentation existiert**
`/engineering-strategy` produziert ein lebendes Dokument mit Metriken. Quartalsmäßig überarbeiten.

**Fehler 5: Board-Engineering-Berichte, die sich wie eine Fremdsprache anfühlen**
`/engineering-strategy` verwenden, um für nicht-technische Zielgruppen zu schreiben. DORA-Metriken brauchen einen erklärenden Satz, bevor sie für ein Board etwas bedeuten.

---

## Ressourcen

- [Leitfaden zu Architecture Decision Records](./adr-writing.md)
- [Engineering-Strategie-Skill](../skills/productivity/engineering-strategy.md)
- [Tech-Interview-Kit](../skills/productivity/tech-interview-kit.md)
- [Tech-Debt-Tracker](../skills/productivity/tech-debt-tracker.md)
- [Wöchentlicher CTO-Workflow](../workflows/cto-weekly.md)
- [Erste Schritte mit Claude Code](./getting-started.md)

---

> **Arbeite mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
