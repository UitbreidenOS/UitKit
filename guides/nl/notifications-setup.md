# Meldingen en waarschuwingen voor lange Claude Code-sessies

Complete installatiehulp voor het geïnformeerd blijven tijdens lange autonome Claude Code-runs — nachtelijke bouwbewerkingen, bulkmigraties, multi-agent workflows of elke sessie waar u van het toetsenbord af gaat. Kies er één of combineer meerdere op basis van uw omgeving.

---

## Waarom dit belangrijk is

Claude Code kan uren op autonome taken lopen. Zonder meldingen:
- U weet niet wanneer een sessie eindigt of vast loopt
- Toestemmingsprompts blokkeren voortgang totdat u terugkeert
- Fouten stapelen zich onopgemerkt op

Met meldingen kunt u Claude laten draaien en alleen teruggeroepen worden wanneer iets uw aandacht nodig heeft.

---

## Methode 1: ntfy mobiele push

**Beste voor:** op de hoogte worden overal, ook wanneer uw laptop dicht is.

ntfy is een gratis, open source pushmelding service. Geen account vereist voor zelf-hosted. De gehoste `ntfy.sh` is gratis voor laag volume.

**Setup (gehoste ntfy.sh):**

1. Installeer de ntfy app op iOS of Android en abonneer op een onderwerp (kies een unieke naam, bijv. `claudient-tushar-2026`).

2. Voeg een `stop` hook toe aan `settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -d \"Claude session ended\" ntfy.sh/YOUR-TOPIC-NAME"
          }
        ]
      }
    ]
  }
}
```

3. Voor toestemmingsverzoeken voegt u een `PreToolUse` hook toe op hulpmiddelen met hoog risico:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"$CLAUDE_TOOL_INPUT\" | grep -qE \"(rm |drop |delete |truncate )\" && curl -s -H \"Priority: urgent\" -d \"Claude wants to run a destructive command\" ntfy.sh/YOUR-TOPIC-NAME || true'"
          }
        ]
      }
    ]
  }
}
```

**Zelf-gehoste ntfy** (Docker):
```bash
docker run -p 80:80 -v /var/cache/ntfy:/var/cache/ntfy binwiederhier/ntfy serve
```
Vervang `ntfy.sh` door uw serveradres in de curl-opdrachten.

**Testen:**
```bash
curl -d "test notification" ntfy.sh/YOUR-TOPIC-NAME
```

---

## Methode 2: TTS-spraakaankondiging

**Beste voor:** casual bewustzijn wanneer u in de buurt bent maar niet naar het scherm kijkt.

macOS heeft ingebouwde TTS via de `say`-opdracht. Linux gebruikt `pyttsx3` of `espeak`.

**macOS — Stop hook:**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "say 'Claude session complete'"
          }
        ]
      }
    ]
  }
}
```

**macOS — Notification hook op fouten:**

```bash
#!/bin/bash
# hooks/tts-error-alert.sh
# Reads CLAUDE_HOOK_EVENT from env and announces errors
if echo "$CLAUDE_HOOK_EVENT" | grep -qi "error\|failed\|permission"; then
  say "Claude needs attention: $(echo $CLAUDE_HOOK_EVENT | head -c 100)"
fi
```

**Linux (pyttsx3):**
```python
#!/usr/bin/env python3
# hooks/tts-announcer.py
import pyttsx3, os, sys

engine = pyttsx3.init()
engine.setProperty('rate', 160)
message = os.environ.get('CLAUDE_SESSION_SUMMARY', 'Claude session complete')
engine.say(message)
engine.runAndWait()
```

Installeer: `pip install pyttsx3`

**Linux (espeak, geen afhankelijkheden):**
```json
{
  "hooks": {
    "Stop": [{ "type": "command", "command": "espeak 'Claude session complete'" }]
  }
}
```

---

## Methode 3: Slack webhook meldingen

**Beste voor:** teamzichtbaarheid — laat teamgenoten weten wanneer gedeelde Claude runs eindigen of invoer nodig hebben.

**Setup:**

1. Maak een inkomende webhook in uw Slack-werkruimte (Slack → App Directory → Inkomende Webhooks).
2. Kopieer de webhook URL.

**Stop hook:**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -X POST -H 'Content-type: application/json' --data '{\"text\":\"Claude Code session finished in ${PWD}\"}' YOUR-SLACK-WEBHOOK-URL"
          }
        ]
      }
    ]
  }
}
```

**Hook-script met context (aanbevolen boven inline curl):**

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
          \"text\": \"*Claude session complete*\n*Project:* ${PROJECT}\n*Time:* ${TIMESTAMP}\"
        }
      }
    ]
  }" \
  "$WEBHOOK_URL"
```

