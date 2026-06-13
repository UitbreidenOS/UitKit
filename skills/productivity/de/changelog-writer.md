---
name: changelog-writer
description: "Benutzerorientiertes Changelog aus Git-Historie oder PRs: nach Auswirkung gruppiert, in einfacher Sprache, mit Links zur Dokumentation"
---

# Changelog-Writer-Skill

## Wann aktivieren
- Du bereitest ein Release vor und musst ein Git-Log oder eine Liste von PRs in ein benutzerorientiertes Changelog umwandeln
- Dein Team liefert kontinuierlich und du musst einen wöchentlichen oder monatlichen Überblick über Änderungen schreiben
- Die technische CHANGELOG.md des Engineering-Teams ist zu technisch, um sie mit Kunden zu teilen
- Du musst Release-Notes für eine Produktankündigung, eine E-Mail oder eine In-App-Benachrichtigung erstellen
- Du möchtest Änderungen nach Benutzerauswirkung klassifizieren (neues Feature / Verbesserung / Bugfix / Breaking Change)

## Wann NICHT verwenden
- Du schreibst interne technische Release-Notes für Entwickler — diese können näher am Commit-Log bleiben
- Du benötigst einen vollständigen Blogbeitrag zur Ankündigung eines Hauptfeatures — das ist Marketing-Text, kein Changelog-Eintrag
- Du möchtest einen Migrationsleitfaden für Breaking Changes — verwende `/api-doc-writer` für den Migrationsleitfaden; der Changelog-Eintrag sollte auf ihn verlinken, nicht ihn ersetzen
- Du hast noch nichts ausgeliefert — schreibe das Changelog, nachdem der Code eingeflossen ist, nicht vorher

## Anweisungen

### Git-Log → benutzerorientiertes Changelog

```
Diese Git-Historie / PR-Liste in einen benutzerorientierten Changelog-Eintrag umwandeln.

## Release-Kontext
Produkt: [Name]
Version: [v2.4.0 / "Juni-2026-Release" / wöchentlicher Überblick]
Release-Datum: [Datum]
Zielgruppe: [Endnutzer / Entwickler / Admins / gemischt]

## Roheingabe
[Eins der folgenden einfügen: Git-Log-Ausgabe / Liste zusammengeführter PRs / Jira-Release / Linear-Meilenstein / freie Änderungsliste]

Beispiel Git-Log-Format:
abc1234 feat: add bulk invite flow for workspace admins (#1203)
def5678 fix: pagination breaks when filter is active (#1188)
ghi9012 chore: upgrade React to 18.3 (#1201)  ← überspringen
jkl3456 feat(api): add cursor-based pagination to /v1/events (#1195)
mno7890 fix: email notifications sent twice on plan upgrade (#1179)
pqr2345 perf: reduce dashboard initial load time by 40% (#1197)
stu6789 BREAKING: remove deprecated /v1/users/bulk endpoint (#1200)

## Anweisungen

1. FILTERN: Nur interne Änderungen überspringen:
   - Abhängigkeits-Upgrades ohne sichtbare Benutzerauswirkung (`chore: upgrade X`)
   - Refactorings ohne sichtbare Benutzerändernug (`refactor:`)
   - Nur-Test-Änderungen (`test:`)
   - CI/CD-Änderungen (`ci:`, `build:`)
   - Internes Tooling

2. Jede verbleibende Änderung KLASSIFIZIEREN:
   - Neues Feature: neue Funktion, die der Nutzer vorher nicht hatte
   - Verbesserung: bestehendes Feature funktioniert jetzt besser (schneller, einfacher, erweitert)
   - Bugfix: etwas, das kaputt war, funktioniert jetzt
   - Breaking Change: etwas, das eine Benutzeraktion erfordert, um weiter zu funktionieren
   - Sicherheit: sicherheitsrelevanter Fix

3. In einfacher Sprache UMSCHREIBEN:
   - Für [Zielgruppe] schreiben — nicht für Entwickler, die den Code lesen
   - Keine Commit-Hashes, Branch-Namen oder interne Ticket-Nummern in der Ausgabe
   - Aktive Stimme: "Sie können jetzt..." / "Wir haben ... behoben" / "Wir haben ... verbessert"
   - Ein Satz pro Eintrag für Bugfixes und Verbesserungen; 2-3 Sätze für neue Features
   - Bei Bedarf auf Dokumentation verlinken: "(Siehe [Dokumentationslink])"

4. Nach Auswirkung SORTIEREN:
   - Breaking Changes zuerst (damit Nutzer sie sofort sehen)
   - Neue Features
   - Verbesserungen
   - Bugfixes

## Ausgabeformat

---

## [Version / Release-Name] — [Datum]

### Breaking Changes
> Aktion erforderlich vor dem Upgrade

- **[Name der Änderung]:** [Klartextbeschreibung, was sich geändert hat und was der Nutzer tun muss.] [Migrationsleitfaden →](#)

### Neue Features
- **[Feature-Name]:** [Was es tut und für wen es ist. Welches Problem es löst.]
- **[Feature-Name]:** [...]

### Verbesserungen
- [Klartextbeschreibung der Verbesserung und ihres Nutzens für den Benutzer]
- [...]

### Bugfixes
- [Beschreibung behoben, was kaputt war und wie das korrekte Verhalten jetzt ist]
- [...]

---
```

