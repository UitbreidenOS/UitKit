---
description: Generar un andamiaje de gráfico Helm para la aplicación actual
argument-hint: "[nombre-app] [opcional: chart-type=app|library]"
---
Generar un gráfico Helm para: $ARGUMENTS

Inspecciona el proyecto para inferir el tipo de aplicación, los puertos expuestos y cualquier servicio de apoyo requerido.

Produce la estructura completa del directorio de gráficos:
```
charts/<nombre-app>/
  Chart.yaml
  values.yaml
  values-prod.yaml
  templates/
    _helpers.tpl
    deployment.yaml
    service.yaml
    ingress.yaml
    configmap.yaml
    secret.yaml
    hpa.yaml
    serviceaccount.yaml
    NOTES.txt
```

Requisitos por archivo:

`Chart.yaml`:
- `apiVersion: v2`, `type` correcto (application o library), `version` semver comenzando en `0.1.0`, `appVersion` como marcador de posición

`values.yaml`:
- Claves de nivel superior: `replicaCount`, `image` (repository/tag/pullPolicy), `service`, `ingress`, `resources`, `autoscaling`, `env`, `secrets`, `podAnnotations`, `nodeSelector`, `tolerations`, `affinity`
- Todos los valores deben ser defaults válidos que produzcan un gráfico implementable sin modificación

`templates/deployment.yaml`:
- Usa `_helpers.tpl` para ayudantes de nombre/etiqueta — sin `.Release.Name` en línea crudo
- Anotación `checksum/config` en la plantilla de pod para que los despliegues se activen en cambios de ConfigMap
- `livenessProbe` y `readinessProbe` — rutas de `values.yaml`
- `securityContext` completo a nivel de pod y contenedor: `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation: false`, eliminar todas las capacidades
- `resources` de values sin límites codificados

`ingress.yaml`:
- Condicional en `ingress.enabled`
- Soportar patrones tanto `networking.k8s.io/v1` como anotaciones heredadas
- Bloque TLS condicional en `ingress.tls`

`NOTES.txt`: instrucciones posteriores a la instalación mostrando el comando exacto para obtener la URL del servicio

Después del gráfico, muestra:
1. Comando `helm lint` para validar
2. Comando `helm template . | kubectl apply --dry-run=client -f -` para previsualizar
3. La entrada mínima de `helmfile.yaml` para desplegar este gráfico en un clúster