Bewaar de webhook URL in uw shell-omgeving (`~/.zshrc` of `.env`), niet in `settings.json`.

**Voor toestemmings-gate meldingen:**

```bash
# hooks/slack-permission-request.sh
# Call this when Claude needs human approval before continuing
curl -s -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"@here Claude needs approval to proceed in *${PROJECT}* — check your terminal\"}" \
  "$WEBHOOK_URL"
```

---

## Methode 4: WhatsApp-poort voor toestemmingsverzoeken

**Beste voor:** route hoog-inzet toestemmingsverzoeken naar uw telefoon wanneer u weg van de computer bent.

WhatsApp meldingen vereisen de WhatsApp Business Cloud API of een service van derden als Twilio of CallMeBot. CallMeBot is het eenvoudigste voor persoonlijk gebruik.

**CallMeBot setup:**

1. Voeg het CallMeBot-nummer toe aan uw WhatsApp-contacten: +34 644 59 65 15
2. Stuur "I allow callmebot to send me messages" naar dat nummer
3. U ontvangt uw API-sleutel in antwoord

**Hook script:**

```bash
#!/bin/bash
# hooks/whatsapp-gate.sh
PHONE="YOUR_PHONE_NUMBER_WITH_COUNTRY_CODE"  # e.g., 14155551234
API_KEY="YOUR_CALLMEBOT_KEY"
MESSAGE=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$1'))")

curl -s "https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${MESSAGE}&apikey=${API_KEY}"
```

**settings.json — brand op destructieve Bash-opdrachten:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash /path/to/hooks/whatsapp-gate.sh 'Claude wants to run: $CLAUDE_TOOL_COMMAND'"
          }
        ]
      }
    ]
  }
}
```

**Beperking:** WhatsApp meldingen zijn eenrichtingsverkeer — Claude kan niet wachten op een WhatsApp-antwoord. Gebruik dit alleen als waarschuwing; antwoord in de terminal.

---

## Methode 5: Desktop meldingen

**Beste voor:** wanneer u op de computer bent maar gericht op een ander venster.

**macOS — terminal-notifier:**

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
            "command": "terminal-notifier -title 'Claude Code' -message 'Session complete' -sound default"
          }
        ]
      }
    ]
  }
}
```

**macOS — osascript (geen installatie):**

```bash
osascript -e 'display notification "Session complete" with title "Claude Code" sound name "Glass"'
```

**Linux — notify-send:**

```bash
notify-send "Claude Code" "Session complete" --icon=terminal --urgency=normal
```

Voor root/service sessies waar `DISPLAY` niet is ingesteld:
```bash
DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus notify-send "Claude Code" "Done"
```

---

## Methoden combineren: prioriteitsvolgorde

Met alle methoden tegelijk draait u lawaai. Gebruik een prioriteitsstack:

| Scenario | Methode |
|---|---|
| Sessie voltooid (normaal) | TTS voice (casual awareness) |
| Sessie nodig invoer | Desktop notification + Slack |
| Sessie raakt destructieve opdracht | ntfy mobiele push (urgent) + WhatsApp gate |
| Onbewaakt nachtrun | ntfy mobiele push alleen |
| Team gedeelde Claude run | Slack webhook |

**Gecombineerde settings.json (macOS, persoonlijk gebruik):**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "say 'Claude done'" },
          { "type": "command", "command": "terminal-notifier -title 'Claude Code' -message 'Session complete'" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"$CLAUDE_TOOL_INPUT\" | grep -qE \"(sudo |rm -rf|drop table|truncate)\" && curl -s -H \"Priority: urgent\" -d \"Dangerous command requested\" ntfy.sh/YOUR-TOPIC || true'"
          }
        ]
      }
    ]
  }
}
```

---

## Testen vóór onbewaakt laten van Claude

Vóór het starten van een lange autonome run:

```bash
# Test TTS
say "test notification"

# Test desktop notification
terminal-notifier -title "Test" -message "Notification works"

# Test ntfy
curl -d "test" ntfy.sh/YOUR-TOPIC

# Test Slack
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"test"}' YOUR-SLACK-WEBHOOK
```

Voer een korte 2-minuten Claude sessie uit met uw hooks actief en bevestig minstens één melding maakt vuurwerk voordat u een multi-uur sessie onbewaakt laat.

---
