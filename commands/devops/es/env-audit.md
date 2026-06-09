---
description: Audita el uso de variables de entorno en todo el código base para identificar problemas de seguridad e higiene
argument-hint: "[path or file glob to scan]"
---
Audita el uso de variables de entorno en: $ARGUMENTS (por defecto: todo el proyecto)

Escanea todos los archivos de código fuente, archivos de configuración, Dockerfiles, archivos de composición, definiciones de CI/CD y manifiestos de implementación.

Reporta los hallazgos en estas categorías:

**1. Secretos en riesgo**
- Credenciales codificadas, tokens, claves API o contraseñas en cualquier archivo rastreado por git
- Archivos `.env` que no están en gitignore
- Secretos interpolados directamente en pasos `run:` de shell en CI (riesgo de inyección)
- Instrucciones Docker `ARG`/`ENV` que incrustan secretos en capas de imagen

**2. Variables faltantes**
- Variables referenciadas en código (process.env.X, os.environ["X"], os.Getenv("X"), etc.) que no tienen una entrada correspondiente en `.env.example`, `docker-compose.yml`, Kubernetes Secret/ConfigMap o valores predeterminados documentados
- Variables requeridas sin alternativa que causarían pánico en tiempo de ejecución/bloqueo si no están configuradas

**3. Variables no utilizadas**
- Variables declaradas en `.env`, `.env.example`, Compose o manifiestos que nunca se leen en el código

**4. Inconsistencias**
- Nombres de variables que difieren entre entornos (por ejemplo, `DATABASE_URL` en compose vs `DB_URL` en k8s)
- Variables con valores predeterminados en un entorno pero requeridas en otro
- Declaraciones duplicadas en múltiples archivos con valores potencialmente diferentes

**5. Higiene**
- Nombres no estándar (deben ser `SCREAMING_SNAKE_CASE`)
- Variables que contienen datos sensibles pero no están marcadas como `sensitive` en Terraform o `type: kubernetes.io/Opaque` en Kubernetes Secrets
- Archivos `.env` confirmados con valores reales

Formato de salida:
- Agrupa hallazgos por categoría anterior
- Para cada hallazgo: ruta del archivo + número de línea, severidad (`critical` / `warning` / `info`) y una línea de remediación
- Finaliza con un resumen de conteos por severidad y una lista priorizada de correcciones (primero los elementos críticos)

No imprimas el contenido del archivo literalmente — cita ubicaciones y cita solo la línea relevante.
