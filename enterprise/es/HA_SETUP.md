# Alta Disponibilidad y Recuperación ante Desastres

Los despliegues empresariales de Claudient requieren una arquitectura tolerante a fallos con equilibrio de carga activo-activo, disyuntores y estrategias de degradación gradual. Esta guía cubre topologías de despliegue, verificaciones de salud, procedimientos de conmutación y automatización de recuperación.

## Arquitecturas de Despliegue

### Arquitectura 1: Activo-Activo (Recomendada)

Varias instancias de Claudient sirven tráfico simultáneamente en zonas de disponibilidad.

```
                             ┌─────────────────────┐
                             │  Monitor de Salud   │
                             │ (Prometheus + K8s)  │
                             └──────────┬──────────┘
                                        │
                      ┌─────────────────┼─────────────────┐
                      │                 │                 │
                ┌─────▼──────┐   ┌─────▼──────┐   ┌─────▼──────┐
                │ Instancia 1 │   │ Instancia 2 │   │ Instancia 3 │
                │ (us-este)   │   │ (us-oeste)  │   │ (eu-oeste)  │
                └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
                      │                │                │
                      └────────────────┼────────────────┘
                                       │
                         ┌─────────────▼──────────────┐
                         │  Equilibrador L7           │
                         │ (HAProxy / Nginx / ALB)    │
                         └────────────┬───────────────┘
                                      │
                         ┌────────────▼──────────────┐
                         │  Clientes (API / WebUI)   │
                         └───────────────────────────┘
                                      │
        ┌─────────────────────────────┼──────────────────────────────┐
        │                             │                              │
    ┌───▼─────┐                  ┌───▼─────┐                    ┌───▼─────┐
    │ Consul   │                  │  etcd   │                    │  Redis  │
    │ (estado) │                  │(arrendos)                    │(caché)  │
    └──────────┘                  └─────────┘                    └─────────┘
```

**Ventajas:**
- Sin punto único de fallo
- Distribución de solicitudes entre zonas
- Actualizaciones sin interrupciones (reinicio continuo)
- Conmutación automática mediante comprobaciones de salud

**Requisitos:**
- Instancias sin estado (sin almacenamiento local de sesiones)
- Caché distribuida (Redis/Memcached)
- Backend de configuración compartida (Consul/etcd)
- Equilibrador L7 con soporte de verificación de salud

### Arquitectura 2: Activo-Pasivo (para On-Prem/Air-Gapped)

Una instancia primaria, una o más réplicas de espera.

```
┌──────────────────┐                    ┌──────────────────┐
│   Nodo Primario  │                    │  Nodo de Espera 1│
│  (Activo)        │  Replicación       │  (Pasivo)        │
│  ┌────────────┐  │  ◄─────────►       │  ┌────────────┐  │
│  │ Database   │  │                    │  │ Database   │  │
│  │ (MySQL)    │  │                    │  │ (MySQL)    │  │
│  └────────────┘  │                    │  └────────────┘  │
└────────┬─────────┘                    └──────────────────┘
         │
    Tráfico de Cliente
         │
         ▼
   VIP (IP Virtual)
   10.0.0.100

[Latido mediante: keepalived/corosync]
[Cuando Primario falla → VIP se mueve a Espera 1]
```

**Ventajas:**
- Modelo operativo más simple
- Menor sobrecarga de recursos
- Depuración más fácil (primario único)

**Compromisos:**
- Breve ventana de conmutación (10-30 segundos)
- Menor disponibilidad (99,5 % vs 99,99 %)

## Estrategia de Equilibrio de Carga

### Configuración de Verificaciones de Salud

Las verificaciones de salud deben ser **conscientes de la aplicación**, no solo sondeos TCP.

#### Kubernetes (recomendado)

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
  
  # Punto final de verificación de salud
  option httpchk GET /health/ready HTTP/1.1\r\nHost:\ claudient.company.com
  
  server instance1 10.0.1.10:8080 check inter 5s fall 2 rise 2
  server instance2 10.0.1.11:8080 check inter 5s fall 2 rise 2
  server instance3 10.0.1.12:8080 check inter 5s fall 2 rise 2
  
  # Comportamiento de drenaje para apagado controlado
  timeout server 30s
  option tcp-smart-accept
  option tcp-smart-connect
