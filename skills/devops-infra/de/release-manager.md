---
name: release-manager
description: "Releaseverwaltung: semantische Versionierung, Changelog-Generierung aus konventionellen Commits, Releasereife-Checklisten, Hotfix-Verfahren, Rollback-Pläne und Release-Branch-Strategie"
---

# Fähigkeit Release Manager

## Wann aktivieren
- Planung und Koordination einer Softwareversion
- Changelog-Generierung aus der Commit-Historie
- Bestimmung des korrekten semantischen Versions-Bumps für ein Release
- Ausführung von Release-Reife-Checks vor der Bereitstellung
- Verwaltung eines Hotfix- oder Notfall-Release-Prozesses
- Konfiguration einer Release-Branch-Strategie (Git Flow, trunk-based, etc.)

## Wann NICHT verwenden
- CI/CD-Pipeline-Konfiguration — verwenden Sie die cicd-Fähigkeit
- Setup der Bereitstellungsinfrastruktur — verwenden Sie die docker- oder kubernetes-Fähigkeiten
- Verwaltung von Incidents nach dem Release — verwenden Sie den incident-commander-Agenten
- npm publish spezifisch — verwenden Sie den npm publish-Workflow

## Anweisungen

### Semantische Versionierung

```
Bestimmung des Versions-Bumps für [Release].

Aktuelle Version: [X.Y.Z]
Änderungen in diesem Release: [beschreiben oder Commit-Liste einfügen]

Regeln für semantische Versionierung (semver.org):
MAJOR (X): Breaking Change — bestehende Integrationen werden unterbrochen
  Beispiele: entfernter API-Endpunkt, geänderte Funktionssignatur, beendete Node-Version-Unterstützung
  Wenn: irgendein Commit mit "BREAKING CHANGE:" im Body oder "!" nach dem Typ (feat!: ...)

MINOR (Y): neue Funktionalität, rückwärtskompatibel
  Beispiele: neuer API-Endpunkt, neuer optionaler Parameter, neue Funktion hinter einem Flag
  Wenn: Commits mit Typ "feat:"

PATCH (Z): rückwärtskompatible Fehlerbehebung
  Beispiele: Fehler beheben, Abhängigkeit aktualisieren (keine Breaking-Changes), Fehlermeldung verbessern
  Wenn: Commits mit Typ "fix:", "perf:", "refactor:", "docs:" (ohne neue Features)

Konventionelle Commit-Typen:
- feat: → MINOR Bump
- fix: → PATCH Bump
- feat!: oder BREAKING CHANGE: → MAJOR Bump
- chore:, docs:, style:, test:, refactor: → PATCH (oder kein Bump, Ihre Wahl)
- perf: → PATCH Bump

Unter Berücksichtigung Ihrer Änderungen: [Eingabe]
Empfohlene Version: [X.Y.Z → A.B.C]
Begründung: [welche Commits welchen Bump ausgelöst haben]
```

### Changelog-Generierung

```
Generiere Changelog für [Version Release].

Version: [X.Y.Z]
Datum: [JJJJ-MM-TT]
Commits seit dem letzten Release: [git log --oneline-Ausgabe einfügen oder Änderungen beschreiben]

Konventionelles Commit-Format: type(scope): description
Beispiel: feat(auth): OAuth2-Login-Unterstützung hinzufügen

Changelog-Format (Keep a Changelog Standard):

## [X.Y.Z] — JJJJ-MM-TT

### Breaking Changes
- [Beschreibung des Breaking Changes + Migrationspfad]

### Hinzugefügt
- [feat: Commits → benutzerorientierte Beschreibung]
- [feat(scope): Commits nach Bereich gruppiert]

### Geändert
- [Änderungen an bestehender Funktionalität]

### Behoben
- [fix: Commits → was war kaputt und funktioniert jetzt]

### Sicherheit
- [sicherheitsrelevante Änderungen — Schwachstellen gepatcht, Berechtigungen verschärft]

### Veraltet
- [Features, die in einer zukünftigen Hauptversion entfernt werden]

### Entfernt
- [entfernte Features — Breaking, geht in Breaking Changes wenn Entfernung der Break ist]

Regeln für gute Changelog-Einträge:
- Schreiben Sie für Benutzer, nicht für Entwickler
- "OAuth2-Login hinzufügen" nicht "feat(auth): implement oauth2 handler"
- Migrationschritte für Breaking Changes einbeziehen
- Gruppieren nach Impact, nicht nach Datei oder System

Generiere Changelog für mein Release aus den Commits, die ich bereitstelle.
```

