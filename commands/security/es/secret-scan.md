---
description: Escanear el código fuente en busca de secretos, credenciales y valores sensibles confirmados o codificados
argument-hint: "[path or git-ref]"
---
Escanear `$ARGUMENTS` (predeterminado: repositorio completo incluyendo historial de git) en busca de secretos, credenciales y valores sensibles que no deben aparecer en el control de código fuente ni en artefactos implementados.

**Fase 1 — Escaneo de patrones (archivos de código fuente)**

Buscar en todos los archivos no binarios:
- Claves y tokens de API: patrones como `sk-`, `ghp_`, `xoxb-`, `AKIA`, `AIza`, UUIDs usados como secretos
- Claves privadas: encabezados PEM (`-----BEGIN * PRIVATE KEY-----`), bloques de claves privadas SSH
- Contraseñas: variables denominadas `password`, `passwd`, `pwd`, `secret`, `token`, `api_key` asignadas a literales de cadena
- Cadenas de conexión: DSN con credenciales incrustadas (`postgres://user:pass@host`)
- Secretos JWT: claves de firma codificadas
- Secretos OAuth: literales de `client_secret`
- Credenciales del proveedor de nube: tokens de cuenta de servicio de AWS, GCP, Azure, Terraform, Kubernetes
- URL de webhook con tokens incrustados (Slack, Discord, GitHub)
- Contenidos de archivo `.env` confirmados accidentalmente

**Fase 2 — Escaneo del historial de git** (si se encuentra dentro de un repositorio de git)

Ejecutar: `git log --all --full-history -- '*.env' '*.pem' '*.key' '*.p12' '*.pfx'`
Verificar commits recientes para secretos confirmados accidentalmente que pueden haber sido "eliminados" pero permanecen en el historial.

**Fase 3 — Archivos de configuración e infraestructura**

Examinar: `docker-compose.yml`, manifiestos de Kubernetes, valores de Helm, configs de CI/CD (`.github/`, `.circleci/`, `.travis.yml`, `Jenkinsfile`) para valores env codificados.

**Fase 4 — Clasificar cada hallazgo**

Para cada resultado:
- Ruta del archivo y número de línea
- Tipo de secreto (por ejemplo, clave de acceso de AWS, GitHub PAT)
- Si parece ser real o un marcador de posición/ejemplo (marcar como LIVE o EXAMPLE)
- Si aparece en el historial de git (marcar como HISTORY si es así)

**Formato de salida**:
```
## Resultados del escaneo de secretos

### Secretos LIVE (rotar inmediatamente)
[file:line] [type] — vista previa enmascarada: sk-...xxxx

### EXAMPLE / Marcador de posición (verificar)
[file:line] [type] — contexto: ...

### Filtraciones de historial
[commit] [file] [type] — nota: todavía accesible a través de git

### Remediación
1. Rotar todos los secretos LIVE antes de hacer cualquier otra cosa.
2. Usar git-filter-repo o BFG para purgar filtraciones del historial.
3. Añadir patrones detectados a .gitignore y pre-commit hooks.
```

Nunca imprimir el valor del secreto completo — siempre enmascarar a los últimos 4 caracteres.
