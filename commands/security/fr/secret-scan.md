---
description: Analyser le dépôt de code pour rechercher les secrets, identifiants et valeurs sensibles validés ou en dur
argument-hint: "[chemin ou git-ref]"
---
Analyser `$ARGUMENTS` (par défaut : tout le dépôt incluant l'historique git) pour trouver les secrets, identifiants et valeurs sensibles qui ne doivent pas apparaître dans le contrôle de code source ou les artefacts déployés.

**Phase 1 — Analyse des motifs (fichiers source)**

Rechercher dans tous les fichiers non binaires :
- Clés API et tokens : motifs comme `sk-`, `ghp_`, `xoxb-`, `AKIA`, `AIza`, UUIDs utilisés comme secrets
- Clés privées : en-têtes PEM (`-----BEGIN * PRIVATE KEY-----`), blocs de clés SSH privées
- Mots de passe : variables nommées `password`, `passwd`, `pwd`, `secret`, `token`, `api_key` assignées à des littéraux de chaîne
- Chaînes de connexion : DSNs avec identifiants intégrés (`postgres://user:pass@host`)
- Secrets JWT : clés de signature en dur
- Secrets OAuth : littéraux `client_secret`
- Identifiants de fournisseur cloud : AWS, GCP, Azure, Terraform, tokens de compte de service Kubernetes
- URLs de webhook avec tokens intégrés (Slack, Discord, GitHub)
- Contenu du fichier `.env` accidentellement validé

**Phase 2 — Analyse de l'historique git** (si dans un dépôt git)

Exécuter : `git log --all --full-history -- '*.env' '*.pem' '*.key' '*.p12' '*.pfx'`
Vérifier les validations récentes pour les secrets accidentellement validés qui peuvent avoir été « supprimés » mais subsistent dans l'historique.

**Phase 3 — Fichiers de configuration et d'infrastructure**

Examiner : `docker-compose.yml`, manifestes Kubernetes, valeurs Helm, configurations CI/CD (`.github/`, `.circleci/`, `.travis.yml`, `Jenkinsfile`) pour les valeurs env en dur.

**Phase 4 — Trier chaque détection**

Pour chaque résultat :
- Chemin du fichier et numéro de ligne
- Type de secret (par exemple, clé d'accès AWS, GitHub PAT)
- S'il semble être réel ou un placeholder/exemple (marquer comme LIVE ou EXAMPLE)
- S'il apparaît dans l'historique git (marquer comme HISTORY si applicable)

**Format de sortie** :
```
## Résultats de l'analyse des secrets

### Secrets LIVE (rotation immédiate)
[fichier:ligne] [type] — aperçu masqué : sk-...xxxx

### EXAMPLE / Placeholder (à vérifier)
[fichier:ligne] [type] — contexte : ...

### Fuites dans l'historique
[commit] [fichier] [type] — note : toujours accessible via git

### Remédiation
1. Faire tourner tous les secrets LIVE avant toute autre chose.
2. Utiliser git-filter-repo ou BFG pour purger les fuites historiques.
3. Ajouter les motifs détectés à .gitignore et les hooks de pré-commit.
```

Ne jamais afficher la valeur complète du secret — toujours masquer jusqu'aux 4 derniers caractères.
