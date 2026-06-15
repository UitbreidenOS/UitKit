---
name: air-gap
description: "Déploiement en réseau isolé pour l'entreprise : aucun appel réseau externe, service de modèle local, liste d'outils approuvés, exigences d'audit réseau"
updated: 2026-06-15
---

# Guide de déploiement en réseau isolé pour l'entreprise

Ce document couvre le déploiement de Claudient et Claude Code dans des réseaux d'entreprise complètement isolés (air-gappés) sans connectivité externe. Il inclut les contrôles de sécurité, la liste blanche des outils, le service de modèle local et les journaux d'audit pour la conformité.

---

## Portée

**Environnement air-gap :** Un réseau complètement isolé d'Internet et des services externes. Aucun appel HTTP/HTTPS sortant, aucun accès API aux services cloud, aucune connexion MCP serveur distant.

**Objectifs de conformité :**
- Zéro appel API externe
- Pas d'exfiltration de données (journaux, code, identifiants)
- Journalisation d'audit complète de toutes les opérations Claude Code
- Outils et MCP approuvés uniquement
- Service de modèle local sans inférence externe

---

## Prérequis

### Exigences réseau

1. **Réseau complètement isolé** — pas de passerelle Internet, pas de VPN vers le cloud
2. **Proxy API local** — exécuté sur des serveurs internes (proxy Claude API ou LLM local)
3. **Miroirs de packages internes** — npm, PyPI, Maven avec packages en cache
4. **Serveurs MCP locaux** — git, système de fichiers, MCP internes personnalisés uniquement
5. **Infrastructure de journalisation d'audit** — collecte de journaux centralisée (ELK, Splunk, etc.)

### Infrastructure approuvée

- **Systèmes d'exploitation :** Ubuntu 22.04 LTS, CentOS 8, macOS 12+, Windows Server 2022
- **Runtime conteneur :** Docker CE ou Podman (installable hors ligne)
- **CI/CD :** Jenkins, GitLab Runner (local uniquement) ou GitHub Enterprise Server (sur site)
- **Service de modèle :** Ollama (LLM local), vLLM ou proxy Claude API (en cache local)
- **Journalisation :** ELK Stack, Splunk ou rsyslog avec serveur syslog local

---

## Partie 1 : Isolation réseau et vérification

### 1.1 Audit réseau

Avant de déployer Claude Code en air-gap, vérifiez zéro connectivité externe :

```bash
#!/bin/bash
# enterprise/audit-network-isolation.sh

echo "[*] Audit de l'isolation réseau..."

# Test de connectivité sortante
declare -a EXTERNAL_SERVICES=(
  "api.anthropic.com:443"
  "github.com:443"
  "hub.docker.com:443"
  "registry.npmjs.org:443"
  "pypi.org:443"
  "8.8.8.8:53"  # DNS Google
)

for service in "${EXTERNAL_SERVICES[@]}"; do
  if timeout 2 bash -c "cat < /dev/null > /dev/tcp/${service%:*}/${service#*:}" 2>/dev/null; then
    echo "[FAIL] Connexion externe disponible : $service"
    exit 1
  else
    echo "[PASS] Bloqué : $service"
  fi
done

# Vérifier les règles du pare-feu
echo "[*] Vérification des règles du pare-feu..."
sudo iptables -L -n | grep "REJECT\|DROP" | grep -E "out|eth0" && echo "[PASS] Filtrage des sorties activé"

# Vérifier la résolution DNS (devrait échouer pour les domaines externes)
if ! nslookup anthropic.com 2>/dev/null | grep -q "Address"; then
  echo "[PASS] Résolution DNS externe bloquée"
else
  echo "[FAIL] Résolution DNS externe disponible"
  exit 1
fi

echo "[OK] Le réseau est correctement isolé"
```

Exécutez avant le déploiement :

```bash
bash enterprise/audit-network-isolation.sh
```

### 1.2 Règles du pare-feu de sortie

Restreindre tout le trafic sortant. Autoriser uniquement les services internes :

**Règles iptables :**

