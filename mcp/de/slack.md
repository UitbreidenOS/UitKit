# MCP: Slack

Lese Slack-Kanäle, durchsuche Nachrichten, poste Updates und verwalte Benachrichtigungen — bringe den Kontext deines Teams in Claude Code ohne Tabs zu wechseln oder den Flow zu verlieren.

## Warum du das brauchst

Team-Wissen lebt in Slack: Design-Entscheidungen, Incident-Timelines, Produkt-Feedback und Async-Diskussionen, die nie in Docs landen. Ohne MCP kann Claude nichts davon sehen. Mit Slack MCP:
- Channel-Verlauf und Suche geben Claude den kompletten Team-Kontext hinter jedem Feature oder Bug
- Deployment-Benachrichtigungen, PR-Zusammenfassungen oder Status-Updates posten passiert in der Coding-Session
- Auf verpasste Diskussionen aufholen (Standups, Feedback-Threads, Incident-Kanäle) ist ein einzelner Prompt
- Automatisierte Status-Posts von Claude können manuelle Slack-Updates während langer Aufgaben ersetzen

## Installation

```bash
npm install -g @modelcontextprotocol/server-slack
```

## Konfiguration

Füge zu `~/.claude.json` oder project `.claude/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    }
  }
}
```

## Schlüssel-Tools / Was es tut

- `list_channels` — liste öffentliche Kanäle im Workspace auf (Name, ID, Member-Zahl, Topic)
- `get_channel_history` — hole kürzliche Nachrichten aus einem Kanal mit konfigurierbarem Message-Limit
- `search_messages` — Volltext-Suche über alle Kanäle, auf die der Bot Zugriff hat, mit optionalen Date-Filtern
- `post_message` — poste eine Nachricht zu einem Kanal (unterstützt Slack-Markdown-Formatierung)
- `reply_to_thread` — antworte auf einen bestehenden Message-Thread mit dem Parent-Messages-Timestamp
- `get_thread_replies` — hole alle Antworten in einem Thread nach Channel und Parent-Timestamp
- `list_users` — liste Workspace-Mitglieder mit Display-Namen und User-IDs auf
- `get_user_profile` — rufe das komplette Profil eines Users ab (Titel, Timezone, E-Mail, falls erlaubt)
- `upload_file` — lade eine Datei oder einen Snippet in einen Kanal hoch
- `add_reaction` — füge eine Emoji-Reaktion zu einer Nachricht hinzu

## Verwendungsbeispiele

```
Durchsuche Slack nach allen Erwähnungen des Auth-Bugs diese Woche über
alle Kanäle, auf die ich Zugriff habe. Fasse zusammen, was das Team fand und ob
eine vereinbarte Fix da ist oder sie noch offen ist.
```

```
Poste eine Deployment-Benachrichtigung zu #deployments:
Version 2.4.1 ist live auf Production. Änderungen: [liste Änderungen].
Rollback-Anweisungen: [link].
```

```
Hole die letzten 30 Nachrichten aus #product-feedback und identifiziere
die Top-3-Feature-Requests nach Nennungs-Frequenz. Liste alle
Requests auf, die mehr als einmal erschienen.
```

```
Antworte auf den Thread in #engineering, wo Sarah über
die Datenbank-Migration fragte — sag ihr, die Migration lief erfolgreich,
brauchte 4 Minuten und null Rows waren unerwartet betroffen.
```

```
Fasse den heutigen #engineering-Kanal zusammen. Ich war 6 Stunden
tief fokussiert — welche Entscheidungen wurden getroffen und was muss ich wissen?
```

## Authentifizierung

1. Gehe zu **api.slack.com/apps** und klicke auf **Create New App** → **From scratch**
2. Nenne die App und wähle deinen Workspace
3. Unter **OAuth & Permissions → Bot Token Scopes**, füge diese Scopes hinzu:
   - `channels:read` — liste öffentliche Kanäle auf
   - `channels:history` — lese öffentliche Channel-Nachrichten
   - `groups:read` / `groups:history` — gleich für Private Kanäle (falls nötig)
   - `search:read` — durchsuche Nachrichten Workspace-weit
   - `chat:write` — poste Nachrichten
   - `users:read` — liste und suche Users auf
   - `files:write` — lade Dateien hoch (falls nötig)
   - `reactions:write` — füge Reaktionen hinzu (falls nötig)
4. Klicke auf **Install to Workspace** und genehmige die Berechtigungen
5. Kopiere das **Bot User OAuth Token** (beginnt mit `xoxb-`) und setze es als `SLACK_BOT_TOKEN`
6. Finde deine **Team ID** unter **Settings → Basic Information** und setze sie als `SLACK_TEAM_ID`
7. Lade den Bot zu jedem Kanal ein, den er lesen muss mit `/invite @your-bot-name`

## Tipps

**Bot muss zu Kanälen eingeladen sein:** Der Bot kann nur Kanäle lesen und posten, zu denen er hinzugefügt wurde. Für Private Kanäle erfordert das eine explizite `/invite @botname` von einem Channel-Mitglied — Admin-Zugang vergibt es nicht automatisch.

**`search:read` ist ein separater Scope:** Channel-Verlauf und Suche sind verschiedene Berechtigungen. `channels:history` liest nur einen bestimmten Kanal, den du spezifizierst. `search:read` ermöglicht Workspace-weite Nachrichten-Suche. Du brauchst beide für volle Funktionalität.

**Rate Limits variieren nach Endpoint:** Die meisten Endpoints fallen unter Slacks Tier 3 (50+ Requests/Minute). Suche ist Tier 2 (20 Requests/Minute). Für High-Volume-Operationen, füge kurze Verzögerungen zwischen Aufrufen hinzu, um 429-Fehler zu vermeiden.

**Direct Message Posting braucht Extra-Scope:** Zu einem Users DM zu posten braucht den `im:write` Scope zusätzlich zu `chat:write`. Füge ihn zu den Bots Scopes hinzu und reinstalliere, wenn du diese Fähigkeit brauchst.

**Slack Markdown in Nachrichten:** `post_message` unterstützt Slacks mrkdwn-Format: `*bold*`, `_italic_`, `` `code` ``, `>blockquote` und `<URL|link text>`. Verwende das beim Formatieren von Deployment-Benachrichtigungen oder strukturierten Zusammenfassungen.

**Thread Timestamps sind präzise:** `reply_to_thread` braucht den exakten `ts` (Timestamp)-Wert der Parent-Nachricht, der wie `1716300000.000100` aussieht. Hole ihn aus `get_channel_history`-Ausgabe, bevor du antwortest.

---
