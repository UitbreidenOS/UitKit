---
description: Genereer een databaseback-up- en herstelplan afgestemd op de projectstack en RTO/RPO-vereisten
argument-hint: "[database type, hosting environment, or RTO/RPO requirements]"
---
Genereer een databaseback-up- en herstelplan voor: $ARGUMENTS

Als $ARGUMENTS een databasetype en/of omgeving specificeert, gebruik dit dan. Anders detecteert u de database-engine en hostingcontext uit projectconfiguratiebestanden (docker-compose, .env, database.yml, enz.).

Produceer een volledig back-upplan met de volgende onderdelen:

1. Back-upstrategie:
   - Volledige back-upfrequentie en schema (cron-expressie).
   - Incrementele of WAL-gebaseerde continue back-up als de engine dit ondersteunt (PostgreSQL WAL-archivering, MySQL binlog, MSSQL-transactielogverzending).
   - Logische versus fysieke back-upafwegingen voor deze engine en gegevenssetgrootte.
   - Aanbevolen tools: pg_dump / pg_basebackup, mysqldump / Percona XtraBackup, mongodump, sqlite3 .backup, cloud-native snapshots (RDS, Cloud SQL, Azure Database).

2. Retentiebeleid:
   - Dagelijkse back-ups bewaard voor N dagen, wekelijks voor N weken, maandelijks voor N maanden — geef een concrete aanbeveling op basis van impliciete nalevingsvereisten.
   - Richtlijnen voor schatting van opslagkosten (verhouding van gecomprimeerde back-upgrootte tot onbewerkte databasegrootte).

3. Opslag en beveiliging:
   - Vereiste voor off-site of cross-region opslag.
   - Codering in rust (back-upbestanden moeten worden gecodeerd — geef de vlag/configuratie voor het gekozen gereedschap).
   - Toegangsbeheer: back-upreferenties moeten gescheiden zijn van toepassingsreferenties.

4. Herstelprocedures:
   - Stap-voor-stap herstelopdrachten voor de aanbevolen tools.
   - Point-in-time recovery (PITR) instructies als WAL/binlog-archivering is geconfigureerd.
   - Geschatte RTO op basis van back-upgrootte en herstelmethode.

5. Back-upvalidatie:
   - Wekelijkse herstelprocedurecyclus naar een staging-omgeving.
   - Checksum- of rijtelverificatiestap na herstel.
   - Waarschuwingen: wat u moet bewaken (back-uptaakafsluiting, back-upleeftijd, back-upgrootteanomalie).

6. Runbook-sjabloon:
   - Een korte incidentrunbook: "Database is weg — wat moet ik in de volgende 15 minuten doen?"

Voer concrete opdrachten uit, geen generiek advies. Alle opdrachten moeten ongewijzigd of met minimale variabelevervanging uitvoerbaar zijn.
