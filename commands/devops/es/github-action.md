---
description: Generar un flujo de trabajo de GitHub Actions para tareas de CI, CD o automatización
argument-hint: "[propósito del flujo de trabajo: ej. ci, deploy-aws, release, pr-checks]"
---
Generar un flujo de trabajo de GitHub Actions para: $ARGUMENTS

Inspeccionar el proyecto para determinar el lenguaje/framework, comandos de prueba, comandos de compilación y objetivo de implementación. Personalizar el flujo de trabajo en consecuencia.

Generar un único archivo `.github/workflows/<slug>.yml`.

Requisitos:

Disparadores:
- Usar el conjunto mínimo de disparadores para el propósito indicado (ej. `push` + `pull_request` para CI; `release` para publicación; `workflow_dispatch` para operaciones manuales)
- Agregar filtros `paths` si el repositorio es un monorepo
- Fijar `branches` a `main`/`master` a menos que se requiera una cobertura más amplia

Trabajos y pasos:
- Usar `actions/checkout@v4` — siempre fijar acciones a un SHA o etiqueta de versión principal, nunca a una rama
- Cachear dependencias apropiadas para el stack (`actions/cache` o cachés integradas en acciones `setup-*`)
- Ejecutar lint, type-check y pruebas como pasos separados con nombres claros
- Fallar rápido: `continue-on-error: false` en pasos críticos; establecer `timeout-minutes` en cada trabajo
- Para compilaciones de Docker: usar `docker/build-push-action@v5` con `cache-from: type=gha` y `cache-to: type=gha,mode=max`
- Para implementaciones: usar autenticación basada en OIDC (`permissions: id-token: write`) en lugar de secretos de larga duración donde el proveedor lo admita

Seguridad:
- Declarar `permissions` explícitos a nivel de flujo de trabajo (por defecto `read-all`) y elevar por trabajo solo según sea necesario
- Nunca interpolar `${{ github.event.*.body }}` o entrada no confiable directamente en pasos `run:` — usar variables de entorno
- Fijar acciones de terceros a un SHA de commit completo con un comentario de versión

Después del YAML del flujo de trabajo, generar:
1. Secretos y variables de repositorio requeridos (nombre + qué valor establecer)
2. Cualquier regla de protección de rama que debe configurarse para que este flujo de trabajo sea efectivo
3. Tiempo de ejecución estimado del trabajo y sugerencias para reducirlo si es superior a 5 minutos
