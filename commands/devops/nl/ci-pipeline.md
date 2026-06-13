---
description: Genereer een CI pijplijn configuratie voor het huidige project
argument-hint: "[platform: github|gitlab|circleci|bitbucket] [optioneel: extra stappen]"
---
Genereer een volledige CI pijplijn configuratie voor het opgegeven platform in $ARGUMENTS. Indien geen platform is gegeven, standaard ingesteld op GitHub Actions. Indien $ARGUMENTS extra stappen bevat (bijv. `deploy`, `notify`, `sonar`), voeg deze fasen toe.

Stappen:
1. Detecteer de programmeertaal, runtime en test framework van het project door het inspecteren van pakketmanifesten en configuratiebestanden.
2. Ontwerp een pijplijn met deze fasen in volgorde:
   - **Lint** — voer de linter van het project uit (ESLint, Flake8, golangci-lint, Clippy, enz.) en fail fast bij fouten.
   - **Test** — voer het volledige testsuite uit met coverage reporting. Cache afhankelijkheden tussen uitvoeringen.
   - **Build** — compileer of bundel de applicatie. Produceer een versiebeheerd artefact.
   - **Security scan** — voer een afhankelijkheidskwetsbaarheid scan uit (npm audit, pip-audit, govulncheck, Trivy voor images, enz.).
   - **Docker build** — bouw en push de image naar een registry (geparameteriseerd via secrets/env vars). Tag met de commit SHA en branchnaam.
   - **Deploy** (indien aangevraagd in $ARGUMENTS) — voeg een deploy fase toe gebaseerd op de doelbranch (bijv. `main`).
3. Pas platform-specifieke best practices toe:
   - GitHub Actions: gebruik `actions/cache`, matrix strategie voor multi-versie testen indien van toepassing, OIDC-gebaseerde cloud authenticatie in plaats van langdurige inloggegevens.
   - GitLab CI: gebruik `cache`, `artifacts`, `rules` in plaats van `only/except`, OIDC waar ondersteund.
   - CircleCI: gebruik orbs voor Docker en programmeertaal setup.
   - Bitbucket: gebruik `caches`, `artifacts`, en Bitbucket Pipelines service containers.
4. Parametriseer alle registry URL's, imagenamen en deploy doelen als omgevingsvariabelen of CI secrets — hardcodeer deze nooit.
5. Voeg een `pull_request` (of equivalent) trigger toe die lint, test en security scan uitvoert, maar push en deploy overslaat.
6. Na de configuratie, vermeld alle secrets/variabelen die moeten worden ingesteld in de instellingen van het CI platform.
