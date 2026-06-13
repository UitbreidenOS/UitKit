---
description: Auditar el uso de variables de entorno en toda la base de código para detectar problemas de seguridad e higiene
argument-hint: "[ruta o patrón glob de archivo a escanear]"
---
Auditar el uso de variables de entorno en: $ARGUMENTS (por defecto: proyecto completo)

Escanear todos los archivos de código fuente, archivos de configuración, Dockerfiles, archivos de compose, definiciones de CI/CD y manifiestos de implementación.

Reportar hallazgos en estas categorías:

**1. Secretos en riesgo**
- Credenciales codificadas, tokens, claves API o contraseñas en cualquier archivo rastreado por git
- Archivos `.env` que no están en gitignore
- Secretos interpolados directamente en pasos `run:` de shell en CI (riesgo de inyección)
- Instrucciones Docker `ARG`/`ENV` que incrustan secretos en capas de imagen

**2. Variables faltantes**
- Variables referenciadas en código (process.env.X, os.environ["X"], os.Getenv("X"), etc.) que no tienen entrada correspondiente en `.env.example`, `docker-compose.yml`, Kubernetes Secret/ConfigMap, o valores por defecto documentados
- Variables requeridas sin alternativa que causarían pánico/caída en tiempo de ejecución si no están configuradas

**3. Variables sin usar**
- Variables declaradas en `.env`, `.env.example`, Compose o manifiestos que nunca se leen en el código

**4. Inconsistencias**
- Nombres de variables que difieren entre entornos (por ejemplo, `DATABASE_URL` en compose vs `DB_URL` en k8s)
- Variables con valores por defecto en un entorno pero requeridas en otro
- Declaraciones duplicadas en múltiples archivos con valores potencialmente diferentes

**5. Higiene**
- Nomenclatura no estándar (debe ser `SCREAMING_SNAKE_CASE`)
- Variables que contienen datos sensibles pero no están marcadas como `sensitive` en Terraform o `type: kubernetes.io/Opaque` en Secrets de k8s
- Archivos `.env` confirmados con valores reales

Formato de salida:
- Agrupar hallazgos por categoría anterior
- Para cada hallazgo: ruta de archivo + número de línea, severidad (`critical` / `warning` / `info`), y remediación en una línea
- Finalizar con un resumen de conteo por severidad y una lista de correcciones priorizada (elementos críticos primero)

No imprimir contenido de archivos de manera textual — citar ubicaciones y citar solo la línea relevante.
