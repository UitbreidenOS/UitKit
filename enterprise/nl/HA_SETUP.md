# Hoge Beschikbaarheid & Disaster Recovery

Enterprise-implementaties van Claudient vereisen een fouttolerante architectuur met actief-actieve taakverdeling, circuitonderbrekkers en strategieën voor geleidelijke degradatie. Deze gids behandelt implementatietopologieën, gezondheidscontroles, failover-procedures en automatisering van herstel.

## Implementatiearchitecturen

### Architectuur 1: Actief-Actief (Aanbevolen)

Meerdere Claudient-exemplaren verwerken gelijktijdig verkeer in beschikbaarheidszones.

```
                             ┌─────────────────────┐
                             │   Gezondheidsmonitor│
                             │  (Prometheus + K8s) │
                             └──────────┬──────────┘
                                        │
                      ┌─────────────────┼─────────────────┐
                      │                 │                 │
                ┌─────▼──────┐   ┌─────▼──────┐   ┌─────▼──────┐
                │ Exemplaar 1 │   │ Exemplaar 2 │   │ Exemplaar 3 │
                │ (vs-oost)   │   │ (vs-west)   │   │ (eu-west)   │
                └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
                      │                │                │
                      └────────────────┼────────────────┘
                                       │
                         ┌─────────────▼──────────────┐
                         │  L7-Taakverdeler           │
                         │ (HAProxy / Nginx / ALB)    │
                         └────────────┬───────────────┘
                                      │
                         ┌────────────▼──────────────┐
                         │  Klanten (API / WebUI)    │
                         └───────────────────────────┘
                                      │
        ┌─────────────────────────────┼──────────────────────────────┐
        │                             │                              │
    ┌───▼─────┐                  ┌───▼─────┐                    ┌───▼─────┐
    │ Consul   │                  │  etcd   │                    │  Redis  │
    │ (status) │                  │ (leases)│                    │ (cache) │
    └──────────┘                  └─────────┘                    └─────────┘
```

**Voordelen:**
- Geen enkel storingspunt
- Verdeling van verzoeken over zones
- Updates zonder downtime (doorlopend opnieuw starten)
- Automatische failover via gezondheidscontroles

**Vereisten:**
- Statuloze exemplaren (geen lokale sessieopslag)
- Gedistribueerde cache (Redis/Memcached)
- Gedeelde configuratie-backend (Consul/etcd)
- L7-taakverdeler met ondersteuning voor gezondheidscontroles

### Architectuur 2: Actief-Passief (voor On-Prem/Air-Gapped)

Één primair exemplaar, een of meer standby-replica's.

```
┌──────────────────┐                    ┌──────────────────┐
│   Primair Knooppunt│                 │  Standby Knooppunt 1│
│  (Actief)         │  Replicatie       │  (Passief)        │
│  ┌────────────┐  │  ◄─────────►       │  ┌────────────┐  │
│  │ Database   │  │                    │  │ Database   │  │
│  │ (MySQL)    │  │                    │  │ (MySQL)    │  │
│  └────────────┘  │                    │  └────────────┘  │
└────────┬─────────┘                    └──────────────────┘
         │
    Clientverkeer
         │
         ▼
   VIP (Virtueel IP)
   10.0.0.100

[Hartslag via: keepalived/corosync]
[Als Primair uitvalt → VIP gaat naar Standby 1]
```

**Voordelen:**
- Eenvoudiger operationeel model
- Lagere resourcebelasting
- Gemakkelijker debuggen (enkel primair)

**Compromissen:**
- Korte failover-venster (10-30 seconden)
- Lagere beschikbaarheid (99,5% vs 99,99%)

## Taakverdeling Strategie

### Configuratie van Gezondheidscontroles

Gezondheidscontroles moeten **toepassingsbewust** zijn, niet alleen TCP-sondes.

#### Kubernetes (aanbevolen)

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
  
  # Eindpunt gezondheidscontrole
  option httpchk GET /health/ready HTTP/1.1\r\nHost:\ claudient.company.com
  
  server instance1 10.0.1.10:8080 check inter 5s fall 2 rise 2
  server instance2 10.0.1.11:8080 check inter 5s fall 2 rise 2
  server instance3 10.0.1.12:8080 check inter 5s fall 2 rise 2
  
  # Afvoergedrag voor gracieus afsluit
  timeout server 30s
  option tcp-smart-accept
  option tcp-smart-connect
