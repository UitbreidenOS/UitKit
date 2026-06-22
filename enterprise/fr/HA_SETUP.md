# Haute Disponibilité & Récupération d'Urgence

Les déploiements d'entreprise de Claudient nécessitent une architecture tolérante aux pannes avec équilibrage de charge actif-actif, disjoncteurs, et stratégies de dégradation progressive. Ce guide couvre les topologies de déploiement, les vérifications de santé, les procédures de basculement et l'automatisation de la récupération.

## Architectures de Déploiement

### Architecture 1 : Actif-Actif (Recommandée)

Plusieurs instances Claudient servent le trafic simultanément sur les zones de disponibilité.

```
                             ┌─────────────────────┐
                             │   Moniteur de Santé │
                             │ (Prometheus + K8s)  │
                             └──────────┬──────────┘
                                        │
                      ┌─────────────────┼─────────────────┐
                      │                 │                 │
                ┌─────▼──────┐   ┌─────▼──────┐   ┌─────▼──────┐
                │ Instance 1  │   │ Instance 2  │   │ Instance 3  │
                │ (us-est)    │   │ (us-ouest)  │   │ (eu-ouest)  │
                └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
                      │                │                │
                      └────────────────┼────────────────┘
                                       │
                         ┌─────────────▼──────────────┐
                         │  Équilibreur L7            │
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
    │(état)    │                  │(baux)   │                    │(cache)  │
    └──────────┘                  └─────────┘                    └─────────┘
```

**Avantages :**
- Pas de point de défaillance unique
- Distribution des requêtes entre zones
- Mises à jour sans interruption (redémarrage continu)
- Basculement automatique via vérifications de santé

**Exigences :**
- Instances sans état (pas de stockage de session local)
- Cache distribué (Redis/Memcached)
- Backend de configuration partagé (Consul/etcd)
- Équilibreur de charge L7 avec support des vérifications de santé

### Architecture 2 : Actif-Passif (pour on-prem/air-gapped)

Une instance primaire, une ou plusieurs répliques de secours.

```
┌──────────────────┐                    ┌──────────────────┐
│   Nœud Primaire  │                    │  Nœud de Secours │
│  (Actif)         │  Réplication       │  (Passif)        │
│  ┌────────────┐  │  ◄─────────►       │  ┌────────────┐  │
│  │ Database   │  │                    │  │ Database   │  │
│  │ (MySQL)    │  │                    │  │ (MySQL)    │  │
│  └────────────┘  │                    │  └────────────┘  │
└────────┬─────────┘                    └──────────────────┘
         │
    Trafic Client
         │
         ▼
   VIP (IP Virtuelle)
   10.0.0.100

[Pulsation via : keepalived/corosync]
[Si Primaire échoue → VIP se déplace vers Secours 1]
```

**Avantages :**
- Modèle opérationnel plus simple
- Surcharge de ressources réduite
- Débogage plus facile (primaire unique)

**Compromis :**
- Brève fenêtre de basculement (10-30 secondes)
- Disponibilité inférieure (99,5 % contre 99,99 %)

## Stratégie d'Équilibrage de Charge

### Configuration des Vérifications de Santé

Les vérifications de santé doivent être **conscientes de l'application**, pas seulement des sondes TCP.

#### Kubernetes (recommandé)

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

#### HAProxy (on-prem)

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
  
  # Point de terminaison de vérification de santé
  option httpchk GET /health/ready HTTP/1.1\r\nHost:\ claudient.company.com
  
  server instance1 10.0.1.10:8080 check inter 5s fall 2 rise 2
  server instance2 10.0.1.11:8080 check inter 5s fall 2 rise 2
  server instance3 10.0.1.12:8080 check inter 5s fall 2 rise 2
  
  # Comportement de vidage pour arrêt gracieux
  timeout server 30s
  option tcp-smart-accept
  option tcp-smart-connect
```

### Points de Terminaison de Vérification de Santé

Les services doivent exposer ces points de terminaison :

```
GET /health/live
  Réponse : 200 OK, JSON : {"status": "alive", "timestamp": "2026-06-22T10:30:00Z"}
  Objet : Vérification au niveau du processus (le service fonctionne-t-il ?)
  Délai d'attente : 3 secondes

