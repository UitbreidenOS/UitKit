---
description: Generate a production-ready docker-compose.yml for the current project
argument-hint: "[service-name or stack description]"
---
Generate a production-ready `docker-compose.yml` for: $ARGUMENTS

Inspect the current working directory — read any existing Dockerfiles, package.json, pyproject.toml, go.mod, or similar manifests to infer the stack.

Requirements:
- Use named volumes, not bind mounts, for persistent data
- Set `restart: unless-stopped` on all long-running services
- Inject secrets via environment variables referencing a `.env` file — never hardcode credentials
- Include a `healthcheck` block for every service that exposes a port
- Define a dedicated bridge network; do not use the default network
- Pin image tags — never use `:latest`
- Add a `depends_on` with `condition: service_healthy` for services with startup dependencies
- Separate `dev` and `prod` profiles where applicable using the `profiles` key
- For databases: set explicit `POSTGRES_DB` / `MYSQL_DATABASE` / etc. and expose ports only to localhost (`127.0.0.1:<port>:<port>`)

Output:
1. The full `docker-compose.yml`
2. A `docker-compose.override.yml` with source-mount and debug-port overrides for local dev
3. A `.env.example` listing every required variable with no real values

After the files, list:
- Every environment variable the operator must supply
- Any volumes that need pre-population or init scripts
- Commands to bring the stack up and verify health:
  ```
  docker compose up -d
  docker compose ps
  docker compose logs --tail=50 <service>
  ```

If the stack has a reverse proxy (nginx/traefik/caddy), include it with TLS termination config structurally correct but commented out.

Do not generate a Dockerfile unless explicitly asked — compose only.
