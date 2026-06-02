# Claude für Operations Manager und COOs

Alles, was ein Operations Manager oder COO braucht, um KI-gestützte Betriebsabläufe zu führen — Prozessdokumentation, Lieferantenmanagement, OKR-Tracking, Teamkoordination und wöchentliche Berichterstattung — in Claude Code.

---

## Für wen das gedacht ist

Du bist Operations Manager, VP of Operations oder COO, dessen Aufgabe es ist, das Unternehmen am Laufen zu halten. Du verantwortest Prozesse, Werkzeuge, funktionsübergreifende Koordination und operative Kennzahlen. Du verbringst zu viel Zeit in Meetings, die keine Entscheidungen produzieren, mit Dokumenten, die veralten, sobald du sie veröffentlichst, und mit Lieferantenbewertungen, die nie eine klare Empfehlung haben.

**Vor Claude Code:** 4 Stunden, um eine SOP von Grund auf zu schreiben. Ein halber Tag für den Aufbau eines Lieferantenvergleichs. Ein ganzer Nachmittag, um Meeting-Notizen in Aktionspunkte zu verwandeln. Wöchentliche Berichterstattung nimmt den Montagmorgen in Anspruch.

**Danach:** SOPs in 30 Minuten entworfen. Lieferantenmatrizen aus Notizen in 20 Minuten erstellt. Meeting-Notizen in 5 Minuten in Jira-Tickets umgewandelt. Wöchentlicher Puls fertig, bevor der Kaffee kalt wird.

---

## 30-Sekunden-Installation

```bash
# Installiere den vollständigen Operations-Stack
npx claudient add skills small-business/sop-writer
npx claudient add skills small-business/weekly-pulse
npx claudient add skills small-business/meeting-to-action
npx claudient add skills gtm/revenue-operations
npx claudient add skills productivity/scrum-master
npx claudient add skills productivity/process-mapper
npx claudient add skills productivity/vendor-evaluator
npx claudient add agents advisors/coo-advisor
npx claudient add agents advisors/chief-of-staff
```

---

## Dein Claude Code Operations-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/sop-writer` | SOPs mit RACI- und Entscheidungstabellen entwerfen, formatieren und versionieren | Immer wenn ein Prozess dokumentiert werden muss |
| `/process-mapper` | Bestehende Prozesse kartieren: Flussdiagramm, RACI, Engpassanalyse, Verbesserungsempfehlungen | Prozessaudits, Automatisierungsvorbereitung, funktionsübergreifende Übergaben |
| `/vendor-evaluator` | RFP-Vorlagen, Bewertungsrubrik, Vergleichsmatrix, Empfehlungsmemo | Jede Lieferantenentscheidung über $10K/Jahr |
| `/weekly-pulse` | Wöchentlicher OKR-Check-in, Kennzahlen-Dashboard, Blocker-Zusammenfassung | Jeden Montagmorgen |
| `/meeting-to-action` | Meeting-Notizen oder Transkripte in strukturierte Aktionspunkte mit Eigentümern umwandeln | Nach jedem bedeutenden Meeting |
| `/revenue-operations` | RevOps-Reporting, Pipeline-Gesundheit, Prognosegenauigkeit | GTM/RevOps-Arbeit |
| `/scrum-master` | Sprint-Zeremonien, Retrospektiven, Velocity-Coaching | Team-Betriebsrhythmus |

### Agents

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `coo-advisor` | Sonnet | Strategische operative Entscheidungen, Organisationsdesign-Fragen |
| `chief-of-staff` | Sonnet | Funktionsübergreifende Koordination, Stakeholder-Kommunikation, Priorisierung |

---

## Täglicher Workflow

### Morgen-OKR-Puls (15 Minuten)

**Starte jeden Tag mit dem Wissen, wo du bei deinen Schlüsselkennzahlen stehst.**

