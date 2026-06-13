# Claude für Technical Writer und Docs Engineers

Alles, was ein Technical Writer oder Docs Engineer benötigt, um KI-gestützte Dokumentations-Workflows zu betreiben — API-Docs, READMEs, Runbooks, Changelogs, ADRs, Docs-Site-Architektur, Style Guides und Content-Audits.

---

## Für wen dieser Leitfaden gedacht ist

Du bist Technical Writer, Docs Engineer oder Developer Advocate und deine Aufgabe ist es, komplexe technische Produkte verständlich zu machen. Du schreibst API-Dokumentation, Onboarding-Guides, Runbooks und Changelogs. Du reviewst PRs auf Dokumentationsgenauigkeit. Du pflegst eine Docs-Site. Du kämpfst darum, Informationen aktuell zu halten. Claude Code macht die mechanischen Teile dieser Arbeit schnell und konsistent, damit du dich auf das Schreiben und das redaktionelle Urteilsvermögen konzentrieren kannst, das tatsächlich Expertise erfordert.

**Vor Claude Code:** 4 Stunden, um einen API-Endpunkt von Grund auf zu dokumentieren. 30 Minuten, um einen Changelog-Eintrag zu schreiben, der 30 Sekunden gelesen wird. 2 Stunden, um ein Runbook aus einem Post-Mortem zu erstellen. Auf einen Ingenieur warten, der erklärt, was ein neues Feature macht, bevor du anfangen kannst zu schreiben.

**Danach:** API-Endpunkt in 10 Minuten aus dem Code oder der Spec dokumentiert. Changelog aus einem Git-Log in 5 Minuten. Runbook aus einer Incident-Timeline in 20 Minuten. Docs-Site-IA-Review in 30 Minuten.

---

## 30-Sekunden-Installation

```bash
# Alle Technical-Writer-Skills installieren
npx claudient add skills productivity

# Oder gezielt auswählen:
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/runbook-generator
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/changelog-writer
npx claudient add agents roles/changelog-narrator
```

---

## Dein Claude Code Docs-Stack

### Skills (Slash-Befehle)

| Skill | Was er macht | Wann verwenden |
|---|---|---|
| `/readme-generator` | Vollständiges README aus Code oder Beschreibung | Neues Projekt, neue Open-Source-Veröffentlichung |
| `/runbook-generator` | Operatives Runbook aus Incident- oder Prozessbeschreibung | Nach jedem Incident, für jeden operativen Prozess |
| `/adr-writer` | Architecture Decision Record aus einer technischen Entscheidung | Wenn eine bedeutende Architekturentscheidung getroffen wird |
| `/doc-site-builder` | Docs-Site-IA: Nav-Struktur, Templates, Content-Taxonomie, Suchstrategie | Docs-Site starten oder umstrukturieren |
| `/api-doc-writer` | API-Docs aus OpenAPI-Spec oder Code: Endpunkte, Beispiele, Fehlercodes, SDKs | API-Änderungen, neue Endpunkte, Migrationsleitfäden |
| `/changelog-writer` | Benutzerorientierter Changelog aus Git-Log oder PR-Liste | Jedes Release, wöchentlicher Digest |

### Agents

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `changelog-narrator` | Haiku | Batch-Changelog-Generierung über mehrere Releases hinweg |

---

## Täglicher Workflow

### Morgens — Engineering-Standup-Output → Dokumentationsaufgaben

**Gestrige PRs in Docs-Aufgaben umwandeln:**
```
/changelog-writer

Diese PRs wurden gestern gemergt. Klassifiziere jeden als: braucht neue Doku / braucht Doku-Update /
braucht Changelog-Eintrag / nur intern (keine Doku nötig).

PR-Liste:
[gemergte PR-Titel und Beschreibungen einfügen]

Für jeden, der eine Doku oder einen Changelog-Eintrag benötigt: gib mir eine einzeilige Zusammenfassung, was zu schreiben ist.
```

**Schnelle API-Doku für einen neuen Endpunkt:**
```
/api-doc-writer

Dokumentiere diesen API-Endpunkt aus dem Code:

[Route-Handler-Code, OpenAPI-Snippet oder einfache Beschreibung einfügen]

Ausgabe: vollständige Endpunkt-Referenzdoku mit Request/Response-Tabellen, allen Parametern,
Fehlercodes und Code-Beispielen in curl, Python und TypeScript.
```

