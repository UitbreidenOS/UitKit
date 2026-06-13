---
name: capacity-planner
description: "Infrastruktur-Kapazitätsplanung: Ressourcenbedarf vorhersagen, Kostenprojektionen erstellen, Skalierungsempfehlungen geben"
---

# Skill: Infrastruktur-Kapazitätsplaner

## Wann aktivieren
- Infrastrukturplanung vor einem Produktlaunch oder Traffic-Anstieg
- Prognose von Cloud-Kosten für das nächste Quartal oder Geschäftsjahr
- Entscheidung, wann ein Dienst horizontal oder vertikal skaliert werden soll
- Bewertung, ob Instanzen reserviert oder On-Demand-Preise verwendet werden sollen
- Erstellung eines Infrastrukturbudgets für ein Fundraising-Gespräch
- Abbau überprovisionierter Ressourcen zur Senkung der Cloud-Ausgaben
- Planung der Datenbankkapazität vor Datenwachstum

## Wann NICHT verwenden
- Echtzeit-Skalierungsentscheidungen bei Vorfällen — dafür `/incident-response` verwenden
- Architektur-Redesign — dafür `/aws-architect`, `/gcp-architect` oder `/azure-architect` verwenden
- SLO-Definition und Fehlerbudget — dafür `/slo-architect` verwenden
- Kostenoptimierung bestehender Ausgaben (Rightsizing, Reserved Instances) ohne Planungskontext — ein dediziertes Kostenwerk zeug verwenden

## Anweisungen

### Kernprompt für die Kapazitätsplanung

```
Erstelle einen Kapazitätsplan für [DIENST oder SYSTEM] für die nächsten [3 / 6 / 12] Monate.

Aktueller Zustand:
- Dienst: [was er tut]
- Traffic: [aktuelle Anfragen/Tag oder RPS]
- Infrastruktur: [aktuelle Rechenkapazität — z.B. 3x t3.medium EC2, 2 Kubernetes-Pods etc.]
- Datenbank: [Typ, Instanzgröße, aktuell verwendeter Speicher]
- Aktuelle monatliche Cloud-Kosten: [$X]
- Aktuelle Auslastung: [CPU: X %, Arbeitsspeicher: X %, DB-Verbindungen: X von Y]

Wachstumsannahmen:
- Erwartetes Traffic-Wachstum: [X % pro Monat / flach / spezifischer ereignisbasierter Anstieg]
- Erwartetes Datenwachstum: [GB/Monat in Datenbank oder Objektspeicher]
- Geplante Produktlaunches: [Ereignisse, die plötzliche Spitzen verursachen werden]

Einschränkungen:
- SLO: [Verfügbarkeitsziel, Latenz-SLO]
- Budgetgrenze: [$X/Monat max]
- Cloud-Anbieter: [AWS / GCP / Azure]
- Bestehende Verpflichtungen: [bereits gekaufte Reserved Instances oder Savings Plans]

Erstelle:

## 1. Kapazitätsprognose
Voraussichtlicher Ressourcenbedarf nach: [3 Monaten / 6 Monaten / 12 Monaten]
- Rechenkapazität: aktuell vs. benötigt
- Arbeitsspeicher: aktuell vs. benötigt
- Datenbank: Speicher- und IOPS-Wachstum
- Bandbreite / Datentransferkosten
- CDN- oder Caching-Layer-Auswirkung

## 2. Skalierungsauslöser
Ab welchem Metrik-Schwellenwert sollte skaliert werden?
- CPU > X % über Y Minuten anhaltend → um Z Replicas erweitern
- Arbeitsspeicher > X % → vertikal auf nächste Stufe skalieren oder Swap hinzufügen
- DB-Verbindungen > X % des Maximums → Connection Pooling (PgBouncer) oder Read Replica erwägen

## 3. Kostenprognose
| Monat | Rechenkapazität | Datenbank | Speicher | Bandbreite | Gesamt |
|---|---|---|---|---|---|
| Jetzt | $X | $X | $X | $X | $X |
| +3 Mo. | $X | $X | $X | $X | $X |
| +6 Mo. | $X | $X | $X | $X | $X |
| +12 Mo. | $X | $X | $X | $X | $X |

## 4. Skalierungsempfehlungen
Konkrete Maßnahmen in Reihenfolge:
1. [Was jetzt zu tun ist — sofortige Maßnahme]
2. [Was in 30–60 Tagen zu tun ist]
3. [Was für 6 Monate zu planen ist]

## 5. Kostenoptimierungsmöglichkeiten
Einsparungen ohne Kapazitätsreduzierung:
- Reserved Instances / Savings Plans: $X/Monat gespart bei sofortigem Kauf
- Rightsizing: [spezifische überprovisionierte Instanzen]
- Speicher-Tiering: [Daten, die in günstigeren Speicher verschoben werden können]
- Caching: [was gecacht werden kann, um DB-Last und Rechenkosten zu reduzieren]
```