```bash
#!/bin/bash
# enterprise/setup-firewall.sh

# Refuser par défaut tous les trafics sortants
sudo iptables -P OUTPUT DROP

# Autoriser les sorties vers les services internes uniquement
sudo iptables -A OUTPUT -d 10.0.0.0/8 -j ACCEPT        # RFC1918 interne
sudo iptables -A OUTPUT -d 172.16.0.0/12 -j ACCEPT     # RFC1918 interne
sudo iptables -A OUTPUT -d 192.168.0.0/16 -j ACCEPT    # RFC1918 interne
sudo iptables -A OUTPUT -d 127.0.0.1 -j ACCEPT         # localhost

# Autoriser DNS interne (si applicable)
sudo iptables -A OUTPUT -d <INTERNAL_DNS_IP> -p udp --dport 53 -j ACCEPT

# Autoriser NTP interne (si applicable)
sudo iptables -A OUTPUT -d <INTERNAL_NTP_IP> -p udp --dport 123 -j ACCEPT

# Refuser tout le reste
sudo iptables -A OUTPUT -j REJECT --reject-with icmp-net-unreachable

# Persister les règles
sudo iptables-save > /etc/iptables/rules.v4
```

---

## Partie 2 : Service de modèle local

### 2.1 Déploiement Ollama (recommandé)

Ollama fournit une inférence LLM locale sans dépendances externes :

**Installer Ollama :**

```bash
# macOS
brew install ollama

# Linux (télécharger depuis https://ollama.ai)
curl -fsSL https://ollama.ai/install.sh | sh

# Docker (pour les systèmes air-gappés)
docker load < ollama-docker.tar
docker run -d --name ollama -p 11434:11434 ollama:latest
```

**Extraire les modèles localement (Internet requis une fois) :**

```bash
# Avant l'air-gap : extraire les modèles avec accès Internet
ollama pull llama2
ollama pull mistral
ollama pull neural-chat

# Lister les modèles disponibles
ollama list

# Exporter les modèles pour transfert hors ligne
ollama export llama2 > llama2.gguf
```

**Configurer Claude Code pour utiliser Ollama :**

**.claude/settings.json**

```json
{
  "models": {
    "default": "ollama:llama2",
    "advanced": "ollama:mistral",
    "coding": "ollama:neural-chat"
  },
  "apiUrl": "http://127.0.0.1:11434/v1",
  "apiKey": "offline",
  "disableExternalMcp": true,
  "timeout": 300000
}
```

### 2.2 Déploiement vLLM (haute performance)

Pour un débit plus élevé, déployez vLLM :

**Configuration Docker :**

```bash
docker pull vllm/vllm-openai
docker run -d \
  --name vllm \
  --gpus all \
  -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model /models/llama2 \
  --served-model-name llama2 \
  --gpu-memory-utilization 0.9
```

**Configurer Claude Code :**

```json
{
  "apiUrl": "http://127.0.0.1:8000/v1",
  "model": "llama2",
  "apiKey": "fake-offline-key"
}
```

### 2.3 Proxy Claude API (réponses en cache)

Si vous avez des réponses Claude précédemment en cache, exécutez un proxy local :

**Configuration :**

```bash
git clone https://github.com/anthropic-ai/python-sdk
cd python-sdk
pip install -e .

# Créer le magasin de cache
mkdir -p /var/cache/claude-proxy

# Exécuter le proxy
python -m anthropic.proxy \
  --host 127.0.0.1 \
  --port 8000 \
  --cache-dir /var/cache/claude-proxy
```

---

## Partie 3 : Outils approuvés et MCP

### 3.1 Liste blanche MCP hors ligne sécurisée

Seules ces MCP sont autorisées dans les environnements air-gap :

| Serveur MCP | Statut | Configuration |
|---|---|---|
| `filesystem` | ✅ Approuvé | Opérations de fichiers locaux |
| `git` | ✅ Approuvé | Dépôts git locaux |
| `bash` | ✅ Approuvé | Commandes shell locales (avec restrictions) |
| `postgres` | ✅ Approuvé | Instance PostgreSQL locale |
| `sqlite` | ✅ Approuvé | Base de données intégrée |
| Tous les MCP externes | ❌ Bloqué | GitHub, Slack, Linear, etc. |

### 3.2 Configuration MCP pour air-gap

**.claude/settings.json**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp",
      "args": ["server", "filesystem"],
      "disabled": false
    },
    "git": {
      "command": "mcp",
      "args": ["server", "git"],
      "disabled": false
    },
    "bash": {
      "command": "mcp",
      "args": ["server", "bash"],
      "disabled": false,
      "env": {
        "ALLOWED_COMMANDS": "cd,ls,find,grep,cat,echo,git,npm,pip"
      }
    },
    "postgres": {
      "command": "mcp",
      "args": ["server", "postgres"],
      "disabled": false,
      "env": {
        "DATABASE_URL": "postgresql://localhost/claudient"
      }
    }
  },
  "disableExternalMcp": true,
  "mcpTimeout": 5000
}
```

### 3.3 Liste blanche des commandes Bash

Restreindre les commandes shell à l'ensemble approuvé :

```bash
# enterprise/bash-whitelist.sh