### Kontinuierlicher Release-Überblick (wöchentlich/monatlich)

```
Einen [wöchentlichen / monatlichen] Produkt-Update aus dieser Liste ausgelieferter Änderungen schreiben.

Zeitraum: [Datumsbereich]
Zielgruppe: [Kunden in einem Produkt-Newsletter / Entwickler / Enterprise-Admins]
Ton: [konversationell / formal / technisch]

In diesem Zeitraum ausgelieferte Änderungen:
[Liste oder Git-Log / PRs einfügen]

Format:
- Mit der wirkungsvollsten Änderung beginnen (1-2 Sätze — der Hook)
- Nach Produktbereich oder Thema gruppieren, nicht nach Auslieferungsdatum
- "Wir"-Sprache für Änderungen ("Wir haben X schneller gemacht..."), "Sie" für Vorteile ("Sie können jetzt...")
- Mit einem "Demnächst"-Abschnitt enden, wenn du zugesagte Roadmap-Elemente andeuten möchtest

Ausgabe: ein Changelog-Überblick, bereit zum Einfügen in eine E-Mail, In-App-Benachrichtigung oder einen Blogbeitrag.
Länge: [kurz (unter 200 Wörter) / standard (200-400 Wörter) / detailliert (400+ Wörter für Hauptreleases)]
```

### Breaking-Change-Eintrag (detailliert)

```
Einen Breaking-Change-Eintrag für das Changelog schreiben.

Änderung: [Breaking Change in technischen Begriffen beschreiben]
Was früher funktionierte: [das alte Verhalten]
Was jetzt passiert: [das neue Verhalten]
Warum wir es geändert haben: [der Grund — ehrlich sein, wenn es für technische Schulden ist, nicht nur "Verbesserungen"]
Betroffene Nutzer: [wer betroffen ist — alle / nur Nutzer von Feature X / nur in Plan X]
Was sie tun müssen: [spezifische Handlungsschritte nummeriert 1, 2, 3]
Frist: [Datum, an dem das alte Verhalten entfernt wird / bis wann sie migrieren müssen]
Migrationsleitfaden: [Link zur Dokumentation]
Support: [wo Hilfe zu bekommen ist]

Ausgabe: ein Changelog-Eintrag, der alarmierend genug ist, damit Nutzer ihn lesen, aber keine Panik auslöst.
Enthält: eine klar gekennzeichnete "Aktion erforderlich"-Überschrift.
Nicht: die erforderliche Aktion im Fließtext begraben.
```

### Changelog-Qualitätsprüfung