---

### Content-Review-Zyklus

**Einen Docs-Abschnitt auf Veraltung prüfen:**
```
/doc-site-builder

Prüfe diesen Abschnitt unserer Docs auf Content-Probleme.

Seiten (Titel und Datum der letzten Aktualisierung angeben):
[Liste der Seiten]

Aktuelle Produktänderungen, die diese Seiten veraltet haben könnten:
[Liste der Produktänderungen der letzten 90 Tage — aus Changelog oder Release Notes]

Identifiziere: wahrscheinlich veraltete Seiten / Seiten mit fehlendem Inhalt / Seiten, die aufgeteilt oder zusammengeführt werden sollten.
Ausgabe: priorisiertes Content-Update-Backlog.
```

**Style-Review für eine Doku-Seite:**
```
Überprüfe diese Dokumentationsseite auf Klarheit, Vollständigkeit und Stil.

Seite: [Inhalt einfügen]

Prüfe gegen:
1. Ist das Benutzerziel allein aus dem Titel ersichtlich?
2. Beginnt die Seite damit, was der Benutzer erreichen kann, nicht was das Feature ist?
3. Sind Code-Beispiele so ausführbar wie sie sind (keine Platzhalterwerte, die sie kaputtmachen)?
4. Werden Fehlermeldungen mit Ursachen und Lösungen erklärt, nicht nur aufgelistet?
5. Ist es durchgehend in der zweiten Person ("du") geschrieben?
6. Gibt es unnötige Abschnitte, die gestrichen werden könnten?

Ausgabe: spezifische Bearbeitungen auf Zeilenebene mit Erklärung.
```

---

### Release-Zyklus — Changelog schreiben

**Bei jedem Release:**
```
/changelog-writer

Wandle diesen Git-Log in einen benutzerorientierten Changelog für v[X.Y.Z] um.

Zielgruppe: [Endbenutzer / Entwickler / Admins]
Release-Datum: [Datum]

git log:
[git log --oneline Ausgabe für dieses Release einfügen]

Ausfiltern: Dependency-Upgrades, interne Refactorings, nur testbezogene Änderungen.
Gruppieren nach: Breaking Changes → Neue Features → Verbesserungen → Fixes.
Für [Entwickler / nicht-technische Benutzer] schreiben.
Links zu Docs für jedes neue Feature mit Dokumentation einschließen.
```

---

### Incident-Dokumentation — Runbooks

**Post-Incident: die Reaktion als Runbook festhalten:**
```
/runbook-generator

Erstelle ein Runbook aus dieser Incident-Timeline.

Service: [Service-Name]
Incident-Typ: [was schiefgelaufen ist]
Incident-Timeline:
[aus deinem Incident-Tracking-Tool oder Slack-Thread einfügen]

Erstelle ein Runbook, das folgendes abdeckt:
- Symptome und Erkennungskriterien
- Schrittweise Diagnoseprozedur
- Behebungsschritte (nummeriert, mit genauen Befehlen)
- Eskalationspfad
- Präventionscheckliste (was vor dem nächsten Auftreten zu prüfen ist)

Format: operatives Runbook, dem ein On-Call-Ingenieur folgen kann, der diesen Incident noch nie gesehen hat.
```

---

### Architekturentscheidungen — ADRs

**Eine technische Entscheidung festhalten, bevor sie verloren geht:**
```
/adr-writer

Schreibe einen Architecture Decision Record für [Entscheidung].

Entscheidung: [was entschieden wurde]
Kontext: [die Situation, die eine Entscheidung erforderte — warum war sie nötig?]
Betrachtete Optionen: [liste die evaluierten Alternativen auf]
Entscheidungsbegründung: [warum diese Option gegenüber den Alternativen gewählt wurde]
Konsequenzen: [die Trade-offs — was diese Entscheidung einfacher und was schwieriger macht]
Status: [Akzeptiert / Vorgeschlagen / Veraltet / Ersetzt durch ADR-N]

Verwende das Nygard-Format. Einschließen: Titel, Datum, Status, Kontext, Entscheidung, Konsequenzen.
```

