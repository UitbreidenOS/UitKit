---
name: migration-architect
description: "Planificación de migración sin tiempo de inactividad: migraciones de esquema de base de datos (expand-contract), cutovers de infraestructura, reemplazos de servicios — planes por fases, estrategias de reversión y compuertas de validación"
---

# Habilidad Arquitecto de Migración

## Cuándo activar
- Planificación de una migración de esquema de base de datos sin tiempo de inactividad
- Diseño de un cutover de servicio o reemplazo de sistema
- Construcción de un plan de migración por fases con rutas de reversión explícitas
- Validación de compatibilidad de datos antes y después de la migración
- Migración de infraestructura (proveedor de nube, hosting, motor de base de datos)

## Cuándo NO usar
- Actualizaciones de dependencias npm/pip — usar la habilidad dependency-auditor
- Diseño de arquitectura de nube sin contexto de migración — usar habilidades cloud architect
- Diseño de ETL de canalización de datos — usar habilidades data-ml

## Instrucciones

### Migración de esquema de base de datos (expand-contract)

```
Planifique una migración de esquema de base de datos sin tiempo de inactividad.

Base de datos: [PostgreSQL / MySQL / MongoDB / otro]
Cambio: [describir — agregar columna / renombrar columna / cambiar tipo / dividir tabla / agregar FK]
Tráfico actual: [solicitudes/segundo, carga máxima]
Requisito de reversión: [debe poder revertir / solo hacia adelante aceptable]

El patrón expand-contract (sin tiempo de inactividad, todo seguro para producción):

FASE 1 — EXPAND (implementar primero, compatible hacia atrás):
Agregar nueva estructura junto con la existente:
- Nueva columna con default NULL (no NOT NULL — bloquearía la tabla)
- Nueva tabla junto con la antigua
- Nuevo índice (CREATE INDEX CONCURRENTLY — sin bloqueo de tabla en PostgreSQL)

FASE 2 — DUAL WRITE (ambos esquemas nuevo y antiguo):
La aplicación escribe en ambas estructuras antigua y nueva simultáneamente.
Las lecturas aún usan la estructura antigua (reversión: simplemente dejar de escribir en la nueva).

FASE 3 — MIGRATE READS:
Cambiar lectura de aplicación a la nueva estructura.
La estructura antigua aún recibe escrituras (permite reversión).

FASE 4 — CONTRACT (eliminar estructura antigua):
Elimine la columna/tabla/índice antigua una vez que se confirme 100% estable.
Esto es irreversible — confirme exhaustivamente antes de ejecutar.

Genere el plan de migración para mi cambio de esquema específico.
```

### Cutover de reemplazo de servicio

```
Planifique un cutover de reemplazo de servicio sin tiempo de inactividad.

Servicio antiguo: [describir — monolito / API heredada / dependencia de terceros]
Servicio nuevo: [describir]
Tráfico: [X solicitudes/segundo, X usuarios afectados]
Ventana de reversión: [¿cuánto tiempo podemos revertir si algo sale mal?]

Patrón Strangler Fig (el más seguro para el reemplazo de servicio):

Fase 1 — Implementar nuevo servicio junto con el antiguo (sin tráfico aún):
- Nuevo servicio implementado en entorno de producción
- Solo prueba interna (personal, cuentas de prueba internas)
- Paridad de funcionalidad validada contra contrato de API de servicio antiguo

Fase 2 — Modo sombra (ambos servicios reciben tráfico):
- Todas las solicitudes van al servicio antiguo (tráfico de producción)
- El nuevo servicio recibe una copia de todas las solicitudes (tráfico sombra)
- Compare respuestas: antiguo vs nuevo — identifique discrepancias
- Corrija discrepancias en el nuevo servicio sin afectar a los usuarios

Fase 3 — Canary (pequeño % al nuevo servicio):
- 1% → 5% → 10% → 25% → 50% → 100% durante días/semanas
- Monitoreo en cada incremento: tasa de error, latencia, métricas empresariales
- Activador de reversión: si la tasa de error aumenta > [umbral] en cualquier paso canary

Fase 4 — Cutover completo:
- 100% tráfico al nuevo servicio
- Servicio antiguo mantenido en espera durante [X días] (aún no fuera de servicio)
- Reversión: voltear peso del balanceador de carga nuevamente al servicio antiguo si es necesario

Fase 5 — Decomisión:
- Servicio antiguo fuera de servicio después de [ventana de estabilidad]
- Datos/estado de servicio antiguo migrados o archivados

Genere el plan de cutover para mis servicios específicos.
```

### Migración de infraestructura de nube

