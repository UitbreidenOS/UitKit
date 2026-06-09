---
description: Generieren Sie eine Datenbankmigrationen-Datei aus einer Schemäänderungsbeschreibung oder einem Diff
argument-hint: "[description of schema change]"
---
Sie generieren eine Datenbankmigrationen. Der Benutzer hat Folgendes bereitgestellt: $ARGUMENTS

Leiten Sie das Ziel-Migrationsframework aus dem Projekt ab (Alembic, Flyway, Liquibase, Django-Migrationen, Rails ActiveRecord, Prisma, Knex, TypeORM, Sequelize oder reines SQL). Falls mehrdeutig, überprüfen Sie auf Konfigurationsdateien oder vorhandene Migrationen im Repo, bevor Sie fragen.

Schritte:
1. Überprüfen Sie bestehende Migrationen, um Benennungskonvention, Zeitstempelformat und Dateistruktur zu bestimmen.
2. Identifizieren Sie den aktuellen Schemastatus aus bestehenden Migrationen oder Schemadateien.
3. Generieren Sie die Migration mit:
   - Einem `up`-Pfad (Forward-Migration), der wo möglich idempotent ist (verwenden Sie IF NOT EXISTS, IF EXISTS Guards).
   - Einem `down`-Pfad (Rollback), der den `up`-Pfad vollständig umkehrt.
   - Explizite Transaktionsgrenzen, falls das Framework transaktionales DDL unterstützt.
   - Spaltenbeschränkungen (NOT NULL, DEFAULT, CHECK), die dem Anfragten entsprechen.
   - Index-Erstellung neben neuen Fremdschlüsseln.
4. Falls die Änderung das Umbenennen einer Spalte oder Tabelle beinhaltet, generieren Sie eine zwei-phasige Migration: neue hinzufügen, backfill, alte löschen — es sei denn, der Benutzer fordert explizit ein einphasiges Umbenennen an.
5. Kennzeichnen Sie destruktive Operationen (DROP COLUMN, DROP TABLE, Typverengerung) mit einem Kommentarblock, der mit `-- DESTRUCTIVE:` beginnt, und empfehlen Sie eine entsprechende Deployment-Strategie (Feature Flag, Dual-Write, etc.).
6. Geben Sie den Migrationen-Dateiinhalt mit dem korrekten Dateinamen nach bestehenden Konventionen aus.
7. Bei großen Tabellen kennzeichnen Sie Operationen, die ACCESS EXCLUSIVE Locks erfordern (ALTER TABLE auf PostgreSQL), und schlagen Sie CONCURRENTLY Alternativen vor, wo verfügbar.

Generieren Sie keine ORM-Modelländerungen, sofern nicht anders angefordert. Konzentrieren Sie sich ausschließlich auf die Migrationen-Artefakte.
