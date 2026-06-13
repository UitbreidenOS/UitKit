---
description: Genereer een back-up- en herstelplan voor databases afgestemd op de stack van het project en RTO/RPO-vereisten
argument-hint: "[databasetype, hostingomgeving of RTO/RPO-vereisten]"
---
Genereer een back-up- en herstelplan voor databases voor: $ARGUMENTS

Als $ARGUMENTS een databasetype en/of omgeving specificeert, gebruik die. Anders detecteert u de database-engine en hostingcontext uit projectconfiguratie (docker-compose, .env, database.yml, enz.).

Produceer een compleet back-upplan dat het volgende behandelt:

1. Back-upstrategie:
   - Volledige back-upfrequentie en -planning (cron-expressie).
   - Incrementele of WAL-gebaseerde continue back-up indien ondersteund door de engine (PostgreSQL WAL-archivering, MySQL binlog, MSSQL transactionlogverzending).
   - Logisch vs. fysiek back-upafwegingen voor deze engine en gegevenssetgrootte.
   - Aanbevolen tools: pg_dump / pg_basebackup, mysqldump / Percona XtraBackup, mongodump, sqlite3 .backup, cloudeigen snapshots (RDS, Cloud SQL, Azure Database).

2. Bewaarbeleid:
   - Dagelijkse back-ups voor N dagen, wekelijks voor N weken, maandelijks voor N maanden — zorg voor een concrete aanbeveling op basis van veronderstelde compliance-vereisten.
   - Richtlijn voor schatting van opslagkosten (verhouding tussen gecomprimeerde back-upgrootte en grootte van ruwe database).

3. Opslag en beveiliging:
   - Vereiste voor off-site of cross-regio opslag.
   - Versleuteling in rust (back-upbestanden moeten worden versleuteld — zorg voor de vlag/configuratie voor het gekozen tool).
   - Toegangscontrole: back-upcredentials moeten gescheiden zijn van toepassingscredentials.

4. Herstelaprocedures:
   - Stap-voor-stap herstellopdrachten voor de aanbevolen tools.
   - Instructies voor point-in-time recovery (PITR) indien WAL/binlog-archivering is geconfigureerd.
   - Geschat RTO op basis van back-upgrootte en herstelmethode.

5. Back-upvalidatie:
   - Wekelijkse hersteltestprocedure in een stagingomgeving.
   - Verificatiestap voor controlsommen of rijentelling na herstellen.
   - Waarschuwing: wat u moet monitoren (back-uptaak-exitcode, back-upleeftijd, afwijking in back-upgrootte).

6. Runbook-sjabloon:
   - Een korte incident-runbook: "Database is weg — wat moet ik in de volgende 15 minuten doen?"

Zorg voor concrete opdrachten, niet voor generieke adviezen. Alle opdrachten moeten ongewijzigd kunnen worden uitgevoerd of met minimale variabelevervanging.
