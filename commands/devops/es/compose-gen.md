---
description: Generar un docker-compose.yml listo para producción para el proyecto actual
argument-hint: "[service-name or stack description]"
---
Generar un `docker-compose.yml` listo para producción para: $ARGUMENTS

Inspeccionar el directorio de trabajo actual — leer cualquier Dockerfile existente, package.json, pyproject.toml, go.mod, o manifiestos similares para inferir el stack.

Requisitos:
- Usar volúmenes nombrados, no bind mounts, para datos persistentes
- Establecer `restart: unless-stopped` en todos los servicios de larga duración
- Inyectar secretos a través de variables de entorno que hacen referencia a un archivo `.env` — nunca hardcodear credenciales
- Incluir un bloque `healthcheck` para cada servicio que expone un puerto
- Definir una red bridge dedicada; no usar la red por defecto
- Fijar etiquetas de imagen — nunca usar `:latest`
- Agregar un `depends_on` con `condition: service_healthy` para servicios con dependencias de inicio
- Separar perfiles `dev` y `prod` cuando sea aplicable usando la clave `profiles`
- Para bases de datos: establecer variables explícitas como `POSTGRES_DB` / `MYSQL_DATABASE` / etc. y exponer puertos solo a localhost (`127.0.0.1:<port>:<port>`)

Salida:
1. El `docker-compose.yml` completo
2. Un `docker-compose.override.yml` con source-mount y overrides de puertos de debug para desarrollo local
3. Un `.env.example` listando cada variable requerida sin valores reales

Después de los archivos, listar:
- Cada variable de entorno que el operador debe proporcionar
- Cualquier volumen que necesite pre-población o scripts de inicialización
- Comandos para iniciar el stack y verificar la salud:
  ```
  docker compose up -d
  docker compose ps
  docker compose logs --tail=50 <service>
  ```

Si el stack tiene un reverse proxy (nginx/traefik/caddy), incluirlo con configuración de terminación TLS estructuralmente correcta pero comentada.

No generar un Dockerfile a menos que se solicite explícitamente — solo compose.
