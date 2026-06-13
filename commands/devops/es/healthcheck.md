---
description: Agregar o auditar configuraciones de endpoints y pruebas de verificación de salud para el servicio actual
argument-hint: "[nombre del servicio o ruta del archivo]"
---
Agregar o auditar cobertura de verificación de salud para: $ARGUMENTS

Inspecciona el proyecto para identificar el framework, tipo de servidor e implementaciones existentes de verificación de salud.

**Si no existen endpoints de salud — implementarlos:**

Genera el código mínimo para agregar:
1. `GET /healthz` (liveness) — devuelve `200 OK` con `{"status":"ok"}` si el proceso está vivo; sin verificaciones de dependencias
2. `GET /readyz` (readiness) — devuelve `200 OK` solo si todas las dependencias críticas (BD, caché, servicios descendentes) son accesibles; devuelve `503` con un cuerpo JSON listando qué verificaciones fallaron
3. `GET /metrics` — exposición compatible con Prometheus si el framework lo soporta (de lo contrario, anota qué se necesita)

Reglas de implementación:
- Ambos endpoints deben responder en menos de 100ms bajo carga normal
- Las verificaciones de dependencias en `/readyz` deben tener timeouts (por defecto 2s por verificación) — nunca bloquees indefinidamente
- No requieras autenticación en `/healthz` o `/readyz` — las pruebas deben ser sin autenticar
- Registra fallos en nivel WARN, no ERROR — los fallos de pruebas son señales operacionales, no errores de aplicación
- Para verificación de BD en `/readyz`: usa una consulta ligera (`SELECT 1`) no una introspección de esquema

**Si los endpoints de salud ya existen — auditarlos:**

Verifica:
- Conflación de liveness vs readiness (una prueba de liveness que verifica BD reiniciará pods si la BD está fuera — incorrecto)
- Falta de timeout en verificaciones de dependencias
- Endpoints que devuelven 200 con un cuerpo de error (rompe todas las pruebas)
- Configuraciones de pruebas en Kubernetes/Compose que son demasiado agresivas (`failureThreshold: 1`) o demasiado permisivas (sin `initialDelaySeconds`)

**En todos los casos, genera la configuración de prueba correspondiente para cada objetivo de despliegue encontrado en el proyecto:**

Kubernetes:
```yaml
livenessProbe:
  httpGet: { path: /healthz, port: <puerto> }
  initialDelaySeconds: 10
  periodSeconds: 15
  failureThreshold: 3

readinessProbe:
  httpGet: { path: /readyz, port: <puerto> }
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```

Docker Compose:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:<puerto>/healthz"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 10s
```

Señala cualquier cosa que causaría reinicios falsos positivos o fallos silenciosos de readiness.
