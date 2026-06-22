# Hochverfügbarkeit & Disaster Recovery

Enterprise-Bereitstellungen von Claudient erfordern eine fehlertolerante Architektur mit aktiv-aktiver Lastverteilung, Circuit Breakern und Strategien zur schrittweisen Verschlechterung. Dieser Leitfaden behandelt Bereitstellungstopologien, Gesundheitsprüfungen, Failover-Verfahren und Wiederherstellungsautomatisierung.

## Bereitstellungsarchitekturen

### Architektur 1: Aktiv-Aktiv (Empfohlen)

Mehrere Claudient-Instanzen verarbeiten den Datenverkehr gleichzeitig über Verfügbarkeitszonen hinweg.

```
                             ┌─────────────────────┐
                             │  Gesundheitsmonitor │
                             │  (Prometheus + K8s) │
                             └──────────┬──────────┘
                                        │
                      ┌─────────────────┼─────────────────┐
                      │                 │                 │
                ┌─────▼──────┐   ┌─────▼──────┐   ┌─────▼──────┐
                │ Instanz 1   │   │ Instanz 2   │   │ Instanz 3   │
                │ (us-osten)  │   │ (us-westen) │   │ (eu-westen) │
                └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
                      │                │                │
                      └────────────────┼────────────────┘
                                       │
                         ┌─────────────▼──────────────┐
                         │  L7-Lastverteiler          │
                         │ (HAProxy / Nginx / ALB)    │
                         └────────────┬───────────────┘
                                      │
                         ┌────────────▼──────────────┐
                         │  Clients (API / WebUI)    │
                         └───────────────────────────┘
                                      │
        ┌─────────────────────────────┼──────────────────────────────┐
        │                             │                              │
    ┌───▼─────┐                  ┌───▼─────┐                    ┌───▼─────┐
    │ Consul   │                  │  etcd   │                    │  Redis  │
    │(Status)  │                  │(Leases) │                    │(Cache)  │
    └──────────┘                  └─────────┘                    └─────────┘
```

**Vorteile:**
- Kein Single Point of Failure
- Anfrageverteiling über Zonen
- Unterbrechungsfreie Updates (kontinuierlicher Neustart)
- Automatisches Failover über Gesundheitsprüfungen

**Anforderungen:**
- Zustandslose Instanzen (keine lokale Sitzungsspeicherung)
- Verteilter Cache (Redis/Memcached)
- Gemeinsames Konfigurationsbackend (Consul/etcd)
- L7-Lastverteiler mit Gesundheitsprüfungsunterstützung

### Architektur 2: Aktiv-Passiv (für On-Prem/Air-Gapped)

Eine primäre Instanz, eine oder mehrere Standby-Replikationen.

```
┌──────────────────┐                    ┌──────────────────┐
│   Primärer Knoten│                    │  Standby-Knoten 1│
│  (Aktiv)         │  Replikation       │  (Passiv)        │
│  ┌────────────┐  │  ◄─────────►       │  ┌────────────┐  │
│  │ Database   │  │                    │  │ Database   │  │
│  │ (MySQL)    │  │                    │  │ (MySQL)    │  │
│  └────────────┘  │                    │  └────────────┘  │
└────────┬─────────┘                    └──────────────────┘
         │
    Client-Verkehr
         │
         ▼
   VIP (Virtuelle IP)
   10.0.0.100

[Herzschlag über: keepalived/corosync]
[Wenn Primär ausfällt → VIP wechselt zu Standby 1]
```

**Vorteile:**
- Einfacheres Betriebsmodell
- Geringerer Ressourcenaufwand
- Leicheres Debugging (einzelner Primärer)

**Kompromisse:**
- Kurzes Failover-Fenster (10-30 Sekunden)
- Niedrigere Verfügbarkeit (99,5 % vs 99,99 %)

## Lastverteilungsstrategie

### Konfiguration der Gesundheitsprüfungen

Gesundheitsprüfungen müssen **anwendungsbewusst** sein, nicht nur TCP-Sondiertungen.

#### Kubernetes (empfohlen)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: claudient-lb
spec:
  type: LoadBalancer
  selector:
    app: claudient
  ports:
    - name: http
      port: 80
      targetPort: 8080
    - name: grpc
      port: 50051
      targetPort: 50051
---
apiVersion: v1
kind: Pod
metadata:
  name: claudient-instance-1
