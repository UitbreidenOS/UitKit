---
name: jira-expert
description: "Jira-Projektmanagement: Board-Setup, Issue-Hierarchie, Workflow-Design, JQL-Abfragen, Sprint-Planung, Reporting und Jira Best Practices für Engineering-Teams"
---

# Jira Expert Skill

## Wann aktivieren
- Einen neuen Jira-Project einrichten oder einen bestehenden restructurieren
- JQL-Abfragen zum Auffinden spezifischer Issues schreiben
- Einen Workflow entwerfen, der zu Ihrem Entwicklungsprozess passt
- Sprints, Epics und Story-Hierarchie konfigurieren
- Jira-Reports und Dashboards erstellen
- Debuggen, warum Jira-Boards oder Automationen nicht wie erwartet funktionieren

## Wann NICHT verwenden
- Produktroadmap-Planung — das ist eine product-roadmap Skill Konversation
- Sprint-Retrospektiven — verwenden Sie einen echten Team-Facilitation-Prozess
- Migration weg von Jira — Tools zuerst evaluieren, dann migrieren

## Anweisungen

### Project-Setup

```
Richten Sie ein Jira-Projekt für [Team/Produkt] ein.

Team: [X Ingenieure, Scrum / Kanban / gemischt]
Methodologie: [Scrum (zeitgesteuerte Sprints) / Kanban (kontinuierlicher Fluss) / Scrumban]
Project-Typ: [Software / Geschäft / Service-Management]
Integrationsbedarf: [GitHub / GitLab / Confluence / Slack]

Empfohlene Konfiguration:

Project-Typ: [Software] — gibt Ihnen Sprints, Backlog und Velocity-Reporting

Issue-Hierarchie:
Epic → Story → Subtask (Standard)
oder
Initiative → Epic → Story → Subtask (für größere Programme)

Workflow-Design:
Einfach (empfohlen für die meisten Teams):
  To Do → In Progress → In Review → Done

Mit mehr Granularität:
  Backlog → Selected for Dev → In Progress → In Review → In QA → Done

Zu vermeidende Status:
- "Waiting" ohne Klarheit, wer auf was wartet
- Zu viele Status — jeder Status ist ein Handoff, der ein Ritual braucht

Story Points vs. Zeitsimationen:
- Story Points für relative Komplexitätsschätzung verwenden (Fibonacci: 1,2,3,5,8,13)
- Nie Stunden verwenden — falsche Präzision, die Diskussionszeit kostet

Components: verwenden, um nach technischem Bereich zu gruppieren (Frontend, Backend, Infrastructure, Mobile)
Labels: verwenden für übergreifende Belange (Performance, Sicherheit, Schulden)

Konfigurieren Sie dieses Projekt und richten Sie das initial Board ein.
```

### JQL-Abfragen

```
Schreiben Sie JQL-Abfragen für [Anwendungsfall].

Ich muss finden: [beschreiben Sie, was Sie suchen]
Project: [Project-Schlüssel — z. B. ENG, BACKEND]

Häufige JQL-Muster:

Alle mir zugewiesenen offenen Issues:
  assignee = currentUser() AND resolution = Unresolved

Issues, die nach dem Start zum aktuellen Sprint hinzugefügt wurden (Scope Creep):
  sprint = "Sprint 23" AND created > startOfSprint()

Alle High-Priority-Bugs, die länger als 7 Tage offen sind:
  issuetype = Bug AND priority in (High, Critical) AND created <= -7d AND resolution = Unresolved

Issues in Review ohne Kommentare seit 2+ Tagen (Stale PRs):
  status = "In Review" AND updated <= -2d AND issuetype = Story

Alle Issues in einem Epic:
  "Epic Link" = ENG-123
  oder (Next-gen): parentEpic = ENG-123

Velocity Blocker (In Progress länger als Sprint-Durchschnitt):
  status = "In Progress" AND updated <= -5d AND sprint in openSprints()

Diese Woche erledigte Issues (für Standup / Release Notes):
  status = Done AND resolved >= startOfWeek()

Alle Issues ohne Assignee im Backlog:
  assignee is EMPTY AND status = "To Do" AND sprint is EMPTY

Schreiben Sie eine JQL-Abfrage für meinen spezifischen Anwendungsfall. Schließen Sie eine Beschreibung dessen ein, was sie zurückgibt.
```