GET /health/ready
  Réponse : 200 OK si prêt, 503 sinon
  JSON : {
    "status": "ready",
    "checks": {
      "database": "ok",
      "cache": "ok",
      "config_sync": "ok",
      "replication_lag": "2.5s"
    }
  }
  Objet : Vérification des dépendances (cette instance peut-elle accepter le trafic ?)
  Délai d'attente : 5 secondes
  Fréquence de vérification : 5-10 secondes
```

**Conditions de disponibilité :**
- Connexion à la base de données vivante + retard < 5s
- Cache (Redis) accessible
- Configuration synchronisée à partir de Consul/etcd
- Serveur gRPC lié et à l'écoute
- Jetons d'authentification renouvelés dans les 24h

## Modèle de Disjoncteur

Empêcher les défaillances en cascade quand les dépendances se dégradent.

### Configuration (exemple Go)

```go
import "github.com/grpc-ecosystem/go-grpc-middleware/retry"

// Disjoncteur pour les appels de base de données
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

// Disjoncteur pour les API externes
var apiCircuitBreaker = &circuitbreaker.CircuitBreaker{
  Name:        "external_api",
  MaxRequests: 10,
  Interval:    1 * time.Minute,
  Timeout:     30 * time.Second,
  ReadyToTrip: func(counts circuitbreaker.Counts) bool {
    return counts.ConsecutiveFailures >= 5
  },
}

// Utilisation dans le gestionnaire
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

### États du Disjoncteur

| État | Comportement | Transition |
|------|--------------|------------|
| **FERMÉ** | Les requêtes passent normalement | Taux d'erreur > 60 % → OUVERT |
| **OUVERT** | Les requêtes échouent immédiatement (fast-fail) | Délai d'attente écoulé → MI-OUVERT |
| **MI-OUVERT** | Requêtes limitées autorisées (test de récupération) | Succès → FERMÉ, Échec → OUVERT |

## Dégradation Progressive

Quand les services se dégradent, réduire les fonctionnalités au lieu d'échouer complètement.

### Étapes de Dégradation

```
Étape 1 : Cache Indisponible (Redis en panne)
├─ Utiliser le cache en mémoire au lieu de Redis
├─ Réduire le TTL du cache (5 min au lieu de 1 h)
├─ Journal : "WARN: Using fallback cache, Redis unhealthy"
├─ Servir toujours 100 % des requêtes

Étape 2 : Retard de la Base de Données Répliquée > 10s
├─ Router les requêtes de lecture vers le primaire uniquement
├─ Réduire la fréquence de vérification des drapeaux de fonctionnalité (1s à 10s)
├─ Journal : "WARN: High replication lag (12s), using primary for reads"
├─ Servir toujours 100 % des requêtes

Étape 3 : Base de Données Primaire Dégradée
├─ Activer le mode lecture seule (désactiver les écritures)
├─ Disjoncteur OUVERT pour les opérations d'écriture
├─ Retourner HTTP 503 avec "Service Temporarily Unavailable"
├─ Mettre en file d'attente les écritures pour rejeu ultérieur
├─ Servir les requêtes de lecture à partir du cache/réplique

Étape 4 : Perte Complète du Service
├─ Retourner HTTP 500 à toutes les requêtes
├─ Transférer le trafic vers le site de DR (si disponible)
├─ Alerter l'équipe d'intervention
```

### Exemple de Configuration

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

## Procédures de Récupération des Défaillances

### Récupération de la Base de Données (Primaire en Panne)

**1. Détection** (automatisée, ~30 secondes)
```
La vérification de santé primaire échoue 3 fois (5s × 3) → Dégradation déclenchée
```

**2. Basculement** (déclenchement manuel ou automatisé après 2 minutes)
```bash
# Option A : Automatique via Kubernetes StatefulSet
# K8s détecte l'échec du Pod, programme un nouveau Pod sur un nœud sain

# Option B : Promotion manuelle de la réplique
claudient-cli db promote-replica --replica=replica-us-west --force

# La réplique devient primaire, commence à accepter les écritures
# L'ancien primaire devient secours quand il récupère
```

