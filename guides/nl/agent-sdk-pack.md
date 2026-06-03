# Agent SDK Pack — Volledige Ontwikkelaarsgids

De Claude Agent SDK (`claude-agent-sdk` / `@anthropic-ai/claude-agent-sdk`) is een toegewijde runtime-bibliotheek voor het bouwen van autonome agents die de volledige Claude Code agent-loop programmatisch uitvoeren — buiten de interactieve terminal. Het is geen dunne wrapper rond de Messages API. Het bevat de loop, de ingebouwde tools, het hook-systeem, sessie-persistentie, het machtigingsmodel en MCP-integratie als een eersterangse bibliotheek die u in elke toepassing kunt inbedden.

Deze gids is voor senior engineers die productie-agents bouwen. Het veronderstelt dat u al bekend bent met de Anthropic API en Python of TypeScript.

---

## Agent SDK versus de Alternatieven

Er bestaan drie niveaus. Kies doelbewust.

| Dimensie | Interactieve Claude Code CLI | Agent SDK | Raw Messages API |
|---|---|---|---|
| Primair gebruik | Sessies van menselijke ontwikkelaars | Autonome code in uw app | Eenmalige API-aanroepen |
| Loopbeheer | Afgehandeld door CLI | Afgehandeld door SDK | U schrijft dit |
| Ingebouwde tools | Ja (Read, Write, Bash, etc.) | Ja — dezelfde set | Nee — u definieert alle tools |
| CLAUDE.md / skills | Ja | Ja (configureerbaar) | Nee |
| Hook-systeem | Ja | Ja | Nee |
| Resumeerbare sessies | Ja (JSONL) | Ja (JSONL) | Nee |
| MCP-integratie | Via settings.json | Via HTTP | Nee |
| Toestemmingen | Interactieve prompts | allow/deny/ask-configuratie | N/B |
| Prompt caching | Automatisch | Moet expliciet wired | Moet expliciet wired |
| Tegoedbundel | Interactieve limieten | Aparte agent-bundel (juni 2026) | API-token-budget |
| Latency | 2–5 s opstarttijd | ~100–300 ms eerste aanroep | ~100 ms |
| Geschikt voor | Werk van menselijke ontwikkelaars | Producten, pipelines, automatisering | Eenvoudige retrieval, completion |

**Gebruik de Agent SDK wanneer:**
- U een agent in een product inbedt (niet in een dev-terminal)
- U de volledige ingebouwde toolset nodig hebt zonder deze opnieuw in te voeren
- U hooks, sessies, toestemmingen en MCP van dag één ingebouwd wilt hebben
- U een CI/CD-stap, een achtergrondworker of een door gebruiker geactiveerde automatisering bouwt

**Gebruik de raw Messages API wanneer:**
- U een enkele completion nodig hebt zonder tool-loop
- U een chatbot bouwt die geen tools aanroept of alleen tools aanroept die u volledig beheren
- Latency en token-kosten moeten tot het absolute minimum worden beperkt

**Blijf in de interactieve CLI wanneer:**
- Een mens de sessie aanstuurt
- U live context nodig hebt van uw lokale machine (git-status, lokale services)
- U interactieve toestemmingsprompts en de mogelijkheid om te onderbreken wilt hebben

---

## Installatie

**Python**

```bash
pip install claude-agent-sdk
```

Vereist Python 3.10+. De SDK installeert `anthropic` als afhankelijkheid — u hoeft deze niet afzonderlijk te installeren.

**TypeScript / Node.js**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

Vereist Node 18+. Zowel ESM als CJS worden ondersteund.

**Omgeving**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Alle SDK-aanroepen authenticeren via deze variabele, tenzij u `api_key` expliciet aan de client-constructor doorgeeft.

---

## Minimale Voorbeelden

### Python

```python
from claude_agent_sdk import Agent, AgentConfig

agent = Agent(
    config=AgentConfig(
        model="claude-opus-4-7",
        system="You are a senior Python engineer. Fix bugs in the code you are given.",
        max_turns=20,
    )
)

async def main():
    async for event in agent.run("Fix the type errors in src/auth.py"):
        if event.type == "text":
            print(event.content, end="", flush=True)
        elif event.type == "tool_use":
            print(f"\n[{event.tool_name}] {event.tool_input}")
        elif event.type == "stop":
            print(f"\n[done — stop reason: {event.stop_reason}]")

import asyncio
asyncio.run(main())
```

