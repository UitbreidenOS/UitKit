# Reglas de Kubernetes

## Aplicar a
Todos los manifiestos de Kubernetes (`*.yaml` en `k8s/`, `manifests/`, `helm/`), gráficos de Helm y superposiciones de Kustomize.

## Reglas

1. **Establece `requests` y `limits` en cada contenedor** — las solicitudes no establecidas causan programación impredecible. Los límites no establecidos permiten que un único pod inutilice un nodo. El estrangulamiento de límites de CPU es real; mide y ajusta.

2. **Nunca uses el espacio de nombres `default` para cargas de trabajo de aplicaciones** — crea espacios de nombres específicos (`payments`, `workers`, `monitoring`). El espacio de nombres `default` es para exploración, no para producción.

3. **Establece un mínimo de `replicas: 2` para cualquier Deployment crítico para disponibilidad** — una única réplica significa que una actualización continua o desalojo causa tiempo de inactividad. Usa `PodDisruptionBudget` para prevenir desalojos simultáneos.

4. **Define `readinessProbe` y `livenessProbe`** — readiness controla el tráfico. Liveness reinicia procesos atrapados. Son herramientas diferentes para fallos diferentes. Nunca uses un liveness probe para retrasos de inicialización — usa `startupProbe`.

5. **Fija etiquetas de imagen a resúmenes SHA inmutables en producción** — `myapp@sha256:abc123` es inmutable. `myapp:v1.2.3` es una etiqueta mutable. Usa fijación de resumen a través de tu pipeline de CI o herramientas como `kustomize edit set image`.

6. **Usa `RollingUpdate` con `maxUnavailable: 0` para despliegues sin tiempo de inactividad** — el `maxUnavailable: 1` por defecto pierde tráfico durante actualizaciones. Establece `maxSurge: 1` para permitir un nuevo pod antes de que el anterior se termine.

7. **Almacena secretos en un gestor de secretos, no como base64 en manifiestos** — los objetos `Secret` de Kubernetes son base64, no cifrados, por defecto en etcd. Usa External Secrets Operator, Vault o AWS Secrets Manager.

8. **Aplica `NetworkPolicy` para restringir tráfico pod-a-pod** — por defecto todos los pods pueden alcanzar todos los pods. Denegación a nivel de espacio de nombres + reglas de permiso explícito limita el radio de explosión en caso de compromiso.

9. **Usa `topologySpreadConstraints` o `podAntiAffinity` para resiliencia multi-AZ** — programar réplicas al mismo nodo o AZ anula el propósito de tener múltiples réplicas.

10. **Etiqueta recursos de forma consistente** — mínimo: `app.kubernetes.io/name`, `app.kubernetes.io/version`, `app.kubernetes.io/component`. Las etiquetas son usadas por selectores, monitoreo y asignación de costos.

11. **Establece `terminationGracePeriodSeconds` para que coincida con el tiempo de apagado de tu aplicación** — los 30 segundos por defecto son demasiado cortos para algunas cargas de trabajo y demasiado largos para otras. Establécelo al tiempo de apagado + búfer.

12. **Usa `HorizontalPodAutoscaler` (HPA) para cargas de trabajo sin estado, no escalado manual** — HPA en CPU y métricas personalizadas permite escalado automático hacia afuera. La gestión manual de réplicas no sobrevive picos de carga.

13. **Nunca ejecutes contenedores como root** — establece `securityContext.runAsNonRoot: true` y `runAsUser` a nivel de pod o contenedor. También establece `allowPrivilegeEscalation: false` y `readOnlyRootFilesystem: true` donde sea posible.

14. **Valida manifiestos en CI antes de aplicar** — usa `kubeval`, `kube-score` o `kubectl --dry-run=server`. Detecta errores de esquema y violaciones de políticas antes de que lleguen al clúster.

15. **Usa roles RBAC con espacio de nombres, no ClusterRole, a menos que se requiera acceso a nivel de clúster** — principio de privilegio mínimo. Una cuenta de servicio para un único espacio de nombres nunca debe tener lectura/escritura a nivel de clúster.


---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