```

### Puntos Finales de Verificación de Salud

Los servicios deben exponer estos puntos finales:

```
GET /health/live
  Respuesta: 200 OK, JSON: {"status": "alive", "timestamp": "2026-06-22T10:30:00Z"}
  Propósito: Verificación a nivel de proceso (¿está ejecutándose el servicio?)
  Tiempo de espera: 3 segundos

GET /health/ready
  Respuesta: 200 OK si está listo, 503 si no
  JSON: {
    "status": "ready",
    "checks": {
      "database": "ok",
      "cache": "ok",
      "config_sync": "ok",
      "replication_lag": "2.5s"
    }
  }
  Propósito: Verificación de dependencias (¿puede esta instancia aceptar tráfico?)
  Tiempo de espera: 5 segundos
  Frecuencia de verificación: 5-10 segundos
```

**Condiciones Listas:**
- Conexión de base de datos viva + retraso < 5s
- Caché (Redis) alcanzable
- Configuración sincronizada desde Consul/etcd
- Servidor gRPC vinculado y escuchando
- Tokens de autenticación renovados en 24h

## Patrón de Disyuntor

Evite fallos en cascada cuando las dependencias se degradan.

### Configuración (ejemplo en Go)

```go
import "github.com/grpc-ecosystem/go-grpc-middleware/retry"

// Disyuntor para llamadas a base de datos
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

// Disyuntor para APIs externas
var apiCircuitBreaker = &circuitbreaker.CircuitBreaker{
  Name:        "external_api",
  MaxRequests: 10,
  Interval:    1 * time.Minute,
  Timeout:     30 * time.Second,
  ReadyToTrip: func(counts circuitbreaker.Counts) bool {
    return counts.ConsecutiveFailures >= 5
  },
}

// Uso en controlador
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

### Estados del Disyuntor

| Estado | Comportamiento | Transición |
|--------|----------------|-----------|
| **CERRADO** | Las solicitudes pasan normalmente | Tasa de fallo > 60 % → ABIERTO |
| **ABIERTO** | Las solicitudes fallan inmediatamente (Fast-Fail) | Tiempo de espera transcurrido → SEMI-ABIERTO |
| **SEMI-ABIERTO** | Solicitudes limitadas permitidas (prueba de recuperación) | Éxito → CERRADO, Fallo → ABIERTO |

## Degradación Gradual

Cuando los servicios se degradan, reduce la funcionalidad en lugar de fallar completamente.

### Etapas de Degradación

```
Etapa 1: Caché No Disponible (Redis inactivo)
├─ Usar caché en memoria en lugar de Redis
├─ Reducir TTL de caché (5 min en lugar de 1h)
├─ Registro: "WARN: Using fallback cache, Redis unhealthy"
├─ Seguir sirviendo 100% de solicitudes

Etapa 2: Retraso de Replicación de BD > 10s
├─ Enrutar consultas de lectura solo a primario
├─ Reducir frecuencia de verificación de indicadores (1s a 10s)
├─ Registro: "WARN: High replication lag (12s), using primary for reads"
├─ Seguir sirviendo 100% de solicitudes

Etapa 3: BD Primaria Degradada
├─ Habilitar modo solo lectura (desactivar escrituras)
├─ Disyuntor ABIERTO para operaciones de escritura
├─ Devolver HTTP 503 con "Service Temporarily Unavailable"
├─ Encolar escrituras localmente para posterior repetición
├─ Servir solicitudes de lectura desde caché/réplica

Etapa 4: Pérdida Completa de Servicio
├─ Devolver HTTP 500 a todas las solicitudes
├─ Desviar tráfico al sitio DR (si está disponible)
├─ Alertar al equipo de guardia
```

### Ejemplo de Configuración

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

## Procedimientos de Recuperación de Fallas

### Recuperación de Base de Datos (Primario Inactivo)

**1. Detección** (automatizada, ~30 segundos)
```
Verificación primaria de salud falla 3 veces (5s × 3) → Degradación disparada
```

**2. Conmutación** (activación manual o automatizada después de 2 minutos)
```bash
# Opción A: Automática vía Kubernetes StatefulSet
# K8s detecta fallo de Pod, programa nuevo Pod en nodo sano

# Opción B: Promoción manual de réplica
claudient-cli db promote-replica --replica=replica-us-west --force

# La réplica se convierte en primaria, comienza a aceptar escrituras
# El primario anterior se convierte en espera cuando se recupera
```