```
/weekly-pulse

Heutiges Datum: [Datum]
Woche: [W des Q]

OKR-Status:
Ziel 1: [Name] → Schlüsselergebnis: [Kennzahl, aktueller Wert vs. Ziel]
Ziel 2: [Name] → Schlüsselergebnis: [Kennzahl, aktueller Wert vs. Ziel]

Gestrige nennenswerte Ereignisse: [wichtige Entscheidungen, aufgetauchte Blocker, erreichte oder verpasste Meilensteine]

Was ich von diesem Check-in brauche:
- Red Flags, die heute meine Aufmerksamkeit erfordern
- OKRs, die abdriften (gelb) und diese Woche Eingriff benötigen
- Ein operativer Hebel, den ich heute ziehen kann, um etwas zu bewegen
```

---

### Prozessdokumentation (30–60 Minuten pro Prozess)

```
/process-mapper

Prozess: [Name — z.B. Kunden-Onboarding, Lieferantenbeschaffung]
Auslöser: [was diesen Prozess startet]
Endzustand: [wie erledigt aussieht]
Teilnehmer: [involvierte Rollen]
Werkzeuge: [verwendete Systeme]
Aktuelle Probleme: [was du bereits als kaputt weißt]

Erstelle: Schritt-für-Schritt-Karte, RACI-Matrix, Engpassanalyse, Top-3-Verbesserungsempfehlungen.
```

Dann nutze `/sop-writer`, um die Karte in eine formatierte SOP mit Versionshistorie umzuwandeln:

```
/sop-writer

Prozessname: [Name]
Version: 1.0
Eigentümer: [Rolle]
Zuletzt aktualisiert: [Datum]
Überprüfungsfrequenz: [vierteljährlich]

Basierend auf dieser Prozesskarte: [process-mapper-Ausgabe einfügen]

Schreibe eine vollständige SOP in unserem Standardformat, einschließlich:
- Zweck und Umfang
- Rollen und Verantwortlichkeiten (RACI)
- Schritt-für-Schritt-Anweisungen
- Entscheidungsregeln (wann zu eskalieren)
- Kennzahlen und Erfolgskriterien
- Änderungsprotokoll
```

---

### Lieferantenmanagement

**Vor jeder bedeutenden Lieferantenentscheidung:**

```
/vendor-evaluator

Ich muss Lieferanten für [Kategorie] bewerten.
Budget: [$X]
Zeitplan: [wann wir entscheiden müssen]
Lieferanten, die ich in Betracht ziehe: [Namen]
Muss-Haves: [Liste]
Nice-to-Haves: [Liste]

Erstelle: Bewertungsrubrik, RFP-Fragen, Vergleichsmatrix-Vorlage.
```

**Nach dem Sammeln von Angeboten:**

```
/vendor-evaluator

Erstelle eine Vergleichsmatrix aus diesen Angeboten.

Anbieter A Notizen: [deine Notizen einfügen]
Anbieter B Notizen: [deine Notizen einfügen]
Anbieter C Notizen: [deine Notizen einfügen]

Vereinbarte Bewertungskriterien: [aus der Rubrik]

Erstelle: gewichtete Vergleichstabelle, 3-Jahres-TCO-Schätzung, Risikoregister, Empfehlungsmemo für das Führungsteam.
```

---

### Meeting-Management

**Nach jedem bedeutenden Meeting:**

```
/meeting-to-action

[Meeting-Notizen oder Transkript einfügen]

Meeting-Typ: [Entscheidung / Brainstorming / Status / Eskalation]
Teilnehmer: [Liste mit Rollen]
Datum: [Datum]
Kontext: [was dieses Meeting erreichen sollte]

Extrahiere:
- Getroffene Entscheidungen (jede mit dem Eigentümer auflisten)
- Aktionspunkte (Eigentümer, Fälligkeitsdatum, Lieferobjekt — eine Zeile pro Punkt)
- Offene Fragen, die Nachverfolgung benötigen
- Gemachte Zusagen, auf die andere warten
- Parkplatz-Punkte (angesprochen, aber nicht gelöst)

Ausgabe als Slack-fähige Zusammenfassung und separate Jira/Linear-Aufgabenliste formatieren.
```