```

### Eindpunten van Gezondheidscontrole

Services moeten deze eindpunten beschikbaar stellen:

```
GET /health/live
  Reactie: 200 OK, JSON: {"status": "alive", "timestamp": "2026-06-22T10:30:00Z"}
  Doel: Controle op procesniveau (draait de service?)
  Time-out: 3 seconden

GET /health/ready
  Reactie: 200 OK als klaar, 503 als niet
  JSON: {
    "status": "ready",
    "checks": {
      "database": "ok",
      "cache": "ok",
      "config_sync": "ok",
      "replication_lag": "2.5s"
    }
  }
  Doel: Afhankelijkheidscontrole (kan dit exemplaar verkeer verwerken?)
  Time-out: 5 seconden
  Controlefrequentie: 5-10 seconden
```

**Gereedheidsvoorwaarden:**
- Databaseverbinding actief + lag < 5s
- Cache (Redis) bereikbaar
- Configuratie gesynchroniseerd van Consul/etcd
- gRPC-server gebonden en luisterend
- Verificatietokens vernieuwd binnen 24h

## Circuitonderbreker Patroon

Voorkom cascaderende storingen wanneer afhankelijkheden verslechteren.

### Configuratie (Go-voorbeeld)

```go
import "github.com/grpc-ecosystem/go-grpc-middleware/retry"

// Circuitonderbreker voor databaseoproepen
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

// Circuitonderbreker voor externe API's
var apiCircuitBreaker = &circuitbreaker.CircuitBreaker{
  Name:        "external_api",
  MaxRequests: 10,
  Interval:    1 * time.Minute,
  Timeout:     30 * time.Second,
  ReadyToTrip: func(counts circuitbreaker.Counts) bool {
    return counts.ConsecutiveFailures >= 5
  },
}

// Gebruik in handler
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

### Statussen van Circuitonderbreker

| Status | Gedrag | Overgang |
|--------|--------|----------|
| **GESLOTEN** | Verzoeken gaan normaal door | Faalpercentage > 60% → OPEN |
| **OPEN** | Verzoeken falen onmiddellijk (Fast-Fail) | Time-out verstreken → HALF-OPEN |
| **HALF-OPEN** | Beperkte verzoeken toegestaan (herstetest) | Succes → GESLOTEN, Falen → OPEN |

## Geleidelijke Degradatie

Wanneer services verslechteren, verlaag de functionaliteit in plaats van volledig uitval.

### Degradatietrappen

```
Trap 1: Cache Niet Beschikbaar (Redis uit)
├─ Gebruik in-memory cache in plaats van Redis
├─ Verlaag cache TTL (5 min in plaats van 1h)
├─ Log: "WARN: Using fallback cache, Redis unhealthy"
├─ Nog steeds 100% van verzoeken verwerken

Trap 2: Replicatievertraging DB > 10s
├─ Stuur lezingen alleen naar primair
├─ Verlaag controlefrequentie functiemarkeringen (1s naar 10s)
├─ Log: "WARN: High replication lag (12s), using primary for reads"
├─ Nog steeds 100% van verzoeken verwerken

Trap 3: Primaire DB Verslechterd
├─ Alleen-lezen-modus inschakelen (schrijven uitschakelen)
├─ Circuitonderbreker OPEN voor schrijfoperaties
├─ HTTP 503 retourneren met "Service Temporarily Unavailable"
├─ Schrijfbewerkingen lokaal in wachtrij voor later opnieuw afspelen
├─ Leesbewerkingen van cache/replica verwerken

Trap 4: Volledige Serviceverlies
├─ HTTP 500 aan alle verzoeken retourneren
├─ Verkeer naar DR-site doorsturen (indien beschikbaar)
├─ On-call team waarschuwen
```

### Configuratievoorbeeld

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

## Herstelhandelingen voor Fouten

### Databaseherstel (Primair Uit)

**1. Detectie** (geautomatiseerd, ~30 seconden)
```
Primaire gezondheidscontrole mislukt 3 keer (5s × 3) → Degradatie geactiveerd
```