### TypeScript

```typescript
import { Agent, AgentConfig } from "@anthropic-ai/claude-agent-sdk";

const agent = new Agent({
  config: {
    model: "claude-opus-4-7",
    system: "You are a senior Python engineer. Fix bugs in the code you are given.",
    maxTurns: 20,
  },
});

for await (const event of agent.run("Fix the type errors in src/auth.py")) {
  if (event.type === "text") {
    process.stdout.write(event.content);
  } else if (event.type === "tool_use") {
    console.log(`\n[${event.toolName}] ${JSON.stringify(event.toolInput)}`);
  } else if (event.type === "stop") {
    console.log(`\n[done — stop reason: ${event.stopReason}]`);
  }
}
```

Beide voorbeelden produceren hetzelfde gedrag: de agent krijgt een taak, voert de loop autonoom uit (leest bestanden, bewerkt code, voert Bash-commando's uit) en streamt gebeurtenissen terug naar uw code. U raakt nooit de HTTP-aanroepen, tool-dispatching of vervolgingslogica aan.

---

## De Agent Loop

Inzicht in de loop is een vereiste voor het correct gebruik van hooks, aangepaste tools en sessies.

```
Gebruikersbericht
    |
    v
[Modelaanroep] → tekstuitvoer en/of tool_use-blokken
    |
    |--- als alleen tekst → zend tekst-events → controleer stop-voorwaarde → gereed of doorgaan
    |
    |--- als tool_use:
    |       Voor elk tool_use-blok (standaard parallel):
    |           1. Controleer toestemmingen (allow/deny/ask)
    |           2. Voer tool uit
    |           3. Zend tool_result
    |       Voeg tool_results toe aan berichtgeschiedenis
    |       Loop terug naar [Modelaanroep]
    |
    v
Stop wanneer:
    - Model retourneert end_turn zonder tool_use
    - max_turns bereikt
    - Een hook retourneert HookAction.STOP
    - Toestemming geweigerd op een vereiste tool
```

Elke iteratie is een volledige API-aanroep. De SDK beheert de berichtgeschiedenis automatisch — u voegt nooit handmatig assistent- en tool_result-beurten toe.

**Parallelisme:** Wanneer het model meerdere `tool_use`-blokken in één response retourneert, dispatcht de SDK deze standaard gelijktijdig. Als u side-effecting tools hebt die sequentieel moeten worden uitgevoerd, stelt u `parallel_tool_execution=False` (Python) / `parallelToolExecution: false` (TS) in uw configuratie in.

**Context-window-beheer:** De SDK volgt het token-gebruik over de turns. Wanneer u dicht bij de context-limiet komt, vat het eerdere turns samen met een compacte strategie (dezelfde als het `/compact`-commando van de Claude Code CLI). U kunt dit uitschakelen met `auto_compact=False` of uw eigen samenvattingshook injecteren.

---

## Ingebouwde Tools

De SDK bevat dezelfde ingebouwde tools als de Claude Code CLI. U definieert deze niet — ze zijn beschikbaar voor het model automatisch, tenzij u ze expliciet uitsluit.

| Tool | Wat het doet |
|---|---|
| `Read` | Bestandsinhoud lezen |
| `Write` | Een bestand schrijven/overschrijven |
| `Edit` | Precieze string-replacementbewerkingen |
| `Glob` | Patroongebaseerde bestandsdetectie |
| `Grep` | Inhoudszoeking in bestanden |
| `Bash` | Shell-commando's uitvoeren |
| `WebSearch` | Websearch |
| `WebFetch` | Een URL ophalen en parseren |
| `AskUserQuestion` | Loop pauzeren, mens om invoer vragen |
| `Agent` | Een subagent spawnen |

Om te beperken welke tools beschikbaar zijn:

```python
# Python — alleen bestandstools toestaan, geen Bash, geen web
config = AgentConfig(
    model="claude-opus-4-7",
    tools=["Read", "Write", "Edit", "Glob", "Grep"],
)
```

```typescript
// TypeScript
const config: AgentConfig = {
  model: "claude-opus-4-7",
  tools: ["Read", "Write", "Edit", "Glob", "Grep"],
};
```

Door een expliciete `tools`-lijst door te geven, vervangt u de standaard volledige set. Om aangepaste tools aan de standaardinstellingen toe te voegen, gebruikt u de parameter `extra_tools`.

---

## Aangepaste Tools

Definieer aangepaste tools met een schema en een async-handler. De SDK injecteert ze in de toollijst van het model en dispatcht aanroepen naar uw handler automatisch.

### Python

```python
from claude_agent_sdk import Agent, AgentConfig, tool
from pydantic import BaseModel

class SearchCodebaseInput(BaseModel):
    query: str
    file_pattern: str = "**/*.py"

@tool(
    name="search_codebase",
    description="Search the internal code index for semantic matches. "
                "Faster than Grep for conceptual queries.",
    input_model=SearchCodebaseInput,
)
async def search_codebase(input: SearchCodebaseInput) -> str:
    # Your implementation — call an embedding index, vector DB, etc.
    results = await my_vector_index.search(input.query, pattern=input.file_pattern)
    return "\n".join(f"{r.path}:{r.line} — {r.snippet}" for r in results)

agent = Agent(
    config=AgentConfig(model="claude-opus-4-7"),
    extra_tools=[search_codebase],
)
```

### TypeScript

```typescript
import { Agent, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const searchCodebase = tool({
  name: "search_codebase",
  description:
    "Search the internal code index for semantic matches. Faster than Grep for conceptual queries.",
  inputSchema: z.object({
    query: z.string(),
    filePattern: z.string().default("**/*.ts"),
  }),
  handler: async ({ query, filePattern }) => {
    const results = await myVectorIndex.search(query, { pattern: filePattern });
    return results.map((r) => `${r.path}:${r.line} — ${r.snippet}`).join("\n");
  },
});

const agent = new Agent({
  config: { model: "claude-opus-4-7" },
  extraTools: [searchCodebase],
});
```

Aangepaste tools verschijnen in de toollijst van het model naast ingebouwde tools. Het model bepaalt wanneer het ze aanroept op basis van uw beschrijving — schrijf beschrijvingen die de afweging tussen uw tool en een ingebouwd alternatief expliciet maken.

---

## Subagents

Met de ingebouwde `Agent`-tool kan de primaire agent subagents spawnen. Elke subagent krijgt zijn eigen geïsoleerde loop, toolset en berichtgeschiedenis. Resultaten stromen terug naar de parent als een tool-resultaat.

**Vanuit het perspectief van het model** is het aanroepen van de `Agent`-tool identiek aan het aanroepen van elke andere tool. De SDK onderschept het, creëert een kind-`Agent`-instantie, voert deze tot voltooiing uit en retourneert het resultaat.

**Vanuit het perspectief van uw code** configureert u subagent-gedrag via `SubagentConfig`:

```python
from claude_agent_sdk import Agent, AgentConfig, SubagentConfig

agent = Agent(
    config=AgentConfig(
        model="claude-opus-4-7",
        system="You are a senior engineer. Orchestrate subagents to complete complex refactors.",
        subagent_config=SubagentConfig(
            model="claude-sonnet-4-6",  # cheaper model for subagents
            max_turns=10,
            tools=["Read", "Write", "Edit", "Bash"],  # restrict subagent tools
        ),
    )
)
```

Gebruik een goedkoper model voor subagents die mechanisch werk doen (bestandslezen, bewerkingen, zoekopdrachten). Behoud Opus voor de organiserende agent die redeneert en plant.

De diepte van subagent-spawning is configureerbaar (`max_subagent_depth`, standaard 3). Diepe nesting is zelden nuttig en duur — houd orchestratie ondiep.

---

## Hooks

Hooks zijn functies die afgaan bij lifecycle-events in de agent-loop. Ze zijn het primaire mechanisme voor observabiliteit, veiligheidsforcering, kostencontrole en aangepaste routering.

### Hook-typen

| Hook | Wanneer het afgaat | Kan blokkeren/wijzigen? |
|---|---|---|
| `SessionStart` | Voor de eerste modelaanroep | Nee |
| `UserPromptSubmit` | Wanneer een gebruikersbericht in de loop komt | Ja — kan het bericht herschrijven |
| `PreToolUse` | Voor elke tool-uitvoering | Ja — kan blokkeren of invoer wijzigen |
| `PostToolUse` | Na elke tool-uitvoering | Ja — kan het resultaat wijzigen |
| `Stop` | Wanneer de agent-loop eindigt | Nee |
| `SessionEnd` | Na opruiming | Nee |

### Python

```python
from claude_agent_sdk import Agent, AgentConfig, HookAction
from claude_agent_sdk.hooks import PreToolUseHook, PostToolUseHook, StopHook

class AuditHook(PreToolUseHook):
    async def run(self, tool_name: str, tool_input: dict) -> HookAction:
        # Log every tool call to your audit system
        await audit_log.record(tool=tool_name, input=tool_input)

        # Block writes to protected paths
        if tool_name in ("Write", "Edit") and is_protected(tool_input.get("path", "")):
            return HookAction.deny(reason=f"Write to protected path blocked: {tool_input['path']}")

        return HookAction.allow()

class CostGuardHook(StopHook):
    async def run(self, session_stats: dict) -> None:
        if session_stats["total_tokens"] > 500_000:
            await alert_slack(f"Agent session exceeded 500k tokens: {session_stats}")

agent = Agent(
    config=AgentConfig(model="claude-opus-4-7"),
    hooks=[AuditHook(), CostGuardHook()],
)
```

### TypeScript

```typescript
import {
  Agent,
  HookAction,
  type PreToolUseHook,
  type StopHook,
} from "@anthropic-ai/claude-agent-sdk";

const auditHook: PreToolUseHook = {
  async run(toolName, toolInput) {
    await auditLog.record({ tool: toolName, input: toolInput });

    if (
      ["Write", "Edit"].includes(toolName) &&
      isProtected(toolInput.path ?? "")
    ) {
      return HookAction.deny(`Write to protected path blocked: ${toolInput.path}`);
    }

    return HookAction.allow();
  },
};

const agent = new Agent({
  config: { model: "claude-opus-4-7" },
  hooks: [auditHook],
});
```

### PostToolUse — Resultaten Wijzigen

```python
class RedactSecrets(PostToolUseHook):
    async def run(self, tool_name: str, tool_input: dict, tool_result: str) -> str:
        if tool_name == "Read":
            return redact_env_vars(tool_result)
        return tool_result
```

`PostToolUse`-hooks ontvangen de ruwe tool-uitvoer en kunnen een gewijzigde versie retourneren. Het gewijzigde resultaat is wat het model in zijn context ziet — niet de ruwe uitvoer. Gebruik dit voor redactie, afkappen of resultaat-normalisatie.

---

## Sessies en Herhaalbaarheid

Sessies serialiseren de agent-status naar JSONL zodat de uitvoering na onderbreking kan worden hervatten. Dit is essentieel voor agents met lange uitvoering (CI-pijplijnen, nachtelijke runs) en voor debugging.

### Een Sessie Opslaan

```python
from claude_agent_sdk import Agent, AgentConfig, Session

agent = Agent(config=AgentConfig(model="claude-opus-4-7"))

session = Session(path="/tmp/refactor-session.jsonl")

async for event in agent.run("Refactor the authentication module", session=session):
    print(event)
    # Session state is written to disk after each turn automatically
```

Als het proces mid-run crashes, bevat `/tmp/refactor-session.jsonl` elke voltooide beurt.

### Een Sessie Hervatten

```python
session = Session(path="/tmp/refactor-session.jsonl", resume=True)

# The agent reconstructs message history from the JSONL
# and continues from where it stopped
async for event in agent.run("Continue the refactor", session=session):
    print(event)
```

Wanneer `resume=True`, replayed de SDK de JSONL in de berichtgeschiedenis alvorens het model aan te roepen. Het model ziet de volledige eerdere context en gaat natuurlijk door.

### Sessie-Introspectie

```python
session = Session(path="/tmp/refactor-session.jsonl")
print(session.turns)         # number of completed turns
print(session.total_tokens)  # cumulative token usage
print(session.last_stop_reason)  # why the last session ended
```

Sessies zijn append-only JSONL — veilig om met `tail -f` live te controleren.

---

## Toestemmingen en Veiligheid

Het machtigingssysteem bepaalt welke tool-aanroepen de agent zonder menselijke goedkeuring kan uitvoeren. Configureer het op het `AgentConfig`-niveau.

### Machtigingsmodi

```python
from claude_agent_sdk import AgentConfig, PermissionMode

config = AgentConfig(
    model="claude-opus-4-7",
    permissions={
        # Always allow — no prompt, no log check
        "allow": [
            "Read(**)",
            "Grep(**)",
            "Glob(**)",
            "Bash(git status)",
            "Bash(git log *)",
            "Bash(git diff *)",
        ],
        # Always deny — blocked outright, returned as error
        "deny": [
            "Bash(rm -rf *)",
            "Write(/etc/*)",
            "Write(/usr/*)",
        ],
        # Ask human — AskUserQuestion fires automatically
        "ask": [
            "Bash(*)",
            "Write(*)",
        ],
    },
    permission_mode=PermissionMode.STRICT,  # deny anything not in allow/ask/deny
)
```

`PermissionMode.STRICT` wijst elke tool-aanroep af die niet expliciet wordt vermeld. `PermissionMode.PERMISSIVE` (standaard) laat niet-vermelde aanroepen door. Gebruik `STRICT` in productie-agents die op gevoelige infrastructuur werken.

Machtigingspatronen ondersteunen globs. `Bash(git *)` overeenkomst met elke Bash-aanroep waarvan het commando met `git` begint. `Write(/home/deploy/*)` overeenkomst met elke Write in die directoryboom.

### Ask-Responses Afhandelen

Wanneer een tool overeenkomt met de `ask`-lijst, veuert de SDK `AskUserQuestion` automatisch af. In een headless-toepassing wilt u dit afhandelen:

```python
from claude_agent_sdk.hooks import PreToolUseHook, HookAction

class AutoApproveReadonly(PreToolUseHook):
    async def run(self, tool_name: str, tool_input: dict) -> HookAction:
        # Auto-approve safe operations in headless mode
        if tool_name in ("Read", "Glob", "Grep"):
            return HookAction.allow()
        # For Bash, inspect before allowing
        if tool_name == "Bash":
            cmd = tool_input.get("command", "")
            if any(cmd.startswith(safe) for safe in ["git ", "pytest ", "python -m "]):
                return HookAction.allow()
        # Default: deny and log for manual review
        await review_queue.push(tool_name=tool_name, input=tool_input)
        return HookAction.deny("Queued for manual review")
```

---

## MCP-Integratie

De SDK verbindt met MCP-servers via HTTP. De configuratie weerspiegelt het formaat `settings.json` van de Claude Code CLI.

```python
from claude_agent_sdk import Agent, AgentConfig, MCPServer

agent = Agent(
    config=AgentConfig(
        model="claude-opus-4-7",
        mcp_servers=[
            MCPServer(
                name="github",
                url="https://mcp.example.com/github",
                api_key_env="GITHUB_MCP_KEY",
            ),
            MCPServer(
                name="postgres",
                url="http://localhost:5432/mcp",
                transport="http",
            ),
        ],
    )
)
```

MCP-tools verschijnen in de toollijst van het model met de servernaam als voorvoegsel (bijv. `github__create_pr`, `postgres__query`). Het model roept ze aan zoals elke ingebouwde tool. De SDK verwerkt HTTP-dispatching, authenticatie en result-formatting.

**Verificatieopties:**
- `api_key_env` — lees de sleutel uit een omgevingsvariabele (aanbevolen)
- `api_key` — geef de sleutel direct door (vermijd in productie — gebruik omgevingsvariabelen)
- `headers` — willekeurige HTTP-headers voor aangepaste verificatieschema's

**MCP + toestemmingen:** MCP-tool-aanroepen doorlopen hetzelfde machtigingssysteem. Voeg MCP-tool-namen toe aan uw allow/deny/ask-lijsten met hun voorvoegelde namen:

```python
"allow": ["github__list_prs", "github__get_pr"],
"ask": ["github__create_pr", "github__merge_pr"],
"deny": ["github__delete_repo"],
```

---

## Prompt Caching

Toepassingen die met de Agent SDK zijn gebouwd, moeten prompt caching gebruiken. Zonder dit worden lange systeemprompts en CLAUDE.md-inhoud bij elke API-aanroep in de loop opnieuw ge-tokenized — op schaal is dit een aanzienlijke en vermijdbare kosten.

De SDK schakelt caching niet automatisch in. Wire het expliciet via `cache_config`:

```python
from claude_agent_sdk import AgentConfig, CacheConfig

config = AgentConfig(
    model="claude-opus-4-7",
    system=long_system_prompt,  # e.g., your CLAUDE.md content + instructions
    cache_config=CacheConfig(
        # Cache breakpoints are inserted automatically at:
        # 1. The end of the system prompt
        # 2. The end of tools definitions
        # 3. The last user message (for multi-turn caching)
        auto_breakpoints=True,
        min_cache_tokens=1024,  # only cache blocks above this threshold
    ),
)
```

Met `auto_breakpoints=True` voegt de SDK `cache_control: {"type": "ephemeral"}`-markers in op de optimale posities (systeemprompt-einde, tool-lijsteinde en rolling-gesprekseinde).

**Cache-hitpercentages in de praktijk:**
- Systeemprompt: bijna 100% na de eerste aanroep in een sessie
- Tool-definities: bijna 100% — ze veranderen niet tussen turns
- Gespreksgeschiedenis: hits van turn 2 en hoger voor statische prefix-inhoud

Voor een 50-turn agent-sessie met een 4.000-token systeemprompt, verliest caching meestal 40–60% van de input-tokenkosten. Bij Opus-prijsstelling is dit significant.

**Handmatige breakpoints** (wanneer u precieze controle nodig hebt):

```python
from claude_agent_sdk import CacheBreakpoint

config = AgentConfig(
    model="claude-opus-4-7",
    system=[
        {"type": "text", "text": stable_instructions},
        CacheBreakpoint(),                           # cache everything above here
        {"type": "text", "text": dynamic_context},  # not cached — changes per run
    ],
)
```

---

## Cloud Provider-Implementatie

De SDK leest cloud provider-omgevingsvariabelen om API-aanroepen naar Bedrock, Vertex of Foundry te routeren. Geen codewijzigingen vereist — alleen omgevingsconfiguratie.

### AWS Bedrock

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
# Or use an IAM role — the SDK uses boto3 credential chain
```

De SDK gebruikt automatisch het Bedrock-eindpunt wanneer `CLAUDE_CODE_USE_BEDROCK=1` is ingesteld. Model-ID's worden automatisch toegewezen — u geeft nog steeds `model="claude-opus-4-7"` in uw code door.

### Google Vertex AI

```bash
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project-id
# gcloud auth application-default login
```

### AWS Bedrock met expliciete cross-account-rol

```python
import boto3
from claude_agent_sdk import Agent, AgentConfig

session = boto3.Session(
    aws_access_key_id="...",
    aws_secret_access_key="...",
    aws_session_token="...",
    region_name="us-east-1",
)

agent = Agent(
    config=AgentConfig(model="claude-opus-4-7"),
    bedrock_session=session,  # override the default credential chain
)
```

### Anthropic Foundry

```bash
export ANTHROPIC_FOUNDRY_URL=https://your-foundry-endpoint.example.com
export ANTHROPIC_API_KEY=sk-ant-...
```

Foundry-eindpunten gedragen zich identiek aan de standaard API — dezelfde SDK, dezelfde modelnamen, dezelfde event-indeling. Schakel tussen Foundry en standaard door de omgevingsvariabele in/uit te schakelen.

---

## Kostenmodel — Update juni 2026

Vanaf 15 juni 2026 trekken Agent SDK-sessies van een **aparte maandelijkse tegoedbundel** die onafhankelijk is van uw interactieve Claude Code-terminallimieten en uw Claude.ai-chatlimieten.

Praktische gevolgen:
- Het uitvoeren van een lange autonome agent 's nachts verbruikt uw interactieve quota niet
- De agent-bundel heeft zijn eigen maandelijkse limiet — controleer dit apart in de Anthropic-console
- Subagents die door de SDK worden spawned, trekken ook van de agent-bundel, niet van de interactieve bundel
- Managed Agents (`client.beta.sessions.create`) en Agent SDK-sessies delen dezelfde bundel

Bundel-gebruiksinformatie is zichtbaar op console.anthropic.com → Usage → Agent SDK.

Als u de agent-bundel overschrijdt, retourneren aanroepen een `429` met `error_code: "agent_credit_exceeded"`. Behandel dit in productie:

```python
from claude_agent_sdk.exceptions import AgentCreditExceeded

try:
    async for event in agent.run(task):
        process(event)
except AgentCreditExceeded:
    await alert_oncall("Agent SDK credit pool exhausted — check Anthropic console")
    raise
```

---

## End-to-End Voorbeeld: Autonome Code-Fixing Agent

Een realistische productie-agent die een CI-failure-wachtrij controleert, de uitvoer van mislukte tests haalt, de hoofdoorzaak identificeert, een fix toepast en een pull request opent.

```python
# fix_agent.py
import asyncio
import os
from dataclasses import dataclass

from claude_agent_sdk import Agent, AgentConfig, CacheConfig, MCPServer, Session
from claude_agent_sdk import HookAction, PermissionMode
from claude_agent_sdk.hooks import PreToolUseHook, PostToolUseHook, StopHook

# --- System prompt (long, stable — prime caching candidate) ---
SYSTEM = """
You are an autonomous code-fixing agent. Your job:
1. Read the failing test output provided to you.
2. Locate the source of the failure — read the relevant files.
3. Apply the minimal correct fix — do not refactor unrelated code.
4. Run the tests to verify the fix.
5. Open a pull request via the github MCP tool with a clear description.

Rules:
- Never modify test files unless the test itself is wrong and you can prove it.
- Never modify lock files, generated files, or vendor directories.
- If you cannot find a clear fix in 10 tool calls, stop and write a detailed diagnosis instead.
- Your PR title must start with "fix: ".
""".strip()


# --- Hooks ---

class SafetyHook(PreToolUseHook):
    BLOCKED_PATTERNS = [
        "rm -rf",
        "git push --force",
        "DROP TABLE",
        "truncate",
    ]

    async def run(self, tool_name: str, tool_input: dict) -> HookAction:
        if tool_name == "Bash":
            cmd = tool_input.get("command", "")
            for pattern in self.BLOCKED_PATTERNS:
                if pattern in cmd:
                    return HookAction.deny(f"Blocked dangerous command pattern: {pattern!r}")
        if tool_name in ("Write", "Edit"):
            path = tool_input.get("path", "")
            for protected in ("vendor/", "node_modules/", ".git/", "package-lock.json"):
                if protected in path:
                    return HookAction.deny(f"Blocked write to protected path: {path}")
        return HookAction.allow()


class AuditHook(PostToolUseHook):
    def __init__(self, run_id: str):
        self.run_id = run_id
        self.calls: list[dict] = []

    async def run(self, tool_name: str, tool_input: dict, tool_result: str) -> str:
        self.calls.append({"tool": tool_name, "input": tool_input})
        return tool_result  # pass through unmodified


class BudgetHook(StopHook):
    async def run(self, session_stats: dict) -> None:
        tokens = session_stats.get("total_tokens", 0)
        cost_usd = tokens / 1_000_000 * 15  # rough Opus input cost
        if cost_usd > 5.0:
            import logging
            logging.warning(f"Fix agent session cost ~${cost_usd:.2f} ({tokens:,} tokens)")


# --- Agent factory ---

def build_fix_agent(run_id: str) -> Agent:
    audit = AuditHook(run_id=run_id)

    return Agent(
        config=AgentConfig(
            model="claude-opus-4-7",
            system=SYSTEM,
            max_turns=30,
            cache_config=CacheConfig(auto_breakpoints=True, min_cache_tokens=1024),
            permission_mode=PermissionMode.STRICT,
            permissions={
                "allow": [
                    "Read(**)",
                    "Glob(**)",
                    "Grep(**)",
                    "Bash(git status)",
                    "Bash(git diff *)",
                    "Bash(git log *)",
                    "Bash(git checkout -b *)",
                    "Bash(git add *)",
                    "Bash(git commit *)",
                    "Bash(pytest *)",
                    "Bash(python -m pytest *)",
                    "Bash(npm test *)",
                ],
                "ask": [
                    "Write(*)",
                    "Edit(*)",
                    "Bash(git push *)",
                ],
                "deny": [
                    "Bash(rm -rf *)",
                    "Bash(git push --force*)",
                    "Bash(git reset --hard *)",
                ],
            },
            mcp_servers=[
                MCPServer(
                    name="github",
                    url=os.environ["GITHUB_MCP_URL"],
                    api_key_env="GITHUB_MCP_KEY",
                )
            ],
            subagent_config={
                "model": "claude-sonnet-4-6",
                "max_turns": 10,
                "tools": ["Read", "Grep", "Glob", "Bash"],
            },
        ),
        hooks=[SafetyHook(), audit, BudgetHook()],
    )


# --- Task runner ---

@dataclass
class CIFailure:
    repo: str
    branch: str
    run_id: str
    test_output: str


async def fix_ci_failure(failure: CIFailure) -> bool:
    session_path = f"/tmp/fix-sessions/{failure.run_id}.jsonl"
    os.makedirs("/tmp/fix-sessions", exist_ok=True)

    agent = build_fix_agent(run_id=failure.run_id)
    session = Session(path=session_path)

    task = f"""
Repository: {failure.repo}
Branch: {failure.branch}

Failing test output:
---
{failure.test_output}
---

Fix the failure and open a pull request targeting main.
"""

    success = False
    async for event in agent.run(task, session=session):
        if event.type == "text":
            print(event.content, end="", flush=True)
        elif event.type == "tool_use":
            print(f"\n  [{event.tool_name}]", flush=True)
        elif event.type == "stop":
            success = event.stop_reason == "end_turn"
            print(f"\n[stop: {event.stop_reason}]")

    return success


# --- Entry point ---

async def main():
    # In production, pull from a queue (SQS, Redis, etc.)
    failure = CIFailure(
        repo="my-org/my-repo",
        branch="feature/user-auth",
        run_id="ci-run-20260602-001",
        test_output=open("/tmp/test-output.txt").read(),
    )

    fixed = await fix_ci_failure(failure)
    exit(0 if fixed else 1)


if __name__ == "__main__":
    asyncio.run(main())
```

Deze agent:
- Gebruikt `STRICT`-toestemmingen zodat geen niet-vermelde tool-aanroep stilzwijgend doorkomt
- Plaatst gevaarlijke bewerkingen (schrijfbewerkingen, pushes) in `ask` zodat ze hook-goedkeuring vereisen
- Cache de systeemprompt in alle turns (significante kostenbesparing over 30 turns)
- Persisteert sessie-status naar JSONL zodat een crash mid-run kan worden hervatten
- Gebruikt Sonnet voor subagents om kosten op mechanische subtaken te verminderen
- Verbindt met GitHub via MCP voor PR-creatie zonder shell-level git-credentials
- Controleert elke tool-aanroep voor compliancebeoordeling

---

## Implementatie-Checklist

Voordat u een Agent SDK-toepassing naar productie stuurt:

- [ ] `CacheConfig(auto_breakpoints=True)` is ingesteld — betaal niet voor herhaalde systeemprompt-tokenisatie
- [ ] `PermissionMode.STRICT` is ingesteld — sta willekeurige tool-aanroepen niet zwijgend toe in productie
- [ ] `PreToolUseHook` blokkeert gevaarlijke Bash-patronen — `rm -rf`, force pushes, database drops
- [ ] Sessies schrijven naar duurzame opslag (niet `/tmp`) — gebruik S3, GCS of een gekoppeld volume
- [ ] `AgentCreditExceeded` wordt opgehaald en gewaarschuwd — de agent-bundel is apart en kan uitgeput raken
- [ ] `max_turns` is conservatief ingesteld — een ongelimiteerde agent-loop is unbounded kosten
- [ ] Cloud provider env vars worden via secrets manager ingesteld — niet hardcoded
- [ ] MCP `api_key_env` verwijst naar omgevingsvariabelen — niet inline strings
- [ ] Subagents gebruiken een goedkoper model — behoud Opus voor orchestratie, Sonnet voor uitvoering
- [ ] `StopHook` logt token-gebruik per sessie — nodig voor kostenattributie

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