---

### Funktionsübergreifende Koordination

Nutze den `chief-of-staff`-Agent für komplexe Koordination:

```
@chief-of-staff

Ich muss [Initiative] über [Teams] koordinieren.

Stakeholder:
- [Team/Person 1]: [was sie verantworten, was sie von anderen brauchen]
- [Team/Person 2]: [was sie verantworten, was sie von anderen brauchen]

Aktuelle Blocker: [Liste]
Zeitplan: [wichtige Meilensteine]

Hilf mir: [Koordinationsplan entwerfen / Stakeholder-Update schreiben / kritischen Pfad identifizieren]
```

---

## Wöchentlicher Rhythmus

### Montag — OKR-Puls und Wochenplanung

```
/weekly-pulse

Woche: [W des Q]
OKR-Status für jedes Schlüsselergebnis: [aktueller Wert / Ziel / Trend]
Top-3-Prioritäten diese Woche: [Liste]
Abhängigkeiten von anderen Teams diese Woche: [Liste]
Meetings diese Woche, die Vorbereitung brauchen: [Liste]

Ausgabe: Einseitiges Wochenbriefing, das ich bei meinem Montags-Check-in mit dem CEO teilen kann.
```

### Mittwoch — Wochenmitte-Check

```
Schneller Wochenmitte-Check:
- Welche Prioritäten liegen im Plan?
- Was droht diese Woche zu verrutschen?
- Welche Entscheidungen stehen aus und blockieren Fortschritt?
- Muss ich etwas eskalieren?

Gib mir eine 5-Punkte-Slack-Nachricht zum Senden an meine direkten Mitarbeiter.
```

### Freitag — Wöchentlicher Ops-Bericht

```
/weekly-pulse

Wöchentlicher Ops-Bericht für: [Datum Wochenende]

Kennzahlen-Update:
[Daten aus deinen Dashboards einfügen — oder Kennzahlen und ihre Werte beschreiben]

Erfolge dieser Woche: [Liste]
Verfehlungen dieser Woche: [Liste + Ursache für jede]
Prioritäten nächste Woche: [Top 3]
Entscheidungen, die die Führung vor Montag treffen muss: [Liste]

Format: Zusammenfassung (3 Stichpunkte) + detaillierter Abschnitt für das Operations-Team.
```

---

## 30-Tage-Einarbeitungsplan

### Woche 1 — Audit und Baseline

- Installiere alle Operations-Skills und konfiguriere deine primären Tools (Jira/Linear MCP wenn verwendet)
- Führe `/process-mapper` bei deinen Top-3-schmerzhaftesten Prozessen durch
- Dokumentiere, welche Prozesse keine SOP haben (das sind deine Risikobereiche)
- Richte deine OKR-Tracking-Vorlage in `/weekly-pulse` ein
- Identifiziere deine Top-2-Lieferantenentscheidungen in den nächsten 90 Tagen

### Woche 2 — Dokumentationssprint

- Nutze `/sop-writer`, um SOPs für die Top-3-Prozesse der letzten Woche zu entwerfen
- Führe `/meeting-to-action` bei deinen 5 jüngsten Meeting-Notizen durch (rückwirkend)
- Beginne, `/meeting-to-action` ab jetzt bei jedem Meeting zu nutzen
- Richte den Weekly-Pulse als Montags-Morgen-Ritual ein

### Woche 3 — Lieferanten- und funktionsübergreifende Arbeit

- Starte deine erste Lieferantenbewertung mit `/vendor-evaluator`
- Nutze den `chief-of-staff`-Agent, um deinen ersten funktionsübergreifenden Koordinationsplan zu entwerfen
- Führe eine Retrospektive mit einem Team durch, indem du `/scrum-master` nutzt
- Identifiziere deinen gefährdetsten OKR und entwerfe eine Intervention

### Woche 4 — Reporting und Optimierung

