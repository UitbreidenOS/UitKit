# Datenbankmigrationsworkflow

Sicherer, schrittweiser Prozess zur Planung und Ausführung von Datenbankschemaänderungen ohne Ausfallzeit.

## Wann verwendet

Verwenden Sie diesen Workflow für jede Datenbankänderung, die:
- Ändert eine vorhandene Tabelle (Spalte hinzufügen/umbenennen/löschen, Typ ändern)
- Betrifft eine Tabelle mit > 100K Zeilen
- Erfordert einen neuen Index auf einer großen Tabelle
- Ändert eine Einschränkung oder einen Fremdschlüssel
- Umfasst das Verschieben oder Aufteilen von Daten zwischen Tabellen

Überspringen Sie diesen Workflow für: neue Tabellen in neuen Funktionen ohne vorhandene Daten.

## Phase 1: Planung (vor dem Schreiben von SQL)

**Beantworten Sie zunächst diese Fragen:**

1. Was genau ändert sich?
   - Spalte hinzufügen/umbenennen/löschen/Typ ändern/Einschränkung ändern/Index?

2. Wie viele Daten sind betroffen?
   ```sql
   SELECT COUNT(*) FROM affected_table;  -- Zeilenanzahl
   SELECT pg_size_pretty(pg_total_relation_size('affected_table'));  -- Tabellengröße
   ```

3. Wie stark wird diese Tabelle genutzt?
   ```sql
   -- Zugriffsmuster überprüfen (PostgreSQL)
   SELECT seq_scan, idx_scan, n_tup_upd, n_tup_del
   FROM pg_stat_user_tables WHERE relname = 'affected_table';
   ```

4. Kann dies ohne Ausfallzeit durchgeführt werden?
   - SPALTE NULLABLE HINZUFÜGEN: ja
   - NOT NULL-Spalte ohne Standard hinzufügen: erfordert Expand-Contract
   - SPALTE LÖSCHEN: ja (wenn Code sie nicht mehr verwendet)
   - SPALTE UMBENENNEN: erfordert Expand-Contract
   - INDEX ERSTELLEN: ja, mit CONCURRENTLY
   - SPALTENTYP ÄNDERN: riskant — prüfen Sie, ob Datenkonvertierung erforderlich ist

5. Ist der Anwendungscode mit dem alten und neuen Schema kompatibel?
   - Code zuerst bereitstellen, dann migrieren (neue Spalte kann null sein, bis sie gefüllt ist)
   - Oder zuerst migrieren, dann bereitstellen (nur wenn die Migration rein additiv ist)

## Phase 2: Schreiben Sie die Migration

**Verwenden Sie das Expand-Contract-Muster für jede Breaking Change:**

```sql
-- EXPAND-PHASE (dies zuerst bereitstellen, alter Code funktioniert immer noch):
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);

-- BACKFILL (offline ausführen, kein Lock):
-- In Batches, um Sperren zu vermeiden:
UPDATE users SET display_name = username 
WHERE display_name IS NULL AND id BETWEEN 1 AND 10000;
-- ... für alle ID-Bereiche wiederholen

-- CONTRACT-PHASE (nach Code-Update und Backfill abgeschlossen):
-- Einschränkungen nur nach Backfill hinzufügen:
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
-- Alte Spalte nur nach Bestätigung löschen, dass nichts sie liest:
ALTER TABLE users DROP COLUMN username;
```

**Schreiben Sie das Rollback:**
```sql
-- Jede Migration muss ein dokumentiertes Rollback haben
-- Rollback für obiges:
ALTER TABLE users ADD COLUMN username VARCHAR(255);
UPDATE users SET username = display_name WHERE username IS NULL;
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users DROP COLUMN display_name;
```

## Phase 3: Testen

```bash
# 1. Testen Sie auf einer Kopie von Produktionsdaten (nicht nur einer Dev-DB)
pg_dump $PROD_DB | psql $STAGING_DB

# 2. Migrationszeit im Staging messen
time psql $STAGING_DB < migration.sql

# 3. Rollback im Staging testen
time psql $STAGING_DB < rollback.sql

# 4. Datenintegrität nach Migration überprüfen
psql $STAGING_DB -c "SELECT COUNT(*) FROM affected_table WHERE new_column IS NULL;"
```

**Akzeptanzkriterien vor der Ausführung in der Produktion:**
- [ ] Migration läuft in < 30 Sekunden (oder verwendet CONCURRENTLY und ist nicht blockierend)
- [ ] Rollback getestet und bestätigt funktioniert
- [ ] Datenintegrität validiert (Zeilenanzahl, Null-Checks, Einschränkungs-Checks)
- [ ] Anwendung mit altem und neuem Schema getestet (während der Übergangsprozess)

## Phase 4: Produktionsausführung

**Vor-Migrations-Checkliste:**
- [ ] Sicherung in den letzten 24 Stunden erstellt (oder jetzt erstellen)
- [ ] Off-Peak-Zeit ausgewählt (Spitzenverkehrszeiten vermeiden)
- [ ] Techniker nach der Migration 30 Minuten lang bereit
- [ ] Rollback-Skript bereit, sofort einzufügen
- [ ] Überwachungs-Dashboards geöffnet

**Ausführung:**
```bash
# 1. Führe Migration aus
psql $PROD_DB < migration.sql

# 2. Sofort überprüfen
psql $PROD_DB -c "SELECT COUNT(*) FROM affected_table;"
psql $PROD_DB -c "\d affected_table"  # Schema bestätigen

# 3. 10 Minuten lang überwachen
# Überprüfen: Fehlerquote, Abfrage-Latenz, DB-CPU
```

**Wenn etwas falsch aussieht:**
```bash
# Rollback sofort ausführen
psql $PROD_DB < rollback.sql
# Dann im Staging untersuchen, bevor Sie es erneut versuchen
```

## Phase 5: Nach der Migration

- [ ] Bereinigung: Entfernen Sie alle während der Migration verwendeten temporären Spalten oder Indizes
- [ ] Dokumentation aktualisieren, wenn Schemadokumente vorhanden sind
- [ ] Migrationen mit Versionsverlauf archivieren
- [ ] Wenn die Migration komplex war: Schreiben Sie eine Post-Mortem-Notiz für das Team

## Zugehöriger Inhalt

- `/rules/common/database-migrations` — Regeln, die für alle Migrationen gelten
- `/skills/devops-infra/migration-architect` — komplexe Multi-System-Migrationen
- `/skills/database/postgresql` — PostgreSQL-spezifische Muster

---