**3. Verificación**
```bash
# Verificar que el nuevo primario está sano
claudient-cli db health --primary

# Monitorear replicación del nuevo primario → esperas
claudient-cli db replication-status

# Confirmar que las operaciones de escritura se reanudan
curl -X GET http://claudient-api/metrics | grep claudient_writes_total
```

**4. Post-incidente**
- Investigar causa raíz (verificar logs de 10 minutos antes del fallo)
- Si primario anterior se recupera, reconstruir desde copia de seguridad de primario nuevo
- Ejecutar verificaciones de consistencia: `claudient-cli db verify-consistency`

### Recuperación de Falla de Caché

**1. Detección**
```
Tiempo de espera de conexión Redis (5 segundos) → Disyuntor ABIERTO
Todas las lecturas de caché devuelven falta de caché (servidas desde respaldo)
```

**2. Opciones de Recuperación**

**Opción A: Reiniciar Servicio**
```bash
# Terminar contenedor Redis problemático, K8s lo reinicia
kubectl delete pod redis-0
kubectl wait --for=condition=Ready pod/redis-0 --timeout=60s

# O reinicio manual
systemctl restart redis-server
```

**Opción B: Vaciar y Reconstruir**
```bash
# Si Redis está corrupto
redis-cli FLUSHALL

# Calentar caché con datos activos
claudient-cli cache warmup --profile=production
  ├─ Cargar indicadores de características (50MB)
  ├─ Cargar datos de usuario comunes (200MB)
  └─ Cargar índice de sesión (100MB)
  └─ ETA: 45 segundos
```

### Falla de Sincronización de Configuración

**1. Detección**
```
Verificación de salud Consul/etcd falla → Config obsoleta (hasta 5 min)
```

**2. Recuperación**
```bash
# Forzar manualmente la sincronización desde fuente de verdad
claudient-cli config sync --force --source=git

# O reiniciar observador de configuración
systemctl restart claudient-config-sync

# Verificar que todas las instancias hayan recogido nueva configuración
claudient-cli config get-applied | jq '.version'
```

## Monitoreo y Alertas

### Métricas Clave a Monitorear

```
Métricas de Disponibilidad:
  - claude_uptime_percent (objetivo: 99.95%)
  - service_requests_total (por código de estado)
  - request_latency_p95_ms (objetivo: < 200ms)

Salud de Dependencias:
  - database_connection_pool_active
  - database_replication_lag_seconds (alerta si > 5s)
  - redis_connected_clients (alerta si = 0)
  - config_sync_lag_seconds (alerta si > 30s)

Indicadores de Degradación:
  - circuit_breaker_state (1=cerrado, 2=abierto, 3=semi-abierto)
  - cache_fallback_hits_total (alerta si > 10% del tráfico)
  - write_queue_depth (alerta si > 1000)
  - read_only_mode_active (alerta inmediatamente)

Tasas de Error:
  - db_query_errors_per_sec (alerta si > 1)
  - auth_failures_total (alerta si pico > 2x línea base)
  - cascading_failures_detected (alerta inmediatamente)
```

### Reglas de Alertas (Prometheus)

```yaml
groups:
  - name: claudient_ha
    rules:
      - alert: HighReplicationLag
        expr: db_replication_lag_seconds > 5
        for: 2m
        annotations:
          summary: "Retraso de replicación BD > 5s"
          action: "Verificar salud de réplica, reiniciar si es necesario"

      - alert: CircuitBreakerOpen
        expr: circuit_breaker_state{name!=""} == 2
        for: 30s
        annotations:
          summary: "Disyuntor {{ $labels.name }} está ABIERTO"
          action: "Verificar salud de dependencias, reiniciar servicio si es necesario"

      - alert: CacheUnavailable
        expr: redis_connected_clients == 0
        for: 10s
        annotations:
          summary: "Redis no disponible, usando respaldo de memoria"
          action: "Reiniciar contenedor Redis inmediatamente"

      - alert: InstanceUnhealthy
        expr: up{job="claudient"} == 0
        for: 30s
        annotations:
          summary: "Instancia {{ $labels.instance }} está INACTIVA"
          action: "K8s reiniciará automáticamente; si no, verificar systemd/logs"

      - alert: ReadOnlyModeActive
        expr: claudient_read_only_mode == 1
        for: 0s
        annotations:
          summary: "Claudient en modo SOLO LECTURA (escrituras deshabilitadas)"
          action: "Incidente P1 - notificar comandante de incidente inmediatamente"
```