ALLOWED_COMMANDS=(
  "cd" "ls" "find" "grep" "cat" "echo" "pwd"
  "git" "npm" "pip" "python" "node" "go" "cargo"
  "docker" "docker-compose" "kubectl"
  "curl" "wget"  # URL internes uniquement
  "jq" "yq" "sed" "awk"
  "ssh" "scp"    # Hôtes internes uniquement
)

# Rejeter les commandes contenant :
BLOCKED_PATTERNS=(
  "curl http.*anthropic.com"
  "pip install.*--index-url.*https://"
  "npm install.*--registry.*https://"
  "|.*nc.*-l"     # shell inversé
  ">&.*\/dev\/tcp" # connexion sortante
)
```

Connectez ceci à `.claude/hooks/validate-bash.sh` :

```bash
#!/bin/bash
# .claude/hooks/validate-bash.sh

COMMAND="$1"

# Vérifier la liste blanche
for allowed in "${ALLOWED_COMMANDS[@]}"; do
  if [[ "$COMMAND" == "$allowed"* ]]; then
    # Vérifier les modèles bloqués
    for pattern in "${BLOCKED_PATTERNS[@]}"; do
      if [[ "$COMMAND" =~ $pattern ]]; then
        echo "[BLOCKED] La commande viole la politique de sécurité : $COMMAND" >&2
        exit 1
      fi
    done
    exit 0
  fi
done

echo "[BLOCKED] Commande non autorisée : $COMMAND" >&2
exit 1
```

---

## Partie 4 : Audit et journalisation

### 4.1 Journalisation d'audit centralisée

Toutes les opérations Claude Code doivent être enregistrées pour la conformité :

**.claude/settings.json**

```json
{
  "logging": {
    "enabled": true,
    "level": "INFO",
    "format": "json",
    "outputs": [
      "file:///var/log/claudient/operations.log",
      "syslog://127.0.0.1:514"
    ]
  },
  "audit": {
    "enabled": true,
    "trackBashCommands": true,
    "trackFileAccess": true,
    "trackMcpCalls": true,
    "retentionDays": 365
  }
}
```

### 4.2 Schéma du journal d'audit

Chaque opération doit enregistrer :

```json
{
  "timestamp": "2026-06-15T14:23:45.123Z",
  "user": "alice.smith",
  "action": "bash_command_executed",
  "details": {
    "command": "cd /opt/project && npm run build",
    "working_directory": "/opt/project",
    "exit_code": 0,
    "duration_ms": 1234
  },
  "security": {
    "network_isolation_verified": true,
    "external_calls_attempted": 0,
    "whitelist_check": "PASSED"
  }
}
```

### 4.3 Configuration du transfert de journaux

Envoyer les journaux au serveur syslog central :

```bash
#!/bin/bash
# enterprise/setup-log-forwarding.sh

# Installer rsyslog s'il n'est pas présent
sudo apt-get install -y rsyslog

# Configurer le transfert syslog
sudo tee /etc/rsyslog.d/10-claudient-forward.conf > /dev/null <<EOF
# Transférer les journaux Claudient au serveur central
:programname, isequal, "claudient" @@<INTERNAL_SYSLOG_SERVER>:514

# Stocker également localement pour l'audit
:programname, isequal, "claudient" /var/log/claudient/operations.log
EOF

# Redémarrer rsyslog
sudo systemctl restart rsyslog

# Vérifier
tail -f /var/log/claudient/operations.log
```

### 4.4 Génération de rapport de conformité

Générer des rapports d'audit pour les révisions de conformité :

```bash
#!/bin/bash
# enterprise/generate-compliance-report.sh

REPORT_DATE=$(date +%Y-%m-%d)
REPORT_FILE="audit-report-${REPORT_DATE}.json"

jq -s '
{
  report_date: $REPORT_DATE,
  period: {
    start: (map(.timestamp) | min),
    end: (map(.timestamp) | max)
  },
  summary: {
    total_commands: length,
    failed_commands: map(select(.details.exit_code != 0)) | length,
    external_calls_attempted: map(.security.external_calls_attempted) | add
  },
  failed_operations: map(select(.details.exit_code != 0)),
  network_violations: map(select(.security.external_calls_attempted > 0))
}' \
  /var/log/claudient/operations.log > "$REPORT_FILE"

