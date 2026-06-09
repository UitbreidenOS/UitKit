---
description: Générer une configuration de pipeline CI pour le projet actuel
argument-hint: "[platform: github|gitlab|circleci|bitbucket] [optional: extra steps]"
---
Générer une configuration de pipeline CI complète pour la plateforme spécifiée dans $ARGUMENTS. Si aucune plateforme n'est donnée, utiliser GitHub Actions par défaut. Si $ARGUMENTS inclut des étapes supplémentaires (par exemple, `deploy`, `notify`, `sonar`), inclure ces étapes.

Étapes :
1. Détecter le langage, le runtime et le framework de test du projet en inspectant les manifestes et fichiers de configuration.
2. Concevoir un pipeline avec ces étapes dans l'ordre :
   - **Lint** — exécuter le linter du projet (ESLint, Flake8, golangci-lint, Clippy, etc.) et échouer rapidement en cas d'erreurs.
   - **Test** — exécuter la suite de tests complète avec rapports de couverture. Mettre en cache les dépendances entre les exécutions.
   - **Build** — compiler ou regrouper l'application. Produire un artefact versionnés.
   - **Security scan** — exécuter une analyse de vulnérabilité des dépendances (npm audit, pip-audit, govulncheck, Trivy pour les images, etc.).
   - **Docker build** — construire et envoyer l'image à un registre (paramétré via secrets/variables d'environnement). Étiqueter avec le SHA du commit et le nom de la branche.
   - **Deploy** (si demandé dans $ARGUMENTS) — ajouter une étape de déploiement gérée par la branche cible (par exemple, `main`).
3. Appliquer les meilleures pratiques spécifiques à la plateforme :
   - GitHub Actions : utiliser `actions/cache`, stratégie de matrice pour les tests multi-versions si applicable, authentification cloud basée sur OIDC au lieu des identifiants longue durée.
   - GitLab CI : utiliser `cache`, `artifacts`, `rules` au lieu de `only/except`, OIDC si supporté.
   - CircleCI : utiliser les orbes pour Docker et la configuration du langage.
   - Bitbucket : utiliser `caches`, `artifacts`, et les conteneurs de service Bitbucket Pipelines.
4. Paramétrer tous les URLs de registre, noms d'images et cibles de déploiement en tant que variables d'environnement ou secrets CI — ne jamais les coder en dur.
5. Ajouter un déclencheur `pull_request` (ou équivalent) qui exécute lint, test et security scan mais ignore push et deploy.
6. Après la configuration, lister tous les secrets/variables qui doivent être configurés dans les paramètres de la plateforme CI.