**2. Failover** (handmatig geactiveerd of geautomatiseerd na 2 minuten)
```bash
# Optie A: Automatisch via Kubernetes StatefulSet
# K8s detecteert Pod-fout, plant nieuwe Pod op gezonde node

# Optie B: Handmatige promotie replica
claudient-cli db promote-replica --replica=replica-us-west --force

# Replica wordt primair, begint schrijfbewerkingen te accepteren
# Oude primair wordt standby wanneer het herstelt
```

**3. Verificatie**
```bash
# Controleer dat nieuwe primair gezond is
claudient-cli db health --primary

# Monitor replicatie van nieuwe primair → standby's
claudient-cli db replication-status

# Bevestig dat schrijfbewerkingen hervatten
curl -X GET http://claudient-api/metrics | grep claudient_writes_total
```

**4. Na het incident**
- Onderzoek root cause (check logs van 10 minuten voor fout)
- Als oude primair herstelt, herbouw van nieuwe primaire backup
- Voer consistentiecontroles uit: `claudient-cli db verify-consistency`

### Cache-Foutstel Herstel

**1. Detectie**
```
Redis-verbinding time-out (5 seconden) → Circuitonderbreker OPEN
Alle cache-lezingen retourneren cache-miss (bediend van fallback)
```

**2. Herstelopties**

**Optie A: Service Opnieuw Starten**
```bash
# Problematische Redis-container beëindigen, K8s start opnieuw
kubectl delete pod redis-0
kubectl wait --for=condition=Ready pod/redis-0 --timeout=60s

# Of handmatig opnieuw starten
systemctl restart redis-server
```

**Optie B: Leegmaken en Herbouwen**
```bash
# Als Redis beschadigd
redis-cli FLUSHALL

# Cache opwarmen met hot data
claudient-cli cache warmup --profile=production
  ├─ Laadt functiemarkeringen (50MB)
  ├─ Laadt gemeenschappelijke gebruikersgegevens (200MB)
  └─ Laadt sessieindex (100MB)
  └─ ETA: 45 seconden
```

### Configuratie-Synchronisationfout

**1. Detectie**
```
Consul/etcd gezondheidscontrole mislukt → Config verouderd (tot 5 min)
```

**2. Herstel**
```bash
# Handmatig geforceerde synchronisatie van waarheidssbron
claudient-cli config sync --force --source=git

# Of start configwatcher opnieuw
systemctl restart claudient-config-sync

# Controleer dat alle exemplaren nieuwe config hebben opgehaald
claudient-cli config get-applied | jq '.version'
```

## Bewaking & Waarschuwingen

### Sleutelgegevens om te Volgen

```
Beschikbaarheidsgegevens:
  - claude_uptime_percent (doel: 99,95%)
  - service_requests_total (per statuscode)
  - request_latency_p95_ms (doel: < 200ms)

Afhankelijkheidsgezondheid:
  - database_connection_pool_active
  - database_replication_lag_seconds (waarschuwen als > 5s)
  - redis_connected_clients (waarschuwen als = 0)
  - config_sync_lag_seconds (waarschuwen als > 30s)

Degradatie-indicatoren:
  - circuit_breaker_state (1=gesloten, 2=open, 3=half-open)
  - cache_fallback_hits_total (waarschuwen als > 10% van verkeer)
  - write_queue_depth (waarschuwen als > 1000)
  - read_only_mode_active (onmiddellijk waarschuwen)

Faalpercentages:
  - db_query_errors_per_sec (waarschuwen als > 1)
  - auth_failures_total (waarschuwen als piek > 2x basislijn)
  - cascading_failures_detected (onmiddellijk waarschuwen)
```

### Waarschuwingsregels (Prometheus)

```yaml
groups:
  - name: claudient_ha
    rules:
      - alert: HighReplicationLag
        expr: db_replication_lag_seconds > 5
        for: 2m
        annotations:
          summary: "Databasereplicatievertraging > 5s"
          action: "Controleer replicagezondheid, start opnieuw indien nodig"

      - alert: CircuitBreakerOpen
        expr: circuit_breaker_state{name!=""} == 2
        for: 30s
        annotations:
          summary: "Circuitonderbreker {{ $labels.name }} is OPEN"
          action: "Controleer afhankelijkheidsgezondheid, start service opnieuw indien nodig"

      - alert: CacheUnavailable
        expr: redis_connected_clients == 0
        for: 10s
        annotations:
          summary: "Redis niet beschikbaar, gebruik geheugenfallback"
          action: "Start Redis-container onmiddellijk opnieuw"

      - alert: InstanceUnhealthy
        expr: up{job="claudient"} == 0
        for: 30s
        annotations:
          summary: "Exemplaar {{ $labels.instance }} is UIT"
          action: "K8s start automatisch opnieuw; controleer systemd/logs als niet"

      - alert: ReadOnlyModeActive
        expr: claudient_read_only_mode == 1
        for: 0s
        annotations:
          summary: "Claudient in ALLEEN-LEZEN-modus (schrijven uitgeschakeld)"
          action: "P1 incident - waarschuw incidentcommandant onmiddellijk"
```