### Sprint-Planung

```
Helfen Sie mir, Sprint-Planung für [Team] durchzuführen.

Team: [X Ingenieure]
Sprint-Länge: [1 Woche / 2 Wochen]
Team Velocity: [X Story Points Durchschnitt der letzten 3 Sprints]
Sprint-Ziel für diesen Sprint: [was wir erreichen wollen]
Backlog-Zustand: [gepflegt / benötigt Pflege]

Sprint-Planung Checklist:

Vor-Planung (Tag davor):
□ Backlog gepflegt: Top 20 Items geschätzt und verstanden
□ Sprint-Ziel entworfen (1 Satz — wie Erfolg aussieht)
□ Kapazität bestätigt: Wer fehlt? (PTO, On-Call, Interviews)
□ Angepasste Kapazität: [Team Velocity × Verfügbarkeit %]

Während der Planung (2-Stunden-Sitzung für 2-Wochen-Sprint):

Teil 1 — Ziel-Alignment (15 min):
- PO präsentiert Sprint-Ziel
- Team bestätigt, dass es erreichbar und wertvoll ist
- Gibt es Blockaden zum Sprintstart?

Teil 2 — Backlog-Verfeinerung (45 min, wenn nicht bereits geschehen):
- Gehen Sie die Top-Backlog-Items durch
- Team stellt Klärungsfragen → Akzeptanzkriterien hinzufügen
- Neu schätzen, falls sich das Verständnis änderte

Teil 3 — Verpflichtung (45 min):
- Team zieht Stories von der Spitze des Backlogs, bis Velocity erreicht ist
- Ingenieure brechen Stories in Subtasks auf (hilft verborgene Komplexität offenzulegen)
- Rufen Sie Abhängigkeiten zwischen Items auf
- Letzte 10 min: lesen Sie den Sprint durch — stimmt jeder zu?

Teil 4 — Sprint gestartet (15 min):
- Starten Sie den Sprint in Jira
- Verschieben Sie die erste Aufgabe jedes Developers zu "In Progress"

JQL für Kapazitätsprüfung:
  sprint = "Sprint [X]" AND assignee = [Ingenieur] ORDER BY priority

Ausgang: Sprint-Planungs-Agenda-Template + JQL-Abfragen für die Sitzung.
```

### Jira Reporting und Dashboards

```
Bauen Sie ein Jira-Dashboard für [Publikum].

Publikum: [Engineering-Team / Produktmanager / Executive]
Benötigte Metriken: [Velocity / Bug-Rate / Sprint-Gesundheit / OKR-Fortschritt]

Dashboard Gadgets für Engineering-Teams:
- Sprint Health: Issues done vs. committed (Burndown)
- Velocity Chart: letzte 6-8 Sprints — Trend auf/ab/flach?
- Created vs. Resolved: Lösen wir Bugs schneller, als sie erstellt werden?
- Cycle Time: durchschnittliche Zeit von "In Progress" zu "Done" nach Issue-Typ

Dashboard für Produktmanager:
- Epics Fortschritt: % vollständig für jeden Epic im Flug
- Release Burndown: verbleibende Story Points zum Release-Ziel
- Issues ohne Schätzungen: Planungslücken markieren
- Diese Woche erledigt: was wurde ausgeliefert (nutzen Sie in wöchentlicher Überprüfung)

Executive Dashboard:
- OKR-Gesundheit: [Benutzerdefini — verknüpfen Sie Epics mit OKRs via Labels oder benutzerdefinierten Feldern]
- Team Velocity Trend: [werden wir schneller oder langsamer?]
- Bug-Count nach Schweregrad: [wie viele kritisch/hoch Bugs offen?]
- Release-Cadence: [Daten der letzten 5 Releases]

JQL für häufige Dashboard Gadgets:
Bug-Rate (Bugs in den letzten 30 Tagen erstellt):
  issuetype = Bug AND created >= -30d

Cycle Time (diese Woche gelöst):
  status = Done AND sprint in closedSprints() ORDER BY resolved DESC

Ungeschätzter Backlog:
  story_points is EMPTY AND status = "To Do" AND sprint is EMPTY

Bauen Sie die Dashboard-Gadget-Konfiguration für mein Publikum.
```