**3. Vérification**
```bash
# Vérifier que le nouveau primaire est sain
claudient-cli db health --primary

# Surveiller la réplication à partir du nouveau primaire → secours
claudient-cli db replication-status

# Confirmer que les opérations d'écriture reprennent
curl -X GET http://claudient-api/metrics | grep claudient_writes_total
```

**4. Post-incident**
- Enquêter sur la cause première (vérifier les journaux d'il y a 10 minutes avant l'erreur)
- Si l'ancien primaire récupère, le reconstruire à partir de la sauvegarde du nouveau primaire
- Exécuter les vérifications de cohérence : `claudient-cli db verify-consistency`

### Récupération des Défaillances de Cache

**1. Détection**
```
Délai d'attente de connexion Redis (5 secondes) → Disjoncteur OUVERT
Toutes les lectures du cache retournent un manque de cache (servi à partir du fallback)
```

**2. Options de Récupération**

**Option A : Redémarrer le Service**
```bash
# Terminer le conteneur Redis problématique, K8s le redémarre
kubectl delete pod redis-0
kubectl wait --for=condition=Ready pod/redis-0 --timeout=60s

# Ou redémarrage manuel
systemctl restart redis-server
```

**Option B : Vider et Reconstruire**
```bash
# Si Redis est corrompu
redis-cli FLUSHALL

# Réchauffer le cache avec les données chaudes
claudient-cli cache warmup --profile=production
  ├─ Charge les drapeaux de fonctionnalité (50MB)
  ├─ Charge les données utilisateur communes (200MB)
  └─ Charge l'index de session (100MB)
  └─ ETA : 45 secondes
```

### Défaillance de Synchronisation de Configuration

**1. Détection**
```
La vérification de santé Consul/etcd échoue → Config obsolète (jusqu'à 5 min)
```

**2. Récupération**
```bash
# Forcer manuellement la synchronisation à partir de la source de vérité
claudient-cli config sync --force --source=git

# Ou redémarrer le observateur de configuration
systemctl restart claudient-config-sync

# Vérifier que toutes les instances ont repris la nouvelle configuration
claudient-cli config get-applied | jq '.version'
```

## Surveillance & Alertes

### Métriques Clés à Suivre

```
Métriques de Disponibilité :
  - claude_uptime_percent (cible : 99,95 %)
  - service_requests_total (par code de statut)
  - request_latency_p95_ms (cible : < 200ms)

Santé des Dépendances :
  - database_connection_pool_active
  - database_replication_lag_seconds (alerte si > 5s)
  - redis_connected_clients (alerte si = 0)
  - config_sync_lag_seconds (alerte si > 30s)

Indicateurs de Dégradation :
  - circuit_breaker_state (1=fermé, 2=ouvert, 3=mi-ouvert)
  - cache_fallback_hits_total (alerte si > 10 % du trafic)
  - write_queue_depth (alerte si > 1000)
  - read_only_mode_active (alerte immédiatement)

Taux d'Erreur :
  - db_query_errors_per_sec (alerte si > 1)
  - auth_failures_total (alerte si pic > 2x de base)
  - cascading_failures_detected (alerte immédiatement)
```

### Règles d'Alerte (Prometheus)

```yaml
groups:
  - name: claudient_ha
    rules:
      - alert: HighReplicationLag
        expr: db_replication_lag_seconds > 5
        for: 2m
        annotations:
          summary: "Retard de réplication de la base de données > 5s"
          action: "Vérifier la santé de la réplique, redémarrer si nécessaire"

      - alert: CircuitBreakerOpen
        expr: circuit_breaker_state{name!=""} == 2
        for: 30s
        annotations:
          summary: "Disjoncteur {{ $labels.name }} est OUVERT"
          action: "Vérifier la santé des dépendances, redémarrer le service si nécessaire"

      - alert: CacheUnavailable
        expr: redis_connected_clients == 0
        for: 10s
        annotations:
          summary: "Redis indisponible, utilisant le fallback mémoire"
          action: "Redémarrer immédiatement le conteneur Redis"

      - alert: InstanceUnhealthy
        expr: up{job="claudient"} == 0
        for: 30s
        annotations:
          summary: "L'instance {{ $labels.instance }} est EN PANNE"
          action: "K8s redémarrera automatiquement ; sinon, vérifier systemd/journaux"

      - alert: ReadOnlyModeActive
        expr: claudient_read_only_mode == 1
        for: 0s
        annotations:
          summary: "Claudient en mode LECTURE SEULE (écritures désactivées)"
          action: "Incident P1 - appeler immédiatement le commandant d'incident"
```

