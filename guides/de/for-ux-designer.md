# Claude für UX Designer und Researcher

Alles, was ein UX Designer oder Researcher benötigt, um KI-gestützte Research-Synthese, Usability-Analysen, Persona-Erstellung und Design-Kritiken in Claude Code durchzuführen.

---

## Für wen dieser Leitfaden gedacht ist

Du bist UX Designer, UX Researcher oder Product Designer, dessen Arbeit User-Research-Synthese, Usability-Tests, Persona-Erstellung, Journey Mapping, Design-Kritiken, Accessibility-Reviews und Stakeholder-Kommunikation umfasst. Du verbringst zu viel Zeit damit, Research-Ergebnisse zu formatieren, Berichte zu schreiben, die niemand liest, und Personas von Grund auf neu zu erstellen. Claude Code reduziert diesen Overhead, damit du Zeit für das ausgeben kannst, was tatsächlich menschliches Urteilsvermögen erfordert: mit Benutzern sprechen, Design-Entscheidungen treffen und das Produkt beeinflussen.

**Vor Claude Code:** 3-4 Stunden, um einen Usability-Report zu schreiben. 2 Stunden, um eine Persona aus Interview-Notizen zu erstellen. Einen halben Tag, um ein UX-Audit für ein Feature-Handoff zu erstellen.

**Danach:** Vollständiger Usability-Report in 30 Minuten. Persona in 10 Minuten aus Rohnotizen. UX-Audit in 45 Minuten, priorisiert nach Schweregrad und Aufwand.

---

## 30-Sekunden-Installation

```bash
# Alle UX-Designer-Skills installieren
npx claudient add skills product

# Oder gezielt auswählen:
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/ux-audit
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add agents roles/hypothesis-tester
```

---

## Dein Claude Code UX-Stack

### Skills (Slash-Befehle)

| Skill | Was er macht | Wann verwenden |
|---|---|---|
| `/ux-researcher` | User-Personas, Journey Maps, Usability-Testpläne, Research-Synthese | Zentrale Research-Arbeit |
| `/usability-report` | Vollständiger Usability-Report: Session-Zusammenfassungen, Schweregradeinstufungen, Empfehlungen | Nach jeder Runde Usability-Tests |
| `/persona-builder` | Datenbasierte User-Personas: Ziele, Frustrationen, Verhaltensweisen, Zitate | Nach der Research-Synthese |
| `/ux-audit` | Heuristische Evaluation gegen Nielsens 10 Heuristiken, priorisierte Ergebnisse | Vor dem Launch, bei Feature-Handoffs |
| `/product-discovery` | Discovery-Frameworks: Problemdefinition, Annahmen-Mapping, Opportunity-Sizing | Frühe Discovery-Phase |
| `/experiment-designer` | A/B-Test-Design, Hypothesenformulierung, Metrikauswahl, Stichprobengröße | Design-Entscheidungen mit Daten validieren |

### Agents

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `hypothesis-tester` | Sonnet | Design-Hypothesen mit Research- oder Analytics-Daten validieren |

---

## Täglicher Workflow

### Morgens — Research-Synthese-Sessions

**Rohdaten in Erkenntnisse umwandeln:**
```
/ux-researcher

Synthetisiere User-Research-Ergebnisse aus diesen 5 Interview-Notizen.

Research-Typ: User-Interviews
Anzahl der Sessions: 5
Rohergebnisse: [Interview-Notizen einfügen, eine pro Session]

Ich benötige: geclusterte Themen, priorisierte Erkenntnisse im Format "Wenn X, dann Y Benutzer — das bedeutet Z"
und P1/P2/P3-Empfehlungen.
```

**Persona aus der Synthese erstellen:**
```
/persona-builder

Erstelle User-Personas aus diesen Research-Daten.

Datenquellen: User-Interviews (5), Support-Tickets (3 Monate), NPS-Verbatims
Produkt: [Name]
Nutzerbasis: [wer dieses Produkt verwendet]

[synthetisierte Ergebnisse von oben einfügen]

Ich benötige 2 Personas für einen Design-Sprint nächste Woche. Primäre Verwendung: Design-Entscheidungen und Scope-Diskussionen.
```

---

### Nach einem Usability-Test — Berichterstellung

**Session-Notizen in einen priorisierten Bericht umwandeln:**
```
/usability-report

Schreibe einen Usability-Test-Report für [Feature-Name].

Produkt: [Name]
Getestetes Feature: [spezifischer Flow]
Testformat: moderiert remote
Teilnehmer: 6 — [Screening-Kriterien]
Durchgeführte Sessions: [Zeitraum]
Forschungsfragen:
1. [Primäre Frage]
2. [Sekundäre Frage]

Rohergebnisse:
[Beobachternotizen, Zitate, Aufzeichnungen zur Aufgabenerledigung einfügen]
```

---

### Vor dem Launch — UX-Audit

