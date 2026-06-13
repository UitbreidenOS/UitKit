---
description: Escanea la base de código en busca de secretos, credenciales y valores sensibles confirmados o codificados
argument-hint: "[ruta o ref-git]"
---
Escanea `$ARGUMENTS` (por defecto: repositorio completo incluyendo historial de git) en busca de secretos, credenciales y valores sensibles que no deben aparecer en el control de código fuente ni en artefactos desplegados.

**Fase 1 — Escaneo de patrones (archivos de código)**

Busca en todos los archivos no binarios:
- Claves y tokens de API: patrones como `sk-`, `ghp_`, `xoxb-`, `AKIA`, `AIza`, UUIDs usados como secretos
- Claves privadas: encabezados PEM (`-----BEGIN * PRIVATE KEY-----`), bloques de claves privadas SSH
- Contraseñas: variables nombradas `password`, `passwd`, `pwd`, `secret`, `token`, `api_key` asignadas a literales de cadena
- Cadenas de conexión: DSNs con credenciales incrustadas (`postgres://usuario:contraseña@host`)
- Secretos JWT: claves de firma codificadas
- Secretos OAuth: literales `client_secret`
- Credenciales de proveedores en la nube: tokens de cuentas de servicio de AWS, GCP, Azure, Terraform, Kubernetes
- URLs de webhook con tokens incrustados (Slack, Discord, GitHub)
- Contenido de archivos `.env` confirmado accidentalmente

**Fase 2 — Escaneo de historial de git** (si está dentro de un repositorio git)

Ejecuta: `git log --all --full-history -- '*.env' '*.pem' '*.key' '*.p12' '*.pfx'`
Verifica confirmaciones recientes en busca de confirmaciones secretas accidentales que pueden haber sido "eliminadas" pero permanecen en el historial.

**Fase 3 — Archivos de configuración e infraestructura**

Examina: `docker-compose.yml`, manifiestos de Kubernetes, valores de Helm, configuraciones de CI/CD (`.github/`, `.circleci/`, `.travis.yml`, `Jenkinsfile`) para valores de entorno codificados.

**Fase 4 — Triage de cada hallazgo**

Para cada resultado:
- Ruta del archivo y número de línea
- Tipo de secreto (ej: Clave de Acceso AWS, GitHub PAT)
- Si parece ser real o un marcador de posición/ejemplo (marcar como LIVE o EXAMPLE)
- Si aparece en el historial de git (marcar como HISTORY si es así)

**Formato de salida**:
```
## Resultados de Escaneo de Secretos

### Secretos LIVE (rotar inmediatamente)
[archivo:línea] [tipo] — vista previa enmascarada: sk-...xxxx

### EXAMPLE / Marcador de posición (verificar)
[archivo:línea] [tipo] — contexto: ...

### Fugas de Historial
[commit] [archivo] [tipo] — nota: todavía accesible vía git

### Remediación
1. Rota todos los secretos LIVE antes de hacer otra cosa.
2. Usa git-filter-repo o BFG para purgar fugas de historial.
3. Añade los patrones detectados a .gitignore y pre-commit hooks.
```

Nunca imprimas el valor completo del secreto — siempre enmascara a los últimos 4 caracteres.