## Disaster-Recovery (DR) Site

Voor bedrijfsondersteuning implementaties, behoud een warme of hete DR-site.

### Architectuur: Actief-Actief (Voorkeur)

```
Productiesite (vs-oost)       DR-site (vs-west)
┌──────────────────────┐      ┌──────────────────────┐
│  Claudient-exemplaar │      │  Claudient-exemplaar │
│  + DB Primair        │      │  + DB Replica        │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
        Replicatie (bidirectioneel, 5ms)
           ◄────────────────────────────►
           │                             │
           └────────┬────────────────────┘
                    │
            Globale Taakverdeler
            (Route53 / Cloudflare)
                    │
              Clientverzoeken
```

**Hersteltijd**: ~10 seconden (alleen DNS-failover)

### Architectuur: Actief-Passief (Lagere Kosten)

```
Productiesite (vs-oost)       DR-site (vs-west)
┌──────────────────────┐      ┌──────────────────────┐
│  Claudient-exemplaar │      │  Claudient-exemplaar │
│  + DB Primair        │      │  Uitgeschakeld       │
└──────────┬───────────┘      └──────────────────────┘
           │
    Dagelijkse backup naar S3
           │
    [12 uur RPO]
```

**Hersteltijd**: 10-15 minuten (inrichten en synchroniseren van backup)

### DR Failover Procedure

#### Geautomatiseerde Failover (als primair volledig verloren)

```bash
#!/bin/bash
# Geactiveerd wanneer primaire gezondheidscontroles 5 minuten lang mislukken

set -e

INCIDENT_ID=$(uuidgen)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "[$TIMESTAMP] DR-failover gestart - Incident-ID: $INCIDENT_ID"

# 1. Controleer dat DR-site klaar is
if ! curl -f https://dr.claudient.com/health/ready > /dev/null; then
  echo "FOUT: DR-site niet gezond, failover afgebroken"
  exit 1
fi

# 2. Verhef DR-database naar primair
echo "DR-database tot primair verheven..."
psql -U admin -h dr-db.internal -d claudient -c \
  "SELECT pg_promote();"

sleep 5

# 3. Controleer dat DR-database schrijfbewerkingen accepteert
if ! psql -U admin -h dr-db.internal -d claudient -c "SHOW server_version;" > /dev/null; then
  echo "FOUT: DR-database accepteert geen verbindingen, failover afgebroken"
  exit 1
fi

# 4. Update DNS naar DR-site (TTL 30s voor snelle rollback)
echo "DNS wordt bijgewerkt..."
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

# 5. Wacht op DNS-verspreiding
sleep 10

# 6. Controleer dat verkeer naar DR stroomt
REQUESTS_DR=$(curl -s https://dr.claudient.com/metrics | grep claudient_requests_total | awk '{print $2}')
sleep 5
REQUESTS_DR_NEW=$(curl -s https://dr.claudient.com/metrics | grep claudient_requests_total | awk '{print $2}')

if [ "$REQUESTS_DR" -eq "$REQUESTS_DR_NEW" ]; then
  echo "FOUT: Geen verkeer naar DR-site"
  exit 1
fi

# 7. Waarschuw incidentcommandant
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -d '{
    "channel": "#incidents",
    "text": "FAILOVER VOLTOOID: Verkeer nu op DR-site (vs-west). Incident-ID: '$INCIDENT_ID'. Productiesite: OFFLINE. Herstel ETA: TBD"
  }'

echo "[$TIMESTAMP] Failover voltooid, DR-site is nu primair"
exit 0
```

#### Handmatige Failover (voor gepland onderhoud)