### Traffic-basiertes Skalierungsmodell

```
Erstelle ein Skalierungsmodell für [DIENST] basierend auf Traffic-Mustern.

Aktuelle Traffic-Daten:
- Durchschnittliche RPS (Anfragen pro Sekunde): [X]
- Spitzen-RPS (höchster beobachteter Wert): [X]
- Tägliches Traffic-Muster: [flach / Morgenpeak / Abendpeak / stoßartig]
- Wochenmuster: [werktags-schwer / wochenend-schwer / flach]

Diensteigenschaften:
- Durchschnittliche Anfragelatenz: [Xms bei aktueller Last]
- CPU pro Anfrage (ungefähr): [X % pro Pod pro 100 RPS]
- Arbeitsspeicher pro Anfrage: [X MB Working Set pro Pod]
- Zustandslos oder zustandsbehaftet: [zustandslos = einfach horizontal skalierbar]

Ausgabe des Skalierungsmodells:

Für jedes RPS-Niveau:
| RPS | Benötigte Pods | CPU-Headroom | Latenzschätzung | Kosten/Monat |
|---|---|---|---|---|
| [Aktuell: X] | [Y Pods] | [X % Headroom] | [Xms] | $X |
| [2x Wachstum] | | | | |
| [5x Wachstum] | | | | |
| [10x Wachstum] | | | | |

Horizontale Skalierungsregeln:
- Erweitern wenn: CPU > [X] % für [Y] Minuten ODER RPS > [Z]
- Reduzieren wenn: CPU < [X] % für [Y] Minuten UND RPS < [Z]
- Minimale Pods: [N] (für Verfügbarkeit während Skalierungsereignissen)
- Maximale Pods: [N] (Kostengrenze oder Kontolimit)

HPA-Konfiguration (Horizontal Pod Autoscaler) für Kubernetes:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: [service-name]
  namespace: [namespace]
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: [service-name]
  minReplicas: [N]
  maxReplicas: [N]
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

Das Skalierungsmodell für meinen Dienst generieren.
```

### Datenbankkapazitätsplanung

```
Plane die Datenbankkapazität für [DIENST] über [N] Monate.

Aktueller Zustand:
- Datenbank: [PostgreSQL / MySQL / MongoDB / DynamoDB / etc.]
- Instanz: [aktueller Instanztyp und -größe]
- Speicher: [aktuell genutzt / insgesamt bereitgestellt]
- Verbindungen: [aktuelle aktive Verbindungen / maximale Verbindungen]
- Größte Tabellen: [Name: X GB, Name: Y GB]
- Abfragemuster: [leselastig 80/20 / schreiblastig / ausgewogen]
- Backup-Aufbewahrung: [X Tage]

Wachstumseingaben:
- Neue Daten pro Tag: [X GB / X Zeilen in der größten Tabelle]
- Monatliche Wachstumsrate: [X %]
- Geplante Datenmigration oder Schema-Änderungen: [beschreiben]

Ausgabe des Datenbankkapazitätsplans:

## Speicherprognose
| Monat | Datengröße | Indexgröße | Gesamt | Speicherkosten |
|---|---|---|---|---|
| Jetzt | X GB | X GB | X GB | $X |
| +3 Mo. | | | | |
| +6 Mo. | | | | |
| +12 Mo. | | | | |

Speicher-Warnschwellen:
- Gelb: Speicher > 70 % voll → Upgrade planen
- Rot: Speicher > 85 % voll → Upgrade innerhalb von 1 Woche

## Verbindungskapazität
Aktuelle maximale Verbindungen für [Instanztyp]: [N]
Aktuelle Auslastung: [X Verbindungen, X % des Maximums]
Connection-Pool-Empfehlung:

Bei Verwendung von PgBouncer oder RDS Proxy:
- Pool-Größe pro Anwendungsinstanz: [N]
- Maximale Clients: [N]
- Pool-Modus: [Transaktion / Session — Transaktion empfohlen für zustandslose APIs]

## Instanz-Upgrade-Auslöser
Instanz upgraden wenn:
- Durchschnittliche CPU > 70 % für > 30 Minuten täglich
- Freier Speicher < 20 % des Gesamtspeichers
- Lese-IOPS > 80 % der bereitgestellten IOPS konsistent
- P99-Abfragelatenz > [X]ms für Top-10-Abfragen

Nächste Instanzstufe: [aktuell] → [empfohlen nächste] nach [X Monaten]
Kostendifferenz: $X/Monat zusätzlich

## Read-Replica-Überlegung
Read Replica hinzufügen wenn:
- Lese/Schreib-Verhältnis > 5:1
- Reporting-/Analyseabfragen beeinträchtigen die Primary-Performance
- Primary-CPU wird durch Lesevorgänge, nicht Schreibvorgänge belastet

Read-Replica-Kosten: $X/Monat (gleicher Instanztyp wie Primary)
Verbindungsrouting: [beschreiben, wie Lese- vs. Schreibvorgänge im Anwendungscode geroutet werden]
```

