# Plan de Recuperación ante Desastres Empresarial

## Propósito

Esta guía establece objetivos de recuperación, estrategias de copias de seguridad, procedimientos de restauración y protocolos de pruebas de resiliencia para minimizar el impacto empresarial de fallos del sistema, pérdida de datos o interrupciones de servicio.

---

## Objetivos de Recuperación

### RPO y RTO por Nivel de Servicio

| Nivel de Servicio | RTO (Tiempo de Recuperación) | RPO (Punto de Recuperación) | Prioridad |
|---|---|---|---|
| **Crítico** | ≤ 1 hora | ≤ 5 minutos | P0 |
| **Alto** | ≤ 4 horas | ≤ 15 minutos | P1 |
| **Medio** | ≤ 24 horas | ≤ 1 hora | P2 |
| **Bajo** | ≤ 72 horas | ≤ 6 horas | P3 |

**Servicios Críticos:**
- Sistemas de autenticación y autorización
- Capa de persistencia de datos (base de datos primaria)
- Streaming de eventos en tiempo real
- Puerta de enlace API orientada al cliente

**Prioridad Alta:**
- Pipeline de análisis
- Gestión de configuración
- Monitoreo y alertas
- Sistemas de documentación

---

## Estrategia de Copia de Seguridad

### 1. Copias de Seguridad Completas del Sistema

**Frecuencia:** Diaria (00:00 UTC)  
**Retención:** 30 días en sitio, 90 días fuera de sitio  
**Objetivo:** Todos los almacenes de datos persistentes

**Procedimiento:**
```bash
# Automatizado a través de orquestador de copias de seguridad
backup-system \
  --full \
  --encrypt \
  --verify-checksum \
  --replicate-to-cold-storage
```

**Verificación:**
- Sumas de verificación validadas inmediatamente después de copia de seguridad
- Prueba de restauración realizada en 10% de copias de seguridad mensualmente
- Alerta si alguna copia de seguridad > 30% del tamaño base

### 2. Copias de Seguridad Incrementales

**Frecuencia:** Cada 6 horas  
**Retención:** 7 días en sitio  
**Cadena:** Vinculada a la copia de seguridad completa más reciente

**Procedimiento:**
```bash
backup-system \
  --incremental \
  --delta-only \
  --since-last-full
```

### 3. Copias de Seguridad de Base de Datos

**PostgreSQL:**
- Archivado continuo de WAL (Write-Ahead Logs) a S3
- Copia de seguridad completa diaria + incremental por hora
- Recuperación point-in-time (PITR) disponible durante 30 días
- Monitoreo de retraso de replicación: alerta si > 10 segundos

**Redis/Cache:**
- Snapshots RDB cada hora
- AOF (Append-Only File) habilitado
- Replicado a instancia de respaldo en AZ separado

**Elasticsearch:**
- Repositorio de snapshot en S3
- Snapshots diarios con retención de 30 días
- Snapshots buscables para recuperación rápida

### 4. Copias de Seguridad de Configuración y Secretos

**Almacenamiento:** Bóveda cifrada (AWS Secrets Manager, HashiCorp Vault)  
**Frecuencia:** Sincronización en tiempo real + snapshots por hora  
**Acceso:** Protegido por MFA, registrado en auditoría  
**Rotación:** Secretos rotados automáticamente cada 90 días

---

## Procedimientos de Restauración

### Nivel 1: Restauración de Servicio Individual (RTO: 15 min)

**Desencadenante:** Verificaciones de estado del servicio fallan > 2 minutos  
**Manual:** `restore-service.sh`

```bash
#!/bin/bash
SERVICE=$1
BACKUP_TIME=${2:-latest}

# Paso 1: Detener el servicio que falla
systemctl stop $SERVICE

# Paso 2: Verificar disponibilidad de copia de seguridad
aws s3 ls s3://backups/$SERVICE/$BACKUP_TIME/ || exit 1

# Paso 3: Descargar y restaurar desde copia de seguridad
aws s3 sync s3://backups/$SERVICE/$BACKUP_TIME/ /var/data/$SERVICE/
chmod 750 /var/data/$SERVICE/*
chown service:service /var/data/$SERVICE -R

# Paso 4: Validar integridad de datos
restore-validate --service $SERVICE --data-path /var/data/$SERVICE/

# Paso 5: Iniciar servicio con verificaciones de estado
systemctl start $SERVICE
sleep 5
systemctl status $SERVICE || exit 1

# Paso 6: Notificar al equipo de guardia
alert-oncall --severity critical --message "$SERVICE restaurado desde $BACKUP_TIME"
```

