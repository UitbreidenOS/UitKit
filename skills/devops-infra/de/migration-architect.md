---
name: migration-architect
description: "Zero-Downtime-Migrationsplanung: Datenbankschema-Migrationen (expand-contract), Infrastruktur-Cutovers, Service-Ersetzungen — Phasenweise Pläne, Rollback-Strategien und Validierungs-Gates"
---

# Fähigkeit Migrations-Architekt

## Wann aktivieren
- Planung einer Datenbankschema-Migration ohne Downtime
- Entwerfen eines Service-Cutover oder System-Ersetzung
- Erstellung eines Migrations-Phasenplans mit expliziten Rollback-Pfaden
- Validierung der Datenkompatibilität vor und nach Migration
- Infrastruktur-Migration (Cloud-Provider, Hosting, Datenbank-Engine)

## Wann NICHT verwenden
- npm/pip Abhängigkeitsaktualisierungen — nutzen Sie die dependency-auditor-Fähigkeit
- Cloud-Architektur-Design ohne Migrations-Kontext — nutzen Sie cloud architect-Fähigkeiten
- Daten-Pipeline ETL-Design — nutzen Sie data-ml-Fähigkeiten

## Anweisungen

### Datenbankschema-Migration (expand-contract)

```
Planung einer Zero-Downtime-Datenbankschema-Migration.

Datenbank: [PostgreSQL / MySQL / MongoDB / andere]
Änderung: [beschreiben — Spalte hinzufügen / Spalte umbenennen / Typ ändern / Tabelle teilen / FK hinzufügen]
Aktueller Traffic: [Anfragen/Sekunde, Spitzenlast]
Rollback-Anforderung: [muss rollback können / nur-vorwärts akzeptabel]

Das expand-contract-Muster (Zero-Downtime, alle produktionssicher):

PHASE 1 — EXPAND (zuerst bereitstellen, rückwärtskompatibel):
Neue Struktur neben bestehende hinzufügen:
- Neue Spalte mit NULL-Standard (nicht NOT NULL — würde Tabelle sperren)
- Neue Tabelle neben alter
- Neuer Index (CREATE INDEX CONCURRENTLY — kein Tabellenlock in PostgreSQL)

PHASE 2 — DUAL WRITE (beide alte und neue Schema):
Anwendung schreibt zu beiden alten und neuen Struktur gleichzeitig.
Lesevorgänge verwenden weiterhin alte Struktur (Rollback: einfach Schreiben zu neuer beenden).

PHASE 3 — MIGRATE READS:
Anwendungs-Lesevorgänge zur neuen Struktur wechseln.
Alte Struktur erhält noch Schreibvorgänge (ermöglicht Rollback).

PHASE 4 — CONTRACT (alte Struktur entfernen):
Alte Spalte/Tabelle/Index entfernen, sobald 100% bestätigt stabil.
Dies ist irreversibel — gründlich bestätigen vor Ausführung.

Generiere Migrations-Plan für mein spezifisches Schema-Change.
```

### Service-Replacement-Cutover

```
Planung eines Service-Ersetzungs-Cutover ohne Downtime.

Alter Service: [beschreiben — Monolith / Legacy-API / Third-Party-Abhängigkeit]
Neuer Service: [beschreiben]
Traffic: [X Anfragen/Sekunde, X betroffene Benutzer]
Rollback-Fenster: [wie lange können wir zurückrollen, falls etwas schiefgeht?]

Strangler Fig-Muster (sicherste für Service-Ersetzung):

Phase 1 — Neuen Service neben alter bereitstellen (kein Traffic noch):
- Neuer Service in Produktionsumgebung bereitgestellt
- Nur interner Test (Mitarbeiter, interne Test-Konten)
- Funktionsparität gegen alten Service-API-Vertrag validiert

Phase 2 — Shadow-Modus (beide Services erhalten Traffic):
- Alle Anfragen gehen zu altem Service (Produktions-Traffic)
- Neuer Service erhält Kopie aller Anfragen (Shadow-Traffic)
- Vergleiche Antworten: alt vs neu — identifiziere Unterschiede
- Behebt Unterschiede im neuen Service, ohne Benutzer zu beeinflussen

Phase 3 — Canary (kleiner % zu neuem Service):
- 1% → 5% → 10% → 25% → 50% → 100% über Tage/Wochen
- Überwache bei jedem Schritt: Fehlerrate, Latenz, Business-Metriken
- Rollback-Auslöser: wenn Fehlerrate bei jedem Canary-Schritt > [Schwelle] steigt

Phase 4 — Vollständiger Cutover:
- 100% Traffic zum neuen Service
- Alter Service für [X Tage] in Bereitschaft gehalten (noch nicht außer Betrieb)
- Rollback: Load-Balancer-Gewicht zurück zu altem Service bei Bedarf

Phase 5 — Außerbetriebnahme:
- Alter Service nach [Stabilitätsfenster] außer Betrieb genommen
- Alt-Service Daten/Zustand migriert oder archiviert

Generiere Cutover-Plan für meine spezifischen Services.
```

### Cloud-Infrastruktur-Migration

