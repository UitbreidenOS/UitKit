---
description: Generieren Sie einen GitHub Actions-Workflow für CI-, CD- oder Automatisierungsaufgaben
argument-hint: "[workflow purpose: e.g. ci, deploy-aws, release, pr-checks]"
---
Generieren Sie einen GitHub Actions-Workflow für: $ARGUMENTS

Inspizieren Sie das Projekt, um die Sprache/das Framework, Testbefehle, Build-Befehle und das Bereitstellungsziel zu ermitteln. Passen Sie den Workflow entsprechend an.

Geben Sie eine einzelne `.github/workflows/<slug>.yml`-Datei aus.

Anforderungen:

Auslöser:
- Verwenden Sie den minimalen Auslösersatz für den angegebenen Zweck (z. B. `push` + `pull_request` für CI; `release` für Veröffentlichung; `workflow_dispatch` für manuelle Ops)
- Fügen Sie `paths`-Filter hinzu, wenn das Repository ein Monorepo ist
- Pin `branches` zu `main`/`master`, sofern keine umfassendere Abdeckung erforderlich ist

Jobs und Schritte:
- Verwenden Sie `actions/checkout@v4` — pinnen Sie Aktionen immer auf einen SHA oder Major-Version-Tag, niemals auf einen Branch
- Cache-Abhängigkeiten, die dem Stack entsprechen (`actions/cache` oder integrierte Caches in `setup-*`-Aktionen)
- Führen Sie Lint, Type-Check und Tests in separaten Schritten mit klaren Namen aus
- Schnell fehlschlagen: `continue-on-error: false` bei kritischen Schritten; setzen Sie `timeout-minutes` für jeden Job
- Für Docker-Builds: verwenden Sie `docker/build-push-action@v5` mit `cache-from: type=gha` und `cache-to: type=gha,mode=max`
- Für Bereitstellungen: verwenden Sie OIDC-basierte Authentifizierung (`permissions: id-token: write`) anstelle von langleibestehenden Secrets, sofern der Provider dies unterstützt

Sicherheit:
- Deklarieren Sie explizite `permissions` auf Workflow-Ebene (Standard auf `read-all`) und erhöhen Sie diese nur nach Bedarf pro Job
- Interpolieren Sie nie `${{ github.event.*.body }}` oder nicht vertrauenswürdige Eingaben direkt in `run:`-Schritte — verwenden Sie Umgebungsvariablen
- Pinnen Sie Third-Party-Aktionen auf einen vollständigen Commit-SHA mit einem Versions-Kommentar

Nach der Workflow-YAML geben Sie aus:
1. Erforderliche Repository-Secrets und Variablen (Name + was als Wert festgelegt werden soll)
2. Alle Branch-Schutzregeln, die konfiguriert werden müssen, damit dieser Workflow wirksam ist
3. Geschätzte Job-Laufzeit und Vorschläge zu ihrer Verkürzung, falls sie über 5 Minuten liegt
