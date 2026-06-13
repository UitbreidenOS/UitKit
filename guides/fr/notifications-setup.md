# Notifications et alertes pour les longues sessions Claude Code

Guide de configuration complet pour rester informé pendant les exécutions autonomes longues de Claude Code — builds nocturnes, migrations en masse, workflows multi-agents, ou toute session où vous vous éloignez du clavier. Choisissez une méthode ou combinez-en plusieurs selon votre environnement.

---

## Pourquoi c'est important

Claude Code peut s'exécuter pendant des heures sur des tâches autonomes. Sans notifications :
- Vous ne savez pas quand une session se termine ou se bloque
- Les demandes de permission bloquent la progression jusqu'à votre retour
- Les erreurs s'accumulent sans être remarquées

Avec des notifications, vous pouvez laisser Claude s'exécuter et n'être rappelé que lorsque quelque chose nécessite votre attention.

---

## Méthode 1 : Notifications push mobile ntfy

**Idéal pour :** Être notifié n'importe où, même lorsque votre ordinateur portable est fermé.

ntfy est un service de notifications push gratuit et open source. Aucun compte requis pour l'auto-hébergement. Le service hébergé `ntfy.sh` est gratuit pour faible volume.

**Configuration (ntfy.sh hébergé) :**

1. Installez l'application ntfy sur iOS ou Android et abonnez-vous à un sujet (choisissez un nom unique, par exemple `claudient-mon-projet-2026`).

2. Ajoutez un hook `Stop` dans `settings.json` :

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -d \"Session Claude terminée\" ntfy.sh/VOTRE-NOM-DE-SUJET"
          }
        ]
      }
    ]
  }
}
```

3. Pour les demandes de permission, ajoutez un hook `PreToolUse` sur les outils à risque élevé :

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"$CLAUDE_TOOL_INPUT\" | grep -qE \"(rm |drop |delete |truncate )\" && curl -s -H \"Priority: urgent\" -d \"Claude veut exécuter une commande destructive\" ntfy.sh/VOTRE-SUJET || true'"
          }
        ]
      }
    ]
  }
}
```

**ntfy auto-hébergé (Docker) :**
```bash
docker run -p 80:80 -v /var/cache/ntfy:/var/cache/ntfy binwiederhier/ntfy serve
```

**Test :**
```bash
curl -d "test de notification" ntfy.sh/VOTRE-SUJET
```

---

## Méthode 2 : Annonceur vocal TTS

**Idéal pour :** Une prise de conscience décontractée quand vous êtes à proximité mais ne regardez pas l'écran.

macOS dispose du TTS intégré via la commande `say`. Linux utilise `pyttsx3` ou `espeak`.

**macOS — Hook Stop :**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "say 'Session Claude terminée'"
          }
        ]
      }
    ]
  }
}
```

**Linux (pyttsx3) :**
```python
#!/usr/bin/env python3
# hooks/tts-announcer.py
import pyttsx3, os, sys

engine = pyttsx3.init()
engine.setProperty('rate', 160)
message = os.environ.get('CLAUDE_SESSION_SUMMARY', 'Session Claude terminée')
engine.say(message)
engine.runAndWait()
```

Installation : `pip install pyttsx3`

**Linux (espeak, sans dépendances) :**
```json
{
  "hooks": {
    "Stop": [{ "type": "command", "command": "espeak 'Session Claude terminée'" }]
  }
}
```

---

## Méthode 3 : Notifications Slack via webhook

**Idéal pour :** Visibilité en équipe — informer les coéquipiers quand les exécutions Claude partagées se terminent ou nécessitent une intervention.

**Configuration :**

1. Créez un webhook entrant dans votre espace de travail Slack (Slack → Répertoire d'apps → Webhooks entrants).
2. Copiez l'URL du webhook.

**Hook Stop :**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -X POST -H 'Content-type: application/json' --data '{\"text\":\"Session Claude Code terminée dans ${PWD}\"}' VOTRE-URL-WEBHOOK-SLACK"
          }
        ]
      }
    ]
  }
}
```

**Script de hook avec contexte (recommandé plutôt que curl en ligne) :**

