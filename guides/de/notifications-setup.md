# Notifications and Alerts for Long Claude Code Sessions

Vollständiger Setup-Leitfaden, um während langer autonomer Claude Code-Läufe informiert zu bleiben — Overnight-Builds, Massen-Migrationen, Multi-Agent-Workflows oder jede Session, in der Sie von der Tastatur aufstehen. Wählen Sie eins oder kombinieren Sie mehrere basierend auf Ihrer Umgebung.

---

## Warum das wichtig ist

Claude Code kann Stunden mit autonomen Tasks laufen. Ohne Benachrichtigungen:
- Sie wissen nicht, wenn eine Session fertig ist oder steckenbleibt
- Permission-Aufforderungen blockieren Fortschritt, bis Sie zurückkommt
- Fehler häufen sich unbemerkt an

Mit Benachrichtigungen können Sie Claude laufen lassen und nur dann zurückgezogen werden, wenn etwas Ihre Aufmerksamkeit braucht.

---

## Methode 1: ntfy Mobile Push

**Am besten für:** Benachrichtigungen überall erhalten, auch wenn Ihr Laptop geschlossen ist.

ntfy ist ein kostenloser, Open-Source Push-Benachrichtigungsdienst. Kein Konto erforderlich für selbst-gehostet. Das gehostete `ntfy.sh` ist kostenlos für niedriges Volumen.

**Setup (gehostetes ntfy.sh):**

1. Installieren Sie die ntfy App auf iOS oder Android und abonnieren Sie ein Topic (wählen Sie einen eindeutigen Namen, z.B. `claudient-tushar-2026`).

2. Addieren Sie einen `stop` Hook zu `settings.json`:

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

3. Für Permission-Anfragen, addieren Sie einen `PreToolUse` Hook auf High-Risk Tools:

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

**Selbst-gehostetes ntfy** (Docker):
```bash
docker run -p 80:80 -v /var/cache/ntfy:/var/cache/ntfy binwiederhier/ntfy serve
```
Ersetzen Sie `ntfy.sh` mit Ihrer Server-Adresse in den curl-Befehlen.

**Testen:**
```bash
curl -d "test notification" ntfy.sh/YOUR-TOPIC-NAME
```

---

## Methode 2: TTS Voice Announcer

**Am besten für:** Freizeitiges Bewusstsein, wenn Sie in der Nähe aber nicht auf den Bildschirm schauen.

macOS hat integrierte TTS über den `say`-Befehl. Linux nutzt `pyttsx3` oder `espeak`.

**macOS — Stop Hook:**

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

**macOS — Notification Hook auf Errors:**

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

Installieren Sie: `pip install pyttsx3`

**Linux (espeak, keine Abhängigkeiten):**
```json
{
  "hooks": {
    "Stop": [{ "type": "command", "command": "espeak 'Claude session complete'" }]
  }
}
```

---

## Methode 3: Slack Webhook Benachrichtigungen

**Am besten für:** Team-Sichtbarkeit — Informieren Sie Teamkollegen, wenn gemeinsame Claude-Läufe fertig oder brauchen Input.

**Setup:**

1. Erstellen Sie einen Incoming Webhook in Ihrem Slack-Arbeitsbereich (Slack → App Directory → Incoming Webhooks).
2. Kopieren Sie die Webhook-URL.

**Stop Hook:**

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

**Hook Script mit Kontext (empfohlen über inline curl):**

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

Speichern Sie die Webhook-URL in Ihrer Shell-Umgebung (`~/.zshrc` oder `.env`), nicht in `settings.json`.

**Für Permission-Gate Benachrichtigungen:**

```bash
# hooks/slack-permission-request.sh
# Rufen Sie das auf, wenn Claude menschliche Genehmigung vor dem Fortsetzen braucht
curl -s -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"@here Claude needs approval to proceed in *${PROJECT}* — check your terminal\"}" \
  "$WEBHOOK_URL"
```

---

## Methode 4: WhatsApp Gate für Permission-Anfragen

**Am besten für:** Routing von High-Stakes Permission-Anfragen zu Ihrem Telefon, wenn Sie weg vom Computer sind.

WhatsApp-Benachrichtigungen erfordern die WhatsApp Business Cloud API oder einen Third-Party Service wie Twilio oder CallMeBot. CallMeBot ist das einfachste für persönliche Nutzung.

**CallMeBot Setup:**

1. Addieren Sie die CallMeBot Nummer zu Ihren WhatsApp-Kontakten: +34 644 59 65 15
2. Senden Sie "I allow callmebot to send me messages" an diese Nummer
3. Sie erhalten Ihren API-Schlüssel als Antwort

**Hook Script:**

```bash
#!/bin/bash
# hooks/whatsapp-gate.sh
PHONE="YOUR_PHONE_NUMBER_WITH_COUNTRY_CODE"  # z.B. 14155551234
API_KEY="YOUR_CALLMEBOT_KEY"
MESSAGE=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$1'))")

curl -s "https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${MESSAGE}&apikey=${API_KEY}"
```

**settings.json — Feuer auf destruktive Bash-Befehle:**

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

**Einschränkung:** WhatsApp-Benachrichtigungen sind One-Way — Claude kann nicht auf eine WhatsApp-Antwort warten. Verwenden Sie dies als Alert nur; antworten Sie im Terminal.

---

## Methode 5: Desktop-Benachrichtigungen

**Am besten für:** Wenn Sie am Computer, aber auf ein anderes Fenster fokussiert sind.

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

**macOS — osascript (kein Install):**

```bash
osascript -e 'display notification "Session complete" with title "Claude Code" sound name "Glass"'
```

**Linux — notify-send:**

```bash
notify-send "Claude Code" "Session complete" --icon=terminal --urgency=normal
```

Für Root/Service Sessions, wo `DISPLAY` nicht gesetzt ist:
```bash
DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus notify-send "Claude Code" "Done"
```

---

## Kombination von Methoden: Prioritätsordnung

Das Laufen aller Methoden auf einmal erzeugt Lärmm. Verwenden Sie einen Priority Stack:

| Szenario | Methode |
|---|---|
| Session fertig (normal) | TTS Voice (freizeitiges Bewusstsein) |
| Session braucht Input | Desktop Benachrichtigung + Slack |
| Session trifft destructive Befehl | ntfy Mobile Push (dringend) + WhatsApp Gate |
| Unattended Overnight Run | ntfy Mobile Push nur |
| Team Shared Claude Run | Slack Webhook |

**Kombinierte settings.json (macOS, persönliche Nutzung):**

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

## Testen vor dem Verlassen von Claude Unattended

Vor dem Starten eines langen autonomen Laufs:

```bash
# Test TTS
say "test notification"

# Test Desktop Benachrichtigung
terminal-notifier -title "Test" -message "Notification works"

# Test ntfy
curl -d "test" ntfy.sh/YOUR-TOPIC

# Test Slack
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"test"}' YOUR-SLACK-WEBHOOK
```

Führen Sie eine kurze 2-Minuten Claude-Session mit Ihren Hooks aktiv aus und bestätigen Sie mindestens eine Benachrichtigung erzeugt, bevor Sie eine Multi-Stunden-Session unbeaufsichtigt verlassen.

---
