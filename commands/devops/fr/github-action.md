---
description: Générer un workflow GitHub Actions pour les tâches CI, CD ou d'automatisation
argument-hint: "[objectif du workflow : ex. ci, deploy-aws, release, pr-checks]"
---
Générer un workflow GitHub Actions pour : $ARGUMENTS

Inspecter le projet pour déterminer le langage/framework, les commandes de test, les commandes de build et la cible de déploiement. Adapter le workflow en conséquence.

Générer un seul fichier `.github/workflows/<slug>.yml`.

Exigences :

Déclencheurs :
- Utiliser l'ensemble minimal de déclencheurs pour l'objectif spécifié (ex. `push` + `pull_request` pour CI ; `release` pour publication ; `workflow_dispatch` pour opérations manuelles)
- Ajouter des filtres `paths` si le repo est un monorepo
- Épingler `branches` à `main`/`master` sauf si une couverture plus large est nécessaire

Jobs et étapes :
- Utiliser `actions/checkout@v4` — toujours épingler les actions à un SHA ou une balise de version majeure, jamais à une branche
- Mettre en cache les dépendances appropriées à la pile (`actions/cache` ou caches intégrés dans les actions `setup-*`)
- Exécuter lint, type-check et test comme des étapes séparées avec des noms clairs
- Échouer rapidement : `continue-on-error: false` sur les étapes critiques ; définir un `timeout-minutes` sur chaque job
- Pour les builds Docker : utiliser `docker/build-push-action@v5` avec `cache-from: type=gha` et `cache-to: type=gha,mode=max`
- Pour les déploiements : utiliser l'authentification basée sur OIDC (`permissions: id-token: write`) plutôt que des secrets de longue durée où le fournisseur le supporte

Sécurité :
- Déclarer les `permissions` explicites au niveau du workflow (par défaut `read-all`) et élever par job uniquement si nécessaire
- Ne jamais interpoler `${{ github.event.*.body }}` ou une entrée non approuvée directement dans les étapes `run:` — utiliser les variables d'environnement
- Épingler les actions tierces à un SHA de commit complet avec un commentaire de version

Après le YAML du workflow, générer :
1. Les secrets et variables de repository requis (nom + valeur à définir)
2. Toute règle de protection de branche qui doit être configurée pour que ce workflow soit efficace
3. Durée d'exécution estimée du job et suggestions pour la réduire si elle dépasse 5 minutes
