> 🇫🇷 This is the French translation. [English version](../github-actions.md).

# Compétence GitHub Actions

## Quand activer
- Rédiger des pipelines CI/CD pour les tests, le lint, le build et le déploiement
- Configurer des builds matrix sur plusieurs OS ou versions de langage
- Configurer des règles de protection d'environnement et des gates de déploiement
- Rédiger des workflows réutilisables ou des actions composites
- Configurer le build Docker et le push vers un registre de conteneurs
- Configurer l'authentification OIDC vers les fournisseurs cloud (pas de secrets longue durée)
- Déboguer des workflows en échec ou comprendre des erreurs de syntaxe de workflow
- Configurer le cache des dépendances (npm, pip, modules Go)

## Quand NE PAS utiliser
- GitLab CI, CircleCI, Jenkins — systèmes de pipeline différents
- Automatisation du développement local (utiliser Makefile ou des scripts)
- Tâches cron non liées à un dépôt (utiliser le planificateur cloud)

## Instructions

### Structure du fichier workflow
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Permissions explicites — ne jamais utiliser write-all par défaut
permissions:
  contents: read
  pull-requests: write    # Uniquement si nécessaire (ex: poster des commentaires)

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
```

### Permissions — toujours explicites
Ne jamais utiliser `permissions: write-all` par défaut. Toujours déclarer les permissions minimales requises :
```yaml
permissions:
  contents: read          # Lire le dépôt
  packages: write         # Pousser vers GitHub Container Registry
  id-token: write         # OIDC pour l'auth cloud
  pull-requests: write    # Commenter les PRs
```

### Secrets — OIDC plutôt que des credentials longue durée
Utiliser OIDC (OpenID Connect) pour l'authentification cloud — pas de secrets stockés :

```yaml
# AWS OIDC — pas besoin de AWS_ACCESS_KEY_ID
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions-role
    aws-region: eu-west-1

# GCP OIDC
- name: Authenticate to GCP
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: projects/123/locations/global/workloadIdentityPools/pool/providers/github
    service_account: deploy@project.iam.gserviceaccount.com
```

### Cache des dépendances
Toujours mettre en cache les dépendances pour réduire le temps de build :
```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'          # Cache intégré — pas d'étape de cache manuelle nécessaire

# Python
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: 'pip'

# Go
- uses: actions/setup-go@v5
  with:
    go-version: '1.22'
    cache: true
```

### Gates d'environnement pour les déploiements en production
```yaml
jobs:
  deploy-production:
    environment: production    # Référence l'environnement GitHub avec des règles de protection
    needs: [test, build]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: ./scripts/deploy.sh
```

Configurer des règles de protection d'environnement dans les paramètres GitHub :
- Réviseurs requis pour les déploiements en production
- Timer d'attente entre staging et production
- Restreindre aux branches spécifiques (uniquement `main`)

### Builds matrix
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
      fail-fast: false    # Ne pas annuler tout au premier échec
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

### Workflows réutilisables
```yaml
# .github/workflows/deploy.yml — réutilisable
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      deploy-token:
        required: true

# Appelant
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: production
    secrets:
      deploy-token: ${{ secrets.DEPLOY_TOKEN }}
```

### Échecs courants
- `actions/checkout@v4` manquant — toujours la première étape
- Secrets non accessibles dans les forks — utiliser `pull_request_target` avec précaution (risque de sécurité)
- Cache non trouvé — la clé doit correspondre exactement ; utiliser `restore-keys` comme solution de repli
- OIDC échoue — vérifier que la politique de confiance côté fournisseur cloud autorise le dépôt et la branche

## Exemple

**Utilisateur :** Rédiger un pipeline CI/CD pour une application Node.js : exécuter les tests sur les PRs, build et push de l'image Docker lors de la fusion sur main, déployer en production avec une gate d'approbation manuelle.

**Sortie attendue :**
- Déclencheurs `on: push/pull_request`
- Job `test` : checkout, setup-node avec cache, `npm ci`, `npm test`
- Job `build` (sur push vers main, dépend de test) : Docker build + push vers GHCR avec OIDC
- Job `deploy` : `environment: production` (nécessite une approbation), appelle le script de déploiement
- Bloc `permissions:` explicite — minimum requis
- Pas de secrets codés en dur — OIDC pour l'auth au registre

---