**Lista de Verificación de Validación:**
- [ ] Servicio inicia correctamente
- [ ] El endpoint de verificación de estado responde (HTTP 200)
- [ ] Conectividad de base de datos confirmada
- [ ] Sin registros de error en los primeros 60 segundos

---

### Nivel 2: Restauración de Base de Datos (RTO: 30 min)

**Desencadenante:** Corrupción de datos, eliminación accidental, errores irrecuperables  
**Manual:** `restore-database.sh`

```bash
#!/bin/bash
DB_NAME=$1
RESTORE_POINT=${2:-latest}

# Paso 1: Adquirir bloqueo exclusivo (prevenir escrituras)
psql -h $DB_HOST -U postgres -c "ALTER DATABASE $DB_NAME SET default_transaction_isolation = 'serializable';"

# Paso 2: Identificar cronología de restauración
# Para PITR: restore-point = "2024-06-22 14:30:00"
# Para copia de seguridad: restore-point = "backup-full-20240622"

if [[ $RESTORE_POINT == backup-* ]]; then
    # Restauración de copia de seguridad completa
    pg_basebackup -h $DB_HOST -U backup_user -D /var/lib/postgresql/recovery -v -P
    echo "recovery_target_timeline = 'latest'" >> /var/lib/postgresql/recovery/recovery.conf
else
    # Recuperación point-in-time
    echo "recovery_target_time = '$RESTORE_POINT'" >> /var/lib/postgresql/recovery/recovery.conf
fi

# Paso 3: Realizar restauración
systemctl stop postgresql
rm -rf /var/lib/postgresql/main
mv /var/lib/postgresql/recovery /var/lib/postgresql/main
chown postgres:postgres /var/lib/postgresql/main -R

# Paso 4: Iniciar BD en modo de solo lectura
systemctl start postgresql
pg_isready -h localhost || exit 1

# Paso 5: Ejecutar verificaciones de integridad
psql -h localhost -U postgres -d $DB_NAME -c "ANALYZE;"
psql -h localhost -U postgres -d $DB_NAME -c "SELECT COUNT(*) FROM pg_stat_user_tables;" > /tmp/table_counts.txt

# Paso 6: Verificar contra snapshot
diff /tmp/table_counts.txt /backups/verify/table_counts_$RESTORE_POINT.txt || echo "ADVERTENCIA: Los recuentos de tablas difieren"

# Paso 7: Habilitar escrituras (promover)
psql -h localhost -U postgres -c "ALTER DATABASE $DB_NAME RESET default_transaction_isolation;"
systemctl restart postgresql

echo "Base de datos $DB_NAME restaurada a $RESTORE_POINT"
```

**Lista de Verificación de Validación:**
- [ ] BD se inicia limpiamente
- [ ] Sin corrupción detectada (escaneo pg_filedump)
- [ ] La replicación se pone al día dentro de 5 minutos
- [ ] Las pruebas de aplicación pasan contra BD restaurada
- [ ] La marca de tiempo de datos coincide con el punto de restauración esperado

---

### Nivel 3: Paro Multi-Servicio (RTO: 2 horas)

**Desencadenante:** Múltiples servicios críticos inactivos, fallo del centro de datos primario  
**Manual:** `regional-failover.sh`

