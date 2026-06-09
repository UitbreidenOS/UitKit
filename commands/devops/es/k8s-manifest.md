---
description: Generar manifiestos de Kubernetes listos para producción para la aplicación actual
argument-hint: "[resource-type or app-name] [namespace]"
---
Generar manifiestos de Kubernetes listos para producción para: $ARGUMENTS

Inspecciona el proyecto para determinar el tipo de carga de trabajo (servicio sin estado, worker, CronJob, StatefulSet). Elige el recurso correcto en consecuencia.

Produce todos los manifiestos como documentos YAML separados delimitados por `---` en un único archivo.

Incluye estos recursos:
- `Namespace` si se especifica un espacio de nombres no predeterminado
- `Deployment` o `StatefulSet` para la carga de trabajo principal
- `Service` (ClusterIP de forma predeterminada; anota cuándo se justifica LoadBalancer/NodePort)
- `ConfigMap` para configuración no sensible
- `Secret` con valores marcadores codificados en base64 y una advertencia clara para reemplazar antes de aplicar
- `HorizontalPodAutoscaler` dirigido a métricas de CPU y memoria
- `PodDisruptionBudget` con `minAvailable: 1`
- `Ingress` si el servicio es accesible por HTTP — usa la clase de ingreso nginx, añade la estanza TLS con anotación de cert-manager

Requisitos de especificación de carga de trabajo:
- `resources.requests` y `resources.limits` para CPU y memoria — tamaño basado en la pila detectada
- `livenessProbe` y `readinessProbe` — HTTP o exec según corresponda; incluye `initialDelaySeconds` y `failureThreshold`
- `securityContext` a nivel de Pod: `runAsNonRoot: true`, `seccompProfile: RuntimeDefault`
- `securityContext` a nivel de contenedor: `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities: drop: [ALL]`
- `terminationGracePeriodSeconds` ajustado al comportamiento de cierre de la aplicación
- `topologySpreadConstraints` para distribuir entre nodos y zonas
- Etiquetas estándar `app.kubernetes.io/*` en cada recurso

Después de los manifiestos, produce una lista de verificación de elementos a completar antes de `kubectl apply`:
1. Reemplaza el marcador de etiqueta de imagen con el digest real o etiqueta semver
2. Completa los valores de Secret (o referencia un operador de secretos externos)
3. Establece el nombre de host de ingreso y el nombre del secreto TLS
4. Confirma el nombre de la clase de almacenamiento si utilizas un StatefulSet con PVCs
5. Verifica que los nombres de métrica de HPA coincidan con tu configuración de metrics-server o Prometheus adapter