- Erstelle deinen ersten vollständigen wöchentlichen Ops-Bericht mit `/weekly-pulse`
- Überprüfe deine Prozesskarten — welche Engpässe kannst du eliminieren?
- Liefere das Lieferanten-Empfehlungsmemo aus Woche 3
- Tracke die gesparte Zeit diesen Monat vs. vor Claude Code (Ziel: 8–12 Stunden/Woche)

---

## Tool-Integrationen

### Jira / Linear (Projekttracking)

```json
// Zu ~/.claude/settings.json hinzufügen
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Damit verbunden kann `/meeting-to-action` Aufgaben direkt in deinem Projekt-Board erstellen.

### Notion (Dokumentation)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-integration-token"
      }
    }
  }
}
```

Nutzen für: SOPs, Prozesskarten, Lieferantenvergleichsmatrizen, wöchentliche Berichte.

### Slack (asynchrone Kommunikation)

Formatiere alle `/weekly-pulse`- und `/meeting-to-action`-Ausgaben für Slack, indem du anhängst:
"Formatiere das als Slack-Nachricht — keine Markdown-Überschriften, nutze Stichpunkte und Fettschrift zur Betonung."

### Google Sheets / Airtable (Kennzahlen-Tracking)

OKR-Daten als CSV exportieren → in `/weekly-pulse` für Analyse und Trendberichte einfügen.

---

## Zu verfolgende Kennzahlen

Nutze Claude Code, um diese monatlich zu analysieren:

| Kennzahl | Ziel | Warnsignal |
|---|---|---|
| OKR-Abschlussrate (vierteljährlich) | > 70% | < 50% |
| Prozessdokumentationsabdeckung | > 80% der kritischen Prozesse | < 60% |
| Meeting-Aktionspunkt-Erledigungsrate | > 85% bis zum Fälligkeitsdatum | < 70% |
| Lieferantenentscheidungs-Zykluszeit | < 30 Tage für wichtige Entscheidungen | > 60 Tage |
| Wöchentliche Berichtszeit (Min.) | < 30 Minuten | > 90 Minuten |
| Funktionsübergreifende Blocker-Lösungszeit | < 3 Werktage | > 7 Tage |

---

## Häufige Fehler und wie Claude Code hilft, sie zu vermeiden

**Fehler 1: SOPs, die ignoriert werden**
Claude Code erstellt SOPs mit klaren Eigentümern, Entscheidungsregeln und Überprüfungsdaten. Ohne diese werden SOPs zu Regalstücken.

**Fehler 2: Lieferantenentscheidungen auf Basis von Demos, nicht Daten**
`/vendor-evaluator` erzwingt eine Bewertungsrubrik vor der Demo, damit du nicht Äpfel mit Birnen und einem Verkaufsgespräch vergleichst.

**Fehler 3: Meetings, die Gespräche produzieren, keine Entscheidungen**
`/meeting-to-action` ist nach jedem Entscheidungsmeeting nicht verhandelbar. Innerhalb von 30 Minuten ausführen, sonst verfällt der Kontext.

**Fehler 4: OKRs vierteljährlich statt wöchentlich tracken**
`/weekly-pulse` läuft montags morgens. OKRs, die wöchentlich abdriften, sterben bis zum Quartalsende.

**Fehler 5: Undokumentierte Prozesse = Schlüsselpersonen-Abhängigkeiten**
Wenn die Person, die "einfach weiß, wie es funktioniert", geht, hast du keinen Prozess. `/process-mapper` ist der Weg, um einzelne Ausfallpunkte zu eliminieren.

---

## Ressourcen

- [Prozessdokumentationsleitfaden](./sop-writing-guide.md)
- [Lieferantenbewertungs-Playbook](../skills/productivity/vendor-evaluator.md)
- [Wöchentlicher OKR-Workflow](../workflows/ops-weekly.md)
- [COO-Advisor-Agent](../agents/advisors/coo-advisor.md)
- [Erste Schritte mit Claude Code](./getting-started.md)

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
