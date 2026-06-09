---
description: Realistische Seed-Data-Skripte für Entwicklungs- oder Testumgebungen generieren
argument-hint: "[table name(s), schema file, or description]"
---
Seed-Daten generieren für: $ARGUMENTS

Wenn $ARGUMENTS ein Tabellenname oder eine Liste von Namen ist, suchen Sie Schemadefinitionen in der Codebasis. Wenn es eine Schemadatei ist, lesen Sie diese. Wenn es eine Beschreibung ist, leiten Sie das Schema aus dem Kontext ab.

Regeln für die Seed-Data-Generierung:

1. Erkennen Sie den Seed-Mechanismus, der in diesem Projekt verwendet wird:
   - SQL INSERT-Dateien, Framework-Seeder (Rails db/seeds.rb, Django fixtures, Prisma seed.ts, Laravel seeders, Knex seeds) oder Factory-Bibliotheken (FactoryBot, factory-boy, Faker.js).
   - Passen Sie das vorhandene Format genau an.

2. Generieren Sie Daten, die:
   - Realistisch sind: verwenden Sie domänengerechte Werte (realistische Namen, gültige E-Mails, plausible Daten, korrekte Enum-Werte).
   - Variiert sind: mindestens 10-20 Zeilen pro Tabelle, es sei denn, die Tabelle stellt einen kleinen Lookup-Satz dar.
   - Konsistent über verwandte Tabellen hinweg: Fremdschlüssel verweisen auf gültige IDs in übergeordneten Tabellen; die Seed-Reihenfolge respektiert FK-Einschränkungen.
   - Sicher sind: verwenden Sie niemals echte PII-Muster — verwenden Sie offensichtlich gefälschte Daten (z. B. `alice@example.com`, nicht `alice@gmail.com`).

3. Decken Sie Grenzfälle ab:
   - Mindestens eine Zeile pro unterschiedlicher Enum-/Statuswert.
   - Null-Werte für Spalten, die NULL-Werte zulassen, wenn die Anwendung diese verarbeiten muss.
   - Grenzwerte (Nullbeträge, maximale String-Längen, Daten weit in der Zukunft/Vergangenheit), wo relevant zum Testen.

4. Wenn das Schema Soft-Delete-Spalten hat, beziehen Sie sowohl aktive als auch gelöschte Datensätze ein.

5. Geben Sie die Seed-Datei(en) mit korrekten Dateinamen und Pfaden gemäß Projektkonventionen aus.

6. Führen Sie nach den Seed-Daten eine Liste aller Voraussetzungs-Seeds auf, die zuerst ausgeführt werden müssen (Abhängigkeitsreihenfolge), und alle manuellen Setup-Schritte (z. B. Erstellen eines Superusers vor dem Seeding von Benutzerrollen).

Geben Sie nicht mehr als 50 Zeilen pro Tabelle aus, es sei denn, dies wird explizit angefordert.