### Automation Rezepte

```
Richten Sie Jira-Automatisierung für [Workflow] ein.

Anwendungsfall: [beschreiben Sie, was Sie automatisieren möchten]

Häufige Jira-Automations-Rezepte:

Auto-Assign beim Statuswechsel:
  Trigger: Issue übergegangen zu "In Review"
  Bedingung: Assignee is [Ingenieur]
  Aktion: Zuweisen zu [Reviewer] + Kommentar hinzufügen "Ready for review"

Auto-Close abgelaufener Bugs:
  Trigger: Geplant (wöchentlich)
  Bedingung: status = "To Do" AND updated <= -90d AND priority = Low
  Aktion: Übergegangen zu "Won't Fix" + Kommentar "Auto-geschlossen nach 90 Tage Inaktivität"

Notify Slack auf kritischen Bug:
  Trigger: Issue erstellt
  Bedingung: issuetype = Bug AND priority = Critical
  Aktion: Senden Sie Slack-Nachricht an #engineering-alerts mit Issue-Link

Sync GitHub PRs zu Jira:
  Trigger: GitHub PR geöffnet (via GitHub Integration)
  Aktion: Übergegangen verknüpftes Issue zu "In Review"

Auto-Transition bei PR-Merge:
  Trigger: GitHub PR gemergt
  Aktion: Übergegangen verknüpftes Jira-Issue zu "Done"

Sprint-Velocity-Warnung:
  Trigger: Geplant (täglich, während Sprint)
  Bedingung: Sprint % vollständig > 70% AND Punkte erledigt / Punkte committed < 0.5
  Aktion: Benachrichtige PO via Kommentar auf Sprint-Board

Schreiben Sie die Automationsregeln für meinen spezifischen Anwendungsfall.
```

## Beispiel

**Benutzer:** Unser Jira-Board ist ein Chaos — 200+ Issues im Backlog, die Hälfte ohne Schätzungen, keine klaren Sprint-Ziele, und die Velocity ist in 3 Monaten von 45 auf 28 gefallen. Wo fange ich an?

**Claudies Wiederherstellungsplan:**

Velocity-Rückgang von 45→28 in 3 Monaten = 38% Rückgang. Das ist kein Jira-Problem — Jira surfacet ein Team-Problem. Konfigurieren Sie Jira nicht neu, ohne die echte Ursache zu verstehen.

**Schritt 1 — Diagnostizieren vor Beheben (diese Woche):**

JQL: Was wurde in jedem der letzten 3 Sprints erledigt?
```
sprint in closedSprints() AND status = Done ORDER BY resolved DESC
```
Tauchen dieselben Arten von Issues wiederholt auf? Wenn ja: wiederkehrende Bugs oder ungelöste technische Schulden fressen Velocity.

JQL: Wie viele Bugs wurden in den letzten 90 Tagen erstellt?
```
issuetype = Bug AND created >= -90d
```
Wenn das Bug-Volumen steigt, wird die Velocity-Rückgang durch ungeplante Arbeit verursacht, nicht Planungsdysfunction.

**Schritt 2 — Backlog-Chirurgie (1 Team-Sitzung, 90 min):**
- Sortiert nach "Last Updated" aufsteigend
- Jedes Issue unberührt > 3 Monate ohne Sprint-Zuweisung → Archivieren (wird nicht tun oder tut nicht)
- Schätzen Sie sie nicht — entfernen Sie einfach das Rauschen
- Ziel: Backlog unter 80 Items vor nächstem Sprint

**Schritt 3 — Sprint-Hygiene wiederherstellen:**
- Sprint-Ziel: ein Satz, vereinbart vor Sprint-Start
- Keine Hinzufügung von Items während des Sprints ohne Entfernung von etwas Äquivalentem
- Retrospektive: Führen Sie ein "was hat uns diesen Sprint verlangsamt?" am Ende jeden Sprints für 4 Sprints aus

**Schritt 4 — Verfolgen Sie die Cycle Time, nicht nur die Velocity:**
Fügen Sie ein "Cycle Time" Gadget zu Ihrem Board hinzu. Wenn die Cycle Time zunimmt (Stories dauern länger zu vervollständigen), ist das Problem WIP-Limit — zu viele Dinge im Progress auf einmal.

---