## Site de Récupération d'Urgence (DR)

Pour les déploiements critiques, maintenir un site DR chaud ou tiède.

### Architecture : Actif-Actif (Préféré)

```
Site de Production (us-est)   Site DR (us-ouest)
┌──────────────────────┐      ┌──────────────────────┐
│  Instance Claudient  │      │  Instance Claudient  │
│  + DB Primaire       │      │  + DB Réplique       │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
        Réplication (bidirectionnelle, 5ms)
           ◄────────────────────────────►
           │                             │
           └────────┬────────────────────┘
                    │
            Équilibreur de Charge Global
            (Route53 / Cloudflare)
                    │
              Requêtes Client
```

**Temps de Récupération** : ~10 secondes (juste basculement DNS)

### Architecture : Actif-Passif (Coût Inférieur)

```
Site de Production (us-est)   Site DR (us-ouest)
┌──────────────────────┐      ┌──────────────────────┐
│  Instance Claudient  │      │  Instance Claudient  │
│  + DB Primaire       │      │  Éteinte             │
└──────────┬───────────┘      └──────────────────────┘
           │
    Sauvegarde quotidienne vers S3
           │
    [RPO : 12 heures]
```

**Temps de Récupération** : 10-15 minutes (approvisionner et synchroniser à partir de la sauvegarde)

### Procédure de Basculement DR

#### Basculement Automatisé (si primaire complètement perdu)

```bash
#!/bin/bash
# Déclenché quand les vérifications de santé primaires échouent pendant 5 minutes

set -e

INCIDENT_ID=$(uuidgen)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "[$TIMESTAMP] Basculement DR commencé - ID d'Incident : $INCIDENT_ID"

# 1. Vérifier que le site DR est prêt
if ! curl -f https://dr.claudient.com/health/ready > /dev/null; then
  echo "ERREUR : Site DR pas sain, abandon du basculement"
  exit 1
fi

# 2. Promouvoir la base de données DR en primaire
echo "Promotion de la base de données DR en primaire..."
psql -U admin -h dr-db.internal -d claudient -c \
  "SELECT pg_promote();"

sleep 5

# 3. Vérifier que la base de données DR accepte les écritures
if ! psql -U admin -h dr-db.internal -d claudient -c "SHOW server_version;" > /dev/null; then
  echo "ERREUR : Base de données DR n'accepte pas les connexions, abandon"
  exit 1
fi

# 4. Mettre à jour DNS pour pointer vers le site DR (TTL 30s pour rollback rapide)
echo "Mise à jour DNS..."
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

# 5. Attendre la propagation DNS
sleep 10

# 6. Vérifier que le trafic flux vers DR
REQUESTS_DR=$(curl -s https://dr.claudient.com/metrics | grep claudient_requests_total | awk '{print $2}')
sleep 5
REQUESTS_DR_NEW=$(curl -s https://dr.claudient.com/metrics | grep claudient_requests_total | awk '{print $2}')

if [ "$REQUESTS_DR" -eq "$REQUESTS_DR_NEW" ]; then
  echo "ERREUR : Pas de trafic flux vers le site DR"
  exit 1
fi

# 7. Notifier le commandant d'incident
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -d '{
    "channel": "#incidents",
    "text": "BASCULEMENT COMPLET : Trafic maintenant sur le site DR (us-ouest). ID d'Incident : '$INCIDENT_ID'. Site de Production : HORS LIGNE. ETA de Récupération : TBD"
  }'

echo "[$TIMESTAMP] Basculement complet, le site DR est maintenant primaire"
exit 0
```

#### Basculement Manuel (pour maintenance programmée)

