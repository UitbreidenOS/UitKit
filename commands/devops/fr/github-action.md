---
description: Générer un workflow GitHub Actions pour les tâches CI, CD ou d'automatisation
argument-hint: "[workflow purpose: e.g. ci, deploy-aws, release, pr-checks]"
---
Générer un workflow GitHub Actions pour : $ARGUMENTS

Inspectez le projet pour déterminer le langage/framework, les commandes de test, les commandes de construction et la cible de déploiement. Adaptez le workflow en conséquence.

Produisez un seul fichier `.github/workflows/<slug>.yml`.

Exigences :

Déclencheurs :
- Utilisez l'ensemble de déclencheurs minimal pour l'objectif indiqué (par exemple, `push` + `pull_request` pour CI ; `release` pour la publication ; `workflow_dispatch` pour les opérations manuelles)
- Ajoutez des filtres `paths` si le dépôt est un monorepo
- Épinglez les `branches` à `main`/`master` sauf si une couverture plus large est nécessaire

Emplois et étapes :
- Utilisez `actions/checkout@v4` — épinglez toujours les actions à un SHA ou une balise de version majeure, jamais à une branche
- Mettez en cache les dépendances appropriées à la pile (`actions/cache` ou les caches intégrés dans les actions `setup-*`)
- Exécutez lint, type-check et test comme des étapes séparées avec des noms clairs
- Échouez rapidement : `continue-on-error: false` sur les étapes critiques ; définissez une `timeout-minutes` sur chaque travail
- Pour les builds Docker : utilisez `docker/build-push-action@v5` avec `cache-from: type=gha` et `cache-to: type=gha,mode=max`
- Pour les déploiements : utilisez l'authentification basée sur OIDC (`permissions: id-token: write`) plutôt que des secrets de longue durée lorsque le fournisseur le supporte

Sécurité :
- Déclarez des `permissions` explicites au niveau du workflow (par défaut `read-all`) et élevez par travail uniquement si nécessaire
- N'interpolez jamais `${{ github.event.*.body }}` ou des entrées non fiables directement dans les étapes `run:` — utilisez des variables d'environnement
- Épinglez les actions tierces à un SHA de validation complet avec un commentaire de version

Après le YAML du workflow, produisez :
1. Les secrets et variables de dépôt requis (nom + valeur à définir)
2. Toutes les règles de protection de branche qui doivent être configurées pour que ce workflow soit efficace
3. Temps d'exécution estimé du travail et suggestions pour le réduire s'il dépasse 5 minutes
