---
description: Genereer een GitHub Actions-workflow voor CI, CD of automatiseringstaken
argument-hint: "[workflow purpose: e.g. ci, deploy-aws, release, pr-checks]"
---
Genereer een GitHub Actions-workflow voor: $ARGUMENTS

Inspecteer het project om de taal/framework, testcommando's, buildcommando's en implementatiedoel te bepalen. Pas de workflow daarop aan.

Output een enkel `.github/workflows/<slug>.yml` bestand.

Vereisten:

Triggers:
- Gebruik de minimale triggerset voor het aangegeven doel (bijv. `push` + `pull_request` voor CI; `release` voor publiceren; `workflow_dispatch` voor handmatige operaties)
- Voeg `paths`-filters toe als de repository een monorepo is
- Zet `branches` op `main`/`master` tenzij bredere dekking nodig is

Jobs en stappen:
- Gebruik `actions/checkout@v4` — zet actions altijd vast op een SHA of major versietag, nooit op een branch
- Cache afhankelijkheden passend bij de stack (`actions/cache` of ingebouwde caches in `setup-*` actions)
- Voer lint, type-check en test uit als aparte stappen met duidelijke namen
- Faal snel: `continue-on-error: false` op kritieke stappen; stel een `timeout-minutes` in voor elke job
- Voor Docker-builds: gebruik `docker/build-push-action@v5` met `cache-from: type=gha` en `cache-to: type=gha,mode=max`
- Voor implementaties: gebruik op OIDC gebaseerde authenticatie (`permissions: id-token: write`) in plaats van langdurige secrets waar de provider dit ondersteunt

Beveiliging:
- Declareer expliciete `permissions` op workflowniveau (standaard op `read-all`) en verhoog per job alleen indien nodig
- Interpoleer `${{ github.event.*.body }}` of onbetrouwbare invoer nooit rechtstreeks in `run:` stappen — gebruik omgevingsvariabelen
- Zet third-party actions vast op een volledige commit SHA met een versiecommentaar

Na de workflow YAML, output:
1. Vereiste repository-secrets en -variabelen (naam + waarde om in te stellen)
2. Alle branch-beschermingsregels die voor deze workflow moeten worden geconfigureerd om effectief te zijn
3. Geschatte jobruntimezeit en suggesties om deze te verminderen als deze langer dan 5 minuten is
