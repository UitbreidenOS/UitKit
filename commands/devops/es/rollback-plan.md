---
description: Generar un plan de reversión paso a paso para el despliegue actual o cambio reciente
argument-hint: "[service name, version, or PR/commit to roll back]"
---
Generar un plan de reversión para: $ARGUMENTS

Inspecciona el proyecto para determinar el mecanismo de despliegue (Kubernetes, ECS, Heroku, VM bare metal, Lambda, etc.), el pipeline de CI/CD y cualquier componente con estado (bases de datos, colas, cachés, feature flags).

Produce un runbook con estas secciones:

**1. Lista de verificación previa a la reversión**
- Confirmar la versión/revisión anterior objetivo a la que revertir (etiqueta de imagen, SHA de Git, revisión de Helm)
- Identificar quién debe aprobar antes de ejecutar (líder de guardia, comandante del incidente)
- Verificar que el artefacto anterior aún existe en el registro/almacén — si no existe, marcar inmediatamente
- Listar cualquier migración de esquema aplicada desde la versión anterior (las irreversibles bloquean una reversión limpia)

**2. Evaluación de impacto**
- Tiempo de inactividad estimado o ventana degradada durante la reversión
- Qué usuarios/inquilinos/regiones se ven afectados
- Cualquier dato escrito desde el despliegue deficiente que puede ser incompatible con el esquema anterior

**3. Pasos de reversión** (numerados, comandos listos para copiar y pegar)

Para Kubernetes:
```
kubectl rollout undo deployment/<name> -n <namespace>
kubectl rollout status deployment/<name> -n <namespace>
kubectl get pods -n <namespace> -w
```

Para Helm:
```
helm history <release> -n <namespace>
helm rollback <release> <revision> -n <namespace>
```

Para migraciones de base de datos: proporcionar el comando exacto de migración hacia abajo o notar que se requiere una reversión de esquema manual y especificar qué SQL debe ejecutarse.

Para feature flags: enumerar qué banderas deben desactivarse antes o después de la reversión binaria.

**4. Pasos de verificación**
- Comandos de prueba de humo o URLs para confirmar que el servicio está saludable en la versión anterior
- Métricas clave a observar durante 10 minutos después de la reversión (tasa de error, latencia p99, profundidad de cola)

**5. Criterios de aborto**
- Condiciones bajo las cuales la reversión en sí debe detenerse y escalarse
- Alternativa si falla la reversión (por ejemplo, desplazamiento de tráfico a una región conocida como buena)

**6. Acciones posteriores a la reversión**
- Abrir un problema de seguimiento para análisis de causa raíz
- Conservar registros y trazas de la ventana del incidente antes de que expiren
- Cronograma para intentar un nuevo despliegue con la corrección

Marca cualquier paso que no pueda automatizarse y requiera criterio humano o acceso elevado.