```bash
#!/bin/bash
# hooks/slack-notify.sh
WEBHOOK_URL="${SLACK_CLAUDE_WEBHOOK}"
PROJECT=$(basename "$PWD")
TIMESTAMP=$(date '+%H:%M')

curl -s -X POST -H 'Content-type: application/json' \
  --data "{
    \"blocks\": [
      {
        \"type\": \"section\",
        \"text\": {
          \"type\": \"mrkdwn\",
          \"text\": \"*Session Claude terminée*\n*Projet :* ${PROJECT}\n*Heure :* ${TIMESTAMP}\"
        }
      }
    ]
  }" \
  "$WEBHOOK_URL"
```

Stockez l'URL du webhook dans votre environnement shell (`~/.zshrc` ou `.env`), pas dans `settings.json`.

---

## Méthode 4 : Portail WhatsApp pour les demandes de permission

**Idéal pour :** Router les demandes de permission à enjeux élevés vers votre téléphone quand vous êtes loin de l'ordinateur.

Les notifications WhatsApp nécessitent l'API WhatsApp Business Cloud ou un service tiers comme Twilio ou CallMeBot. CallMeBot est le plus simple pour l'usage personnel.

**Configuration CallMeBot :**

1. Ajoutez le numéro CallMeBot à vos contacts WhatsApp : +34 644 59 65 15
2. Envoyez "I allow callmebot to send me messages" à ce numéro
3. Vous recevrez votre clé API en réponse

**Script de hook :**

```bash
#!/bin/bash
# hooks/whatsapp-gate.sh
PHONE="VOTRE_NUMERO_AVEC_INDICATIF_PAYS"  # ex. 33612345678
API_KEY="VOTRE_CLE_CALLMEBOT"
MESSAGE=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$1'))")

curl -s "https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${MESSAGE}&apikey=${API_KEY}"
```

**Limitation :** Les notifications WhatsApp sont unidirectionnelles — Claude ne peut pas attendre une réponse WhatsApp. Utilisez ceci uniquement comme alerte ; répondez dans le terminal.

---

## Méthode 5 : Notifications de bureau

**Idéal pour :** Quand vous êtes à l'ordinateur mais concentré sur une autre fenêtre.

**macOS — terminal-notifier :**

```bash
brew install terminal-notifier
```

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "terminal-notifier -title 'Claude Code' -message 'Session terminée' -sound default"
          }
        ]
      }
    ]
  }
}
```

**macOS — osascript (sans installation) :**

```bash
osascript -e 'display notification "Session terminée" with title "Claude Code" sound name "Glass"'
```

**Linux — notify-send :**

```bash
notify-send "Claude Code" "Session terminée" --icon=terminal --urgency=normal
```

---

## Combiner les méthodes : ordre de priorité

Utiliser toutes les méthodes à la fois crée du bruit. Adoptez une pile de priorités :

| Scénario | Méthode |
|---|---|
| Session se termine normalement | Annonce vocale TTS (prise de conscience décontractée) |
| Session nécessite une intervention | Notification de bureau + Slack |
| Session frappe une commande destructive | Push mobile ntfy (urgent) + portail WhatsApp |
| Exécution nocturne sans surveillance | Push mobile ntfy uniquement |
| Exécution Claude partagée en équipe | Webhook Slack |

**settings.json combiné (macOS, usage personnel) :**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "say 'Claude terminé'" },
          { "type": "command", "command": "terminal-notifier -title 'Claude Code' -message 'Session terminée'" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"$CLAUDE_TOOL_INPUT\" | grep -qE \"(sudo |rm -rf|drop table|truncate)\" && curl -s -H \"Priority: urgent\" -d \"Commande dangereuse demandée\" ntfy.sh/VOTRE-SUJET || true'"
          }
        ]
      }
    ]
  }
}
```

---

## Tester avant de laisser Claude sans surveillance

Avant de démarrer une longue exécution autonome :

```bash
# Tester TTS
say "test de notification"

# Tester notification de bureau
terminal-notifier -title "Test" -message "La notification fonctionne"

# Tester ntfy
curl -d "test" ntfy.sh/VOTRE-SUJET

# Tester Slack
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"test"}' VOTRE-WEBHOOK-SLACK
```

Lancez une courte session Claude de 2 minutes avec vos hooks actifs et confirmez qu'au moins une notification se déclenche avant de laisser une session de plusieurs heures sans surveillance.

---