---

### Docs-Site-Architektur

**Eine Docs-Site umstrukturieren:**
```
/doc-site-builder

Entwirf die Informationsarchitektur für unsere Docs-Site.

Produkt: [Name und Beschreibung]
Zielgruppe: [Entwickler / Endbenutzer / Admins / alle]
Aktueller Stand: [Migration von Notion / Umstrukturierung einer bestehenden Site / Neustart]
Benötigte Doku-Typen: [Getting Started, API-Referenz, Anleitungen, konzeptionelle Docs, Release Notes]
Content-Volumen: [ungefähre Anzahl der Seiten]
Plattform: [Docusaurus / MkDocs / Mintlify / noch nicht gewählt]

Erstelle:
- Top-Level-Nav-Struktur mit Begründung
- Diátaxis-Content-Klassifikation (Tutorial / How-to / Referenz / Erklärung)
- Seiten-Templates für jeden Content-Typ
- Content-Gap-Analyse
- Launch-Readiness-Checkliste
```

---

## 30-Tage-Einarbeitungsplan (neue Technical Writer)

### Woche 1 — Einrichtung und Docs-Audit
- Alle Produktivitäts-Skills installieren: `npx claudient add skills productivity`
- `/doc-site-builder` Diátaxis-Klassifikation auf alle bestehenden Docs ausführen — Lücken und gemischte Seiten identifizieren
- Alle bestehenden Docs in deinem Hauptbereich lesen — veraltete Inhalte notieren (gegen aktuelle PRs abgleichen)
- 2-3 Engineering-Standups begleiten — hören, was im nächsten Sprint geliefert wird

### Woche 2 — API-Docs und Referenzdokumentation
- 3 API-Endpunkte ohne gute Dokumentation auswählen
- `/api-doc-writer` verwenden, um jeden aus dem Code zu entwerfen — mit dem Ingenieur, der ihn geschrieben hat, reviewen
- Zeit von Entwurf bis Genehmigung messen — Bearbeitungszyklen verfolgen, um Prompts zu verbessern
- Den Docs-as-Code-PR-Review-Prozess mit Engineering einrichten

### Woche 3 — Changelog und Release Notes
- Zugang zum Git-Log oder gemergte PR-Feed erhalten
- Den nächsten Release-Changelog mit `/changelog-writer` schreiben — mit vorherigen Changelogs für Ton und Tiefe vergleichen
- 3 Runbooks für häufige On-Call-Incidents schreiben, die noch keine Dokumentation haben
- Das ADR-Archiv durchsehen — sind die getroffenen Entscheidungen dokumentiert?

### Woche 4 — Content-Strategie
- Einen vollständigen Content-Audit durchführen: welche Docs haben die meisten Seitenaufrufe? Höchste Absprungrate? Stärkste Korrelation mit Support-Tickets?
- Analytics verwenden, um die Top-5-Seiten zu identifizieren, auf denen Benutzer landen und scheitern (hohe Absprungrate + geringe Zufriedenheit)
- Einen Docs-Verbesserungssprint für Engineering vorschlagen: 5 Seiten, messbares Ziel
- Content-Audit-Ergebnisse dem Team präsentieren

---

## Tool-Integrationen

### GitHub / GitLab (Docs-as-Code)

CI-Checks bei jedem Docs-PR ausführen:

```yaml
# .github/workflows/docs.yml
- name: Check broken links
  uses: lycheeverse/lychee-action@v1

- name: Spell check
  uses: streetsidesoftware/cspell-action@v2

- name: Lint markdown
  uses: DavidAnson/markdownlint-cli2-action@v9
```

Claude Code kann beim Schreiben von Prosa helfen — CI erzwingt Konsistenz und erkennt defekte Links, bevor sie Benutzer erreichen.

### OpenAPI / Swagger (API-Specs)

Wenn dein Team OpenAPI verwendet:
- Spec im selben Repo wie die Docs committen
- `/api-doc-writer` verwenden, um menschenlesbare Docs aus der Spec zu generieren
- Bei jeder Spec-Änderung neu generieren — API-Referenz, die generiert werden kann, nicht manuell pflegen

