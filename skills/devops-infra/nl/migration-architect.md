---
name: migration-architect
description: "Zero-downtime migratieplanning: databaseschemamigaties (expand-contract), infrastructuur cutovers, service-vervangingen — gefaseerde plannen, rollback-strategieën en validatiepoorten"
---

# Vaardigheid Migratie-Architect

## Wanneer activeren
- Planning van een databaseschemamingie zonder downtime
- Ontwerp van service-cutover of systeemvervanging
- Opbouw van gefaseerde migratieplan met expliciete rollback-paden
- Validatie van gegevenscompatibiliteit vóór en na migratie
- Infrastructuurmigratie (cloudprovider, hosting, database-engine)

## Wanneer NIET gebruiken
- npm/pip-afhankelijkheidsupgrades — use dependency-auditor skill
- Cloud-architectuurontwerp zonder migratiecontext — use cloud architect skills
- Gegevens-pipeline ETL-ontwerp — use data-ml skills

## Instructies

### Databaseschemamingie (expand-contract)

```
Plan zero-downtime databaseschemamingie.

Database: [PostgreSQL / MySQL / MongoDB / ander]
Wijziging: [beschrijf — kolom toevoegen / kolom hernoemen / type wijzigen / tabel splitsen / FK toevoegen]
Huidge traffic: [aanvragen/seconde, pieklast]
Rollback-vereiste: [moet kunnen terugdraaien / forward-only acceptabel]

Het expand-contract-patroon (zero-downtime, alles production-veilig):

FASE 1 — EXPAND (eerst implementeren, achterwaarts compatibel):
Voeg nieuwe structuur naast bestaande toe:
- Nieuwe kolom met NULL-standaard (niet NOT NULL — zou tabel vergrendelen)
- Nieuwe tabel naast oude
- Nieuwe index (CREATE INDEX CONCURRENTLY — geen tabellock in PostgreSQL)

FASE 2 — DUAL WRITE (beide oude en nieuwe schema):
Toepassing schrijft naar beide oude en nieuwe structuur tegelijk.
Lezen gebruiken nog steeds oude structuur (terugdraaien: eenvoudig schrijven naar nieuw stoppen).

FASE 3 — MIGRATE READS:
Schakelen toepassingsleesoperaties naar nieuwe structuur.
Oude structuur ontvangt nog steeds schrijvingen (maakt terugdraaien mogelijk).

FASE 4 — CONTRACT (oude structuur verwijderen):
Verwijder oude kolom/tabel/index zodra 100% bevestigd stabiel.
Dit is onomkeerbaar — goed bevestigen vóór uitvoering.

Genereer migratieplan voor mijn specifieke schemawijziging.
```

### Service-vervangings-cutover

```
Plan service-vervangings-cutover zonder downtime.

Oude service: [beschrijf — monoliet / legacy API / third-party-afhankelijkheid]
Nieuwe service: [beschrijf]
Traffic: [X aanvragen/seconde, X getroffen gebruikers]
Terugdraaienvenster: [hoe lang kunnen we terugdraaien als iets misgaat?]

Strangler Fig-patroon (veiligste voor service-vervanging):

Fase 1 — Implementeer nieuwe service naast oude (geen traffic nog):
- Nieuwe service in productieomgeving geïmplementeerd
- Alleen interne tests (medewerkers, interne testaccounts)
- Functionaliteitspariteit tegen oude service-API-contract gevalideerd

Fase 2 — Shadow-modus (beide services ontvangen traffic):
- Alle aanvragen gaan naar oude service (productie-traffic)
- Nieuwe service ontvangt kopie van alle aanvragen (shadow-traffic)
- Vergelijk antwoorden: oud vs nieuw — identificeer discrepanties
- Repareer discrepanties in nieuwe service zonder gebruikers te beïnvloeden

Fase 3 — Canary (klein % naar nieuwe service):
- 1% → 5% → 10% → 25% → 50% → 100% over dagen/weken
- Controleer bij elke stap: foutfrequentie, latentie, business-metrieken
- Terugdraaien-trigger: als foutfrequentie bij elke canary-stap > [drempel] stijgt

Fase 4 — Volledige cutover:
- 100% traffic naar nieuwe service
- Oude service voor [X dagen] paraat gehouden (nog niet buiten bedrijf)
- Terugdraaien: load-balancer-gewicht terug naar oude service bij behoefte

Fase 5 — Buitenbedrijfstelling:
- Oude service na [stabiliteitvenster] buiten bedrijf gesteld
- Oude service-gegevens/status gemigreerd of gearchiveerd

Genereer cutoverplan voor mijn specifieke services.
```

### Cloud-infrastructuurmigratie

