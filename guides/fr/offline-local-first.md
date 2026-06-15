---
name: offline-local-first
description: "Mode hors ligne et local-first : exécutez Claudient dans les environnements air-gapped, les stacks hors ligne, les modèles de repli, et ce qui nécessite une connectivité réseau"
updated: 2026-06-15
---

# Guide du mode hors ligne et local-first

Ce guide couvre l'exécution de Claudient, ses stacks, et les flux de travail Claude Code dans les environnements air-gapped, hors ligne, et faible connectivité. Il distingue les capacités qui fonctionnent hors ligne et celles qui nécessitent l'accès réseau, et documente les modèles de repli pour les scénarios déconnectés.

---

## Présentation générale

Claudient est conçu pour s'intégrer avec Claude Code et les outils externes (Claude API, serveurs MCP, plateformes cloud). Cependant, de nombreux flux de travail peuvent fonctionner hors ligne avec :

1. **Modèle local servant** (Claude via proxy API local)
2. **Stacks hors ligne** (skills qui ne nécessitent pas de serveurs MCP externes ou APIs)
3. **Connaissances en cache** (CLAUDE.md, documentation, modèles de prompts)
4. **Outils déconnectés** (CLI local, git, shell, opérations de fichiers)

Ce guide identifie quels composants Claudient fonctionnent hors ligne et comment les configurer.

---

## Ce qui fonctionne hors ligne

### Capacités Claudient principales (Entièrement hors ligne)

- **Guides, skills, agents, flux de travail, prompts** — toute la documentation et les patterns Markdown
- **Opérations git** — clonage, commit, branchement (dépôt local uniquement)
- **Lecture/écriture de fichiers** — toute opération système de fichiers local
- **Scripting bash/shell** — commandes locales, configuration d'environnement
- **Édition et review de code** — analyse du code local
- **Templates et checklists** — modèles de prompts hors ligne

### Stacks hors ligne

Les stacks suivantes peuvent s'exécuter entièrement hors ligne sans appels MCP ou API externes :