```
Dieses Changelog auf Qualität und Vollständigkeit überprüfen.

[Bestehenden Changelog-Eintrag einfügen]

Anhand dieser Qualitätskriterien prüfen:

VOLLSTÄNDIGKEIT:
- [ ] Alle Breaking Changes aufgelistet und klar gekennzeichnet?
- [ ] Jeder Eintrag hat eine Klartextbeschreibung (kein Fachjargon, keine Commit-Hashes)?
- [ ] Links zur Dokumentation für wichtige neue Features?
- [ ] Bugfixes erklären, was kaputt war, nicht nur "Bug behoben"?

SPRACHE:
- [ ] Für [Endnutzer / Entwickler] geschrieben — nicht für das interne Team?
- [ ] Durchgehend aktive Stimme?
- [ ] Einträge nach Benutzerauswirkung sortiert (Breaking → neu → Verbesserung → Fix)?
- [ ] Keine internen Ticket-Nummern (JIRA-1234) für externe Leser sichtbar?

BREAKING CHANGES:
- [ ] Klar von anderen Änderungen getrennt?
- [ ] Enthält die spezifische Aktion, die der Nutzer ergreifen muss?
- [ ] Enthält Frist und Link zur Migrationsdokumentation?

Für jede Lücke: den Eintrag korrekt umschreiben.
```

### Semantic-Versioning-Leitfaden

```
Anhand dieser Änderungen die korrekte semantische Versions-Erhöhung empfehlen.

Aktuelle Version: [vX.Y.Z]
Änderungen in diesem Release:
[Änderungen auflisten]

Regeln für semantische Versionierung:
- MAJOR (X): Breaking Changes — inkompatible API-Änderung, entferntes Feature, geändertes Verhalten, das bestehende Nutzung kaputt macht
- MINOR (Y): Neue Features — rückwärtskompatible Ergänzungen
- PATCH (Z): Bugfixes — ausschließlich rückwärtskompatible Fixes

Empfehlung: auf v[X.Y.Z] erhöhen
Grund: [welche Änderung die Erhöhungsstufe ausgelöst hat]

Bei MAJOR-Erhöhung: Erinnerung, den Migrationsleitfaden zu aktualisieren und den Zeitplan klar zu kommunizieren.
```

## Beispiel

**Benutzer:** Hier ist unser Git-Log für den letzten Sprint. Schreibe das Changelog für v3.2.0.

```
a1b2c3d feat: workspace members can now export their own data (#445)
d4e5f6a feat(api): add filtering by date range to GET /v1/reports (#441)
g7h8i9j fix: CSV export includes duplicate rows when >1000 records (#438)
k1l2m3n fix: notifications not sent when user is on legacy plan (#436)
o4p5q6r perf: report generation 3x faster for large datasets (#440)
s7t8u9v chore: upgrade lodash to 4.17.21 (#443)
w1x2y3z docs: update API authentication guide (#444)
a4b5c6d BREAKING: /v1/exports now returns 202 Accepted instead of 200 OK for async exports (#439)
```

**Ausgabe:**

```markdown
## v3.2.0 — 2. Juni 2026

### Breaking Changes
> Aktion erforderlich: Integration aktualisieren, wenn die Exports-API verwendet wird

- **Exports-API gibt jetzt 202 für asynchrone Exports zurück:** `POST /v1/exports` gab früher `200 OK` mit der Export-URL zurück. Es gibt jetzt sofort `202 Accepted` zurück, und du rufst `GET /v1/exports/{id}` für den Status ab. Dies ermöglicht es Exports, asynchron zu laufen, ohne deine Anfrage zu blockieren. Jeglichen Code aktualisieren, der bei der Export-Erstellung auf einen `200`-Statuscode prüft. [Migrationsleitfaden →](https://docs.example.com/guides/exports-migration)

### Neue Features
- **Self-Service-Datenexport:** Workspace-Mitglieder können ihre eigenen Daten jetzt aus ihren Kontoeinstellungen exportieren, ohne dass ein Admin es für sie tun muss.
- **Datumsbereichsfilterung in der Reports-API:** `GET /v1/reports` akzeptiert jetzt die Abfrageparameter `start_date` und `end_date`, um Ergebnisse nach einem benutzerdefinierten Datumsbereich zu filtern. [Referenz ansehen →](https://docs.example.com/api/reports)

### Verbesserungen
- Die Berichtsgenerierung ist jetzt 3x schneller für große Datensätze. Berichte, die früher 30+ Sekunden dauerten, werden jetzt in unter 10 Sekunden abgeschlossen.

### Bugfixes
- Einen Fehler behoben, bei dem CSV-Exporte doppelte Zeilen enthielten, wenn der Export mehr als 1.000 Datensätze enthielt.
- Ein Problem behoben, bei dem E-Mail-Benachrichtigungen nicht an Nutzer auf Legacy-Plänen gesendet wurden.
```

---
