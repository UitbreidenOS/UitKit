---
description: Generieren Sie realistische Seed-Datenskripte für Entwicklungs- oder Testumgebungen
argument-hint: "[Tabellenname(n), Schemadatei oder Beschreibung]"
---
Seed-Daten generieren für: $ARGUMENTS

Wenn $ARGUMENTS ein Tabellenname oder eine Liste von Namen ist, lokalisieren Sie Schemadefinitionen im Codebase. Wenn es eine Schemadatei ist, lesen Sie sie. Wenn es eine Beschreibung ist, leiten Sie das Schema aus dem Kontext ab.

Regeln für die Seed-Datengenerierung:

1. Erkennen Sie den in diesem Projekt verwendeten Seed-Mechanismus:
   - SQL INSERT-Dateien, Framework-Seeder (Rails db/seeds.rb, Django Fixtures, Prisma seed.ts, Laravel Seeder, Knex Seeds) oder Factory-Bibliotheken (FactoryBot, factory-boy, Faker.js).
   - Stimmen Sie genau mit dem vorhandenen Format überein.

2. Generieren Sie Daten, die:
   - Realistisch sind: verwenden Sie domänengerechte Werte (echte Namen, gültige E-Mails, plausible Daten, korrekte Enum-Werte).
   - Vielfältig sind: mindestens 10-20 Zeilen pro Tabelle, es sei denn, die Tabelle stellt einen kleinen Lookup-Satz dar.
   - Konsistent über zugehörige Tabellen hinweg: Fremdschlüssel referenzieren gültige IDs in übergeordneten Tabellen; die Seed-Reihenfolge respektiert FK-Constraints.
   - Sicher sind: verwenden Sie nie echte PII-Muster — verwenden Sie offensichtlich gefälschte Daten (z. B. `alice@example.com`, nicht `alice@gmail.com`).

3. Decken Sie Grenzfälle ab:
   - Mindestens eine Zeile pro unterschiedlicher Enum-/Statuswert.
   - Nullwerte für nullable Spalten, in denen die Anwendung diese behandeln muss.
   - Grenzwerte (null Beträge, maximale Stringlängen, weit entfernte Zukunfts-/Vergangenheitsdaten), falls relevant zum Testen.

4. Wenn das Schema Soft-Delete-Spalten hat, nehmen Sie sowohl aktive als auch gelöschte Datensätze auf.

5. Geben Sie die Seed-Datei(en) mit korrekten Dateinamen und Pfaden gemäß Projektkonventionen aus.

6. Nach den Seed-Daten listen Sie alle erforderlichen Prerequisite Seeds auf, die zuerst ausgeführt werden müssen (Abhängigkeitsreihenfolge), und alle manuellen Setup-Schritte (z. B. Erstellen eines Superusers vor dem Seeding von Benutzerrollen).

Geben Sie nicht mehr als 50 Zeilen pro Tabelle aus, es sei denn, dies wird explizit angefordert.
