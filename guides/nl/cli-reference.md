# Claude Code CLI-referentie

Volledige referentie voor alle Claude Code CLI-vlaggen, opstartcommando's, sessiebeheer, schuine opmerking commando's en omgevingsvariabelen.

---

## Claude Code starten

```bash
claude                          # interactive session
claude "do X"                   # non-interactive, single prompt
claude -p "do X"                # print mode (no interactive fallback)
claude -p "do X" --bare         # skip CLAUDE.md + MCP discovery (10x faster SDK startup)
claude --add-dir ../other-repo  # give Claude access to another directory
claude -r <session-id>          # resume a previous session
claude --resume <id> --fork-session  # fork at current point, keep original intact
```

`--bare` is de belangrijkste vlag voor SDK-use cases. Het omzeilt CLAUDE.md-laden, instellingsdiscovery en MCP-verbinding — en verlaagt de opstarlatentie met een orde van grootte wanneer u geen projectcontext nodig hebt.

---

## Sessiebeheerscommando's

```bash
claude agents                   # list all running sessions
claude agents --json            # machine-readable JSON array
claude agents --cwd .           # filter sessions by current directory
claude rm <session-id>          # remove session from agent view
claude respawn <session-id>     # restart session with history intact
claude respawn --all            # restart all running sessions
claude daemon status            # show supervisor process state
```

Session-ID's zijn UUID's die in de agentlijst worden weergegeven. Geef ze door aan `--resume` of `--fork-session` om werk voort te zetten of vertakt.

---

## Projectcommando's

```bash
claude project purge            # delete all local state for this project
claude plugin details <name>    # show plugin component inventory + token cost
```

`project purge` wist gecachte sessiegegevens, plugin-status en lokale instellingen opgeslagen onder `.claude/`. Het raakt niet aan `.claude/settings.json` of gepleegde bestanden.

---

## Belangrijke schuine opmerking commando's (in-session)

| Commando | Beschrijving | Toegevoegd |
|---|---|---|
| `/goal` | Stel het huidge sessiedoel in of bekijk het — vastgestelde bedoeling bovenaan context | 2024 |
| `/btw` | Voeg een achtergrondonopmerking toe aan context zonder een reactie uit te lissen | 2024 |
| `/voice` | Voice-dictatmodus in-/uitschakelen | 2025 |
| `/compact` | Handmatig context-compactie activeren | 2024 |
| `/rewind` | Stap terug naar een eerdere beurt in de huidge sessie | 2025 |
| `/branch` | Een nieuwe sessievork maken van de huidge status | 2025 |
| `/diff` | Toon een geünificeerd diff van alle wijzigingen die in de sessie zijn aangebracht | 2024 |
| `/code-review` | Start de ingebouwde code-review-vaardigheid | 2024 |
| `/focus` | Vernauw Claudes aandacht naar een specifiek bestand of directory | 2025 |
| `/batch` | Voer een lijst met taken parallel uit over subagenten | 2025 |
| `/teleport` | Spring naar een ander directory zonder de sessie te beëindigen | 2025 |
| `/remote-control` | Schakel externe controle van de sessie via API in | 2025 |
| `/loop` | Voer een vraag of commando uit op een terugkerend interval | 2025 |
| `/powerup` | Verhoog modellaag voor een enkele reactie tijdelijk | 2025 |
| `/fast` | Schakel huidge sessie naar Haiku voor snelheid | 2025 |
| `/effort` | Stel inspanningsniveau voor sessie in (`low` / `medium` / `high` / `xhigh`) | 2025 |
| `/cost` | Toon token-gebruik en geschatte kosten voor sessie | 2024 |
| `/extra-usage` | Toon uitsplitsing van token-verbruik door tooloproepen | 2025 |
| `/scroll-speed` | Pas streamingsnelheid van uitvoer in terminal aan | 2025 |
| `/recap` | Genereer een gestructureerd resumé van de sessie tot nu toe | 2025 |
| `/team-onboarding` | Genereer onboardinggids voor nieuw teamlid vanuit projectcontext | 2025 |

---

## Omgevingsvariabelen

| Variabele | Doel |
|---|---|
| `ANTHROPIC_API_KEY` | API-sleutel — vereist voor alle niet-interactief gebruik |
| `ANTHROPIC_BASE_URL` | API-eindpunt overschrijven (aangepaste proxy's, interne gateways) |
| `CLAUDE_CODE_TASK_LIST_ID` | Gedeelde takenlijst-ID — maakt taakcoördinatie over sessies mogelijk |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | Stel in op `1` om agentteamfunctie in te schakelen |
| `ENABLE_PROMPT_CACHING_1H` | Stel in op `1` om 1-uurs cache TTL-laag te gebruiken |
| `ENABLE_TOOL_SEARCH` | Drempel waarbij uitgestelde tool-laden activaties |
| `CLAUDE_EFFORT` | Standaard inspanningsniveau voor nieuwe sessies (`low` / `medium` / `high` / `xhigh`) |
| `CLAUDE_AGENT_NAME` | Identiteitsstring voor deze agent — gebruikt in hook-omgevingsvariabelen |
| `OUTPUT_SIZE_WARN_THRESHOLD` | Bytegrens die waarschuwingen voor hook-uitvoergrootte activeert |

Variabelen ingesteld in de shell overschrijven projectinstellingen. Variabelen ingesteld in `.env` op de projectroot worden automatisch geladen.

---

## `additionalDirectories` Instelling

Blijvend alternatief voor `--add-dir`. Geconfigureerd in `.claude/settings.json` of `~/.claude/settings.json`:

```json
{
  "additionalDirectories": ["../shared-lib", "../design-system"]
}
```

Paden worden opgelost ten opzichte van de projectroot. Gebruik dit wanneer meerdere repo's aan één product samenwerken en Claude in elke sessie lezend toegang over repo's nodig heeft zonder de vlag te herhalen.

---

## Vlagverwijzingssamenvatting

| Vlag | Kort | Beschrijving |
|---|---|---|
| `--print` | `-p` | Niet-interactieve afdrukmodus |
| `--bare` | | Sla CLAUDE.md, instellingen en MCP-detectie over |
| `--add-dir <path>` | | Voeg directory toe aan Claudes werkset |
| `--resume <id>` | `-r` | Hervatting vorige sessie op ID |
| `--fork-session` | | Fork in plaats van hervatting wanneer gebruikt met `--resume` |
| `--json` | | Sessielijst uitvoer als JSON (gebruikt met `agents`) |
| `--cwd <path>` | | Agenten filteren op werkmap |
| `--all` | | Voer commando uit op alle sessies (gebruikt met `respawn`) |

---
