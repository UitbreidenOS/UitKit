---
name: runbook-generator
description: "Generate runbooks for incidents, deployments, and operational tasks — step-by-step procedures with decision trees, rollback steps, and escalation paths"
---

# Habilidad Generador de Runbooks

## Cuándo activar
- Crear un runbook para una tarea operativa recurrente
- Documentación de procedimientos de respuesta a incidentes antes de que ocurra un incidente
- Escritura de un runbook de implementación para una versión compleja
- Construcción de un manual de guardia para nuevos ingenieros
- Conversión de conocimiento tribal informal en procedimientos documentados

## Cuándo NO usar
- Tareas puntuales — solo vale documentar si sucede de nuevo
- Depuración exploratoria — los runbooks son para modos de falla conocidos
- Runbooks específicos de plataforma (pasos de AWS Console) — verificar con UI actual

## Instrucciones

### Runbook de respuesta a incidentes

```
Genere un runbook de respuesta a incidentes para [modo de falla].

Modo de falla: [qué se rompe — ej: « pool de conexión a base de datos agotado », « timeout de servicio de pago », « disco lleno »]
Servicio afectado: [qué servicio/sistema]
Síntomas (lo que ve on-call): [alertas activadas / reportes de usuarios / dashboards]
Severidad: [P1 crítico / P2 mayor / P3 menor]

Estructura del runbook:
1. Resumen: qué cubre este runbook en 1-2 oraciones
2. Síntomas: nombres exactos de alertas + qué experimentan los usuarios
3. Triage inicial (< 5 minutos):
   - ¿Está realmente sucediendo? (verificar)
   - ¿Cuál es el radio de alcance? (cuántos usuarios afectados)
   - ¿Es una nueva implementación? (considerar revertir)
4. Pasos de investigación (ordenados, con resultados esperados):
   - Paso 1: [comando/verificación → lo que espera ver]
   - Paso 2: [comando/verificación → punto de decisión]
5. Opciones de mitigación (de más rápido a más lento):
   - Opción A: [corrección rápida, temporal]
   - Opción B: [corrección media]
   - Opción C: [corrección adecuada, requiere despliegue]
6. Procedimiento de reversión (si es causado por despliegue):
   - [pasos exactos]
7. Post-incidente: [qué verificar antes de cerrar]
8. Escalada: [cuándo llamar a quién]
```

### Runbook de despliegue

```
Genere un runbook de despliegue para [servicio/función].

Servicio: [nombre]
Tipo de despliegue: [rolling / blue-green / canary / all-at-once]
Nivel de riesgo: [bajo / medio / alto]
Dependencias: [servicios que deben actualizarse antes/después]
Migraciones de base de datos: [sí/no — describir si sí]

Estructura del runbook:
1. Lista de verificación previa al despliegue (30-60 min antes):
   □ ¿Todos los tests pasando en CI?
   □ ¿Migración probada en staging?
   □ ¿Plan de reversión documentado?
   □ ¿Equipo notificado (si alto riesgo)?
   □ ¿Dashboards de monitoreo abiertos?

2. Pasos de despliegue (comandos exactos o pasos de UI):
   Paso 1: [acción] → Resultado esperado: [X]
   Paso 2: [acción] → Verificar: [verificación Y]
   
3. Validación (inmediatamente después del despliegue):
   □ ¿El endpoint de salud retorna 200?
   □ ¿La tasa de error está en rango normal?
   □ ¿Funcionan los flujos de usuario clave? (prueba de humo)
   □ ¿Migración de base de datos completada sin problemas?

4. Procedimiento de reversión (si algo sale mal):
   Paso 1: [comando de reversión exacto]
   Paso 2: [reversión de base de datos si es necesario]
   Punto de decisión: ¿revertir vs. hotfix?

5. Post-despliegue (1 hora después):
   □ ¿Tasas de error estables?
   □ ¿Métricas de rendimiento normales?
   □ Cerrar problema/ticket de despliegue
```

### Runbook de tarea operativa

```
Genere un runbook para esta tarea operativa recurrente.

Tarea: [describir — ej: « verificación mensual de respaldo de base de datos », « renovación de certificado SSL », « revisión trimestral de acceso »]
Frecuencia: [diario / semanal / mensual / trimestral / ad-hoc]
Quién lo ejecuta: [rol — cualquier ingeniero / ingeniero senior / DBA / devops]
Tiempo aproximado: [X minutos]

Secciones:
1. Propósito: por qué existe esta tarea, qué se rompe si se omite
2. Requisitos previos: acceso/permisos necesarios, herramientas requeridas
3. Pasos: numerados, con comandos exactos y resultados esperados
4. Verificación: cómo confirmar la finalización de la tarea
5. Manejo de fallos: qué hacer si un paso falla
6. Documentación: dónde registrar la finalización (ticket / hoja de cálculo / herramienta runbook)

Hazlo ejecutable por alguien desconocido del sistema.
```

### Sección manual de guardia

```
Escriba una sección de manual de guardia para [equipo/servicio].

Audiencia: ingeniero en guardia por primera vez
Contexto del servicio: [describir qué hace el servicio y quién lo usa]

Cubra:
1. De qué es responsable (y de qué NO)
2. Cómo clasificar una alerta en los primeros 5 minutos
3. Expectativas de comunicación (cuándo actualizar canal de incidente, a quién involucrar)
4. Matriz de escalada: [rol] → [contacto] → [cuándo escalar]
5. Las 3 alertas más comunes y qué hacer para cada una
6. Herramientas que necesitará: [lista con enlaces]
7. Qué hacer después de que se cierra un incidente (disparador post-mortem, limpieza de ticket)
8. Consejos de supervivencia (del equipo que escribió esto)
```

## Ejemplo

**Usuario:** Genere un runbook para la alerta « alto uso de memoria » en nuestra API Node.js.

**Claude genera:**

---
**RUNBOOK: Alto uso de memoria — API Node.js**
*Severidad: P2 (P1 si OOMKilled)*

**Síntomas:**
- Alerta: `api_memory_usage_percent > 85` para > 10 minutos
- Impacto en usuario: ralentizaciones potenciales o reinicios si la memoria alcanza el límite

**Triage (primeros 5 minutos):**
1. `kubectl top pods -n production | grep api` → ¿Afecta esto a un pod o a todos?
2. `kubectl logs [pod-afectado] --tail=200 | grep -i "memory\|heap\|gc"` → ¿Registros GC?
3. Verificar historial de despliegue: `kubectl rollout history deployment/api` → ¿Comenzó después de un despliegue?

**Si pod único:**
```bash
kubectl delete pod [pod-afectado]  # el pod se reinicia con memoria fresca
```
Monitoree: ¿sube memoria nuevamente en 30 min? → probable fuga de memoria, escale.

**Si todos los pods (sistémico):**
- Verificar pico de tráfico reciente: ver RPS en dashboard
- Si pico de tráfico: escale `kubectl scale deployment api --replicas=X`
- Si no hay pico de tráfico: esto es una fuga de memoria, llame al ingeniero senior

**Disparador de reversión:** Si el problema de memoria comenzó después del despliegue de hoy:
```bash
kubectl rollout undo deployment/api
```

**Escalada:** Si memoria permanece > 90% después del reinicio Y sin despliegue → llamar al ingeniero senior on-call.

---