**Bevor ein Feature ausgeliefert wird:**
```
/ux-audit

Führe ein UX-Audit von [Feature/Flow] durch.

Produkt: [Name]
Umfang: [Screens oder Flow für das Audit]
Plattform: web
Benutzertyp: [Persona-Name]

[UI beschreiben — Screenshot-Links, Figma-Links einfügen oder die Oberfläche beschreiben]

Gib mir: Nielsen-Heuristik-Scores, alle Issues mit Schweregradeinstufungen und eine priorisierte Fix-Liste
sortiert nach Wirkung × Aufwand.
```

---

### Design-Kritik-Moderation

**Strukturierte Kritik für die eigene Arbeit oder ein Design-Review:**
```
/ux-researcher

Führe eine strukturierte Design-Kritik dieses Designs durch.

Design: [beschreiben oder Figma-Link teilen]
Benutzerziel: [was der Benutzer zu erreichen versucht]
Kontext: [wo dies im Flow erscheint]
Einschränkungen: [technische Einschränkungen, Edge Cases zu berücksichtigen]

Kritik gegen:
1. Erreicht es das Benutzerziel ohne Training?
2. Gibt es Heuristik-Verletzungen (Nielsen)?
3. Was ist der wahrscheinlichste Benutzerfehler?
4. Was würde dazu führen, dass es für Edge-Case-Benutzer scheitert?
5. Wie würde eine 10x bessere Version aussehen (um Annahmen zu hinterfragen)?

Ausgabe: strukturiertes Feedback mit Schweregradeinstufungen und spezifischen Redesign-Vorschlägen.
```

---

### Stakeholder-Kommunikation

**Research in ein Entscheidungsbriefing übersetzen:**
```
/usability-report

Wandle diesen Usability-Report in ein Stakeholder-Entscheidungsbriefing um.

Zielgruppe: VP Product und Engineering-Lead — maximal 10 Minuten Lesezeit
Ziel: Genehmigung erhalten, um 3 kritische Fixes vor dem Launch zu priorisieren

[Usability-Report-Ergebnisse einfügen]

Format: Executive Summary → 3 kritische Issues → Geschäftsauswirkung → empfohlene Maßnahme → Aufwandsschätzung.
Keine Methodologiedetails — die sind im Anhang.
```

---

### Wöchentlich — Journey Mapping

**Die aktuelle Erfahrung abbilden:**
```
/ux-researcher

Erstelle eine Customer Journey Map für [Erfahrung].

Erfahrung: [abzubildende End-to-End-Erfahrung]
User-Persona: [welche Persona]
Touchpoints: [abzudeckende Kanäle — E-Mail, Produkt, Support, Website]

Verwende das 5-Phasen-Format. Für jede Phase: Benutzeraktionen, Touchpoints, Gedanken, Gefühle (1-5 Score),
Schmerzpunkte (🔴 kritisch / 🟡 bemerkenswert) und Chancen.

Füge eine Gesamterfahrungskurve hinzu, die die Stimmung über die Phasen hinweg darstellt.
Niedrigster Stimmungspunkt = höchste prioritäre Design-Chance.

Evidenzbasis: [verfügbare Research-Daten — Interviews / Analytics / Support-Tickets / Annahme]
```

---

## 30-Tage-Einarbeitungsplan (neue UX-Mitarbeiter oder Quereinsteiger)

### Woche 1 — Einrichtung und Research-Tools
- Alle Product-Skills installieren: `npx claudient add skills product`
- `/persona-builder` auf bestehende User-Research-Daten ausführen — mit dem aktuellen Benutzerverständnis vertraut machen
- `/ux-audit` auf den meistgenutzten Flow des Produkts ausführen — Baseline-Heuristik-Bewertung
- Bestehende Usability-Test-Reports mit `/usability-report` als Formatierungsreferenz überprüfen

### Woche 2 — Research-Praxis
- Erste User-Interviews durchführen — Rohnotizen machen
- `/ux-researcher` verwenden, um sofort nach jeder Session zu synthetisieren (Notizen nicht kalt werden lassen)
- Einen Research-Synthese-Report entwerfen und mit dem Team teilen
- `/ux-audit` an 3 Konkurrenzprodukten üben — heuristische Bewertungsinstinkte aufbauen

### Woche 3 — Berichterstellung und Kommunikation
- Einen vollständigen Usability-Test an einem aktuellen Feature durchführen
- Den Bericht mit `/usability-report` schreiben — mit PM und Engineering teilen
- Ergebnisse in ein Stakeholder-Briefing umwandeln mit dem obigen Format
- Verfolgen, welche Empfehlungen akzeptiert vs. deprioritiert werden — und warum

