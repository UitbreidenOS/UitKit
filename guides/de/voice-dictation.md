# Sprachdiktat in Claude Code

Sprachdiktat ermöglicht es Ihnen, Prompts zu sprechen, anstatt sie zu tippen. Es ist eine erstklassige Funktion der Claude Code CLI — nicht ein Plugin, nicht eine Drittanbieter-Integration. Die Transkription läuft über Anthropic-Server, was bedeutet, dass es ein claude.ai-Konto benötigt und nicht allein mit einem API-Schlüssel funktioniert.

---

## Voraussetzungen

**Kontoanforderung :** Sprachdiktat erfordert ein claude.ai-Konto, das mit Ihrer Claude Code-Sitzung verknüpft ist. Wenn Sie sich nur mit einem rohen API-Schlüssel authentifiziert haben, ist Sprache nicht verfügbar.

**Plattform-Unterstützung :**

| Plattform | Status | Setup |
|---|---|---|
| macOS | Funktioniert sofort | Nichts erforderlich |
| Linux | Benötigt Audio-Tool | `arecord` (ALSA) oder `sox` installieren |
| WSL | Benötigt WSLg + Audio | `sox libsox-fmt-pulse` installieren; WSLg muss aktiv sein |
| SSH-Sitzung | Nicht unterstützt | Nur lokales Terminal verwenden |
| Web-Interface | Nicht unterstützt | Nur CLI |

**Linux-Setup :**
```bash
# Debian/Ubuntu — ALSA
sudo apt install alsa-utils

# Debian/Ubuntu — sox (Alternative, auch für WSL erforderlich)
sudo apt install sox libsox-fmt-pulse

# Fedora
sudo dnf install sox
```

**WSL-Setup :**
```bash
sudo apt install sox libsox-fmt-pulse
# Bestätigen Sie, dass WSLg aktiv ist — von PowerShell ausführen:
# wsl --update
```

---

## Sprachdiktat aktivieren

Sprachschalter von innerhalb einer Claude Code-Sitzung:

```
/voice
```

Dies aktiviert Voice im Standardmodus (`hold`). Um Modi explizit zu wechseln:

```
/voice hold   # Leerzeichen halten zum Aufnehmen, loslassen zum Senden
/voice tap    # Einmal auf Leerzeichen tippen zum Starten, erneut zum Beenden
/voice off    # Sprache deaktivieren
```

**Hold-Modus** ist der Standard und funktioniert gut zum Diktieren von Prompts in natürlicher Länge — Leerzeichen gedrückt halten, sprechen, loslassen. Der Prompt wird sofort beim Loslassen gesendet.

**Tap-Modus** ist besser für längere Diktat, wenn Sie eine Taste nicht halten möchten. Leerzeichen einmal tippen zum Starten der Aufnahme, erneut tippen zum Beenden.

---

## Permanente Konfiguration

Setzen Sie Spracheinstellungen in `~/.claude/settings.json`, damit sie über Sitzungen hinweg bestehen bleiben:

```json
{
  "voice": {
    "enabled": true,
    "mode": "tap"
  }
}
```

Gültige Werte für `mode`: `"hold"` oder `"tap"`. Setzen Sie `enabled: false`, um Sprache standardmäßig zu deaktivieren, ohne die Konfiguration zu entfernen.

---

## Neubelegen des Push-to-Talk-Schlüssels

Der Standard-Aufnahmeschlüssel ist Leerzeichen, gesteuert durch `$VOICE_PUSH_TO_TALK_KEY`. Zum Neubinden, bearbeiten Sie `~/.claude/keybindings.json`:

```json
{
  "Chat": {
    "voice:pushToTalk": "v"
  }
}
```

Die Bindung lebt im `Chat` Kontext. Jede einzelne Taste oder Tastenkombination, die vom Bindungssystem unterstützt wird, funktioniert hier. Leerzeichen ist praktisch, kollidiert aber mit normaler Texteingabe — einige Entwickler bevorzugen `v` oder `F9` um versehentliche Aktivierungen zu vermeiden.

---

## Sprachunterstützung

Claude Code-Sprache unterstützt 20 Sprachen. Wechseln Sie die Transkriptionssprache über den Schlüssel `language` in Benutzereinstellungen:

```json
{
  "voice": {
    "enabled": true,
    "mode": "hold"
  },
  "language": "fr"
}
```

Die `language`-Einstellung ist ein BCP 47 Sprach-Tag. Beispiele: `en`, `fr`, `de`, `es`, `nl`, `ja`, `zh`, `pt`, `ko`, `it`. Setzen Sie dies auf der Benutzerebene (`~/.claude/settings.json`), nicht pro Projekt.

---

## Wie Transkription funktioniert

Wenn Sie die Push-to-Talk-Taste loslassen (Hold-Modus) oder zum Stoppen tippen (Tap-Modus), wird das aufgezeichnete Audio zu Anthropic-Transkriptionsservern gestreamt. Der zurückgegebene Text wird in das Prompt-Eingabefeld genau so platziert, als hätten Sie ihn eingegeben. Sie können die Transkription bearbeiten, bevor Claude sie verarbeitet — sie wird nicht automatisch eingereicht, es sei denn, Sie konfigurieren dies.

Dies bedeutet, dass Sprache den normalen Claude Code-Sitzungsfluss nicht umgeht. Hooks, Berechtigungen und Tool-Genehmigungsaufforderungen verhalten sich alle identisch zu getippter Eingabe.

---

## Praktische Nutzungsmuster

**Lange Refactor-Anfragen diktieren :** Zu Tap-Modus wechseln, Leerzeichen tippen, die vollständige Umstrukturierung in natürlicher Sprache beschreiben (« Extrahieren Sie die Datenbankverbindungslogik aus `server.ts` in ein dediziertes `db/connection.ts` Modul, aktualisieren Sie alle Importe, fügen Sie einen Verbindungspool mit max 10 Verbindungen hinzu »), erneut tippen. Überprüfen Sie die Transkription, drücken Sie Eingabe.

**Freisprechbewertung beim Lesen :** Öffnen Sie eine Datei auf einem zweiten Monitor, lesen Sie durch den Code, und diktieren Sie Beobachtungen ohne Tastaturfocus zu wechseln. Sprache funktioniert während aktiver Claude-Sitzungen — Claude muss nicht untätig sein.

**Schnelle Iteration auf Prompts :** Verwenden Sie Hold-Modus für kurze Folgefragen. Leerzeichen halten, sagen Sie « Warum haben Sie diesen Ansatz gewählt? », loslassen. Schneller als Tippen für kurze Fragen.

**Mit `/btw` für Seitenfragen paaren :** Sprache funktioniert auch mit `/btw`. Leerzeichen halten nach Eingabe von `/btw ` und die Frage diktieren — Transkription füllt nach dem Befehlspräfix.

---

## Einschränkungen

- SSH-Sitzungen können Sprache nicht verwenden — Mikrofoneingabe wird nicht über SSH weitergeleitet. Nur lokales Terminal verwenden.
- Nur API-Schlüssel-Authentifizierung entsperrt keine Sprache. Die Funktion ist auf claude.ai-Kontositzungen beschränkt.
- Das Web-Interface auf claude.ai hat seine eigenen Sprachfunktionen, getrennt von der CLI — `/voice` ist nur ein CLI-Befehl.
- Die Transkriptionsgenauigkeit verschlechtert sich in lauten Umgebungen. Audio wird unverarbeitet gesendet; es gibt keine Rauschunterdrückung im Client.
- Multi-Speaker-Diktat wird nicht unterstützt — das Modell setzt einen einzelnen Sprecher voraus.

---
