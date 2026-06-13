# Werkstroom databasemigratie

Veilig, stap-voor-stap proces voor het plannen en uitvoeren van databaseschemawijzigingen zonder downtime.

## Wanneer gebruiken

Gebruik deze werkstroom voor elke databasewijziging die:
- Een bestaande tabel wijzigt (kolom toevoegen/hernoemen/verwijderen, type wijzigen)
- Beïnvloedt een tabel met > 100K rijen
- Een nieuwe index op een grote tabel vereist
- Een beperking of vreemde sleutel wijzigt
- Omvat het verplaatsen of splitsen van gegevens tussen tabellen

Sla deze werkstroom over voor: nieuwe tabellen op nieuwe functies zonder bestaande gegevens.

## Fase 1: Planning (vóór het schrijven van SQL)

**Beantwoord eerst deze vragen:**

1. Wat verandert er precies?
   - Kolom toevoegen/hernoemen/verwijderen/type wijzigen/beperking wijzigen/index?

2. Hoeveel gegevens worden beïnvloed?
   ```sql
   SELECT COUNT(*) FROM affected_table;  -- rijnummer
   SELECT pg_size_pretty(pg_total_relation_size('affected_table'));  -- tabelgrootte
   ```

3. Hoe druk wordt deze tabel gebruikt?
   ```sql
   -- Toegangspatronen controleren (PostgreSQL)
   SELECT seq_scan, idx_scan, n_tup_upd, n_tup_del
   FROM pg_stat_user_tables WHERE relname = 'affected_table';
   ```

4. Kan dit zonder downtime worden gedaan?
   - NULLABLE-kolom TOEVOEGEN: ja
   - NOT NULL-kolom zonder standaardwaarde toevoegen: vereist expand-contract
   - KOLOM VERWIJDEREN: ja (als code het niet meer gebruikt)
   - KOLOM HERNOEMEN: vereist expand-contract
   - INDEX MAKEN: ja, met CONCURRENTLY
   - KOLOMTYPE WIJZIGEN: riskant — controleer of gegevensconversie nodig is

5. Is de applicatiecode compatibel met zowel het oude als het nieuwe schema?
   - Code eerst implementeren, dan migreren (nieuwe kolom kan null zijn totdat deze wordt ingevuld)
   - Of eerst migreren, dan implementeren (alleen als migratie zuiver additief is)

## Fase 2: Schrijf de migratie

**Gebruik het expand-contract-patroon voor elke breaking change:**

```sql
-- EXPAND-FASE (dit eerst implementeren, oude code werkt nog steeds):
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);

-- BACKFILL (offline uitvoeren, geen vergrendeling):
-- In batches om vergrendeling te voorkomen:
UPDATE users SET display_name = username 
WHERE display_name IS NULL AND id BETWEEN 1 AND 10000;
-- ... voor alle ID-bereiken herhalen

-- CONTRACT-FASE (nadat code is bijgewerkt en backfill voltooid):
-- Beperkingen alleen toevoegen na backfill:
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
-- Oude kolom alleen verwijderen na bevestiging dat niets het leest:
ALTER TABLE users DROP COLUMN username;
```

**Schrijf de terugdraaier:**
```sql
-- Elke migratie moet een gedocumenteerde terugdraaier hebben
-- Terugdraaier voor het bovenstaande:
ALTER TABLE users ADD COLUMN username VARCHAR(255);
UPDATE users SET username = display_name WHERE username IS NULL;
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users DROP COLUMN display_name;
```

## Fase 3: Test

```bash
# 1. Test op een kopie van productiegegevens (niet alleen een dev DB)
pg_dump $PROD_DB | psql $STAGING_DB

# 2. Meet migratietijd op staging
time psql $STAGING_DB < migration.sql

# 3. Test terugdraaier op staging
time psql $STAGING_DB < rollback.sql

# 4. Controleer gegevensintegriteit na migratie
psql $STAGING_DB -c "SELECT COUNT(*) FROM affected_table WHERE new_column IS NULL;"
```

**Acceptatiecriteria vóór uitvoering in productie:**
- [ ] Migratie loopt in < 30 seconden (of gebruikt CONCURRENTLY en is niet-blokerend)
- [ ] Terugdraaier getest en bevestigd werkend
- [ ] Gegevensintegriteit gevalideerd (rijtellingen, null-checks, beperkingschecks)
- [ ] Applicatie getest met zowel oud als nieuw schema (tijdens overgang)

## Fase 4: Productie-uitvoering

**Voorafgaande-controlelijst:**
- [ ] Backup gemaakt in de afgelopen 24 uur (of maak er een nu)
- [ ] Off-peak time geselecteerd (vermijd piekverkeer)
- [ ] Engineering standby gedurende 30 minuten na migratie
- [ ] Terugdraaiscript klaar om onmiddellijk in te plakken
- [ ] Dashboards geopend

**Uitvoering:**
```bash
# 1. Voer migratie uit
psql $PROD_DB < migration.sql

# 2. Controleer onmiddellijk
psql $PROD_DB -c "SELECT COUNT(*) FROM affected_table;"
psql $PROD_DB -c "\d affected_table"  # bevestig schema

# 3. Monitor gedurende 10 minuten
# Controleer: foutpercentage, querylatentie, DB CPU
```

**Als iets fout lijkt:**
```bash
# Voer terugdraaier onmiddellijk uit
psql $PROD_DB < rollback.sql
# Onderzoek vervolgens op staging vóór herpoging
```

## Fase 5: Na migratie

- [ ] Opruiming: verwijder alle temporaire kolommen of indexen die tijdens migratie zijn gebruikt
- [ ] Documentatie bijwerken als deze bestaat
- [ ] Migratiebestanden archiveren met versiegeschiedenis
- [ ] Als migratie complex was: schrijf een postmortem-notitie voor het team

## Gerelateerde inhoud

- `/rules/common/database-migrations` — regels die van toepassing zijn op alle migraties
- `/skills/devops-infra/migration-architect` — complexe multi-systeemmigraties
- `/skills/database/postgresql` — PostgreSQL-specifieke patronen

---