## Sitio de Recuperación ante Desastres (DR)

Para despliegues críticos de misión, mantener un sitio DR caliente o tibio.

### Arquitectura: Activo-Activo (Preferida)

```
Sitio de Producción (us-este)  Sitio DR (us-oeste)
┌──────────────────────┐      ┌──────────────────────┐
│  Instancia Claudient │      │  Instancia Claudient │
│  + BD Primaria       │      │  + BD Réplica        │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
        Replicación (bidireccional, 5ms)
           ◄────────────────────────────►
           │                             │
           └────────┬────────────────────┘
                    │
            Equilibrador de Carga Global
            (Route53 / Cloudflare)
                    │
              Solicitudes de Clientes
```

**Tiempo de Recuperación**: ~10 segundos (solo conmutación DNS)

### Arquitectura: Activo-Pasivo (Costo Menor)

```
Sitio de Producción (us-este)  Sitio DR (us-oeste)
┌──────────────────────┐      ┌──────────────────────┐
│  Instancia Claudient │      │  Instancia Claudient │
│  + BD Primaria       │      │  Apagada             │
└──────────┬───────────┘      └──────────────────────┘
           │
    Copia de seguridad diaria a S3
           │
    [RPO: 12 horas]
```

**Tiempo de Recuperación**: 10-15 minutos (proporcionar y sincronizar desde copia de seguridad)

### Procedimiento de Conmutación DR

#### Conmutación Automatizada (si primario completamente perdido)

```bash
#!/bin/bash
# Disparado cuando verificaciones primarias de salud fallan durante 5 minutos

set -e

INCIDENT_ID=$(uuidgen)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "[$TIMESTAMP] Conmutación DR iniciada - ID de Incidente: $INCIDENT_ID"

# 1. Verificar que sitio DR está listo
if ! curl -f https://dr.claudient.com/health/ready > /dev/null; then
  echo "ERROR: Sitio DR no sano, cancelando conmutación"
  exit 1
fi

# 2. Promover BD DR a primaria
echo "Promoviendo BD DR a primaria..."
psql -U admin -h dr-db.internal -d claudient -c \
  "SELECT pg_promote();"

sleep 5

# 3. Verificar que BD DR acepta escrituras
if ! psql -U admin -h dr-db.internal -d claudient -c "SHOW server_version;" > /dev/null; then
  echo "ERROR: BD DR no acepta conexiones, cancelando"
  exit 1
fi

# 4. Actualizar DNS para apuntar a sitio DR (TTL 30s para reversión rápida)
echo "Actualizando DNS..."
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

# 5. Esperar propagación DNS
sleep 10

# 6. Verificar que tráfico fluye a DR
REQUESTS_DR=$(curl -s https://dr.claudient.com/metrics | grep claudient_requests_total | awk '{print $2}')
sleep 5
REQUESTS_DR_NEW=$(curl -s https://dr.claudient.com/metrics | grep claudient_requests_total | awk '{print $2}')

if [ "$REQUESTS_DR" -eq "$REQUESTS_DR_NEW" ]; then
  echo "ERROR: Sin tráfico fluyendo a sitio DR"
  exit 1
fi

# 7. Notificar al comandante de incidente
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -d '{
    "channel": "#incidents",
    "text": "CONMUTACIÓN COMPLETADA: Tráfico ahora en sitio DR (us-oeste). ID de Incidente: '$INCIDENT_ID'. Sitio de Producción: FUERA DE LÍNEA. ETA de Recuperación: TBD"
  }'

echo "[$TIMESTAMP] Conmutación completada, sitio DR ahora es primario"
exit 0
```

#### Conmutación Manual (para mantenimiento programado)