```bash
# 1. Onderhoudsmodus op primair activeren (geen nieuwe verzoeken accepteren)
claudient-cli maintenance enable --reason="Planned failover to DR"

# 2. Bestaande verzoeken correct afvoeren (tot 30 seconden)
# Taakverdeler stopt nieuw verkeer, wacht op in-flight verzoeken
sleep 30

# 3. Alle hangende schrijfbewerkingen leegmaken
psql -U admin -h prod-db.internal -d claudient -c \
  "SELECT * FROM write_queue WHERE status='pending';" \
  | xargs -I {} psql -U admin -h dr-db.internal -c "INSERT INTO claudient..."

# 4. Neem uiteindelijke backup van primaire DB
pg_dump -U admin -h prod-db.internal claudient | gzip > /backups/prod-final-$(date +%s).sql.gz

# 5. Verhef DR en zet DNS over (hetzelfde als geautomatiseerde failover hierboven)

# 6. Test DR-site volledig operationeel
claudient-cli health check --full

# 7. Onderhoudsmodus op DR uitschakelen
claudient-cli maintenance disable
```

### Backup & Herstel

```bash
# Dagelijkse incrementele backup naar S3
0 3 * * * /usr/local/bin/claudient-backup.sh --type=incremental --dest=s3://claudient-backups/prod/

# Wekelijkse volledige backup
0 2 * * 0 /usr/local/bin/claudient-backup.sh --type=full --dest=s3://claudient-backups/prod/ --retain=30days

# Maandelijks herstel testen (controleer dat backups geldig zijn)
0 4 1 * * /usr/local/bin/claudient-backup.sh --test-restore --backup-date=7days-ago --dest=/tmp/restore-test/
```

## Testen & Validatie

### Chaos Engineering Tests

Voer deze maandelijks uit om HA-instellingen te valideren:

```bash
# Test 1: Primaire database beëindigen
kubectl delete pod claudient-db-0
# Verwacht: Automatische failover naar replica binnen 30s, nul gegevensverlies

# Test 2: Netwerkpartitie (gesimuleerde hoge latentie)
tc qdisc add dev eth0 root netem delay 500ms
sleep 300
tc qdisc del dev eth0 root
# Verwacht: Circuitonderbrekkers openen, verzoeken verslechteren geleidelijk, herstel wanneer latentie daalt

# Test 3: Cascadefout (cache + primaire DB beëindigen)
kubectl delete pod redis-0 claudient-db-0
# Verwacht: Fallback naar in-memory cache, alleen-lezen modus, nul cascadefouten

# Test 4: Configuratie-synchronisationfout
kubectl delete pod consul-0 consul-1 consul-2
# Verwacht: Doorgaan met verouderde config tot 5 min, synchronisatie hervatten wanneer hersteld

# Test 5: CPU-uitputting
stress-ng --cpu 32 --timeout 5m &
# Verwacht: Taakverdeler verwijdert ongezond exemplaar, resterende exemplaren verwerken belasting (met verhoogde p95-latentie)
```

### Post-Test Validatie

```bash
# 1. Controleer op gegevensverlies
claudient-cli db consistency-check --compare=backup

# 2. Controleer dat alle gegevens zijn vastgelegd
curl -s http://localhost:9090/api/v1/query?query=up | jq '.data.result | length'
# Moet alle exemplaren weer online tonen

# 3. Controleer logs op cascadefouten
grep -E "ERROR|WARN|circuit.*open|cascading" /var/log/claudient/*.log | tail -20
```

## SLA & Doelstellingen

| Gegevens | Doel | Afdwinging |
|----------|------|-----------|
| **Beschikbaarheid** | 99,95% (22,3 min downtime/maand) | Automatische creditering als gemist |
| **MTTR** (Gemiddelde Hersteltijd) | < 5 minuten | Waarschuw als > 10 min |
| **RTO** (Hersteltijddoelstelling) | 10 seconden (actief-actief), 15 min (actief-passief) | Maandelijkse chaosusten |
| **RPO** (Herstelpunt-doelstelling) | < 30 seconden gegevensverlies | Dagelijkse backups valideren |
| **Replicatievertraging** | < 5 seconden (99e percentiel) | Waarschuw als > 5s gedurende > 2 min |

---

**Laatst bijgewerkt**: 2026-06-22  
**Gerelateerde bestanden**: `COMPLIANCE.md`, `AIR_GAP.md`, `AUDIT_TRAIL.md`  
**Onderhoudscontacten**: ops-team@company.com, incident-commander@company.com