```
Plan cloud-migratie voor [workload].

Bron: [AWS / Azure / GCP / on-prem / Co-location]
Doel: [AWS / Azure / GCP]
Workloads: [beschrijf — web-app / database / storage / alles]
Gegevensvolume: [X GB / TB]
Downtime-tolerantie: [zero downtime / onderhoudsvenster van X uur]

Migratiefasen:

FASE 1 — BEOORDELEN (2-4 weken):
□ Alle workloads, afhankelijkheden en gegevensvolumes inventariseren
□ Migratieblokkades identificeren (propriëtaire formaten, licenties, compliance-beperkingen)
□ Prioriteit: start met stateless-services (gemakkelijk), eindig met databases (moeilijk)
□ Huidge staat documenteren: architectuurdiagram, netwerktopologie, DNS-records

FASE 2 — PILOT (2-4 weken):
□ 1 niet-kritische service naar doelcloud migreren
□ Prestatie, kosten en bedrijfspatronen valideren
□ CI/CD-pipelines voor doelcloud bouwen en testen
□ Team trainen op doelcloud-tooling

FASE 3 — LIFT AND SHIFT (per workload):
Voor elke stateless-service:
□ Containeriseer indien nog niet (Docker)
□ Parallel naar doelcloud implementeren (bron nog niet vervangen)
□ Acceptatietests uitvoeren
□ DNS-cutover (laag TTL eerst, dan wisselen)
□ Controleren voor [X dagen] vóór broncoderingering

FASE 4 — DATABASE-MIGRATIE:
□ Replicatie van bron naar doeldatabase instellen (continue synchronisatie)
□ Gegevensintegriteit valideren (rijtellingen, checksums, steekproef-query's)
□ Toepassings-cutover: app naar nieuwe database wijzen
□ Replicatie stoppen
□ Oude database als backup voor [X dagen] behouden

FASE 5 — BUITENBEDRIJFSTELLING:
□ Alle workloads op doelcloud gevalideerd
□ Oude cloud-infrastructuur beëindigd
□ DNS-records opgeruimd
□ Oud cloud-account gesloten

Genereer gefaseerde migratieplan voor mijn specifieke workloads.
```

### Terugdraaistrategie

```
Ontwerp terugdraaistrategie voor [migratie].

Migratietype: [schemawijziging / service-cutover / cloud-migratie / gegevensmigratie]
Huidge fase: [welke fase is in uitvoering of gepland]
Maximaal acceptabele downtime: [zero / X minuten / X uur]
Gegevenswijzigingsrisico: [gegevens kunnen worden gemuteerd / gegevens alleen-lezen / beide]

Terugdraaistrategie per migratietype:

SCHEMAMIGATIES:
Fase 1 (alleen expand): terugdraaien = nieuwe kolom/index/tabel löschen. Veilig, onmiddellijk.
Fase 2 (dual write): terugdraaien = schrijven naar nieuwe stoppen, nieuwe löschen. Veilig.
Fase 3 (leesoperaties geschakeld): terugdraaien = leesoperaties naar oude terugswitchen. Snel.
Fase 4 (contract): ONOMKEERBAAR. Nooit zonder 48h stabiliteitsobservatie uitvoeren.

SERVICE-CUTOVERS:
Terugdraaimechanisme: load-balancer-gewicht flip (seconden voor uitvoering)
Vereist: oude service parallel voor [minimum X dagen] laten draaien
Beslissingspunt voor buitenbedrijfstelling: [nooit vóór 7 dagen stabiele traffic bij 100%]

Genereer terugdraaistrategie en runbook voor mijn migratie.
```

## Voorbeeld

**Gebruiker:** We moeten een kolom in onze PostgreSQL-ordertabel hernoemen (user_id → customer_id). 2M rijen, 500 req/sec. Zero downtime. Hoe?

**Claudes migratieplan:**

4-fasen expand-contract, totale verstreken tijd: ~3-5 dagen parallelle operatie, 15 minuten werkelijke databasewerk verdeeld over 4 implementaties.

**Fase 1 — Nieuwe kolom toevoegen (Implementeer 1, 5 minuten):**
```sql
ALTER TABLE orders ADD COLUMN customer_id BIGINT;
CREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id);
```

**Fase 2 — Bestaande rijen opvullen (buiten piekuren uitvoeren, geen lock):**
```sql
DO $$
DECLARE batch_size INT := 10000;
BEGIN
  LOOP
    UPDATE orders SET customer_id = user_id
    WHERE customer_id IS NULL
    LIMIT batch_size;
    EXIT WHEN NOT FOUND;
    PERFORM pg_sleep(0.01);
  END LOOP;
END $$;
```

**Fase 3 — Dual write (Implementeer 2):**
Toepassing schrijft naar beide `user_id` EN `customer_id`. Leesoperaties gebruiken nog steeds `user_id`.
Voer minstens 48 uur uit. Bevestigen dat `customer_id` volledig is ingevuld en consistent.

**Fase 4 — Leesoperaties schakelen (Implementeer 3):**
Toepassing leest nu van `customer_id`. Schrijft nog steeds beide.
48 uur controleren. Terugdraaien: leesoperaties terug naar `user_id` schakelen (snel, veilig).

**Fase 5 — Oude kolom verwijderen (Implementeer 4, na 1 week stabiel):**
```sql
ALTER TABLE orders DROP COLUMN user_id;
DROP INDEX idx_orders_user_id;
```

**Zero-downtime-garantie:** Elke stap is een achterwaarts compatibele implementatie. Terugdraaien bij elke stap vóór Fase 5 = implementatie schakelen. Na Fase 5 = alleen-voorwaarts.

---
