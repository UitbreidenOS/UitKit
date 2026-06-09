---
description: Agregar o auditar puntos finales de verificación de salud y configuraciones de sonda para el servicio actual
argument-hint: "[service name or file path]"
---
Agregar o auditar la cobertura de verificación de salud para: $ARGUMENTS

Inspecciona el proyecto para identificar el marco, el tipo de servidor e implementaciones de verificación de salud existentes.

**Si no existen puntos finales de salud — implementarlos:**

Genera el código mínimo para agregar:
1. `GET /healthz` (vivacidad) — devuelve `200 OK` con `{"status":"ok"}` si el proceso está vivo; sin verificaciones de dependencias
2. `GET /readyz` (preparación) — devuelve `200 OK` solo si todas las dependencias críticas (BD, caché, servicios descendentes) son alcanzables; devuelve `503` con un cuerpo JSON enumerando qué verificaciones fallaron
3. `GET /metrics` — exposición compatible con Prometheus si el marco la admite (de lo contrario, nota qué se necesita)

Reglas de implementación:
- Ambos puntos finales deben responder en menos de 100 ms bajo carga normal
- Las verificaciones de dependencias de `/readyz` deben tener tiempos de espera (2 s por defecto por verificación) — nunca bloquear indefinidamente
- No requiere autenticación en `/healthz` o `/readyz` — las sondas deben ser sin autenticación
- Registra fallos a nivel WARN, no ERROR — los fallos de sonda son señales operacionales, no errores de aplicación
- Para la verificación de BD de `/readyz`: usa una consulta ligera (`SELECT 1`) no una introspección de esquema

**Si los puntos finales de salud ya existen — auditarlos:**

Verifica:
- Conflación de vivacidad vs preparación (una sonda de vivacidad que verifica BD reiniciará pods en una interrupción de BD — incorrecto)
- Falta de tiempo de espera en verificaciones de dependencias
- Puntos finales que devuelven 200 con un cuerpo de error (rompe todas las sondas)
- Configuraciones de sonda en Kubernetes/Compose que son demasiado agresivas (`failureThreshold: 1`) o demasiado indulgentes (sin `initialDelaySeconds`)

**En todos los casos, proporciona la configuración de sonda correspondiente para cada destino de implementación encontrado en el proyecto:**

Kubernetes:
```yaml
livenessProbe:
  httpGet: { path: /healthz, port: <port> }
  initialDelaySeconds: 10
  periodSeconds: 15
  failureThreshold: 3

readinessProbe:
  httpGet: { path: /readyz, port: <port> }
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```

Docker Compose:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:<port>/healthz"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 10s
```

Señala cualquier cosa que causaría reinicios falsos positivos o fallos silenciosos de preparación.