spec:
  containers:
  - name: claudient
    image: claudient:latest
    ports:
      - containerPort: 8080
      - containerPort: 50051
    livenessProbe:
      httpGet:
        path: /health/live
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 1
    env:
      - name: INSTANCE_ID
        valueFrom:
          fieldRef:
            fieldPath: metadata.name
      - name: CLAUDIENT_DB_REPLICA_LAG_MAX
        value: "5s"
```

#### HAProxy (On-Prem)

```
global
  log stdout local0
  daemon

defaults
  log     global
  mode    http
  timeout connect 5000
  timeout client  50000
  timeout server  50000

frontend claudient_lb
  bind *:80
  mode http
  default_backend claudient_cluster

backend claudient_cluster
  mode http
  balance roundrobin
  option httplog
  option forwardfor
  option http-server-close
  
  # Endpunkt der Gesundheitsprüfung
  option httpchk GET /health/ready HTTP/1.1\r\nHost:\ claudient.company.com
  
  server instance1 10.0.1.10:8080 check inter 5s fall 2 rise 2
  server instance2 10.0.1.11:8080 check inter 5s fall 2 rise 2
  server instance3 10.0.1.12:8080 check inter 5s fall 2 rise 2
  
  # Ablaufverhalten für kontrollierten Shutdown
  timeout server 30s
  option tcp-smart-accept
  option tcp-smart-connect
```

### Endpunkte der Gesundheitsprüfung

Services müssen diese Endpunkte verfügbar machen:

```
GET /health/live
  Antwort: 200 OK, JSON: {"status": "alive", "timestamp": "2026-06-22T10:30:00Z"}
  Zweck: Prüfung auf Prozessebene (läuft der Service?)
  Timeout: 3 Sekunden

GET /health/ready
  Antwort: 200 OK wenn bereit, 503 sonst
  JSON: {
    "status": "ready",
    "checks": {
      "database": "ok",
      "cache": "ok",
      "config_sync": "ok",
      "replication_lag": "2.5s"
    }
  }
  Zweck: Abhängigkeitsprüfung (kann diese Instanz Verkehr verarbeiten?)
  Timeout: 5 Sekunden
  Häufigkeit: 5-10 Sekunden
```

**Bereiche Bedingungen:**
- Datenbankverbindung aktiv + Verzögerung < 5s
- Cache (Redis) erreichbar
- Konfiguration von Consul/etcd synchronisiert
- gRPC-Server gebunden und abhörbereit
- Auth-Token innerhalb von 24h erneuert

## Circuit-Breaker-Muster

Verhindern Sie kaskadierende Ausfälle, wenn Abhängigkeiten verschlechtert werden.

### Konfiguration (Go-Beispiel)

```go
import "github.com/grpc-ecosystem/go-grpc-middleware/retry"

// Circuit Breaker für Datenbankaufrufe
var dbCircuitBreaker = &circuitbreaker.CircuitBreaker{
  Name:        "database",
  MaxRequests: 5,
  Interval:    30 * time.Second,
  Timeout:     10 * time.Second,
  ReadyToTrip: func(counts circuitbreaker.Counts) bool {
    failureRatio := float64(counts.TotalFailures) / float64(counts.Requests)
    return counts.Requests >= 3 && failureRatio >= 0.6
  },
}

// Circuit Breaker für externe APIs
var apiCircuitBreaker = &circuitbreaker.CircuitBreaker{
  Name:        "external_api",
  MaxRequests: 10,
  Interval:    1 * time.Minute,
  Timeout:     30 * time.Second,
  ReadyToTrip: func(counts circuitbreaker.Counts) bool {
    return counts.ConsecutiveFailures >= 5
  },
}

// Verwendung im Handler
func FetchUserData(userID string) (*User, error) {
  result, err := dbCircuitBreaker.Execute(func() (interface{}, error) {
    return db.GetUser(userID)
  })
  if err != nil {
    if err == circuitbreaker.ErrOpenCircuit {
      return nil, errors.New("database unavailable, circuit open")
    }
    return nil, err
  }
  return result.(*User), nil
}
```

### Circuit-Breaker-Zustände

| Zustand | Verhalten | Übergang |
|---------|-----------|----------|
| **GESCHLOSSEN** | Anfragen passieren normal | Fehlerquote > 60 % → OFFEN |
| **OFFEN** | Anfragen schlagen sofort fehl (Fast-Fail) | Timeout abgelaufen → HALB-OFFEN |
| **HALB-OFFEN** | Begrenzte Anfragen erlaubt (Wiederherstellung testen) | Erfolg → GESCHLOSSEN, Fehler → OFFEN |

## Schrittweise Verschlechterung

Wenn Services verschlechtert werden, funktionieren Sie mit reduzierten Funktionen, nicht mit Fehler.

### Verschlechterungsstadien

```
Stufe 1: Cache Nicht Verfügbar (Redis ist aus)
├─ Verwenden Sie In-Memory Cache statt Redis
├─ TTL des Caches reduzieren (5 min statt 1h)
├─ Protokoll: "WARN: Using fallback cache, Redis unhealthy"
├─ 100% der Anfragen immer noch verarbeiten

