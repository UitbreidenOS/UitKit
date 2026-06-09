---
description: Genereer een CI-pipelineconfiguratie voor het huidige project
argument-hint: "[platform: github|gitlab|circleci|bitbucket] [optional: extra steps]"
---
Genereer een volledige CI-pipelineconfiguratie voor het platform opgegeven in $ARGUMENTS. Als geen platform is opgegeven, standaard naar GitHub Actions. Als $ARGUMENTS extra stappen bevat (bijv. `deploy`, `notify`, `sonar`), voeg die fasen toe.

Stappen:
1. Detecteer de taal, runtime en testframework van het project door pakketmanifesten en configuratiebestanden te inspecteren.
2. Ontwerp een pipeline met deze fasen in volgorde:
   - **Lint** — voer de linter van het project uit (ESLint, Flake8, golangci-lint, Clippy, enz.) en fail snel bij fouten.
   - **Test** — voer de volledige testsuite uit met coveragerapportage. Cache afhankelijkheden tussen uitvoeringen.
   - **Build** — compileer of bundel de toepassing. Produceer een geversieerd artefact.
   - **Security scan** — voer een scan voor beveiligingskwetsbaarheden van afhankelijkheden uit (npm audit, pip-audit, govulncheck, Trivy voor afbeeldingen, enz.).
   - **Docker build** — bouw en push het afbeeldingsbestand naar een register (geparametreerd via secrets/omgevingsvariabelen). Tag met de commit SHA en branchnaam.
   - **Deploy** (indien aangevraagd in $ARGUMENTS) — voeg een deployfase toe beperkt tot de doelbranch (bijv. `main`).
3. Pas platformspecifieke aanbevolen procedures toe:
   - GitHub Actions: gebruik `actions/cache`, matrixstrategie voor multi-versietests indien van toepassing, OIDC-gebaseerde cloud-verificatie in plaats van langdurige referenties.
   - GitLab CI: gebruik `cache`, `artifacts`, `rules` in plaats van `only/except`, OIDC waar ondersteund.
   - CircleCI: gebruik orbs voor Docker en taalsetup.
   - Bitbucket: gebruik `caches`, `artifacts` en Bitbucket Pipelines-servicecontainers.
4. Parametriseer alle registerURL's, afbeeldingsnamen en deploydoelen als omgevingsvariabelen of CI-secrets — code ze nooit hard.
5. Voeg een `pull_request`-trigger (of equivalent) toe die lint, test en beveiligingsscan uitvoert maar push en deploy overslaat.
6. Voeg na de config een lijst toe met alle secrets/variabelen die in de CI-platforminstellingen moeten worden geconfigureerd.