- **Backend (Go, Rust, C++)** — outils de build, compilation, testing (pas de déploiement cloud)
- **Data/ML** — entraînement local, ingénierie de features, analyse (pas d'inférence cloud)
- **DevOps/Infra** — code infrastructure-as-code, k8s local, Docker (pas de registries externes)
- **Frontend** — build local, génération SSG, testing de composants hors ligne
- **Flux de travail git** — contrôle de version, CI local (utilisant les runners locaux)
- **Productivité/Automation** — scripts CLI locaux, flux de travail shell
- **Base de données** — instances locales (PostgreSQL, Redis, SQLite) — pas de requêtes cloud
- **Computer use** — automation UI local, OCR, scripting desktop

### Serveurs MCP hors ligne

Si vous exécutez MCP localement, ces serveurs n'ont pas de dépendances externes :

- `filesystem` — opérations de fichiers locaux
- `git` — accès au dépôt git local
- `postgres` — base de données locale (nécessite une instance en cours d'exécution)
- `sqlite` — base de données intégrée
- `bash` — commandes shell sur la machine locale
- MCPs locaux personnalisés (tout serveur MCP construit par l'utilisateur exécuté sur localhost)

---

## Ce qui nécessite le réseau

### Fonctionnalités Claudient qui nécessitent Internet

- **Appels Claude API** — tout skill/agent qui invoque Claude (nécessite la clé API Anthropic et l'accès réseau)
- **Serveurs MCP externes** — serveurs distants (GitHub, Linear, Slack, etc.)
- **Déploiements cloud** — AWS, GCP, Azure (nécessite l'accès API cloud)
- **Registries de packages** — npm, PyPI, Maven (nécessite le téléchargement du package)
- **Web scraping/fetching** — tout skill qui récupère les URLs externes
- **Email, Slack, webhooks** — canaux de notification externes
- **DNS, APIs publiques** — tout appel HTTP/HTTPS externe

### Stacks non hors ligne

Les stacks suivantes nécessitent le réseau pour une fonctionnalité complète :

- **GTM/Growth** — recherche de marché, analytics, intégrations de réseaux sociaux
- **Legal/Compliance** — bases de données réglementaires, intégrations API
- **Product/Marketing** — analytics, intégration CMS, outils externes
- **Finance** — APIs bancaires, processeurs de paiement, données de marché
- **AI-Engineering** — APIs de modèles cloud, bases de données vectorielles, services d'inférence

---

## Configuration du mode hors ligne

### 1. Modèle local servant

Pour utiliser les modèles Claude hors ligne, exécutez un proxy API local qui met en cache ou auto-héberge Claude :

**Option A : Proxy Anthropic (Claude API localement)**

```bash
# Nécessite : internet pour la configuration initiale, puis service local
# Proxy Claude API via un point d'accès local
git clone https://github.com/anthropic-ai/python-sdk
cd python-sdk

# Configurez le proxy de caching local (nécessite le package anthropic)
pip install anthropic
python -m anthropic.proxy --host 127.0.0.1 --port 8000
```

Configurez ensuite Claudient pour utiliser le point d'accès local :

```json
{
  "model": "claude-3-5-haiku-20241022",
  "apiUrl": "http://127.0.0.1:8000/v1"
}
```

**Option B : Ollama ou LLM local**

Pour une opération entièrement hors ligne, utilisez un LLM local :

```bash
brew install ollama  # macOS
# ou téléchargez depuis https://ollama.ai

ollama run llama2  # téléchargez et exécutez localement
```

Configurez Claude Code pour utiliser Ollama :

```json
{
  "model": "llama2",
  "apiUrl": "http://127.0.0.1:11434/v1"
}
```

**Compromis :** Les modèles locaux ont une qualité réduite par rapport à Claude 3.5, mais permettent une opération entièrement hors ligne.

### 2. Configuration MCP hors ligne

Désactivez les MCPs externes et enregistrez uniquement les serveurs locaux :

**.claude/settings.json**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp",
      "args": ["server", "filesystem"]
    },
    "git": {
      "command": "mcp",
      "args": ["server", "git"]
    }
  },
  "disableExternalMcp": true,
  "mcpTimeout": 5000
}
```

Variable d'environnement pour désactiver tous les MCPs externes :

```bash
export DISABLE_EXTERNAL_MCP=true
export MCP_SERVERS=filesystem,git  # liste séparée par des virgules
```

### 3. Clone Claudient localement

Téléchargez l'intégralité du dépôt Claudient pour un accès hors ligne :

```bash
git clone https://github.com/tushar2704/Claudient.git /opt/claudient
export CLAUDIENT_PATH=/opt/claudient

# Vérifiez l'accès hors ligne
ls /opt/claudient/guides/offline-local-first.md
```

Pointez Claude Code vers Claudient local :

```bash
--project /opt/claudient
```

### 4. Cache les réponses API

Si vous avez besoin d'un accès internet une seule fois, mettez en cache les réponses pour une utilisation hors ligne :

```bash
# Avant d'aller hors ligne : récupérez et mettez en cache
claude --project . --cache-responses=true \
  "Generate all patterns for {backend,devops,data-ml}/*.md"

# Allez hors ligne avec la connaissance en cache
claude --offline-only --project .
```

---

## Configuration de Stack local-first hors ligne

### Utiliser une stack hors ligne

Exemple : **Backend Engineer Stack (Entièrement hors ligne)**

```bash
# Assurez-vous que seuls les MCPs hors ligne sont activés
export DISABLE_EXTERNAL_MCP=true
export MCP_SERVERS=filesystem,git

# Chargez la stack
claude --stack backend \
       --project /opt/claudient \
       "Build a Go API server with tests and Docker image"
```

Tous les skills de la stack `backend` fonctionnent sans appels externes :
- `golang` — compilateur local
- `dockerfile` — build de conteneur local
- `testing` — framework de test local
- `postgres` — instance de base de données locale

### Checklist de validation hors ligne

Avant de déclarer une stack « offline-ready », suivez :

```markdown
- [ ] Tous les serveurs MCP sont locaux (filesystem, git, localhost-bound)
- [ ] Aucun appel API aux services externes (Claude, plateformes cloud, SaaS)
- [ ] Aucun téléchargement de package (toutes les dépendances en cache localement)
- [ ] Aucun web scraping ou URL fetching
- [ ] Toutes les commandes peuvent s'exécuter avec `DISABLE_EXTERNAL_MCP=true`
- [ ] CLAUDE.md liste clairement les dépendances externes
```

---

## Modèles de repli pour faible connectivité

Quand le réseau est intermittent ou peu fiable :

### 1. Retry avec Exponential Backoff

```bash
# .claude/hooks/mcp-retry.sh
for attempt in {1..5}; do
  timeout 5 mcp-call "$@" && exit 0
  sleep $((2 ** attempt))
done
exit 1
```

### 2. Cache-First Lookup

```bash
# Vérifiez le cache local avant de faire l'appel API
if [[ -f ~/.claude/cache/$QUERY_HASH ]]; then
  cat ~/.claude/cache/$QUERY_HASH
else
  # Faites l'appel et mettez en cache
  result=$(mcp-call "$@")
  echo "$result" > ~/.claude/cache/$QUERY_HASH
  echo "$result"
fi
```

### 3. Dégradation gracieuse

Les skills hors ligne devraient détecter le MCP indisponible et fournir un repli :

```markdown
# Exemple : AWS Architect Skill

## Quand l'activer
- Concevoir l'architecture AWS

## Quand ne pas l'utiliser
- Pas d'internet et les credentials AWS indisponibles
- Repli : utilisez les modèles CloudFormation du cache local

## Instructions

### Mode hors ligne
Si l'API AWS est indisponible, utilisez les modèles CloudFormation pré-générés :

\`\`\`bash
if ! aws ec2 describe-instances &>/dev/null; then
  echo "AWS API unavailable. Using cached templates."
  cat /opt/claudient/cache/cf-templates/*.json
fi
\`\`\`
```

### 4. Opérations batch pendant les fenêtres en ligne

Collectez le travail hors ligne et synchronisez quand le réseau est disponible :

```bash
# Hors ligne : mettez en queue les commandes
echo "claude --stack backend 'implement feature X'" >> ~/.claude/queue.txt
echo "claude --stack devops 'deploy to staging'" >> ~/.claude/queue.txt

# Quand en ligne : videz la queue
while read cmd; do
  eval "$cmd"
done < ~/.claude/queue.txt
rm ~/.claude/queue.txt
```

---

## Détection du réseau et repli automatique

### Détecter la disponibilité du réseau

```bash
#!/bin/bash
# ~/.claude/hooks/network-check.sh

if ping -c 1 8.8.8.8 &>/dev/null; then
  export NETWORK_AVAILABLE=true
  export MCP_TIMEOUT=5
else
  export NETWORK_AVAILABLE=false
  export DISABLE_EXTERNAL_MCP=true
  export MCP_TIMEOUT=1
fi
```

Hook à exécuter au démarrage :

```json
{
  "hooks": {
    "before:startup": {
      "command": "bash",
      "args": ["~/.claude/hooks/network-check.sh"]
    }
  }
}
```

### Sélection auto-stack basée sur la connectivité

```bash
#!/bin/bash
# Sélectionnez une stack hors ligne si pas de réseau

if [[ "$NETWORK_AVAILABLE" == "false" ]]; then
  STACK="backend"  # défaut hors ligne
else
  STACK="gtm"  # nécessite le réseau
fi

claude --stack "$STACK" "$@"
```

---

## Stacks hors ligne — Référence rapide

| Stack | Hors ligne ? | Notes |
|---|---|---|
| **Backend (Go, Rust, C++)** | ✅ Complet | Nécessite un compilateur local ; pas de déploiement cloud |
| **Data/ML** | ✅ Complet | Entraînement local uniquement ; pas d'inférence cloud |
| **DevOps/Infra** | ⚠️ Partial | IaC fonctionne hors ligne ; le déploiement cloud nécessite l'API |
| **Frontend** | ✅ Complet | Build et testing locaux ; génération SSG |
| **Database** | ✅ Complet | Nécessite une instance locale en cours d'exécution |
| **Productivity** | ✅ Complet | Automation local, scripts shell |
| **Git** | ✅ Complet | Contrôle de version local uniquement |
| **Computer Use** | ✅ Complet | Automation UI local |
| **Finance** | ❌ Aucun | Nécessite les APIs bancaires/marché |
| **GTM/Growth** | ❌ Aucun | Nécessite les APIs analytics, données de marché |
| **Legal/Compliance** | ❌ Aucun | Nécessite les bases de données réglementaires |
| **AI-Engineering** | ⚠️ Partial | Modèles locaux uniquement ; inférence cloud indisponible |

---

## Structure de documentation hors ligne

Quand vous travaillez hors ligne, naviguez la structure de documentation de Claudient :

```
/opt/claudient
├── guides/offline-local-first.md       ← Vous êtes ici
├── enterprise/AIR_GAP.md               ← Guide de déploiement
├── skills/devops-infra/air-gap-deployment.md
├── workflows/offline-validation.md
├── agents/roles/offline-validator.md
├── guides/                             ← Toute la documentation lisible
├── skills/                             ← Tous les patterns de skill
├── agents/                             ← Toutes les définitions d'agent
└── workflows/                          ← Tous les patterns de flux de travail
```

Lisez depuis `/opt/claudient` (pas depuis le git remote) quand hors ligne.

---

## Dépannage du mode hors ligne

### Symptôme : « MCP server not responding »

```bash
# Vérifiez que le MCP local est en cours d'exécution
lsof -i :8000  # si vous utilisez le proxy local

# Forcez le mode hors ligne
export DISABLE_EXTERNAL_MCP=true
export OFFLINE_MODE=true
claude --project /opt/claudient "test query"
```

### Symptôme : « API key not found »

Quand hors ligne, Claude Code ne peut pas accéder à l'API Anthropic. Utilisez le modèle local :

```bash
# Utilisez Ollama à la place
export MODEL=llama2
export API_URL=http://127.0.0.1:11434/v1
claude "test query"
```

### Symptôme : « Package not found »

Si npm/pip essaie de récupérer depuis le registre distant :

```bash
# Utilisez uniquement le cache local
npm ci --prefer-offline --no-audit
pip install --no-index --find-links ./cache -r requirements.txt
```

---

## Résumé

**Principes local-first hors ligne pour Claudient :**

1. **Dépendances local-first** — mettez tout en cache ; le réseau est optionnel
2. **Dégradation gracieuse** — détecter le MCP indisponible ; fournir les replis
3. **Le système de fichiers et git sont vos amis** — ils fonctionnent sans réseau
4. **Stacks hors ligne** — backend, data/ML, devops (partiel), frontend, database, productivité
5. **Stacks dépendantes du réseau** — GTM, finance, legal, AI-engineering (partiel)
6. **Service de modèle local** — Ollama, proxies Claude local pour Claude hors ligne
7. **Documentation comme repli** — tout CLAUDE.md, guides, et patterns sont accessibles hors ligne

**Pour les déploiements d'entreprise**, voir `enterprise/AIR_GAP.md`.

**Pour les flux de travail de validation**, voir `workflows/offline-validation.md`.

**Pour le déploiement air-gap détaillé**, voir `skills/devops-infra/air-gap-deployment.md`.
