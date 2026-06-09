# Docker-regels

## Van toepassing op
Alle `Dockerfile`, `docker-compose.yml`, `.dockerignore` en containerconfiguratiebestanden.

## Regels

1. **Pin base image versies — gebruik nooit `latest`** — `FROM node:20.14-alpine3.19` niet `FROM node:latest`. Onvaste images breken reproduceerbaarheid stil wanneer de upstream tag bijwerkt.

2. **Gebruik multi-stage builds om de uiteindelijke image-grootte te minimaliseren** — compileer/installeer in een builder-fase, kopieer alleen de artefacten naar de runtime-fase. De runtime image mag geen compilers, dev-afhankelijkheden of build-caches bevatten.

3. **Voer uit als een niet-root-gebruiker** — voeg `RUN addgroup -S app && adduser -S app -G app` en `USER app` toe vóór de uiteindelijke `CMD`. Root in de container is root op de host als container isolatie faalt.

4. **Één proces per container** — containers zijn geen VM's. Als je een sidecar nodig hebt (log shipper, metrics agent), gebruik dan een aparte container en een gedeeld netwerk.

5. **Hou lagen minimaal en geordend op wijzigingsfrequentie** — kopieer `package.json` en installeer afhankelijkheden vóór het kopiëren van de broncode. Stabiele lagen worden gecachet; vluchtige lagen maken alles eronder ongeldig.

6. **Gebruik `.dockerignore`** — sluit `node_modules/`, `.git/`, `*.log`, test fixtures en secrets uit. Zonder het stuurt `COPY . .` de gehele build-context, wat builds vertraagt en credentialleaks riskeert.

7. **Bak secrets nooit in images in** — geen `ENV API_KEY=...`, geen `RUN curl -H "Authorization: ..."`. Gebruik Docker secrets, build-time secrets (`--secret`) of runtime environment injectie.

8. **Stel `WORKDIR` expliciet in** — gebruik altijd een absoluut pad: `WORKDIR /app`. Voer geen commando's uit vanuit `/` of relatieve paden.

9. **Gebruik `COPY` in plaats van `ADD`** — `ADD` heeft verrassend gedrag (pakt archieven automatisch uit, haalt URL's op). Gebruik `COPY` voor lokale bestanden. Gebruik `RUN curl` expliciet wanneer je externe bestanden nodig hebt.

10. **Geef `HEALTHCHECK` op** — definieer hoe de orchestrator liveness moet bepalen: `HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:8080/health || exit 1`.

11. **Stel resourcelimieten in `docker-compose.yml` in** — `mem_limit`, `cpus`. Onbegrensde containers verhongeren buren op gedeelde hosts.

12. **Gebruik benoemde volumes, geen bind mounts, voor persistente gegevens in productie** — bind mounts koppelen de container aan de host-padstructuur. Benoemde volumes zijn draagbaar en worden beheerd door Docker.

13. **Tag images met de git commit SHA in CI, niet alleen een branch-naam** — `myapp:abc1234` is onveranderlijk. `myapp:main` is het niet. Branch-tags zijn handige aliassen, geen betrouwbare identificeertekens.

14. **Scan images op kwetsbaarheden in CI** — `docker scout cves` of `trivy image`. Maak de build ongeldig op kritieke CVE's in de uiteindelijke fase.

15. **Vermijd `CMD` met shell-vorm voor signaalafhandeling** — `CMD ["node", "server.js"]` (exec-vorm) ontvangt SIGTERM direct. `CMD node server.js` (shell-vorm) stuurt SIGTERM naar de shell, niet naar het proces.


---

> **Werk met ons samen:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
