---
description: Analysez la base de code à la recherche de secrets, d'identifiants et de valeurs sensibles validés ou codés en dur
argument-hint: "[path or git-ref]"
---
Analysez `$ARGUMENTS` (par défaut : l'ensemble du dépôt incluant l'historique git) à la recherche de secrets, d'identifiants et de valeurs sensibles qui ne doivent pas apparaître dans le contrôle de source ou les artefacts déployés.

**Phase 1 — Analyse par motif (fichiers source)**

Recherchez dans tous les fichiers non binaires :
- Clés API et jetons : modèles comme `sk-`, `ghp_`, `xoxb-`, `AKIA`, `AIza`, UUID utilisés comme secrets
- Clés privées : en-têtes PEM (`-----BEGIN * PRIVATE KEY-----`), blocs de clés SSH privées
- Mots de passe : variables nommées `password`, `passwd`, `pwd`, `secret`, `token`, `api_key` attribuées à des chaînes littérales
- Chaînes de connexion : DSN avec identifiants intégrés (`postgres://user:pass@host`)
- Secrets JWT : clés de signature codées en dur
- Secrets OAuth : littéraux `client_secret`
- Identifiants de fournisseur cloud : AWS, GCP, Azure, Terraform, jetons de compte de service Kubernetes
- URL de webhook avec jetons intégrés (Slack, Discord, GitHub)
- Contenu du fichier `.env` accidentellement validé

**Phase 2 — Analyse de l'historique git** (si dans un dépôt git)

Exécutez : `git log --all --full-history -- '*.env' '*.pem' '*.key' '*.p12' '*.pfx'`
Vérifiez les commits récents pour les validations accidentelles de secrets qui auraient pu être "supprimées" mais restent dans l'historique.

**Phase 3 — Fichiers de configuration et d'infrastructure**

Examinez : `docker-compose.yml`, manifestes Kubernetes, valeurs Helm, configurations CI/CD (`.github/`, `.circleci/`, `.travis.yml`, `Jenkinsfile`) pour les valeurs env codées en dur.

**Phase 4 — Triage de chaque découverte**

Pour chaque résultat :
- Chemin du fichier et numéro de ligne
- Type de secret (par exemple, clé d'accès AWS, GitHub PAT)
- S'il s'agit d'un secret réel ou d'un espace réservé/exemple (marquer comme LIVE ou EXAMPLE)
- S'il apparaît dans l'historique git (marquer comme HISTORY le cas échéant)

**Format de sortie** :
```
## Secret Scan Results

### LIVE Secrets (rotate immediately)
[file:line] [type] — masked preview: sk-...xxxx

### EXAMPLE / Placeholder (verify)
[file:line] [type] — context: ...

### History Leaks
[commit] [file] [type] — note: still accessible via git

### Remediation
1. Rotate all LIVE secrets before doing anything else.
2. Use git-filter-repo or BFG to purge history leaks.
3. Add detected patterns to .gitignore and pre-commit hooks.
```

Ne jamais afficher la valeur complète du secret — toujours masquer les 4 derniers caractères.
