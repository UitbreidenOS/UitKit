# Docker Rules

## Apply to
All `Dockerfile`, `docker-compose.yml`, `.dockerignore`, and container-related configuration files.

## Rules

1. **Pin base image versions — never use `latest`** — `FROM node:20.14-alpine3.19` not `FROM node:latest`. Unpinned images break reproducibility silently when the upstream tag updates.

2. **Use multi-stage builds to minimize final image size** — compile/install in a builder stage, copy only the artifacts to the runtime stage. The runtime image should not contain compilers, dev dependencies, or build caches.

3. **Run as a non-root user** — add `RUN addgroup -S app && adduser -S app -G app` and `USER app` before the final `CMD`. Root inside the container is root on the host if container isolation breaks.

4. **One process per container** — containers are not VMs. If you need a sidecar (log shipper, metrics agent), use a separate container and a shared network.

5. **Keep layers minimal and ordered by change frequency** — copy `package.json` and install dependencies before copying source code. Stable layers are cached; volatile layers invalidate everything below them.

6. **Use `.dockerignore`** — exclude `node_modules/`, `.git/`, `*.log`, test fixtures, and secrets. Without it, `COPY . .` sends the entire build context, slowing builds and risking credential leaks.

7. **Never bake secrets into images** — no `ENV API_KEY=...`, no `RUN curl -H "Authorization: ..."`. Use Docker secrets, build-time secrets (`--secret`), or runtime environment injection.

8. **Set `WORKDIR` explicitly** — always use an absolute path: `WORKDIR /app`. Don't run commands from `/` or relative paths.

9. **Use `COPY` over `ADD`** — `ADD` has surprising behavior (auto-extracts archives, fetches URLs). Use `COPY` for local files. Use `RUN curl` explicitly when you need remote files.

10. **Specify `HEALTHCHECK`** — define how the orchestrator should determine liveness: `HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:8080/health || exit 1`.

11. **Set resource limits in `docker-compose.yml`** — `mem_limit`, `cpus`. Unbounded containers starve neighbors on shared hosts.

12. **Use named volumes, not bind mounts, for persistent data in production** — bind mounts couple the container to host path structure. Named volumes are portable and managed by Docker.

13. **Tag images with the git commit SHA in CI, not just a branch name** — `myapp:abc1234` is immutable. `myapp:main` is not. Branch tags are useful aliases, not reliable identifiers.

14. **Scan images for vulnerabilities in CI** — `docker scout cves` or `trivy image`. Fail the build on critical CVEs in the final stage.

15. **Avoid `CMD` with shell form for signal handling** — `CMD ["node", "server.js"]` (exec form) receives SIGTERM directly. `CMD node server.js` (shell form) sends SIGTERM to the shell, not the process.


---