### Woche 4 — Experimente und Validierung
- `/experiment-designer` verwenden, um einen Test für die wichtigste Design-Hypothese zu entwerfen
- `/hypothesis-tester`-Agent verwenden, um Annahmen gegen bestehende Analytics oder Research zu validieren
- Einen heuristischen Walkthrough mit einem Ingenieur durchführen, wobei die `/ux-audit`-Ausgabe als Agenda dient

---

## Tool-Integrationen

### Figma (Design-Tool)
Claude Code liest Figma-Dateien nicht direkt. Best Practice:
- Schlüssel-Screens als Bilder exportieren und im Audit-Prompt referenzieren
- Den Figma-"Share for presentation"-Link als Referenz in den Notizen verwenden
- Die UI in strukturierten Begriffen beschreiben, wenn Screenshots nicht geteilt werden können

### Dovetail / Notion (Research-Repository)
Interview-Notizen als Klartext exportieren → in `/ux-researcher`-Synthese-Prompts einfügen.
Für strukturierte Repositories die Rohnotizen oder Highlights kopieren — nicht die getaggte/kodierte Ansicht.

### Maze / UserTesting.com (unmoderiertes Testen)
Session-Zusammenfassungen und Aufgabenerledigungsmetriken exportieren → in `/usability-report` einfügen.
Die quantitativen Metriken (Erledigungsrate, Zeit pro Aufgabe) und die qualitativen Highlights einschließen.

### Miro / FigJam (kollaborative Workshops)
Claude verwenden, um den Affinitätskarten-Inhalt zu generieren → nach Miro für visuelle Gruppierung exportieren.
Der `/usability-report`-Syntheseschritt liefert gruppierte Themen, die direkt in Sticky Notes übertragen werden können.

### Linear / Jira (Issue-Tracking)
Die priorisierte Fix-Liste aus `/usability-report` und `/ux-audit` verwenden, um Issues direkt zu erstellen.

```bash
# Claude bitten, die Fix-Liste als Linear/Jira-Tickets zu formatieren
"Format die P1- und P2-Ergebnisse als Linear Issue-Beschreibungen mit:
- Titel (imperativ)
- User Story (als [Persona] möchte ich...)
- Akzeptanzkriterien (3-5 Stichpunkte)
- Labels: [ux] [bug] oder [ux] [improvement]"
```

---

## Zu verfolgende Kennzahlen

Diese verwenden, um die Research-Wirkung nachzuweisen:

| Kennzahl | Ziel |
|---|---|
| Research-zu-Empfehlung-Zykluszeit | <2 Tage von der letzten Session bis zum geteilten Bericht |
| Empfehlungsannahmerate | >60% der P1/P2-Ergebnisse innerhalb von 2 Sprints adressiert |
| SUS-Score-Verbesserung (nach Fix) | +5 SUS-Punkte pro großem Heuristik-Fix-Zyklus |
| Zeit bis zur Persona-Aktualisierung nach Research | <1 Woche |
| Vor dem Launch gefundene Accessibility-Issues (vs. nach Launch) | 100% vor Launch gefunden |
| Usability-Report-Lieferung nach Testabschluss | <48 Stunden |

---

## Häufige Fehler (und wie Claude Code hilft, sie zu vermeiden)

**Fehler 1: Berichte schreiben, die niemand liest**
Stakeholder lesen keine 20-seitigen Berichte. Das Executive-Summary-Format von `/usability-report` und die Entscheidungsbriefing-Ausgabe verwenden. Eine Seite, drei Ergebnisse, eine Empfehlung und eine Aufwandsschätzung.

**Fehler 2: Personas ohne Datenbasis**
`/persona-builder` markiert jede Behauptung, der Beweise fehlen, und verweigert das Erfinden von Zitaten. Mit echten Daten füttern.

**Fehler 3: Alles gleichermaßen auditieren**
`/ux-audit` bewertet nach Schweregrad × Häufigkeit und erstellt eine erzwungen-gerankte Liste. Ein kosmetisches Problem und ein aufgabenblockendes Problem nicht gleich behandeln.

**Fehler 4: Research-Synthese, die eine Woche dauert**
`/ux-researcher` sofort nach jeder Session ausführen. Nicht bündeln — fortlaufend synthetisieren. Notizen, die 3 Tage alt sind, verlieren ihre Textur.

**Fehler 5: Die "Warum es wichtig ist"-Übersetzung überspringen**
Ingenieure und PMs müssen die Geschäftsauswirkung verstehen, nicht nur das UX-Problem. Die `/usability-report`-Ausgabe enthält immer einen "Warum es wichtig ist"-Abschnitt für jedes Ergebnis — nicht überspringen.

---

## Ressourcen

- [Getting started with Claude Code](../getting-started.md)
- [UX research sprint workflow](../workflows/ux-research-sprint.md)
- [Experiment design skill](../skills/product/experiment-designer.md)
- [Product discovery skill](../skills/product/product-discovery.md)
- [Hypothesis tester agent](../agents/roles/hypothesis-tester.md)

---
