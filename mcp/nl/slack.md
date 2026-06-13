# MCP: Slack

Lees Slack-kanalen, zoek berichten, post updates en beheer meldingen — breng de context van je team in Claude Code zonder tabbladen om te schakelen of flow te verliezen.

## Waarom je dit nodig hebt

Teamkennis leeft in Slack: ontwerpbeslissingen, incident-tijdlijnen, productfeedback en async-discussies die nooit in docs terechtkomen. Zonder MCP kan Claude er niets van zien. Met Slack MCP:
- Kanaalgeschiedenis en zoekopdracht geven Claude de volledige teamcontext achter elke feature of bug
- Implementatieberichten, PR-samenvattingen of statusupdates posten gebeurt in de codesessie
- Opvangen van gemiste discussies (standups, feedbackdraden, incident-kanalen) is een eenmalige prompt
- Geautomatiseerde statusposten van Claude kunnen handmatige Slack-updates vervangen tijdens lange taken

## Installatie

```bash
npm install -g @modelcontextprotocol/server-slack
```

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

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

## Sleuteltools / Wat het doet

- `list_channels` — lijst openbare kanalen in de werkruimte (naam, ID, ledental, onderwerp)
- `get_channel_history` — haal recente berichten op uit een kanaal met een configureerbare berichtenlimiet
- `search_messages` — volledige tekstzoeken in alle kanalen waartoe de bot toegang heeft, met optionele datuumfilters
- `post_message` — post een bericht naar een kanaal (ondersteunt Slack-markdown-opmaak)
- `reply_to_thread` — antwoord op een bestaande berichtketting met behulp van het tijdstempel van het bovenliggende bericht
- `get_thread_replies` — haal alle antwoorden in een thread op via kanaal en bovenliggende tijdstempel
- `list_users` — lijst werkruimteleden met weergavenamen en gebruikers-ID's
- `get_user_profile` — haal het volledige profiel van een gebruiker op (titel, tijdzone, e-mail indien toegestaan)
- `upload_file` — upload een bestand of snippet naar een kanaal
- `add_reaction` — voeg een emoji-reactie toe aan een bericht

## Gebruiksvoorbeelden

```
Zoek in Slack naar alle vermeldingen van de auth-bug deze week in
alle kanalen waar ik in ben. Vat samen wat het team heeft gevonden en of
er een afgesproken fix is of het nog open staat.
```

```
Post een implementatiemelding naar #deployments:
Versie 2.4.1 is live op production. Wijzigingen: [lijst wijzigingen hier].
Terugdraaieninstructies: [link].
```

```
Haal de laatste 30 berichten op uit #product-feedback en identificeer
de top 3 featureaanvragen op vermeldingsfrequentie. Lijst alle
aanvragen die meer dan eenmaal zijn verschenen.
```

```
Antwoord op de thread in #engineering waar Sarah vroeg over
de databasemigratie — zeg haar dat de migratie succesvol is uitgevoerd,
4 minuten duurde en nul rijen onverwacht waren beïnvloed.
```

```
Vat vandaag #engineering-kanaal samen. Ik heb 6 uur met hoofd gebogen
gewerkt — welke beslissingen zijn genomen en wat moet ik weten?
```

## Verificatie

1. Ga naar **api.slack.com/apps** en klik op **Create New App** → **From scratch**
2. Geef het een naam en selecteer je werkruimte
3. Onder **OAuth & Permissions → Bot Token Scopes**, voeg je deze scopes toe:
   - `channels:read` — lijstpublieke kanalen
   - `channels:history` — lees openbare kanaalberichten
   - `groups:read` / `groups:history` — hetzelfde voor privékanalen (indien nodig)
   - `search:read` — zoekberichten in werkruimte
   - `chat:write` — postberichten
   - `users:read` — lijst en look-up gebruikers
   - `files:write` — upload bestanden (indien nodig)
   - `reactions:write` — voeg reacties toe (indien nodig)
4. Klik op **Install to Workspace** en keur de machtigingen goed
5. Kopieer het **Bot User OAuth Token** (begint met `xoxb-`) en stel het in als `SLACK_BOT_TOKEN`
6. Vind je **Team ID** onder **Settings → Basic Information** en stel het in als `SLACK_TEAM_ID`
7. Nodig de bot uit bij elk kanaal dat het moet lezen met `/invite @your-bot-name`

## Tips

**Bot moet worden uitgenodigd op kanalen:** De bot kan alleen kanalen lezen en posten waarin het is toegevoegd. Voor privékanalen vereist dit een expliciete `/invite @botname` van een kanaalid — beheerdertoegang geeft dit niet automatisch.

**`search:read` is een afzonderlijke scope:** Kanaalgeschiedenis en zoekopdracht zijn verschillende machtigingen. `channels:history` leest alleen een specifiek kanaal dat je opgeeft. `search:read` schakelt zoekopdrachten in werkruimten in. Je hebt beide nodig voor volledige functionaliteit.

**Tarieflimieten variëren per eindpunt:** De meeste eindpunten vallen onder Slack's Tier 3 (50+ aanvragen/minuut). Zoekopdracht is Tier 2 (20 aanvragen/minuut). Voeg voor krachtige bewerkingen korte vertragingen toe tussen aanroepen om 429 fouten te vermijden.

**Directe berichtposting vereist extra scope:** Posten naar een gebruikersDM vereist de `im:write`-scope naast `chat:write`. Voeg dit toe aan de bot's bereiken en herinstalleer als je dit vermogen nodig hebt.

**Slack-markdown in berichten:** `post_message` ondersteunt Slack's mrkdwn-indeling: `*bold*`, `_italic_`, `` `code` ``, `>blockquote` en `<URL|link text>`. Gebruik dit bij het opmaken van implementatieberichten of gestructureerde samenvattingen.

**Thread-tijdstempels zijn nauwkeurig:** `reply_to_thread` vereist de exacte `ts`-waarde (timestamp) van het bovenliggende bericht, die eruitziet als `1716300000.000100`. Haal het op uit `get_channel_history`-uitvoer voordat je antwoord geeft.

---