Stufe 2: Replikationsverzögerung der Datenbank > 10s
├─ Leseanfragen nur zum Primär leiten
├─ Häufigkeit der Funktionsflags reduzieren (1s zu 10s)
├─ Protokoll: "WARN: High replication lag (12s), using primary for reads"
├─ 100% der Anfragen immer noch verarbeiten

Stufe 3: Primäre Datenbank verschlechtert
├─ Nur-Lesen-Modus aktivieren (Schreibvorgänge deaktivieren)
├─ Circuit Breaker OFFEN für Schreibvorgänge
├─ HTTP 503 mit "Service Temporarily Unavailable" zurückgeben
├─ Schreibvorgänge in lokale Warteschlange für späteren Replay einreihen
├─ Leseanfragen von Cache/Replika verarbeiten

Stufe 4: Vollständiger Dienstverlust
├─ HTTP 500 an alle Anfragen zurückgeben
├─ Verkehr zur DR-Site weiterleiten (wenn verfügbar)
├─ On-Call-Team benachrichtigen
```

### Konfigurationsbeispiel

```json
{
  "degradation": {
    "stages": [
      {
        "name": "cache_fallback",
        "trigger": "redis_unavailable",
        "actions": [
          "use_memory_cache",
          "reduce_ttl_multiplier: 0.1",
          "increase_log_level: debug"
        ]
      },
      {
        "name": "replica_lag",
        "trigger": "replication_lag_ms > 10000",
        "actions": [
          "read_from_primary_only",
          "disable_cache_writes",
          "alert_team"
        ]
      },
      {
        "name": "read_only_mode",
        "trigger": "primary_db_errors_per_sec > 5",
        "actions": [
          "set_mode: readonly",
          "circuit_breaker_writes: open",
          "queue_writes_local",
          "return_status_code: 503"
        ]
      },
      {
        "name": "failover_to_dr",
        "trigger": "primary_db_down",
        "actions": [
          "switch_dns_to_dr_site",
          "alert_incident_commander",
          "page_on_call_engineer"
        ]
      }
    ]
  }
}
```

## Fehlerwiederherstellungsverfahren

### Datenbankwiederherstellung (Primär ist aus)

**1. Erkennung** (automatisiert, ~30 Sekunden)
```
Primäre Gesundheitsprüfung schlägt 3x fehl (5s × 3) → Verschlechterung ausgelöst
```

**2. Failover** (manuell ausgelöst oder automatisiert nach 2 Minuten)
```bash
# Option A: Automatisch über Kubernetes StatefulSet
# K8s erkennt Pod-Fehler, plant neuen Pod auf gesundem Knoten

# Option B: Manuelle Heraufstufung der Replik
claudient-cli db promote-replica --replica=replica-us-west --force

# Replika wird primär, beginnt Schreibvorgänge zu akzeptieren
# Alter Primär wird Standby wenn er wiederhergestellt wird
```

**3. Überprüfung**
```bash
# Überprüfen Sie, dass der neue Primär gesund ist
claudient-cli db health --primary

# Replikation vom neuen Primär → Standby überwachen
claudient-cli db replication-status

# Bestätigen Sie, dass Schreibvorgänge fortgesetzt werden
curl -X GET http://claudient-api/metrics | grep claudient_writes_total
```

**4. Nach dem Vorfall**
- Root Cause untersuchen (Logs von 10 Minuten vor Fehler prüfen)
- Wenn alter Primär wiederhergestellt wird, von neuem Primär-Backup neuerstellen
- Konsistenzprüfungen ausführen: `claudient-cli db verify-consistency`

### Cache-Fehlerwiederherstellung

**1. Erkennung**
```
Redis-Verbindungs-Timeout (5 Sekunden) → Circuit Breaker OFFEN
Alle Cache-Lesevorgänge geben Cache-Miss zurück (von Fallback verarbeitet)
```

**2. Wiederherstellungsoptionen**

**Option A: Service Neustarten**
```bash
# Problematischen Redis-Container beenden, K8s startet neu
kubectl delete pod redis-0
kubectl wait --for=condition=Ready pod/redis-0 --timeout=60s