### Release-Reife-Checkliste

```
Führe Release-Reife-Checks für [Version] aus.

Release-Typ: [major / minor / patch / hotfix]
Zielumgebung: [staging → prod / direkt zu prod / canary]
Bereitstellungszeit: [geplant / On-Call steht bereit / nur Geschäftszeiten]

Checkliste vor dem Release:

CODEQUALITÄT:
□ Alle CI-Checks bestanden (Tests, Lint, Typ-Check, Security Scan)
□ Code-Review für alle Änderungen in diesem Release abgeschlossen
□ Keine offenen P1/P2-Fehler für dieses Release, die nicht behoben sind
□ Keine ungelösten Merge-Konflikte

TESTING:
□ Unit-Tests bestanden (Coverage ≥ Schwelle)
□ Integrations-Tests bestanden
□ E2E-Tests auf Staging-Umgebung bestanden
□ Manueller Smoke-Test kritischer User Journeys auf Staging
□ Performance: keine Regression gegenüber Baseline (p99-Latenz überprüfen)
□ Datenbankmigration auf einer Staging-Datenbank von Produktionsgröße getestet

KOMMUNIKATION:
□ Release Notes entworfen und genehmigt
□ Kundenfreundliches Changelog bereit (falls Änderungen Benutzer betreffen)
□ Support-Team über Änderungen informiert
□ Verkauf/CS informiert, wenn Release neue Demo-Features enthält
□ Status-Seite: Geplante Wartungsfenster gepostet

BEREITSTELLUNG:
□ Bereitstellungs-Runbook überprüft und aktuell
□ Rollback-Plan definiert und getestet
□ Datenbank-Migration Rollback bestätigt (oder Forward-Only-Migration mit dokumentiertem Grund)
□ Feature Flags für schrittweise Einführung konfiguriert (falls zutreffend)
□ On-Call-Ingenieur über Bereitstellungszeitpunkt informiert
□ Monitoring-Dashboards offen: Fehlerrate, p99-Latenz, wichtigste Business-Metriken

POST-DEPLOYMENT VALIDIERUNG (erste 30 Min):
□ Health Endpoint gibt 200 zurück
□ Fehlerrate innerhalb des normalen Bereichs
□ Wichtigste User Flows funktionieren (Smoke Test)
□ Datenbank-Migration sauber abgeschlossen
□ Keine ungewöhnlichen Alerts

GENEHMIGUNG:
□ Engineering-Lead-Genehmigung
□ Product Owner-Genehmigung (für minor/major Releases)
□ [Optional] Security Review für sicherheitsrelevante Änderungen

Generiere die Checkliste für meinen Release-Typ und Bereitstellungsmodell.
```

### Hotfix-Verfahren

```
Führe Hotfix für [Incident/Bug] aus.

Problem-Severity: [P1 — Production Down / P2 — Major Degradation]
Problem: [Bug beschreiben und dessen Impact]
Aktuelle Production Version: [X.Y.Z]
Hotfix Branch von: [main / release/X.Y.Z]

Hotfix-Verfahren:

SCHRITT 1 — Hotfix Branch erstellen:
git checkout -b hotfix/X.Y.Z+1 main  # Branch von main (oder aktuellem Production Tag)
# Bei Verwendung von Git Flow: git flow hotfix start X.Y.Z+1

SCHRITT 2 — Fix anwenden:
[Minimale Änderung zur Fehlerbehebung durchführen — kein opportunistisches Cleanup]
[Test schreiben, der Bug reproduziert, dann überprüfen, dass Fix ihn behebt]

SCHRITT 3 — Version Bump:
Version zu X.Y.Z+1 bumpen (PATCH)
CHANGELOG.md mit Fix aktualisieren

SCHRITT 4 — PR und Review:
PR von hotfix/X.Y.Z+1 → main
Beschleunigtes Review: mindestens 1 Senior Reviewer
CI muss passen: keine Ausnahmen für P1 Hotfixes — wenn CI kaputt ist, CI zuerst beheben

SCHRITT 5 — Merge und Tag:
git tag -a vX.Y.Z+1 -m "Hotfix: [description]"
git push origin vX.Y.Z+1

SCHRITT 6 — Deploy:
Bereitstellungs-Runbook mit beschleunigtem Timeline folgen
Monitoring-Dashboards 30 Minuten nach Deploy offen halten
Bestätigen, dass Fix den Incident behebt, bevor Resolved erklärt

SCHRITT 7 — Backport zu develop:
git checkout develop
git cherry-pick [Hotfix Commit SHA]
# Stellt sicher, dass Fix im nächsten Regular Release ist

SCHRITT 8 — Nach Incident:
CHANGELOG.md auf main und develop aktualisieren
PIR für P1 Hotfixes planen (innerhalb 48 Stunden)

Hotfix-Regeln:
- Nur den gemeldeten Bug FIXIEREN — keine anderen Änderungen im Hotfix Branch
- Hotfix umgeht normalen Release-Prozess aber NICHT Code Review
- Hotfix erhöht automatisch PATCH-Version

Schreibe den Hotfix-Plan für meinen spezifischen Bug.
```