```bash
# 1. Entrer en mode maintenance sur le primaire (arrêter d'accepter les nouvelles requêtes)
claudient-cli maintenance enable --reason="Planned failover to DR"

# 2. Vider gracieusement les requêtes existantes (jusqu'à 30 secondes)
# L'équilibreur de charge arrête d'envoyer le nouveau trafic, attend les requêtes en vol
sleep 30

# 3. Vider toutes les écritures en attente
psql -U admin -h prod-db.internal -d claudient -c \
  "SELECT * FROM write_queue WHERE status='pending';" \
  | xargs -I {} psql -U admin -h dr-db.internal -c "INSERT INTO claudient..."

# 4. Prendre la sauvegarde finale de la base de données primaire
pg_dump -U admin -h prod-db.internal claudient | gzip > /backups/prod-final-$(date +%s).sql.gz

# 5. Promouvoir DR et basculer DNS (même que basculement automatisé ci-dessus)

# 6. Tester le site DR complètement opérationnel
claudient-cli health check --full

# 7. Désactiver le mode maintenance sur DR
claudient-cli maintenance disable
```

### Sauvegarde & Récupération

```bash
# Sauvegarde incrémentale quotidienne vers S3
0 3 * * * /usr/local/bin/claudient-backup.sh --type=incremental --dest=s3://claudient-backups/prod/

# Sauvegarde complète hebdomadaire
0 2 * * 0 /usr/local/bin/claudient-backup.sh --type=full --dest=s3://claudient-backups/prod/ --retain=30days

# Tester la restauration mensuellement (vérifier que les sauvegardes sont valides)
0 4 1 * * /usr/local/bin/claudient-backup.sh --test-restore --backup-date=7days-ago --dest=/tmp/restore-test/
```

## Tests & Validation

### Tests d'Ingénierie du Chaos

Exécutez ces tests mensuellement pour valider la configuration HA :

```bash
# Test 1 : Tuer la base de données primaire
kubectl delete pod claudient-db-0
# Attendu : Basculement automatique vers réplique dans les 30s, zéro perte de données

# Test 2 : Partition réseau (simuler une latence élevée)
tc qdisc add dev eth0 root netem delay 500ms
sleep 300
tc qdisc del dev eth0 root
# Attendu : Les disjoncteurs s'ouvrent, les requêtes se dégradent progressivement, récupération quand la latence baisse

# Test 3 : Défaillance en cascade (tuer cache + base de données primaire)
kubectl delete pod redis-0 claudient-db-0
# Attendu : Fallback vers cache mémoire, mode lecture seule, zéro défaillance en cascade

# Test 4 : Panne de synchronisation de configuration
kubectl delete pod consul-0 consul-1 consul-2
# Attendu : Continuer avec config obsolète jusqu'à 5 min, reprendre la synchronisation quand restaurée

# Test 5 : Épuisement du CPU
stress-ng --cpu 32 --timeout 5m &
# Attendu : L'équilibreur de charge supprime l'instance malsaine, les instances restantes gèrent la charge (avec p95 de latence élevée)
```

### Validation Post-Test

```bash
# 1. Vérifier l'absence de perte de données
claudient-cli db consistency-check --compare=backup

# 2. Vérifier que toutes les métriques sont enregistrées
curl -s http://localhost:9090/api/v1/query?query=up | jq '.data.result | length'
# Devrait montrer toutes les instances de retour en ligne

# 3. Examiner les journaux pour les défaillances en cascade
grep -E "ERROR|WARN|circuit.*open|cascading" /var/log/claudient/*.log | tail -20
```

## SLA & Cibles

| Métrique | Cible | Application |
|----------|-------|------------|
| **Disponibilité** | 99,95 % (22,3 min temps d'arrêt/mois) | Crédit automatique si manqué |
| **MTTR** (Temps Moyen de Récupération) | < 5 minutes | Appel d'intervention si > 10 min |
| **RTO** (Objectif de Temps de Récupération) | 10 secondes (actif-actif), 15 min (actif-passif) | Tests de chaos mensuels |
| **RPO** (Objectif de Point de Récupération) | < 30 secondes de perte de données | Valider les sauvegardes quotidiennes |
| **Retard de Réplication** | < 5 secondes (99e percentile) | Alerte si > 5s pendant > 2 min |

---

**Dernière mise à jour** : 2026-06-22  
**Fichiers connexes** : `COMPLIANCE.md`, `AIR_GAP.md`, `AUDIT_TRAIL.md`  
**Contacts de Maintenance** : ops-team@company.com, incident-commander@company.com