# Oder manueller Neustart
systemctl restart redis-server
```

**Option B: Leeren und Neu erstellen**
```bash
# Wenn Redis beschädigt ist
redis-cli FLUSHALL

# Cache mit Hot-Daten aufwärmen
claudient-cli cache warmup --profile=production
  ├─ Lädt Feature-Flags (50MB)
  ├─ Lädt häufige Benutzerdaten (200MB)
  └─ Lädt Sitzungsindex (100MB)
  └─ Geschätzte Zeit: 45 Sekunden
```

### Konfigurationssynchronisationsfehler

**1. Erkennung**
```
Consul/etcd Gesundheitsprüfung schlägt fehl → Config veraltet (bis zu 5 min)
```

**2. Wiederherstellung**
```bash
# Manuell erzwungene Synchronisierung von Wahrheitsquelle
claudient-cli config sync --force --source=git

# Oder starten Sie den Konfigurationsüberwacher neu
systemctl restart claudient-config-sync

# Überprüfen Sie, dass alle Instanzen neue Konfiguration abgeholt haben
claudient-cli config get-applied | jq '.version'
```

## Überwachung & Benachrichtigungen

### Zu verfolgende Schlüsselmetriken

```
Verfügbarkeitskennzahlen:
  - claude_uptime_percent (Ziel: 99,95 %)
  - service_requests_total (nach Statuscode)
  - request_latency_p95_ms (Ziel: < 200ms)

Abhängigkeitsgesundheit:
  - database_connection_pool_active
  - database_replication_lag_seconds (warnt bei > 5s)
  - redis_connected_clients (warnt bei = 0)
  - config_sync_lag_seconds (warnt bei > 30s)

Verschlechterungsindikatoren:
  - circuit_breaker_state (1=geschlossen, 2=offen, 3=halb-offen)
  - cache_fallback_hits_total (warnt bei > 10% des Verkehrs)
  - write_queue_depth (warnt bei > 1000)
  - read_only_mode_active (sofort warnen)

Fehlerquoten:
  - db_query_errors_per_sec (warnt bei > 1)
  - auth_failures_total (warnt bei Spike > 2x Baseline)
  - cascading_failures_detected (sofort warnen)
```

### Benachrichtigungsregeln (Prometheus)

```yaml
groups:
  - name: claudient_ha
    rules:
      - alert: HighReplicationLag
        expr: db_replication_lag_seconds > 5
        for: 2m
        annotations:
          summary: "Datenbankreplikationsverzögerung > 5s"
          action: "Replika-Gesundheit überprüfen, bei Bedarf neustarten"

      - alert: CircuitBreakerOpen
        expr: circuit_breaker_state{name!=""} == 2
        for: 30s
        annotations:
          summary: "Circuit Breaker {{ $labels.name }} ist OFFEN"
          action: "Abhängigkeitsgesundheit überprüfen, Service bei Bedarf neustarten"

      - alert: CacheUnavailable
        expr: redis_connected_clients == 0
        for: 10s
        annotations:
          summary: "Redis nicht verfügbar, verwenden Fallback-Speicher"
          action: "Redis-Container sofort neustarten"

      - alert: InstanceUnhealthy
        expr: up{job="claudient"} == 0
        for: 30s
        annotations:
          summary: "Instanz {{ $labels.instance }} ist AUS"
          action: "K8s startet automatisch neu; wenn nicht, systemd/Logs überprüfen"

      - alert: ReadOnlyModeActive
        expr: claudient_read_only_mode == 1
        for: 0s
        annotations:
          summary: "Claudient im NUR-LESEN-Modus (Schreibvorgänge deaktiviert)"
          action: "P1-Vorfall - Incident Commander sofort benachrichtigen"