```bash
#!/bin/bash
set -e

INCIDENT_ID=$(uuidgen)
DR_REGION=${1:-us-west-2}
RESTORE_TIME=${2:-$(date -u +'%Y-%m-%d %H:%M:%S' -d '15 minutes ago')}

echo "=== CONMUTACIÓN POR ERROR REGIONAL INICIADA ===" | tee /tmp/failover_$INCIDENT_ID.log
echo "ID de incidente: $INCIDENT_ID"
echo "Región objetivo: $DR_REGION"
echo "Punto de restauración: $RESTORE_TIME"

# Fase 1: Preparar infraestructura DR (10 min)
echo "Fase 1: Provisión de infraestructura DR..."
terraform apply -var="region=$DR_REGION" -var="incident_id=$INCIDENT_ID" -auto-approve

# Fase 2: Restaurar todas las bases de datos en paralelo (15 min)
echo "Fase 2: Restauración de bases de datos..."
for db in primary analytics events config; do
    (
        restore-database $db "$RESTORE_TIME"
        echo "✓ $db restaurada"
    ) &
done
wait

# Fase 3: Restaurar estado de aplicación (10 min)
echo "Fase 3: Restauración de estado de aplicación..."
aws s3 sync s3://backups/app-state/$RESTORE_TIME/ /var/app/state/

# Fase 4: Actualizar DNS a región DR (5 min)
echo "Fase 4: Actualización de registros DNS..."
update-dns \
  --zone-id $ZONE_ID \
  --records-from primary-region \
  --records-to $DR_REGION \
  --ttl 60

# Fase 5: Iniciar servicios y validar (10 min)
echo "Fase 5: Iniciando servicios..."
systemctl start claudient-app
sleep 30

# Fase 6: Ejecutar pruebas de humo
echo "Fase 6: Ejecutando pruebas de humo..."
./tests/smoke-tests.sh || exit 1

echo "=== CONMUTACIÓN POR ERROR REGIONAL COMPLETADA ===" | tee -a /tmp/failover_$INCIDENT_ID.log
echo "Tiempo de recuperación: $(elapsed_time)"
alert-oncall --severity critical --incident-id $INCIDENT_ID --message "Conmutación por error completada a $DR_REGION"
```

**Lista de Verificación de Validación:**
- [ ] DNS actualizado y propagado
- [ ] Todos los servicios saludables en región DR
- [ ] Pruebas de humo pasadas
- [ ] Sin pérdida de datos detectada
- [ ] Retraso de replicación < 1 minuto
- [ ] Notificaciones de cliente enviadas

---

## Ingeniería del Caos y Pruebas de Resiliencia

### Calendario de Pruebas

| Tipo de Prueba | Frecuencia | Duración | Alcance |
|---|---|---|---|
| **Prueba de Restauración de Copia de Seguridad** | Semanal (mié 14:00 UTC) | 30 min | Servicio individual |
| **Prueba PITR de Base de Datos** | Bimensual (2do y 4to lun) | 45 min | Copia de producción |
| **Simulacro de Conmutación Regional** | Trimestral | 2 horas | Sistema completo |
| **Chaos Monkey** | Diario (02:00-03:00 UTC) | 60 min | Nodos canary |
| **Prueba de Partición de Red** | Mensual | 30 min | Conectividad multi-AZ |

### 1. Prueba de Restauración de Copia de Seguridad

**Objetivo:** Validar procedimientos y automatización de restauración  
**Frecuencia:** Semanal miércoles 14:00 UTC  
**Duración:** 30 minutos

**Procedimiento de Prueba:**
```bash
#!/bin/bash
# Ejecutar en entorno sin producción

TEST_DATE=$(date +%Y%m%d)
SERVICE=${1:-api-gateway}
BACKUP_AGE=${2:-1d}  # Copia de seguridad 1 día antes

echo "Prueba de restauración para $SERVICE (edad de copia: $BACKUP_AGE)"

# 1. Listar copias de seguridad disponibles
BACKUPS=$(aws s3 ls s3://backups/$SERVICE/ --recursive | sort -r | head -5)
echo "Copias de seguridad disponibles:"
echo "$BACKUPS"

# 2. Seleccionar copia de seguridad (1 día antes)
BACKUP_TO_RESTORE=$(echo "$BACKUPS" | grep $(date -d "$BACKUP_AGE" +%Y%m%d) | awk '{print $NF}' | head -1)

if [ -z "$BACKUP_TO_RESTORE" ]; then
    echo "ERROR: No se encontró copia de seguridad con criterios"
    exit 1
fi

echo "Restaurando: $BACKUP_TO_RESTORE"

# 3. Restaurar a entorno de prueba
restore-service $SERVICE $BACKUP_TO_RESTORE --environment staging

# 4. Validar restauración
RESTORE_TIME=$(get-backup-timestamp $BACKUP_TO_RESTORE)
RECORD_COUNT=$(psql -h staging-db -U readonly -t -c "SELECT COUNT(*) FROM data_records WHERE created_at > '$RESTORE_TIME' - interval '1 hour';")

if [ $RECORD_COUNT -eq 0 ]; then
    echo "✓ Integridad de copia de seguridad validada"
else
    echo "✗ ADVERTENCIA: Registros inesperados encontrados post-restauración"
fi

# 5. Ejecutar pruebas de humo
./tests/smoke-tests.sh --environment staging || exit 1

# 6. Reportar resultados
RESULT="SUCCESS"
DURATION=$(date +%s) - $START_TIME
report-test-results \
  --test-id backup-restore-$TEST_DATE \
  --service $SERVICE \
  --result $RESULT \
  --duration $DURATION \
  --backup-age $BACKUP_AGE

echo "✓ Prueba completada: $RESULT"
```

