# Reglas de Docker

## Aplicar a
Todos los archivos `Dockerfile`, `docker-compose.yml`, `.dockerignore` y archivos de configuración relacionados con contenedores.

## Reglas

1. **Fijar versiones de imagen base — nunca usar `latest`** — `FROM node:20.14-alpine3.19` en lugar de `FROM node:latest`. Las imágenes sin versión rompen la reproducibilidad silenciosamente cuando la etiqueta ascendente se actualiza.

2. **Usar compilaciones de varias etapas para minimizar el tamaño de la imagen final** — compilar/instalar en una etapa de compilador, copiar solo los artefactos a la etapa en tiempo de ejecución. La imagen en tiempo de ejecución no debe contener compiladores, dependencias de desarrollo o cachés de compilación.

3. **Ejecutar como usuario no root** — agregar `RUN addgroup -S app && adduser -S app -G app` y `USER app` antes del `CMD` final. Root dentro del contenedor es root en el host si el aislamiento del contenedor se rompe.

4. **Un proceso por contenedor** — los contenedores no son máquinas virtuales. Si necesitas un contenedor secundario (transportista de registros, agente de métricas), usa un contenedor separado y una red compartida.

5. **Mantener capas mínimas y ordenadas por frecuencia de cambio** — copiar `package.json` e instalar dependencias antes de copiar el código fuente. Las capas estables se almacenan en caché; las capas volátiles invalidan todo lo que está debajo de ellas.

6. **Usar `.dockerignore`** — excluir `node_modules/`, `.git/`, `*.log`, accesorios de prueba y secretos. Sin él, `COPY . .` envía todo el contexto de compilación, ralentizando las compilaciones y arriesgando fugas de credenciales.

7. **Nunca incrustar secretos en imágenes** — no `ENV API_KEY=...`, no `RUN curl -H "Authorization: ..."`. Usa secretos de Docker, secretos en tiempo de compilación (`--secret`) o inyección de entorno en tiempo de ejecución.

8. **Establecer `WORKDIR` explícitamente** — siempre usar una ruta absoluta: `WORKDIR /app`. No ejecutes comandos desde `/` o rutas relativas.

9. **Usar `COPY` en lugar de `ADD`** — `ADD` tiene comportamiento sorprendente (extrae automáticamente archivos, obtiene URLs). Usa `COPY` para archivos locales. Usa `RUN curl` explícitamente cuando necesites archivos remotos.

10. **Especificar `HEALTHCHECK`** — define cómo el orquestador debe determinar la actividad: `HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:8080/health || exit 1`.

11. **Establecer límites de recursos en `docker-compose.yml`** — `mem_limit`, `cpus`. Los contenedores sin límites privan a los vecinos en hosts compartidos.

12. **Usar volúmenes nombrados, no montajes de unión, para datos persistentes en producción** — los montajes de unión acoplan el contenedor a la estructura de ruta del host. Los volúmenes nombrados son portátiles y gestionados por Docker.

13. **Etiquetar imágenes con el SHA de confirmación de git en CI, no solo un nombre de rama** — `myapp:abc1234` es inmutable. `myapp:main` no lo es. Las etiquetas de rama son alias útiles, no identificadores confiables.

14. **Escanear imágenes en busca de vulnerabilidades en CI** — `docker scout cves` o `trivy image`. Fallar la compilación en CVE críticas en la etapa final.

15. **Evitar `CMD` con forma de shell para manejo de señales** — `CMD ["node", "server.js"]` (forma ejecutable) recibe SIGTERM directamente. `CMD node server.js` (forma de shell) envía SIGTERM al shell, no al proceso.


---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
