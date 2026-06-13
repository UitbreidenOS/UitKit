# Notificaciones y alertas para sesiones largas de Claude Code

Guía de configuración completa para mantenerte informado durante ejecuciones autónomas largas de Claude Code — compilaciones nocturnas, migraciones en lote, flujos de trabajo multi-agente, o cualquier sesión donde te alejas del teclado. Elige una o combina varias según tu entorno.

---

## Por qué importa

Claude Code puede ejecutarse durante horas en tareas autónomas. Sin notificaciones:
- No sabes cuándo una sesión termina o se estanca
- Los prompts de permiso bloquean el progreso hasta que regreses
- Los errores se acumulan sin notarse

Con notificaciones, puedes dejar que Claude se ejecute y recibe información solo cuando algo necesita tu atención.

---

## Método 1: ntfy push móvil

**Mejor para:** Ser notificado en cualquier lugar, incluido cuando tu portátil está cerrado.

ntfy es un servicio de notificación push gratuito y de código abierto. No se requiere cuenta para auto-hospedado. El `ntfy.sh` hospedado es gratuito para bajo volumen.

**Configuración (ntfy.sh hospedado):**

1. Instala la app ntfy en iOS o Android y suscríbete a un tema (elige un nombre único, p. ej., `claudient-tushar-2026`).

2. Agrega un hook `stop` a `settings.json`:

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

3. Para solicitudes de permiso, agrega un hook `PreToolUse` en herramientas de alto riesgo:

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

**ntfy auto-hospedado** (Docker):
```bash
docker run -p 80:80 -v /var/cache/ntfy:/var/cache/ntfy binwiederhier/ntfy serve
```
Reemplaza `ntfy.sh` con tu dirección de servidor en los comandos curl.

**Prueba:**
```bash
curl -d "test notification" ntfy.sh/YOUR-TOPIC-NAME
```

---

## Método 2: Anunciador de voz TTS

**Mejor para:** Conciencia casual cuando estás cerca pero no mirando la pantalla.

macOS tiene TTS incorporado vía el comando `say`. Linux usa `pyttsx3` o `espeak`.

**macOS — Hook Stop:**

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

**macOS — Hook de notificación en errores:**

```bash
#!/bin/bash
# hooks/tts-error-alert.sh
# Lee CLAUDE_HOOK_EVENT del env y anuncia errores
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

Instala: `pip install pyttsx3`

**Linux (espeak, sin dependencias):**
```json
{
  "hooks": {
    "Stop": [{ "type": "command", "command": "espeak 'Claude session complete'" }]
  }
}
```

---

## Método 3: Notificaciones de webhook de Slack

**Mejor para:** Visibilidad del equipo — dejando que compañeros de equipo sepan cuándo las ejecuciones compartidas de Claude terminan o necesitan entrada.

**Configuración:**

1. Crea un webhook entrante en tu espacio de trabajo de Slack (Slack → Directorio de apps → Webhooks entrantes).
2. Copia la URL del webhook.

**Hook Stop:**

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

**Script de hook con contexto (recomendado sobre curl en línea):**

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

Almacena la URL del webhook en tu entorno de shell (`~/.zshrc` o `.env`), no en `settings.json`.

**Para notificaciones de puerta de permiso:**

```bash
# hooks/slack-permission-request.sh
# Llama esto cuando Claude necesita aprobación humana para continuar
curl -s -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"@here Claude needs approval to proceed in *${PROJECT}* — check your terminal\"}" \
  "$WEBHOOK_URL"
```

---

## Método 4: Gate de WhatsApp para solicitudes de permiso

**Mejor para:** Enrutamiento de solicitudes de permiso de alto riesgo a tu teléfono cuando estás lejos de la computadora.

Las notificaciones de WhatsApp requieren la API de nube de negocios de WhatsApp o un servicio de terceros como Twilio o CallMeBot. CallMeBot es el más simple para uso personal.

**Configuración de CallMeBot:**

1. Agrega el número de CallMeBot a tus contactos de WhatsApp: +34 644 59 65 15
2. Envía "I allow callmebot to send me messages" a ese número
3. Recibirás tu clave API en respuesta

**Script de hook:**

```bash
#!/bin/bash
# hooks/whatsapp-gate.sh
PHONE="YOUR_PHONE_NUMBER_WITH_COUNTRY_CODE"  # p. ej., 14155551234
API_KEY="YOUR_CALLMEBOT_KEY"
MESSAGE=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$1'))")

curl -s "https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${MESSAGE}&apikey=${API_KEY}"
```

**settings.json — dispara en comandos Bash destructivos:**

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

**Limitación:** Las notificaciones de WhatsApp son unidireccionales — Claude no puede esperar respuesta de WhatsApp. Usa esto como alerta solo; responde en la terminal.

---

## Método 5: Notificaciones de escritorio

**Mejor para:** Cuando estás en la computadora pero enfocado en otra ventana.

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

**macOS — osascript (sin instalación):**

```bash
osascript -e 'display notification "Session complete" with title "Claude Code" sound name "Glass"'
```

**Linux — notify-send:**

```bash
notify-send "Claude Code" "Session complete" --icon=terminal --urgency=normal
```

Para sesiones de root/servicio donde `DISPLAY` no está configurado:
```bash
DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus notify-send "Claude Code" "Done"
```

---

## Combinación de métodos: orden de prioridad

Ejecutar todos los métodos a la vez crea ruido. Usa una pila de prioridad:

| Escenario | Método |
|---|---|
| Sesión completa (normal) | Voz TTS (conciencia casual) |
| Sesión necesita entrada | Notificación de escritorio + Slack |
| Sesión alcanza comando destructivo | ntfy push móvil (urgente) + gate de WhatsApp |
| Ejecución nocturna desatendida | Solo ntfy push móvil |
| Ejecución compartida de Claude del equipo | Webhook de Slack |

**settings.json combinado (macOS, uso personal):**

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

## Prueba antes de dejar Claude desatendido

Antes de iniciar una ejecución autónoma larga:

```bash
# Prueba TTS
say "test notification"

# Prueba notificación de escritorio
terminal-notifier -title "Test" -message "Notification works"

# Prueba ntfy
curl -d "test" ntfy.sh/YOUR-TOPIC

# Prueba Slack
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"test"}' YOUR-SLACK-WEBHOOK
```

Ejecuta una sesión corta de Claude de 2 minutos con tus hooks activos y confirma que al menos una notificación se dispara antes de dejar una sesión de múltiples horas desatendida.

---
