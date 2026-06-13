---
description: Eine Datenbankmigrierungsdatei aus einer Schemaaenderungsbeschreibung oder einem Diff generieren
argument-hint: "[Beschreibung der Schemaaenderung]"
---
Sie generieren eine Datenbankmigrierung. Der Benutzer hat bereitgestellt: $ARGUMENTS

Leiten Sie das Zielmigrationsframework aus dem Projekt ab (Alembic, Flyway, Liquibase, Django-Migrationen, Rails ActiveRecord, Prisma, Knex, TypeORM, Sequelize oder rohes SQL). Falls unklar, prüfen Sie auf Konfigurationsdateien oder vorhandene Migrationsdateien im Repository, bevor Sie fragen.

Schritte:
1. Untersuchen Sie vorhandene Migrationen, um Namenskonventionen, Zeitstempelformat und Dateistruktur zu bestimmen.
2. Bestimmen Sie den aktuellen Schemastatus aus vorhandenen Migrationen oder Schemadateien.
3. Generieren Sie die Migration mit:
   - Einem `up`-Pfad (Vorwärtsmigrierung), der wo möglich idempotent ist (verwenden Sie IF NOT EXISTS, IF EXISTS Schutzklauseln).
   - Einem `down`-Pfad (Rollback), der den `up`-Pfad vollständig rückgängig macht.
   - Expliziten Transaktionsgrenzen, falls das Framework transaktionales DDL unterstützt.
   - Spaltenbeschränkungen (NOT NULL, DEFAULT, CHECK), die dem entsprechen, was angefordert wurde.
   - Indexerstellung zusammen mit neuen Fremdschlüsseln.
4. Wenn die Änderung das Umbenennen einer Spalte oder Tabelle beinhaltet, generieren Sie eine zweiphasige Migration: neue hinzufügen, backfill, alte löschen — es sei denn, der Benutzer fordert explizit eine einphasige Umbenennung an.
5. Kennzeichnen Sie destruktive Operationen (DROP COLUMN, DROP TABLE, Typverengung) mit einem Kommentarblock, der mit `-- DESTRUCTIVE:` beginnt, und empfehlen Sie eine entsprechende Bereitstellungsstrategie (Feature-Flag, Dual-Write usw.).
6. Geben Sie den Inhalt der Migrationsdatei mit dem korrekten Dateinamen aus, der den vorhandenen Konventionen folgt.
7. Für große Tabellen kennzeichnen Sie Operationen, die ACCESS EXCLUSIVE-Sperren erfordern (ALTER TABLE auf PostgreSQL), und schlagen Sie CONCURRENTLY-Alternativen vor, wo verfügbar.

Generieren Sie keine ORM-Modelländerungen, wenn nicht anders angefordert. Konzentrieren Sie sich ausschliesslich auf das Migrationsartefakt.
