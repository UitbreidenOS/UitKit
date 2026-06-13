---
description: Generar un plan de rollback paso a paso para el despliegue actual o cambio reciente
argument-hint: "[nombre del servicio, versión, o PR/commit para hacer rollback]"
---
Generar un plan de rollback para: $ARGUMENTS

Inspeccionar el proyecto para determinar el mecanismo de despliegue (Kubernetes, ECS, Heroku, VM desnuda, Lambda, etc.), el pipeline de CI/CD y cualquier componente con estado (bases de datos, colas, cachés, feature flags).

Producir un runbook con estas secciones:

**1. Lista de verificación previa al rollback**
- Confirmar la versión/revisión anterior objetivo para hacer rollback (etiqueta de imagen, SHA de Git, revisión de Helm)
- Identificar quién debe aprobar antes de ejecutar (líder on-call, comandante del incidente)
- Verificar que el artefacto anterior aún existe en el registro/almacén — si no es así, señalar inmediatamente
- Listar cualquier migración de esquema aplicada desde la versión anterior (las irreversibles bloquean un rollback limpio)

**2. Evaluación de impacto**
- Tiempo de inactividad estimado o ventana degradada durante el rollback
- Qué usuarios/tenants/regiones se ven afectados
- Cualquier dato escrito desde el despliegue fallido que sea incompatible con el esquema anterior

**3. Pasos de rollback** (numerados, comandos listos para copiar y pegar)

Para Kubernetes:
```
kubectl rollout undo deployment/<nombre> -n <namespace>
kubectl rollout status deployment/<nombre> -n <namespace>
kubectl get pods -n <namespace> -w
```

Para Helm:
```
helm history <release> -n <namespace>
helm rollback <release> <revision> -n <namespace>
```

Para migraciones de bases de datos: proporcionar el comando de migración hacia atrás exacto o señalar que se requiere una reversión de esquema manual y especificar qué SQL debe ejecutarse.

Para feature flags: listar qué flags deben ser desactivados antes o después del rollback binario.

**4. Pasos de verificación**
- Comandos de prueba de humo o URLs para confirmar que el servicio está en buen estado en la versión anterior
- Métricas clave a monitorear durante 10 minutos después del rollback (tasa de errores, latencia p99, profundidad de cola)

**5. Criterios de aborto**
- Condiciones bajo las cuales el rollback en sí debe ser detenido y escalado
- Fallback si el rollback falla (p. ej., cambio de tráfico a una región de funcionamiento correcto conocida)

**6. Acciones posteriores al rollback**
- Abrir un issue de seguimiento para análisis de causa raíz
- Preservar logs y trazas de la ventana del incidente antes de que expiren
- Cronograma para intentar un re-despliegue con la corrección

Señalar cualquier paso que no pueda automatizarse y requiera criterio humano o acceso elevado.