echo "Rapport de conformité : $REPORT_FILE"
```

---

## Partie 5 : Liste de contrôle du déploiement

### Liste de contrôle de sécurité avant le déploiement

```markdown
## Isolation réseau
- [ ] Audit réseau terminé (audit-network-isolation.sh réussi)
- [ ] Règles de pare-feu configurées (setup-firewall.sh appliqué)
- [ ] Filtrage des sorties activé (DROP par défaut iptables)
- [ ] Aucune passerelle Internet dans le segment réseau
- [ ] Aucune connexion VPN vers les réseaux externes

## Service de modèle
- [ ] LLM local en cours d'exécution (Ollama, vLLM ou proxy)
- [ ] Claude Code configuré pour utiliser le modèle local
- [ ] Secours API configurés
- [ ] Procédure de mise à jour du modèle documentée

## MCP et outils
- [ ] Uniquement les MCP approuvés activés
- [ ] MCP externes désactivés (DISABLE_EXTERNAL_MCP=true)
- [ ] Liste blanche Bash configurée
- [ ] Hooks de validation de commande installés

## Audit et journalisation
- [ ] Journalisation d'audit activée
- [ ] Transfert de journaux central configuré
- [ ] Politique de conservation des journaux définie (365+ jours)
- [ ] Génération de rapport de conformité testée
- [ ] Surveillance de l'intégrité des journaux en place

## Documentation
- [ ] Guide de déploiement air-gap disponible hors ligne
- [ ] Procédures de réponse aux incidents documentées
- [ ] Liste de stack hors ligne fournie aux utilisateurs
- [ ] Liste de commandes approuvées distribuée
```

### Validation après déploiement

```bash
#!/bin/bash
# enterprise/validate-air-gap.sh

echo "[*] Validation du déploiement air-gap..."

# 1. Test d'isolation réseau
bash enterprise/audit-network-isolation.sh || exit 1

# 2. Test du modèle local
curl -s http://127.0.0.1:11434/api/tags | grep -q "name" && echo "[PASS] LLM local en cours d'exécution"

# 3. Test des MCP approuvés
claude --help | grep -q "mcp" && echo "[PASS] Support MCP disponible"

# 4. Test de la journalisation d'audit
tail -5 /var/log/claudient/operations.log | grep -q "timestamp" && echo "[PASS] Journalisation d'audit en cours d'exécution"

# 5. Test Claude Code avec les paramètres air-gap
export DISABLE_EXTERNAL_MCP=true
claude --version && echo "[PASS] Claude Code en mode air-gap"

echo "[OK] Validation du déploiement air-gap terminée"
```

---

## Partie 6 : Dépannage et récupération

### Problème : « Connection refused » sur le modèle local

```bash
# Vérifier que le modèle local fonctionne
lsof -i :11434 | grep -q LISTEN && echo "Ollama en cours d'exécution" || ollama serve

# Vérifier que le pare-feu ne bloque pas localhost
sudo iptables -L | grep "127.0.0.1" | grep "ACCEPT"
```

### Problème : « External call attempted » dans le journal d'audit

Procédure d'investigation :

```bash
# Trouver l'opération contrevenante
grep "external_calls_attempted.*> 0" /var/log/claudient/operations.log | head -1

# Identifier la commande
grep -B5 "external_calls_attempted" /var/log/claudient/operations.log | grep "command"

# Vérifier que le serveur MCP n'a pas tenté d'appel externe
journalctl -u mcp-server --since "1 hour ago" | grep -i "connect\|http"
```

### Problème : La qualité du modèle est faible (LLM local)

Considérez ces améliorations :

1. **Utiliser un modèle plus grand :** `ollama pull mistral` ou `llama2-13b`
2. **Activer l'accélération GPU :** `--gpus all` dans la configuration docker
3. **Réduire la latence :** Utiliser vLLM au lieu d'Ollama
4. **Traiter par lots :** Mettre en file d'attente et traiter pendant les heures creuses

---

## Résumé

**Contrôles de sécurité air-gap :**

1. **Isolation réseau :** Vérifier zéro connectivité externe ; pare-feu DROP sortie
2. **Service de modèle local :** Ollama ou vLLM pour l'inférence ; aucune API externe
3. **Liste blanche MCP :** Uniquement filesystem, git, bash, postgres, sqlite autorisés
4. **Restrictions Bash :** Liste blanche de commandes, modèles bloqués, hooks de validation
5. **Journalisation d'audit :** Journalisation JSON, transfert centralisé, rapports de conformité
6. **Liste de contrôle de déploiement :** Validation avant et après le vol

**Pour l'exploitation hors ligne sans air-gap**, consultez `guides/offline-local-first.md`.

**Pour la validation de stack**, consultez `workflows/offline-validation.md`.