**Criterios de Éxito:**
- Restauración completada dentro de 20 minutos
- Todos los datos presentes y sin corrupción
- Pruebas de humo pasan
- Sin desviación de datos entre copia de seguridad y prueba

---

## Monitoreo y Alertas

### Métricas Clave

```yaml
metricas:
  salud-copia-seguridad:
    - edad-copia-seguridad-segundos
    - tamaño-copia-seguridad-bytes
    - duracion-prueba-restauracion-segundos
    - tasa-fallo-verificacion-copia
    umbral-alerta:
      edad-copia: 86400s  # 24 horas
      duracion-restauracion: 1800s  # 30 minutos
      fallos-verificacion: 0.01  # 1%

  replicacion-base-datos:
    - retraso-replicacion-segundos
    - retraso-archivo-wal-bytes
    - brechas-cronologia-detectadas
    umbral-alerta:
      retraso: 30s  # P0 si > 30s
      retraso-archivo: 1GB
      brechas: 1

  preparacion-dr:
    - utilizacion-capacidad-dr
    - restauraciones-exitosas-24h
    - edad-prueba-conmutacion-dias
    umbral-alerta:
      utilizacion: 0.8  # 80%
      fallos-restauracion: 1+
      edad-prueba: 90  # días
```

---

## Matriz de Tiempo de Recuperación y Costo

| Escenario | RTO | RPO | Costo Estimado | Nivel de Riesgo |
|---|---|---|---|---|
| Fallo de instancia individual | 5 min | 1 min | Bajo | Bajo |
| Corrupción de base de datos | 30 min | 5 min | Medio | Medio |
| Paro regional | 2 horas | 15 min | Alto | Alto |
| Fallo cascada multi-región | 4 horas | 30 min | Crítico | Crítico |

---

## Plantilla de Revisión Post-Incidente

Después de cualquier desastre real o simulacro, complete esta plantilla:

```markdown
# Revisión Post-Incidente: [ID de Incidente]

## Resumen Ejecutivo
- **Duración:** [inicio] - [fin] ([total minutos])
- **Impacto:** [sistemas afectados, clientes impactados]
- **Causa:** [causa raíz]
- **Resolución:** [qué lo corrigió]

## Cronología
- T+0: [evento desencadenante]
- T+5: [detección]
- T+10: [respuesta iniciada]
- T+30: [recuperación parcial]
- T+60: [recuperación completa]

## Lo Que Funcionó Bien
- [ ] La alerta se activó a tiempo
- [ ] El manual era preciso
- [ ] La comunicación del equipo fue clara
- [ ] La restauración de copia de seguridad fue exitosa

## Lo Que Podría Mejorar
- [ ] Tiempo de detección
- [ ] Claridad del manual
- [ ] Antigüedad de copia de seguridad
- [ ] Coordinación del equipo

## Elementos de Acción
- [ ] Elemento: Asignado a: Fecha límite:
- [ ] Elemento: Asignado a: Fecha límite:
```

---

## Recursos Relacionados

- **Guía de Implementación:** `deployment-guide.md`
- **Endurecimiento de Seguridad:** `security-hardening.md`
- **Manuales de Guardia:** `/runbooks/`
- **Respuesta a Incidentes:** `/procedures/incident-response.md`