```

## Disaster-Recovery (DR) Site

Für unternehmenskritische Bereitstellungen eine heiße oder warme DR-Site beibehalten.

### Architektur: Aktiv-Aktiv (Bevorzugt)

```
Produktionssite (us-ost)      DR-Site (us-west)
┌──────────────────────┐      ┌──────────────────────┐
│  Claudient-Instanz   │      │  Claudient-Instanz   │
│  + DB Primär         │      │  + DB Replika        │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
        Replikation (bidirektional, 5ms)
           ◄────────────────────────────►
           │                             │
           └────────┬────────────────────┘
                    │
            Globaler Lastverteiler
            (Route53 / Cloudflare)
                    │
              Client-Anfragen
```

**Wiederherstellungszeit**: ~10 Sekunden (nur DNS-Failover)

### Architektur: Aktiv-Passiv (Niedrigere Kosten)

```
Produktionssite (us-ost)      DR-Site (us-west)
┌──────────────────────┐      ┌──────────────────────┐
│  Claudient-Instanz   │      │  Claudient-Instanz   │
│  + DB Primär         │      │  Ausgeschaltet       │
└──────────┬───────────┘      └──────────────────────┘
           │
    Tägliche Sicherung zu S3
           │
    [12 Stunden RPO]
```

**Wiederherstellungszeit**: 10-15 Minuten (bereitstellen und von Sicherung synchronisieren)

### DR-Failover-Verfahren

#### Automatisiertes Failover (wenn Primär vollständig ausfällt)

```bash
#!/bin/bash
# Ausgelöst wenn primäre Gesundheitsprüfungen 5 Minuten lang ausfallen

set -e

INCIDENT_ID=$(uuidgen)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "[$TIMESTAMP] DR-Failover gestartet - Vorfall-ID: $INCIDENT_ID"

# 1. Überprüfen Sie, dass DR-Site bereit ist
if ! curl -f https://dr.claudient.com/health/ready > /dev/null; then
  echo "FEHLER: DR-Site nicht gesund, Failover abgebrochen"
  exit 1
fi

# 2. DR-Datenbank zu Primär hochfahren
echo "Hochfahren der DR-Datenbank zu Primär..."
psql -U admin -h dr-db.internal -d claudient -c \
  "SELECT pg_promote();"

sleep 5

# 3. Überprüfen Sie, dass DR-Datenbank Schreibvorgänge akzeptiert
if ! psql -U admin -h dr-db.internal -d claudient -c "SHOW server_version;" > /dev/null; then
  echo "FEHLER: DR-Datenbank akzeptiert keine Verbindungen, Failover abgebrochen"
  exit 1
fi

# 4. DNS aktualisieren, um auf DR-Site zu zeigen (TTL 30s für schnellen Rollback)
echo "DNS wird aktualisiert..."
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "claudient.company.com",
        "Type": "CNAME",
        "TTL": 30,
        "ResourceRecords": [{"Value": "dr.claudient.com"}]
      }
    }]
  }'

# 5. Auf DNS-Verbreitung warten
sleep 10

