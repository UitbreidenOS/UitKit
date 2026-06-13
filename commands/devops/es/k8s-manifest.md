---
description: Generar manifiestos de Kubernetes listos para producción para la aplicación actual
argument-hint: "[tipo-recurso o nombre-app] [namespace]"
---
Generar manifiestos de Kubernetes listos para producción para: $ARGUMENTS

Inspecciona el proyecto para determinar el tipo de carga de trabajo (servicio sin estado, worker, CronJob, StatefulSet). Elige el recurso correcto en consecuencia.

Genera todos los manifiestos como documentos YAML separados delimitados por `---` en un único archivo.

Incluye estos recursos:
- `Namespace` si se especifica un namespace no predeterminado
- `Deployment` o `StatefulSet` para la carga de trabajo principal
- `Service` (ClusterIP por defecto; indica cuándo LoadBalancer/NodePort es justificado)
- `ConfigMap` para configuración no sensible
- `Secret` con valores de marcador codificados en base64 y una advertencia clara para reemplazar antes de aplicar
- `HorizontalPodAutoscaler` dirigido a métricas de CPU y memoria
- `PodDisruptionBudget` con `minAvailable: 1`
- `Ingress` si el servicio es accesible por HTTP — usa clase nginx ingress, añade sección TLS con anotación cert-manager

Requisitos de especificación de carga de trabajo:
- `resources.requests` y `resources.limits` para CPU y memoria — tamaño basado en el stack detectado
- `livenessProbe` y `readinessProbe` — HTTP o exec según sea apropiado; incluye `initialDelaySeconds` y `failureThreshold`
- `securityContext` a nivel de Pod: `runAsNonRoot: true`, `seccompProfile: RuntimeDefault`
- `securityContext` a nivel de Container: `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities: drop: [ALL]`
- `terminationGracePeriodSeconds` ajustado al comportamiento de apagado de la aplicación
- `topologySpreadConstraints` para distribuir entre nodos y zonas
- Etiquetas estándar `app.kubernetes.io/*` en cada recurso

Después de los manifiestos, genera una lista de verificación de elementos a completar antes de `kubectl apply`:
1. Reemplaza el marcador de etiqueta de imagen con el digest real o etiqueta semver
2. Rellena los valores de Secret (o referencia un operador de secretos externos)
3. Establece el nombre de host de ingress y el nombre del secreto TLS
4. Confirma el nombre de la clase de almacenamiento si usas un StatefulSet con PVCs
5. Verifica que los nombres de métricas de HPA coincidan con tu configuración de metrics-server o Prometheus adapter
