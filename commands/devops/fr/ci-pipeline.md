---
description: Générer une configuration de pipeline CI pour le projet actuel
argument-hint: "[platform: github|gitlab|circleci|bitbucket] [optional: extra steps]"
---
Générer une configuration de pipeline CI complète pour la plateforme spécifiée dans $ARGUMENTS. Si aucune plateforme n'est donnée, utiliser GitHub Actions par défaut. Si $ARGUMENTS inclut des étapes supplémentaires (par exemple, `deploy`, `notify`, `sonar`), inclure ces étapes.

Étapes :
1. Détecter le langage du projet, le runtime et le framework de test en inspectant les manifestes de paquet et les fichiers de configuration.
2. Concevoir un pipeline avec ces étapes dans cet ordre :
   - **Lint** — exécuter le linter du projet (ESLint, Flake8, golangci-lint, Clippy, etc.) et échouer rapidement en cas d'erreurs.
   - **Test** — exécuter la suite de tests complète avec rapport de couverture. Mettre en cache les dépendances entre les exécutions.
   - **Build** — compiler ou assembler l'application. Produire un artefact versionnée.
   - **Security scan** — exécuter une analyse de vulnérabilité des dépendances (npm audit, pip-audit, govulncheck, Trivy pour les images, etc.).
   - **Docker build** — construire et envoyer l'image vers un registre (paramétré via secrets/variables d'environnement). Étiqueter avec le SHA du commit et le nom de la branche.
   - **Deploy** (si demandé dans $ARGUMENTS) — ajouter une étape de déploiement contrôlée sur la branche cible (par exemple, `main`).
3. Appliquer les meilleures pratiques spécifiques à la plateforme :
   - GitHub Actions : utiliser `actions/cache`, stratégie matrix pour les tests multi-version si applicable, authentification cloud basée sur OIDC plutôt que des identifiants de longue durée.
   - GitLab CI : utiliser `cache`, `artifacts`, `rules` au lieu de `only/except`, OIDC où supporté.
   - CircleCI : utiliser les orbes pour Docker et la configuration du langage.
   - Bitbucket : utiliser `caches`, `artifacts` et les conteneurs de service Bitbucket Pipelines.
4. Paramétriser toutes les URL de registre, les noms d'image et les cibles de déploiement comme variables d'environnement ou secrets CI — ne jamais les coder en dur.
5. Ajouter un déclencheur `pull_request` (ou équivalent) qui exécute lint, test et security scan mais ignore push et deploy.
6. Après la configuration, lister tous les secrets/variables qui doivent être configurés dans les paramètres de la plateforme CI.