# 6. Überprüfen Sie, dass Verkehr zu DR fließt
REQUESTS_DR=$(curl -s https://dr.claudient.com/metrics | grep claudient_requests_total | awk '{print $2}')
sleep 5
REQUESTS_DR_NEW=$(curl -s https://dr.claudient.com/metrics | grep claudient_requests_total | awk '{print $2}')

if [ "$REQUESTS_DR" -eq "$REQUESTS_DR_NEW" ]; then
  echo "FEHLER: Kein Verkehr zur DR-Site"
  exit 1
fi

# 7. Incident Commander benachrichtigen
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -d '{
    "channel": "#incidents",
    "text": "FAILOVER ABGESCHLOSSEN: Verkehr jetzt auf DR-Site (us-west). Vorfall-ID: '$INCIDENT_ID'. Produktionssite: OFFLINE. Wiederherstellungs-ETA: TBD"
  }'

echo "[$TIMESTAMP] Failover abgeschlossen, DR-Site ist jetzt Primär"
exit 0
```

#### Manuelles Failover (für geplante Wartung)

```bash
# 1. Wartungsmodus auf Primär aktivieren (neue Anfragen nicht akzeptieren)
claudient-cli maintenance enable --reason="Planned failover to DR"

# 2. Bestehende Anfragen ordnungsgemäß ausgrenzen (bis zu 30 Sekunden)
# Lastverteiler stoppt neuen Verkehr, wartet auf aktive Anfragen
sleep 30

# 3. Alle ausstehenden Schreibvorgänge leeren
psql -U admin -h prod-db.internal -d claudient -c \
  "SELECT * FROM write_queue WHERE status='pending';" \
  | xargs -I {} psql -U admin -h dr-db.internal -c "INSERT INTO claudient..."

# 4. Letzte Sicherung der Primär-DB erstellen
pg_dump -U admin -h prod-db.internal claudient | gzip > /backups/prod-final-$(date +%s).sql.gz

# 5. DR hochfahren und DNS wechseln (gleich wie automatisiertes Failover oben)

# 6. DR-Site vollständig betriebsbereit testen
claudient-cli health check --full

# 7. Wartungsmodus auf DR deaktivieren
claudient-cli maintenance disable
```

### Sicherung & Wiederherstellung

```bash
# Tägliche inkrementelle Sicherung zu S3
0 3 * * * /usr/local/bin/claudient-backup.sh --type=incremental --dest=s3://claudient-backups/prod/

# Wöchentliche vollständige Sicherung
0 2 * * 0 /usr/local/bin/claudient-backup.sh --type=full --dest=s3://claudient-backups/prod/ --retain=30days

# Wiederherstellung monatlich testen (überprüfen Sie, dass Sicherungen gültig sind)
0 4 1 * * /usr/local/bin/claudient-backup.sh --test-restore --backup-date=7days-ago --dest=/tmp/restore-test/
```

## Tests & Validierung

### Chaos-Engineering-Tests

Führen Sie diese monatlich aus, um die HA-Einrichtung zu validieren:

```bash
# Test 1: Primäre Datenbank beenden
kubectl delete pod claudient-db-0
# Erwartet: Automatisches Failover zur Replika innerhalb von 30s, null Datenverlust

# Test 2: Netzwerkpartitionierung (hohe Latenz simulieren)
tc qdisc add dev eth0 root netem delay 500ms
sleep 300
tc qdisc del dev eth0 root
# Erwartet: Circuit Breaker öffnen, Anfragen verschlechtern sich schrittweise, Wiederherstellung bei Latenzverzögerung

# Test 3: Kaskadierfehler (Cache + Primär-DB beenden)
kubectl delete pod redis-0 claudient-db-0
# Erwartet: Fallback zu In-Memory-Cache, nur-Lesen-Modus, null kaskadierfehler

# Test 4: Konfigurationssynchronisationsausfall
kubectl delete pod consul-0 consul-1 consul-2
# Erwartet: Fortbestand mit veralteter Konfiguration bis zu 5 Min, Wiederaufnahme der Synchronisierung bei Wiederherstellung

# Test 5: CPU-Erschöpfung
stress-ng --cpu 32 --timeout 5m &
# Erwartet: Lastverteiler entfernt unhealthy-Instanz, verbleibende Instanzen verarbeiten Last (mit erhöhter Latenz p95)
```

### Validierung Nach Test

```bash
# 1. Überprüfen Sie auf Datenverlust
claudient-cli db consistency-check --compare=backup

# 2. Überprüfen Sie, dass alle Metriken aufgezeichnet werden
curl -s http://localhost:9090/api/v1/query?query=up | jq '.data.result | length'
# Sollte alle Instanzen wieder online zeigen

# 3. Überprüfen Sie Logs auf kaskadierfehler
grep -E "ERROR|WARN|circuit.*open|cascading" /var/log/claudient/*.log | tail -20
```

## SLA & Ziele

| Kennzahl | Ziel | Durchsetzung |
|----------|------|------------|
| **Verfügbarkeit** | 99,95 % (22,3 Min Ausfallzeit/Monat) | Automatische Gutschrift wenn verfehlt |
| **MTTR** (Mittlere Wiederherstellungszeit) | < 5 Minuten | Seite bei > 10min |
| **RTO** (Wiederherstellungsziel-Zeit) | 10 Sekunden (aktiv-aktiv), 15 Min (aktiv-passiv) | Chaos-Tests monatlich |
| **RPO** (Wiederherstellungsziel-Punkt) | < 30 Sekunden Datenverlust | Tägliche Sicherungen validieren |
| **Replikationsverzögerung** | < 5 Sekunden (99. Perzentil) | Warnt bei > 5s für > 2 Min |

---

**Zuletzt aktualisiert**: 2026-06-22  
**Verwandte Dateien**: `COMPLIANCE.md`, `AIR_GAP.md`, `AUDIT_TRAIL.md`  
**Wartungskontakte**: ops-team@company.com, incident-commander@company.com
