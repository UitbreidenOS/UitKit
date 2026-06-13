---
description: GitHub Actions Workflow für CI, CD oder Automatisierungsaufgaben generieren
argument-hint: "[Workflow-Zweck: z.B. ci, deploy-aws, release, pr-checks]"
---
Generiere einen GitHub Actions Workflow für: $ARGUMENTS

Inspiziere das Projekt, um die Programmiersprache/das Framework, Test-Befehle, Build-Befehle und das Deployment-Ziel zu bestimmen. Passe den Workflow entsprechend an.

Gib eine einzelne `.github/workflows/<slug>.yml` Datei aus.

Anforderungen:

Trigger:
- Verwende die minimale Trigger-Menge für den angegebenen Zweck (z.B. `push` + `pull_request` für CI; `release` für Veröffentlichung; `workflow_dispatch` für manuelle Operationen)
- Füge `paths` Filter hinzu, falls das Repository ein Monorepo ist
- Fixiere `branches` auf `main`/`master`, es sei denn, eine breitere Abdeckung ist erforderlich

Jobs und Steps:
- Verwende `actions/checkout@v4` — fixiere Actions immer auf einen SHA oder Major-Version-Tag, niemals auf einen Branch
- Cache Abhängigkeiten passend zum Stack (`actions/cache` oder integrierte Caches in `setup-*` Actions)
- Führe Linting, Type-Checking und Tests als separate Steps mit klaren Namen aus
- Schnelles Fehlschlagen: `continue-on-error: false` bei kritischen Steps; setze `timeout-minutes` bei jedem Job
- Für Docker-Builds: verwende `docker/build-push-action@v5` mit `cache-from: type=gha` und `cache-to: type=gha,mode=max`
- Für Deployments: verwende OIDC-basierte Authentifizierung (`permissions: id-token: write`) statt langlebiger Secrets, wenn der Provider dies unterstützt

Sicherheit:
- Erkläre explizit `permissions` auf Workflow-Ebene (standardmäßig auf `read-all`) und erhöhe pro Job nur nach Bedarf
- Interpoliere niemals `${{ github.event.*.body }}` oder nicht vertrauenswürdige Eingaben direkt in `run:` Steps — verwende Umgebungsvariablen
- Fixiere Third-Party-Actions auf einen vollständigen Commit-SHA mit Versions-Kommentar

Nach dem Workflow YAML gib Folgendes aus:
1. Erforderliche Repository-Secrets und Variablen (Name + welcher Wert zu setzen ist)
2. Alle Branch-Schutzregeln, die für die Wirksamkeit dieses Workflows konfiguriert werden müssen
3. Geschätzte Job-Laufzeit und Vorschläge, um sie zu reduzieren, falls länger als 5 Minuten
