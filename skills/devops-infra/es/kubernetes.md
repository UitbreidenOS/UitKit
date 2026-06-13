> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../kubernetes.md).

# Skill de Kubernetes

## Cuándo activar
- Escribir manifiestos de Kubernetes (Deployments, Services, ConfigMaps, Secrets, Ingress)
- Configurar charts de Helm o archivos de valores para una aplicación
- Depurar un Pod fallido, CrashLoopBackOff o contenedor OOMKilled
- Configurar escalado horizontal de pods (HPA) o escalado vertical (VPA)
- Definir solicitudes y límites de recursos para contenedores
- Escribir o revisar políticas RBAC (Roles, ClusterRoles, RoleBindings)
- Configurar sondas de liveness, readiness y startup
- Configurar volúmenes persistentes y reclamaciones de volúmenes persistentes
- Escribir políticas de red para controlar el tráfico entre pods
- Configurar namespaces y aislamiento multi-tenant

## Cuándo NO usar
- Configuraciones de Docker Compose que no se están migrando a Kubernetes
- Serverless (Cloud Run, Lambda, Fargate) — modelo de despliegue diferente
- Aplicaciones simples de un solo contenedor que no necesitan orquestación
- Entornos de desarrollo local donde Docker solo es suficiente
- Nomad, Mesos u otros orquestadores que no son Kubernetes

## Instrucciones

### Estructura del manifiesto
Siempre establece estos campos en cada Deployment:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-name
  namespace: production          # Siempre explícito — nunca confiar en el namespace por defecto
  labels:
    app: app-name
    version: "1.0.0"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app-name
  template:
    metadata:
      labels:
        app: app-name
        version: "1.0.0"
    spec:
      containers:
        - name: app-name
          image: registry/app-name:tag   # Nunca usar :latest en producción
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

### Solicitudes y límites de recursos
- Siempre establece tanto `requests` como `limits` — nunca los omitas
- `requests` = recursos garantizados (usados para la programación)
- `limits` = máximo permitido (OOMKilled si se supera la memoria)
- Los límites de CPU son opcionales en clústeres con throttling de CPU desactivado — pero los límites de memoria son obligatorios
- Empieza de forma conservadora: requests al ~25% del esperado, limits al 2x del esperado, luego ajusta con métricas reales

### Sondas de salud
Todos los contenedores en producción deben tener sondas:
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 20
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```
- El fallo de `livenessProbe` → reinicio del contenedor
- El fallo de `readinessProbe` → eliminado del balanceador de carga del Service (sin tráfico, sin reinicio)
- Nunca apuntes ambas al mismo endpoint — la readiness debe verificar dependencias, la liveness no

### Gestión de secretos
- Nunca pongas secretos en ConfigMaps — usa Secrets
- Nunca hagas commit de manifiestos Secret con valores reales — usa sealed-secrets, external-secrets-operator o Vault
- Referencia los secretos como variables de entorno, no como volúmenes, a menos que la aplicación requiera específicamente secretos basados en archivos:
```yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: database-url
```

### Convenciones de namespaces
- Namespace `default`: solo para dev/testing
- Las cargas de trabajo de producción siempre en namespaces con nombre
- Usa `ResourceQuota` y `LimitRange` en cada namespace de producción
- RBAC: los desarrolladores obtienen edit en namespaces de dev, view en producción

### Causas comunes de CrashLoopBackOff y soluciones
1. Variable de entorno faltante → revisa la sección Events de `kubectl describe pod`
2. Healthcheck fallido → los logs muestran el error real, la sonda solo lo detecta
3. OOMKilled → aumenta el límite de memoria o soluciona la fuga de memoria
4. Error al obtener la imagen → revisa imagePullPolicy y credenciales del registro
5. Fallo del contenedor init → `kubectl logs pod-name -c init-container-name`

## Ejemplo

**Usuario:** Desplegar una aplicación FastAPI con conexión a PostgreSQL, 3 réplicas, límites de recursos y health checks.

**Estructura de salida esperada:**
- Manifiesto de Namespace
- Secret para `DATABASE_URL`
- Deployment con 3 réplicas, requests/limits de recursos, sondas liveness + readiness apuntando a `/healthz` y `/ready`
- Service (ClusterIP) exponiendo el puerto 80 → puerto 8080 del contenedor
- HorizontalPodAutoscaler con objetivo de 70% de utilización de CPU, mínimo 3 / máximo 10 réplicas

---
