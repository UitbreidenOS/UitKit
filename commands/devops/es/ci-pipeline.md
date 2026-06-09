---
description: Generar una configuración de pipeline de CI para el proyecto actual
argument-hint: "[platform: github|gitlab|circleci|bitbucket] [optional: extra steps]"
---
Genera una configuración completa de pipeline de CI para la plataforma especificada en $ARGUMENTS. Si no se proporciona una plataforma, usa GitHub Actions por defecto. Si $ARGUMENTS incluye pasos adicionales (por ejemplo, `deploy`, `notify`, `sonar`), incluye esas etapas.

Pasos:
1. Detecta el lenguaje, runtime y framework de pruebas del proyecto inspeccionando manifiestos de paquetes y archivos de configuración.
2. Diseña un pipeline con estas etapas en orden:
   - **Lint** — ejecuta el linter del proyecto (ESLint, Flake8, golangci-lint, Clippy, etc.) y falla rápido ante errores.
   - **Test** — ejecuta la suite completa de pruebas con reporte de cobertura. Cachea dependencias entre ejecuciones.
   - **Build** — compila o empaqueta la aplicación. Produce un artefacto versionado.
   - **Security scan** — ejecuta un escaneo de vulnerabilidades de dependencias (npm audit, pip-audit, govulncheck, Trivy para imágenes, etc.).
   - **Docker build** — construye y sube la imagen a un registro (parametrizado vía secrets/variables de entorno). Etiqueta con el SHA del commit y nombre de rama.
   - **Deploy** (si se solicita en $ARGUMENTS) — añade una etapa de despliegue controlada en la rama objetivo (por ejemplo, `main`).
3. Aplica mejores prácticas específicas de la plataforma:
   - GitHub Actions: usa `actions/cache`, estrategia matrix para pruebas de múltiples versiones si aplica, autenticación en la nube basada en OIDC en lugar de credenciales de larga duración.
   - GitLab CI: usa `cache`, `artifacts`, `rules` en lugar de `only/except`, OIDC donde sea soportado.
   - CircleCI: usa orbs para Docker y configuración de lenguaje.
   - Bitbucket: usa `caches`, `artifacts` y contenedores de servicio de Bitbucket Pipelines.
4. Parametriza todas las URLs de registro, nombres de imagen y objetivos de despliegue como variables de entorno o secretos de CI — nunca los codifiques.
5. Añade un disparador `pull_request` (o equivalente) que ejecute lint, test y security scan pero omita push y despliegue.
6. Después de la configuración, lista todos los secretos/variables que deben configurarse en los parámetros de la plataforma de CI.