### Release-Strategie

```
Entwerfe eine Release-Branch-Strategie für [Team].

Teamgröße: [X Ingenieure]
Release-Häufigkeit: [täglich / wöchentlich / monatlich]
Bereitstellungsmodell: [kontinuierlich / gated releases / geplante Fenster]
Aktuelles Problem: [zu langsam / zu riskant / kein Prozess / Merge-Konflikte]

Strategie-Vergleich:

TRUNK-BASED DEVELOPMENT (empfohlen für die meisten Teams):
- Jeder committed täglich zu main
- Releases jederzeit von main getaggt
- Feature Flags verstecken unvollständige Features
- Beste für: CI/CD, kleine Teams, häufige Releases
- Vorteile: einfach, schnell, keine langjährigen Branches
- Nachteile: erfordert Disziplin + Feature Flag Infrastruktur

GIT FLOW (für geplante Releases):
- main: Production
- develop: Integration Branch
- feature/X: individuelle Features → merge zu develop
- release/X.Y: Release Vorbereitung → merge zu main + develop
- hotfix/X: Notfall-Fixes → merge zu main + develop
- Beste für: Mobile Apps, On-Prem Software mit Release Zyklen
- Nachteile: komplex, Merge-Konflikte, langsam

GITHUB FLOW (leichtgewichtig):
- main: immer deploybar
- feature/X: beliebige Arbeit → PR → merge zu main → deploy
- Beste für: Web-Services mit kontinuierlicher Bereitstellung

Für Ihr Team-Profil:
[Eine Strategie mit Begründung und Setup-Anweisungen empfehlen]

Richten Sie die empfohlene Strategie für mein Team mit Git-Befehlen und CI/CD-Integrationspunkten ein.
```

## Beispiel

**Benutzer:** Wir bringen v2.0.0 unserer SaaS-API heraus. Sie hat Breaking Changes (3 veraltete Endpoints entfernt). Wie kommuniziere ich das und führe das Release aus?

**Claudes Release-Plan:**

**Version:** 2.0.0 (MAJOR Bump — Breaking Change = Endpoints entfernt)

**Changelog-Eintrag:**
```markdown
## [2.0.0] — 2026-05-20

### Breaking Changes
- Veraltete Endpoints entfernt: `GET /api/v1/users/legacy`, `POST /api/v1/auth/old`, `DELETE /api/v1/items/purge`
  → **Migration:** Verwenden Sie `GET /api/v2/users`, `POST /api/v2/auth/login`, `DELETE /api/v2/items` jeweils.
  → Vollständiger Migrations-Guide: docs.yourapi.com/migration/v1-to-v2

### Hinzugefügt
- [andere Ergänzungen]

### Behoben
- [Fehlerbehebungen]
```

**Kommunikationsreihenfolge:**
1. **4 Wochen vorher:** E-Mail an alle API-Key-Inhaber — "Breaking Changes kommt in v2.0.0 am [Datum]. Aktion erforderlich."
2. **2 Wochen vorher:** Zweite Erinnerung + Migrations-Guide Link
3. **1 Woche vorher:** Finale Warnung + Angebot der 2-Wochen-Verlängerung für Kunden, die das anfordern
4. **Release-Tag:** Release Notes gepostet, Status-Seite Notiz, Support-Team informiert
5. **Nach Release:** Überwachen Sie 400 Fehler auf entfernten Endpoints — erwarten Sie Spike von langsamen Migranten

**Release-Reife-Gates für großes Breaking:**
- [ ] Alle Kunden, die veraltete Endpoints verwenden, ≥4 Wochen vorher benachrichtigt
- [ ] Migrations-Guide veröffentlicht und auf Genauigkeit überprüft
- [ ] v1 Endpoints als 410 Gone (nicht 404) für 30 Tage behalten — hilft Kunden schneller zu debuggen
- [ ] Rollback-Plan: können Sie die alten Endpoints wieder aktivieren, wenn Migrations-Akzeptanz zu niedrig ist?

---
