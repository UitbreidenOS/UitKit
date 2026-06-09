---
description: Generar un flujo de trabajo de GitHub Actions para CI, CD o tareas de automatización
argument-hint: "[workflow purpose: e.g. ci, deploy-aws, release, pr-checks]"
---
Generar un flujo de trabajo de GitHub Actions para: $ARGUMENTS

Inspecciona el proyecto para determinar el lenguaje/framework, comandos de prueba, comandos de compilación y destino de implementación. Personaliza el flujo de trabajo en consecuencia.

Genera un único archivo `.github/workflows/<slug>.yml`.

Requisitos:

Desencadenadores:
- Utiliza el conjunto mínimo de desencadenadores para el propósito indicado (p. ej., `push` + `pull_request` para CI; `release` para publicación; `workflow_dispatch` para operaciones manuales)
- Añade filtros de `paths` si el repositorio es un monorepo
- Fija `branches` a `main`/`master` a menos que se requiera una cobertura más amplia

Trabajos y pasos:
- Usa `actions/checkout@v4` — siempre fija las acciones a un SHA o etiqueta de versión principal, nunca a una rama
- Caché de dependencias apropiado para la pila (`actions/cache` o cachés integradas en acciones `setup-*`)
- Ejecuta lint, type-check y test como pasos separados con nombres claros
- Fallar rápido: `continue-on-error: false` en pasos críticos; establece `timeout-minutes` en cada trabajo
- Para compilaciones de Docker: usa `docker/build-push-action@v5` con `cache-from: type=gha` y `cache-to: type=gha,mode=max`
- Para implementaciones: usa autenticación basada en OIDC (`permissions: id-token: write`) en lugar de secretos de larga duración donde el proveedor lo admita

Seguridad:
- Declara `permissions` explícitos a nivel de flujo de trabajo (por defecto `read-all`) y eleva por trabajo según sea necesario
- Nunca interpoles `${{ github.event.*.body }}` o entrada no confiable directamente en pasos `run:` — utiliza variables de entorno
- Fija acciones de terceros a un SHA de commit completo con un comentario de versión

Después del YAML del flujo de trabajo, genera:
1. Secretos y variables de repositorio requeridos (nombre + qué valor establecer)
2. Cualquier regla de protección de rama que deba configurarse para que este flujo de trabajo sea efectivo
3. Tiempo de ejecución estimado del trabajo y sugerencias para reducirlo si supera los 5 minutos
