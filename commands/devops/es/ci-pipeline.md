---
description: Generar una configuración de pipeline de CI para el proyecto actual
argument-hint: "[plataforma: github|gitlab|circleci|bitbucket] [opcional: pasos adicionales]"
---
Generar una configuración completa de pipeline de CI para la plataforma especificada en $ARGUMENTS. Si no se proporciona plataforma, usar GitHub Actions por defecto. Si $ARGUMENTS incluye pasos adicionales (por ejemplo, `deploy`, `notify`, `sonar`), incluir esas etapas.

Pasos:
1. Detectar el lenguaje del proyecto, el runtime y el framework de pruebas inspeccionando manifiestos de paquetes y archivos de configuración.
2. Diseñar un pipeline con estas etapas en orden:
   - **Lint** — ejecutar el linter del proyecto (ESLint, Flake8, golangci-lint, Clippy, etc.) y fallar rápidamente ante errores.
   - **Test** — ejecutar la suite completa de pruebas con reportes de cobertura. Cachear dependencias entre ejecuciones.
   - **Build** — compilar o empaquetar la aplicación. Producir un artefacto versionado.
   - **Security scan** — ejecutar un escaneo de vulnerabilidades en dependencias (npm audit, pip-audit, govulncheck, Trivy para imágenes, etc.).
   - **Docker build** — construir y empujar la imagen a un registro (parametrizado vía secretos/variables de entorno). Etiquetar con el SHA del commit y el nombre de la rama.
   - **Deploy** (si se solicita en $ARGUMENTS) — agregar una etapa de deploy controlada por la rama objetivo (por ejemplo, `main`).
3. Aplicar mejores prácticas específicas de plataforma:
   - GitHub Actions: usar `actions/cache`, estrategia de matriz para pruebas multi-versión si aplica, autenticación en la nube basada en OIDC en lugar de credenciales de larga duración.
   - GitLab CI: usar `cache`, `artifacts`, `rules` en lugar de `only/except`, OIDC donde sea soportado.
   - CircleCI: usar orbs para Docker y configuración de lenguaje.
   - Bitbucket: usar `caches`, `artifacts` y contenedores de servicios de Bitbucket Pipelines.
4. Parametrizar todas las URLs de registro, nombres de imagen y objetivos de deploy como variables de entorno o secretos de CI — nunca codificar manualmente.
5. Agregar un disparador `pull_request` (o equivalente) que ejecute lint, test y security scan pero omita push y deploy.
6. Después de la configuración, listar todos los secretos/variables que deben configurarse en los ajustes de la plataforma de CI.