```
Planung einer Cloud-Migration für [Workload].

Quelle: [AWS / Azure / GCP / on-prem / Co-Location]
Ziel: [AWS / Azure / GCP]
Workloads: [beschreiben — Web-App / Datenbank / Storage / alle]
Datenvolumen: [X GB / TB]
Downtime-Toleranz: [Zero-Downtime / Wartungsfenster von X Stunden]

Migrationsphasen:

PHASE 1 — BEWERTEN (2-4 Wochen):
□ Alle Workloads, Abhängigkeiten und Datenvolumen inventarisieren
□ Migrations-Blocker identifizieren (proprietäre Formate, Lizenzen, Compliance-Einschränkungen)
□ Priorisieren: mit stateless-Services starten (einfach), mit Datenbanken enden (schwierig)
□ Aktuellen Zustand dokumentieren: Architektur-Diagramm, Netzwerk-Topologie, DNS-Einträge

PHASE 2 — PILOT (2-4 Wochen):
□ 1 unkritischen Service zu Ziel-Cloud migrieren
□ Leistung, Kosten und operative Muster validieren
□ CI/CD-Pipelines für Ziel-Cloud bauen und testen
□ Team auf Ziel-Cloud-Werkzeuge trainieren

PHASE 3 — LIFT AND SHIFT (pro Workload):
Für jeden stateless-Service:
□ Containerisieren, falls noch nicht (Docker)
□ Parallel zu Ziel-Cloud bereitstellen (Quelle noch nicht ersetzen)
□ Akzeptest-Tests ausführen
□ DNS-Cutover (niedriges TTL erst, dann wechseln)
□ Für [X Tage] überwachen vor Quellen-Außerbetriebnahme

PHASE 4 — DATENBANK-MIGRATION:
□ Replikation von Quell- zu Ziel-Datenbank einrichten (laufende Synchronisation)
□ Datenintegrität validieren (Zeilenzahlen, Checksums, Spot-Check-Abfragen)
□ Anwendungs-Cutover: App auf neue Datenbank zeigen
□ Replikation stoppen
□ Alte Datenbank als Backup für [X Tage] behalten

PHASE 5 — AUSSERBETRIEBNAHME:
□ Alle Workloads auf Ziel-Cloud validiert
□ Alte Cloud-Infrastruktur beendet
□ DNS-Einträge bereinigt
□ Altes Cloud-Konto geschlossen

Generiere Phasen-Migrationsplan für meine spezifischen Workloads.
```

### Rollback-Strategie

```
Rollback-Strategie für [Migration] entwerfen.

Migrationstyp: [Schema-Änderung / Service-Cutover / Cloud-Migration / Daten-Migration]
Aktuelle Phase: [welche Phase ist in Arbeit oder geplant]
Maximal akzeptabler Downtime: [Zero / X Minuten / X Stunden]
Daten-Änderungsrisiko: [Daten könnten mutiert werden / Daten sind nur lesbar / beides]

Rollback-Strategie nach Migrationstyp:

SCHEMA-MIGRATIONEN:
Phase 1 (nur expand): Rollback = neue Spalte/Index/Tabelle löschen. Sicher, sofort.
Phase 2 (dual write): Rollback = Schreiben zu neuer beenden, neue löschen. Sicher.
Phase 3 (Lesevorgänge gewechselt): Rollback = Lesevorgänge zu alt zurück wechseln. Schnell.
Phase 4 (contract): IRREVERSIBEL. Nie ohne 48h Stabilitätsbeobachtung ausführen.

SERVICE-CUTOVERS:
Rollback-Mechanismus: Load-Balancer-Gewicht-Flip (Sekunden zur Ausführung)
Erforderlich: alten Service parallel für [mindestens X Tage] laufen lassen
Entscheidungspunkt für Außerbetriebnahme: [nie vor 7 Tagen stabilem Traffic bei 100%]

Generiere Rollback-Strategie und Runbook für meine Migration.
```

## Beispiel

**Benutzer:** Wir müssen eine Spalte in unserer PostgreSQL-Orders-Tabelle umbenennen (user_id → customer_id). 2M Zeilen, 500 req/sec. Zero Downtime. Wie?

**Claudes Migrations-Plan:**

4-Phasen expand-contract, totale verstrichene Zeit: ~3-5 Tage parallele Operation, 15 Minuten tatsächliche Datenbankarbeit über 4 Deployments verteilt.

**Phase 1 — Neue Spalte hinzufügen (Deploy 1, 5 Minuten):**
```sql
ALTER TABLE orders ADD COLUMN customer_id BIGINT;
CREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id);
```

**Phase 2 — Bestehende Zeilen rückfüllen (außerhalb Spitzenzeiten ausführen, kein Lock):**
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

**Phase 3 — Dual write (Deploy 2):**
Anwendung schreibt sowohl `user_id` ALS AUCH `customer_id`. Lesevorgänge verwenden weiterhin `user_id`.
Minimum 48 Stunden ausführen. Bestätigen, dass `customer_id` vollständig gefüllt und konsistent ist.

**Phase 4 — Lesevorgänge wechseln (Deploy 3):**
Anwendung liest jetzt von `customer_id`. Schreibt weiterhin beides.
48 Stunden überwachen. Rollback: Lesevorgänge zurück zu `user_id` wechseln (schnell, sicher).

**Phase 5 — Alte Spalte entfernen (Deploy 4, nach 1 Woche stabil):**
```sql
ALTER TABLE orders DROP COLUMN user_id;
DROP INDEX idx_orders_user_id;
```

**Zero-Downtime-Garantie:** Jeder Schritt ist ein rückwärtskompatibles Deployment. Rollback bei jedem Schritt vor Phase 5 = Deployment wechseln. Nach Phase 5 = nur-vorwärts.

---