```bash
# Docs aus Spec generieren
npx claudient run api-doc-writer --input openapi.yaml --audience developers
```

### Mintlify / Docusaurus / MkDocs (Docs-Plattformen)

Alle unterstützen MDX oder Markdown mit Frontmatter. Claude Code generiert Markdown; du verwaltest die Plattformkonfiguration.

Empfohlenes Frontmatter-Muster:
```yaml
---
title: "How to configure authentication"
description: "Set up OAuth 2.0, API key, or SSO authentication for your integration"
last_updated: "2026-06-02"
tags: [authentication, security, setup]
---
```

### Linear / Jira (Docs-Backlog)

Docs-Aufgaben als erstklassige Engineering-Tickets verwalten. Label: `docs`, `docs-api`, `docs-runbook`.

Claude Code erstellt den Entwurf — das Ticket verfolgt Review und Veröffentlichung. Den Review-Zyklus nicht überspringen.

### Slack / Teams (Engineering-Zusammenarbeit)

Einen `#docs-updates`-Kanal einrichten, in dem:
- Gemergte PRs mit benutzersichtbaren Änderungen eine Benachrichtigung auslösen
- Technical Writer in einem Thread (durchsuchbar für zukünftige Referenz) nach Kontext bei Ingenieuren fragen können
- Release-Changelogs vor der Veröffentlichung zur Überprüfung gepostet werden

---

## Zu verfolgende Kennzahlen

| Kennzahl | Ziel |
|---|---|
| API-Endpunkt-Dokumentationsabdeckung | 100% der öffentlichen Endpunkte dokumentiert |
| Changelog-Lieferzeit nach Release | Am selben Tag wie das Release |
| ADR-Abdeckung | ADR für jede bedeutende Architekturentscheidung vorhanden |
| Runbook-Abdeckung | Runbook für jeden P1-Incident-Typ vorhanden |
| Defekte Links in Produktions-Docs | 0 (durch CI erzwungen) |
| Docs-Feedback-Score ("War das hilfreich?") | >70% positiv |
| Zeit von PR-Merge bis Docs veröffentlicht | <24 Stunden für kleinere Änderungen, <72 Stunden für größere Features |
| Veraltete Seiten (>6 Monate nicht aktualisiert vs. Produktänderungen) | <10% der Docs |

---

## Häufige Fehler (und wie Claude Code hilft, sie zu vermeiden)

**Fehler 1: API-Docs, die so geschrieben sind, als wären sie für dich, nicht für den Integrator**
`/api-doc-writer` schreibt immer aus der Perspektive des Integrators, enthält funktionierende Code-Beispiele in mehreren Sprachen und erklärt Fehlercodes mit Ursachen und Lösungen — nicht nur eine Tabelle mit Statuscodes.

**Fehler 2: Changelogs, die wie Commit-Nachrichten klingen**
`/changelog-writer` schreibt Commit-Nachrichten in benutzerorientierte Vorteils-Sprache um, filtert interne Änderungen heraus und gruppiert nach Benutzerauswirkung.

**Fehler 3: Docs, die Tutorial-, How-to- und Referenzinhalt auf einer Seite vermischen**
`/doc-site-builder` führt eine Diátaxis-Klassifikation durch und markiert Seiten mit gemischten Typen. Aufteilen, bevor sie unhandhabbar werden.

**Fehler 4: Runbooks, die nie verwendet werden, weil sie veraltet sind**
Runbooks sofort nach Incidents mit `/runbook-generator` schreiben, solange der Kontext noch frisch ist. Datum "zuletzt validiert" hinzufügen und in Game Days validieren.

**Fehler 5: ADRs, die nie geschrieben werden**
ADR-Schreiben muss beim Treffen der Entscheidung stattfinden — nicht sechs Monate später. `/adr-writer` im selben PR verwenden, in dem die Architekturänderung landet.

---

## Ressourcen

- [Getting started with Claude Code](../getting-started.md)
- [Docs sprint workflow](../workflows/docs-sprint.md)
- [Changelog narrator agent](../agents/roles/changelog-narrator.md)
- [ADR writer skill](../skills/productivity/adr-writer.md)
- [Runbook generator skill](../skills/productivity/runbook-generator.md)

---
