# Docker-Regeln

## Anwendbar auf
Alle `Dockerfile`, `docker-compose.yml`, `.dockerignore` und containerbezogene Konfigurationsdateien.

## Regeln

1. **Basis-Image-Versionen pinnen — niemals `latest` verwenden** — `FROM node:20.14-alpine3.19` statt `FROM node:latest`. Ungepinnte Images unterbrechen die Reproduzierbarkeit stumm, wenn der Upstream-Tag aktualisiert wird.

2. **Multi-Stage-Builds verwenden, um die endgültige Image-Größe zu minimieren** — kompilieren/installieren in einer Builder-Phase, nur die Artefakte in die Runtime-Phase kopieren. Das Runtime-Image sollte keine Compiler, Dev-Abhängigkeiten oder Build-Caches enthalten.

3. **Als Nicht-Root-Benutzer ausführen** — `RUN addgroup -S app && adduser -S app -G app` hinzufügen und `USER app` vor dem finalen `CMD`. Root im Container ist Root auf dem Host, wenn Container-Isolation zusammenbricht.

4. **Ein Prozess pro Container** — Container sind keine VMs. Wenn Sie einen Sidecar benötigen (Log-Versender, Metrics-Agent), verwenden Sie einen separaten Container und ein gemeinsames Netzwerk.

5. **Schichten minimal und nach Änderungshäufigkeit geordnet halten** — `package.json` kopieren und Abhängigkeiten installieren, bevor Sie den Quellcode kopieren. Stabile Schichten werden zwischengespeichert; volatile Schichten invalidieren alles darunter.

6. **`.dockerignore` verwenden** — `node_modules/`, `.git/`, `*.log`, Test-Fixtures und Secrets ausschließen. Ohne dies sendet `COPY . .` den gesamten Build-Kontext, verlangsamt Builds und riskiert Credential-Lecks.

7. **Secrets niemals in Images backen** — keine `ENV API_KEY=...`, keine `RUN curl -H "Authorization: ..."`. Verwenden Sie Docker Secrets, Build-Zeit-Secrets (`--secret`) oder Runtime-Umgebungs-Injektion.

8. **`WORKDIR` explizit setzen** — immer einen absoluten Pfad verwenden: `WORKDIR /app`. Führen Sie keine Befehle von `/` oder relativen Pfaden aus.

9. **`COPY` über `ADD` verwenden** — `ADD` hat überraschendes Verhalten (extrahiert Archive automatisch, ruft URLs ab). Verwenden Sie `COPY` für lokale Dateien. Verwenden Sie `RUN curl` explizit, wenn Sie Remote-Dateien benötigen.

10. **`HEALTHCHECK` angeben** — definieren Sie, wie der Orchestrator die Liveness bestimmen sollte: `HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:8080/health || exit 1`.

11. **Ressourcenlimits in `docker-compose.yml` setzen** — `mem_limit`, `cpus`. Unbegrenzte Container unterbrechen Nachbarn auf gemeinsamen Hosts.

12. **Benannte Volumes verwenden, nicht Bind Mounts, für persistent Daten in der Produktion** — Bind Mounts koppeln den Container an die Host-Pfadstruktur. Benannte Volumes sind tragbar und werden von Docker verwaltet.

13. **Images mit dem Git-Commit-SHA in CI taggen, nicht nur mit einem Branch-Namen** — `myapp:abc1234` ist unveränderlich. `myapp:main` ist es nicht. Branch-Tags sind nützliche Aliase, keine zuverlässigen Bezeichner.

14. **Images in CI auf Sicherheitslücken scannen** — `docker scout cves` oder `trivy image`. Bauen Sie beim kritischen CVEs in der letzten Phase fehl.

15. **`CMD` mit Shell-Form für Signalbehandlung vermeiden** — `CMD ["node", "server.js"]` (Exec-Form) empfängt SIGTERM direkt. `CMD node server.js` (Shell-Form) sendet SIGTERM zur Shell, nicht zum Prozess.


---