```bash
# 1. Entrar modo mantenimiento en primario (dejar de aceptar solicitudes nuevas)
claudient-cli maintenance enable --reason="Planned failover to DR"

# 2. Drenar solicitudes existentes correctamente (hasta 30 segundos)
# Equilibrador de carga detiene tráfico nuevo, espera solicitudes en vuelo
sleep 30

# 3. Vaciar todas las escrituras pendientes
psql -U admin -h prod-db.internal -d claudient -c \
  "SELECT * FROM write_queue WHERE status='pending';" \
  | xargs -I {} psql -U admin -h dr-db.internal -c "INSERT INTO claudient..."

# 4. Tomar copia de seguridad final de BD primaria
pg_dump -U admin -h prod-db.internal claudient | gzip > /backups/prod-final-$(date +%s).sql.gz

# 5. Promover DR y conmutar DNS (igual a conmutación automatizada arriba)

# 6. Probar sitio DR completamente operativo
claudient-cli health check --full

# 7. Desactivar modo mantenimiento en DR
claudient-cli maintenance disable
```

### Copia de Seguridad y Recuperación

```bash
# Copia de seguridad incremental diaria a S3
0 3 * * * /usr/local/bin/claudient-backup.sh --type=incremental --dest=s3://claudient-backups/prod/

# Copia de seguridad completa semanal
0 2 * * 0 /usr/local/bin/claudient-backup.sh --type=full --dest=s3://claudient-backups/prod/ --retain=30days

# Probar restauración mensualmente (verificar que copias de seguridad son válidas)
0 4 1 * * /usr/local/bin/claudient-backup.sh --test-restore --backup-date=7days-ago --dest=/tmp/restore-test/
```

## Pruebas y Validación

### Pruebas de Ingeniería del Caos

Ejecute estas mensualmente para validar configuración HA:

```bash
# Prueba 1: Matar BD primaria
kubectl delete pod claudient-db-0
# Esperado: Conmutación automática a réplica dentro de 30s, sin pérdida de datos

# Prueba 2: Partición de red (simular latencia alta)
tc qdisc add dev eth0 root netem delay 500ms
sleep 300
tc qdisc del dev eth0 root
# Esperado: Disyuntores se abren, solicitudes se degradan gradualmente, recuperación cuando latencia baja

# Prueba 3: Falla en cascada (matar caché + BD primaria)
kubectl delete pod redis-0 claudient-db-0
# Esperado: Respaldo a caché en memoria, modo solo lectura, sin fallos en cascada

# Prueba 4: Falla de sincronización de configuración
kubectl delete pod consul-0 consul-1 consul-2
# Esperado: Continuar con configuración obsoleta hasta 5 min, reanudar sincronización cuando se restaura

# Prueba 5: Agotamiento de CPU
stress-ng --cpu 32 --timeout 5m &
# Esperado: Equilibrador elimina instancia no sana, instancias restantes manejan carga (con p95 latencia elevada)
```

### Validación Post-Prueba

```bash
# 1. Verificar ausencia de pérdida de datos
claudient-cli db consistency-check --compare=backup

# 2. Verificar que todas las métricas se grabaron
curl -s http://localhost:9090/api/v1/query?query=up | jq '.data.result | length'
# Debería mostrar todas instancias nuevamente en línea

# 3. Revisar logs para fallos en cascada
grep -E "ERROR|WARN|circuit.*open|cascading" /var/log/claudient/*.log | tail -20
```

## SLA y Objetivos

| Métrica | Objetivo | Aplicación |
|---------|----------|-----------|
| **Disponibilidad** | 99,95% (22,3 min inactividad/mes) | Crédito automático si se incumple |
| **MTTR** (Tiempo Promedio de Recuperación) | < 5 minutos | Página si > 10 min |
| **RTO** (Objetivo de Tiempo de Recuperación) | 10 segundos (activo-activo), 15 min (activo-pasivo) | Pruebas de caos mensualmente |
| **RPO** (Objetivo de Punto de Recuperación) | < 30 segundos pérdida de datos | Validar copias de seguridad diarias |
| **Retraso de Replicación** | < 5 segundos (percentil 99) | Alerta si > 5s por > 2 min |

---

**Última actualización**: 2026-06-22  
**Archivos relacionados**: `COMPLIANCE.md`, `AIR_GAP.md`, `AUDIT_TRAIL.md`  
**Contactos de Mantenimiento**: ops-team@company.com, incident-commander@company.com