```
Planifique una migración de nube para [carga de trabajo].

Fuente: [AWS / Azure / GCP / on-prem / Co-location]
Destino: [AWS / Azure / GCP]
Cargas de trabajo: [describir — aplicación web / base de datos / almacenamiento / todo]
Volumen de datos: [X GB / TB]
Tolerancia de tiempo de inactividad: [sin tiempo de inactividad / ventana de mantenimiento de X horas]

Fases de migración:

FASE 1 — EVALUAR (2-4 semanas):
□ Inventariar todas las cargas de trabajo, dependencias y volúmenes de datos
□ Identificar bloqueadores de migración (formatos patentados, licencias, restricciones de cumplimiento)
□ Priorizar: comenzar con servicios sin estado (más fácil), finalizar con bases de datos (más difícil)
□ Documentar estado actual: diagrama de arquitectura, topología de red, registros DNS

FASE 2 — PILOT (2-4 semanas):
□ Migrar 1 servicio no crítico a la nube de destino
□ Validar rendimiento, costo y patrones operativos
□ Construir y probar pipelines CI/CD para nube de destino
□ Entrenar equipo en herramientas de nube de destino

FASE 3 — LIFT AND SHIFT (por carga de trabajo):
Para cada servicio sin estado:
□ Containerizar si aún no lo está (Docker)
□ Implementar a nube de destino en paralelo (aún no reemplazar fuente)
□ Ejecutar pruebas de aceptación
□ Cutover de DNS (TTL bajo primero, luego voltear)
□ Monitorear durante [X días] antes de decomisión de fuente

FASE 4 — MIGRACIÓN DE BASE DE DATOS:
□ Configurar replicación de fuente a base de datos de destino (sincronización continua)
□ Validar integridad de datos (recuentos de filas, checksums, consultas de muestra)
□ Cutover de aplicación: apuntar aplicación a la nueva base de datos
□ Detener replicación
□ Base de datos antigua retenida como copia de seguridad durante [X días]

FASE 5 — DECOMISIÓN:
□ Todas las cargas de trabajo validadas en nube de destino
□ Infraestructura de nube antigua terminada
□ Registros DNS limpiados
□ Cuenta de nube antigua cerrada

Genere el plan de migración por fases para mis cargas de trabajo específicas.
```

### Estrategia de reversión

```
Diseñe una estrategia de reversión para [migración].

Tipo de migración: [cambio de esquema / cutover de servicio / migración de nube / migración de datos]
Fase actual: [qué fase está en progreso o planeada]
Tiempo de inactividad máximo aceptable: [sin tiempo de inactividad / X minutos / X horas]
Riesgo de cambio de datos: [datos podrían ser mutados / datos de solo lectura / ambos]

Estrategia de reversión por tipo de migración:

MIGRACIONES DE ESQUEMA:
Fase 1 (solo expand): reversión = soltar nueva columna/índice/tabla. Seguro, instantáneo.
Fase 2 (dual write): reversión = detener escritura en nueva estructura, soltar nueva. Seguro.
Fase 3 (lecturas cambiadas): reversión = cambiar lecturas nuevamente a antigua. Rápido.
Fase 4 (contract): IRREVERSIBLE. Nunca ejecutar sin 48h de observación de estabilidad.

CUTOVERS DE SERVICIO:
Mecanismo de reversión: volteo de peso del balanceador de carga (segundos para ejecutar)
Requerido: mantener servicio antiguo ejecutándose en paralelo durante [mínimo X días]
Punto de decisión para decomisión: [nunca antes de 7 días de tráfico estable al 100%]

Genere estrategia de reversión y manual para mi migración.
```

## Ejemplo

**Usuario:** Necesitamos renombrar una columna en nuestra tabla de pedidos PostgreSQL (user_id → customer_id). 2M filas, 500 solicitudes/segundo. Sin tiempo de inactividad. ¿Cómo?

**Plan de migración de Claude:**

4 fases expand-contract, tiempo total transcurrido: ~3-5 días de operación paralela, 15 minutos de trabajo de base de datos real distribuidos en 4 implementaciones.

**Fase 1 — Agregar nueva columna (Implementar 1, 5 minutos):**
```sql
ALTER TABLE orders ADD COLUMN customer_id BIGINT;
CREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id);
```

**Fase 2 — Rellenar filas existentes (ejecutar fuera del horario de máxima concurrencia, sin bloqueo):**
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

**Fase 3 — Dual write (Implementar 2):**
La aplicación escribe tanto `user_id` COMO `customer_id`. Las lecturas aún usan `user_id`.
Ejecutar mínimo 48 horas. Confirmar que `customer_id` está completamente poblada y consistente.

**Fase 4 — Cambiar lecturas (Implementar 3):**
La aplicación ahora lee desde `customer_id`. Todavía escribe ambas.
Monitoreo 48 horas. Reversión: cambiar lecturas nuevamente a `user_id` (rápido, seguro).

**Fase 5 — Eliminar columna antigua (Implementar 4, después de 1 semana estable):**
```sql
ALTER TABLE orders DROP COLUMN user_id;
DROP INDEX idx_orders_user_id;
```

**Garantía sin tiempo de inactividad:** Cada paso es una implementación compatible hacia atrás. Reversión en cualquier paso antes de Fase 5 = cambiar la implementación. Después de Fase 5 = solo hacia adelante.

---