### Launch-Kapazitätsplan

```
Erstelle einen Launch-Kapazitätsplan für [PRODUKT / FEATURE / EREIGNIS].

Launch-Details:
- Was gelauncht wird: [beschreiben]
- Erwartetes Launch-Datum: [DATUM]
- Traffic-Szenario (eines wählen oder alle drei modellieren):
  - Konservativ: [X % Anstieg des aktuellen Traffics]
  - Basisfall: [X Nutzer in den ersten 48 Stunden]
  - Optimistisch: [X Nutzer, vorgestellt in [Medium / App Store / Product Hunt]]

Aktuelle Infrastruktur:
- Rechenkapazität: [beschreiben]
- Datenbank: [beschreiben]
- CDN / Cache: [beschreiben]
- Aktuelle Kapazität: [was ist der maximale RPS, den das System heute verarbeiten kann?]

Ausgabe des Launch-Plans:

## Pre-Launch-Checkliste (Infrastruktur)
- [ ] Lasttest bei [2x / 5x / 10x] erwartetem Peak-Traffic — Ergebnisse dokumentieren
- [ ] Bestätigen, dass Auto-Scaling konfiguriert und getestet ist
- [ ] Cache-Warm-up-Plan für statische Assets und häufige Abfragen
- [ ] Datenbankverbindungspool auf Peak-Verbindungen ausgelegt
- [ ] CDN-Cache-Regeln für neue Seiten/Assets geprüft
- [ ] Monitoring-Dashboards für den Launch-Tag eingerichtet
- [ ] On-Call-Ingenieur identifiziert und über Runbook informiert
- [ ] Rollback-Plan dokumentiert und getestet

## Traffic-Szenarien und Infrastrukturbedarf
| Szenario | Peak-RPS | Benötigte Pods | DB-Verbindungen | Erforderliche Maßnahme |
|---|---|---|---|---|
| Konservativ | X | N | X | [keine Änderung / kleine Anpassung] |
| Basisfall | X | N | X | [auf N Pods voraus-skalieren] |
| Optimistisch | X | N | X | [temporäres vertikales Scaling + Vorwärmen] |

## Launch-Tag-Verfahren
T-24h: Rechenkapazität auf [N] Pods voraus-skalieren (nicht auf Autoscaler warten)
T-4h: CDN-Cache für alle neuen Seiten vorwärmen
T-0: In #engineering posten und On-Call mit Launch-Dashboard-Link taggen
T+1h: Fehlerquoten, Latenz, DB-Verbindungen prüfen — mit Baseline vergleichen
T+24h: Tatsächlichen Traffic vs. Prognose überprüfen, bei Überprovisionierung verkleinern

## Kosten für den Launch-Zeitraum
Zusatzkosten für [7 Tage voraus-skalierte Infrastruktur]: $X
Rückkehr zur normalen Provisionierung nach: [DATUM], wenn Traffic unter [X] RPS stabilisiert
```

### Cloud-Kostenoptimierungsanalyse

```
Analysiere meine Cloud-Kosten und finde Einsparmöglichkeiten.

Aktuelle Monatsrechnung: [$X gesamt]
Aufschlüsselung:
- Rechenkapazität (EC2 / GKE-Nodes / Cloud Run): $X
- Datenbank (RDS / Cloud SQL / Firestore): $X
- Speicher (S3 / GCS / Azure Blob): $X
- Datentransfer / CDN: $X
- Sonstiges (Lambda, SQS, Monitoring etc.): $X

Infrastruktur-Inventar:
- Instanzen/Nodes: [mit Größen und durchschnittlicher Auslastung auflisten]
- Datenbanken: [mit Größen und durchschnittlicher Auslastung auflisten]
- Speicher-Buckets: [insgesamt gespeichert, Zugriffsmuster]
- Bereits vorhandene Reserved Instances oder Savings Plans: [auflisten]

Nach Kategorie analysieren:

COMPUTE-RIGHTSIZING:
- Instanzen mit durchschnittlicher CPU < 20 %: Kandidaten für Downsizing
- Arbeitsspeicher-Auslastung: überprovisionierte Instanzen
- Geschätzte Einsparungen durch Rightsizing: $X/Monat

RESERVED INSTANCES / SAVINGS PLANS:
- Break-Even-Analyse: wenn wir [N]x [Instanztyp] für 1 Jahr binden, sparen wir $X vs. On-Demand
- Empfehlung: welche Instanzen jetzt reservieren vs. On-Demand behalten

SPEICHERKOSTENSENKUNG:
- S3 Intelligent Tiering für selten zugegriffene Daten
- Log-Aufbewahrungsrichtlinie: von [N] auf [M] Tage reduzieren → $X/Monat sparen
- Verwaiste EBS-Volumes oder Snapshots identifizieren: [häufige Verschwendungsquelle]

DATENBANKOPTIMIERUNG:
- Multi-AZ vs. Single-AZ für Dev/Staging: $X/Monat sparen
- Aurora Serverless für variable Workloads: Break-Even bei [X Stunden/Tag Auslastung]
- Read Replicas, die entfernt oder verkleinert werden können

Ausgabe: nach monatlichem Dollareffekt geordnete Liste von Einsparmöglichkeiten mit Implementierungsaufwand (niedrig / mittel / hoch).
```

## Beispiel

**Nutzer:** Wir planen, ein Tool als Open Source zu veröffentlichen und erwarten, dass es nächsten Monat auf Product Hunt vorgestellt wird. Aktuell haben wir 2 t3.medium EC2-Instanzen hinter einem ALB, die 500 RPS bei 45 % CPU verarbeiten. Wir erwarten einen 5–10-fachen Traffic-Anstieg am Launch-Tag. Monatsrechnung beträgt 220 $.

**Ausgabe (Auszug):**

```markdown
# Kapazitätsplan: Product Hunt Launch

## Aktuelle Baseline
2x t3.medium (2 vCPU, 4 GB RAM) — 500 RPS bei 45 % CPU.
Geschätzte Maximalkapazität: ~1.100 RPS vor CPU-Sättigung.

## Traffic-Szenarien
| Szenario | Peak-RPS | Benötigte Instanzen | Headroom |
|---|---|---|---|
| Konservativ (5x) | 2.500 | 5x t3.medium | 20 % |
| Basisfall (7x) | 3.500 | 7x t3.medium | 10 % |
| Optimistisch (10x+) | 5.000+ | 10x t3.medium oder 5x t3.large | 15 % |

## Pre-Launch-Maßnahmen (nach Priorität)

**Jetzt (heute):**
- EC2 Auto Scaling aktivieren mit min=2, max=12, scale-out bei CPU>60 % für 3 Minuten
- Scale-in-Cooldown auf 15 Minuten setzen (verhindert Thrashing nach dem Spike)
- ALB-Healthcheck korrekt konfigurieren und sicherstellen, dass er < 2s antwortet

**T-48h vor Launch:**
- Manuell auf 6 Instanzen voraus-skalieren (nicht auf Autoscaler während des Spikes verlassen — er hat 3–5 Minuten Verzögerung)
- Lasttest auf 3.500 RPS mit k6 oder Locust durchführen — bestätigen, dass Latenz unter 200ms bleibt

**T-4h:**
- CloudFront-Cache für alle statischen Assets der neuen Seiten vorwärmen
- Falls datenbankgestützte Inhalte vorhanden: Cache-Control-Header prüfen

**Kosten am Launch-Tag:**
7 Tage mit 6x t3.medium voraus-skaliert: ~90 $ zusätzlich
Bei 10x und Skalierung auf 10 Instanzen: ~150 $ zusätzlich für die Woche
Empfehlung: voraus-skalieren, beobachten, nach 48–72h nach Normalisierung des Traffics verkleinern.

**Was am Launch-Tag beobachtet werden sollte:**
- ALB RequestCount (nicht nur RPS in der App — ALB ist der vorlaufende Indikator)
- Target Group Healthy Host Count (sollte während des gesamten Zeitraums bei N voraus-skaliert bleiben)
- DB-Verbindungen — t3.medium kann ~50 Verbindungen je Instanz verarbeiten; bei 10 Instanzen sind das 500 Verbindungen
- Bei Verwendung von RDS: FreeableMemory- und DatabaseConnections-Metriken prüfen
```

---
