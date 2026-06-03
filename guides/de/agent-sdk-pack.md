# Agent SDK Pack — Vollständiger Entwicklerleitfaden

Das Claude Agent SDK (`claude-agent-sdk` / `@anthropic-ai/claude-agent-sdk`) ist eine dedizierte Laufzeitbibliothek zum Erstellen autonomer Agenten, die die vollständige Claude Code Agent-Schleife programmgesteuert ausführen – außerhalb des interaktiven Terminals. Es ist kein dünner Wrapper um die Messages API. Es liefert die Schleife, die Built-in-Tools, das Hook-System, Session-Persistierung, das Berechtigungsmodell und die MCP-Integration als Bibliothek erster Klasse, die Sie in jede Anwendung einbetten können.

Dieser Leitfaden richtet sich an Senior Engineers, die Production Agenten bauen. Er setzt voraus, dass Sie bereits mit der Anthropic API und Python oder TypeScript vertraut sind.

---

## Agent SDK versus Alternativen

Es gibt drei Ebenen. Wählen Sie bewusst.

| Dimension | Interaktives Claude Code CLI | Agent SDK | Raw Messages API |
|---|---|---|---|
| Primärer Einsatz | Menschliche Entwicklersitzungen | Autonomer Code in Ihrer App | One-Shot-API-Aufrufe |
| Schleifen-Management | Vom CLI verwaltet | Vom SDK verwaltet | Sie schreiben es |
| Built-in-Tools | Ja (Read, Write, Bash, etc.) | Ja — gleicher Satz | Nein — Sie definieren alle Tools |
| CLAUDE.md / Skills | Ja | Ja (konfigurierbar) | Nein |
| Hook-System | Ja | Ja | Nein |
| Wiederaufnehmbare Sitzungen | Ja (JSONL) | Ja (JSONL) | Nein |
| MCP-Integration | Über settings.json | Über HTTP | Nein |
| Berechtigungen | Interaktive Prompts | allow/deny/ask config | N/A |
| Prompt Caching | Automatisch | Muss explizit verbunden werden | Muss explizit verbunden werden |
| Credit Pool | Interaktive Limits | Separater Agent Pool (Juni 2026) | API Token Budget |
| Latenz | 2–5 s Start | ~100–300 ms erster Aufruf | ~100 ms |
| Best für | Menschliche Dev-Arbeit | Produkte, Pipelines, Automatisierung | Einfaches Abrufen, Completion |

**Verwenden Sie das Agent SDK wenn:**
- Sie einen Agent in ein Produkt einbetten (nicht in ein Dev-Terminal)
- Sie den vollständigen Built-in Tool-Satz ohne Neuimplementierung benötigen
- Sie Hooks, Sessions, Berechtigungen und MCP von Tag 1 an verbunden möchten
- Sie einen CI/CD-Schritt, einen Background Worker oder eine benutzergenerierte Automatisierung bauen

**Verwenden Sie die raw Messages API wenn:**
- Sie eine einzelne Completion ohne Tool-Schleife benötigen
- Sie einen Chatbot bauen, der keine Tools aufruft oder nur Tools aufruft, die Sie vollständig kontrollieren
- Latenz und Token-Kosten auf absolut minimiertes Level reduziert werden müssen

**Bleiben Sie im interaktiven CLI wenn:**
- Ein Mensch die Sitzung antreibt
- Sie Live-Kontext von Ihrem lokalen Computer benötigen (Git-Status, lokale Services)
- Sie interaktive Berechtigungsprompts und die Möglichkeit zum Unterbrechen wünschen

---

## Installation

**Python**

```bash
pip install claude-agent-sdk
```

Erfordert Python 3.10+. Das SDK installiert `anthropic` als Abhängigkeit – Sie müssen es nicht separat installieren.

**TypeScript / Node.js**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

Erfordert Node 18+. ESM und CJS beide unterstützt.

**Umgebung**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Alle SDK-Aufrufe authentifizieren sich über diese Variable, es sei denn, Sie übergeben `api_key` explizit dem Client-Konstruktor.

---

## Minimale Beispiele

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

Beide Beispiele erzeugen dasselbe Verhalten: Dem Agent wird eine Aufgabe gegeben, der Agent führt die Schleife autonom aus (liest Dateien, bearbeitet Code, führt Bash-Befehle aus) und streamt Events zurück zu Ihrem Code. Sie berühren nie die HTTP-Aufrufe, Tool-Dispatch oder Fortsetzungslogik.

---

## Die Agent-Schleife

Das Verständnis der Schleife ist Voraussetzung für die korrekte Verwendung von Hooks, Custom Tools und Sessions.

```
Benutzernachricht
    |
    v
[Model-Aufruf] → Text-Ausgabe und/oder Tool_use-Blöcke
    |
    |--- wenn nur Text → gebe Text-Events aus → überprüfe Stoppbedingung → erledigt oder fortsetzen
    |
    |--- wenn tool_use:
    |       Für jeden Tool_use-Block (standardmäßig parallel):
    |           1. Überprüfe Berechtigungen (allow/deny/ask)
    |           2. Führe Tool aus
    |           3. Gebe Tool_result aus
    |       Füge Tool_results zur Nachrichtenhistorie hinzu
    |       Zurück zu [Model-Aufruf]
    |
    v
Stopp wenn:
    - Model gibt end_turn ohne Tool_use zurück
    - max_turns erreicht
    - Ein Hook gibt HookAction.STOP zurück
    - Berechtigung für ein erforderliches Tool verweigert
```

Jede Iteration ist ein vollständiger API-Aufruf. Das SDK verwaltet die Nachrichtenhistorie automatisch – Sie hängen nie manuell Assistant- und Tool_result-Turns an.

**Parallelismus:** Wenn das Model mehrere `tool_use`-Blöcke in einer Response gibt, versendet das SDK sie standardmäßig gleichzeitig. Wenn Sie nebenwirkungsreiche Tools haben, die sequenziell ausgeführt werden müssen, setzen Sie `parallel_tool_execution=False` (Python) / `parallelToolExecution: false` (TS) in Ihrer Config.

**Context Window Management:** Das SDK verfolgt die Token-Nutzung über Turns hinweg. Wenn Sie sich dem Context-Limit nähern, fasst es frühere Turns mit einer kompakten Strategie zusammen (identisch mit dem `/compact`-Befehl des Claude Code CLI). Sie können dies mit `auto_compact=False` deaktivieren oder einen eigenen Summarisierungs-Hook einfügen.

---

## Built-in-Tools

Das SDK liefert die gleichen Built-in-Tools wie das Claude Code CLI. Sie definieren diese nicht – sie sind dem Model automatisch verfügbar, es sei denn, Sie schließen sie explizit aus.

| Tool | Was es macht |
|---|---|
| `Read` | Dateiinhalte lesen |
| `Write` | Datei schreiben/überschreiben |
| `Edit` | Präzise String-Replacements |
| `Glob` | Musterbasierte Dateisuche |
| `Grep` | Inhaltssuche über Dateien |
| `Bash` | Shell-Befehle ausführen |
| `WebSearch` | Websuche |
| `WebFetch` | URL abrufen und parsen |
| `AskUserQuestion` | Schleife anhalten, Mensch um Eingabe bitten |
| `Agent` | Einen Subagenten spawnen |

Um einzuschränken, welche Tools verfügbar sind:

```python
# Python — erlaube nur Datei-Tools, kein Bash, kein Web
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

Das Übergeben einer expliziten `tools`-Liste ersetzt den Default-Satz. Um Custom Tools zusätzlich zu den Defaults hinzuzufügen, verwenden Sie den Parameter `extra_tools`.

---

## Custom Tools

Definieren Sie Custom Tools mit einem Schema und einem Async-Handler. Das SDK injiziert sie in die Tool-Liste des Models und versendet Aufrufe automatisch zu Ihrem Handler.

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

Custom Tools erscheinen in der Tool-Liste des Models neben Built-in-Tools. Das Model entscheidet, wann sie aufgerufen werden, basierend auf Ihrer Beschreibung – schreiben Sie Beschreibungen, die den Tradeoff zwischen Ihrem Tool und einer Built-in-Alternative explizit machen.

---

## Subagenten

Das Built-in `Agent`-Tool ermöglicht dem primären Agent das Spawnen von Subagenten. Jeder Subagent erhält seine eigene isolierte Schleife, sein Tool-Set und seine Nachrichtenhistorie. Results fließen zurück zum Parent als Tool Result.

**Aus der Perspektive des Models** ist das Aufrufen des `Agent`-Tools identisch mit dem Aufrufen eines anderen Tools. Das SDK fängt es ab, erstellt eine Kind-`Agent`-Instanz, führt sie bis zur Fertigstellung aus und gibt das Ergebnis zurück.

**Aus der Perspektive Ihres Codes** konfigurieren Sie Subagenten-Verhalten über `SubagentConfig`:

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

Verwenden Sie ein günstigeres Model für Subagenten, die mechanische Arbeit leisten (Datei-Reads, Edits, Searches). Reservieren Sie Opus für den orchestrierenden Agent, der Reasoning und Planning macht.

Die Subagenten-Spawning-Tiefe ist konfigurierbar (`max_subagent_depth`, Standard 3). Tiefe Verschachtelung ist selten sinnvoll und teuer – halten Sie die Orchestrierung flach.

---

## Hooks

Hooks sind Funktionen, die bei Lebenszyklus-Events in der Agent-Schleife auslösen. Sie sind der primäre Mechanismus für Observability, Sicherheitserzwingung, Kostenkontrolle und Custom Routing.

### Hook-Typen

| Hook | Wann auslösen | Kann blockieren/modifizieren? |
|---|---|---|
| `SessionStart` | Vor dem ersten Model-Aufruf | Nein |
| `UserPromptSubmit` | Wenn eine Benutzernachricht die Schleife eintritt | Ja — kann die Nachricht umschreiben |
| `PreToolUse` | Vor jeder Tool-Ausführung | Ja — kann blockieren oder Eingabe modifizieren |
| `PostToolUse` | Nach jeder Tool-Ausführung | Ja — kann das Ergebnis modifizieren |
| `Stop` | Wenn die Agent-Schleife endet | Nein |
| `SessionEnd` | Nach Cleanup | Nein |

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

### PostToolUse — Ergebnisse modifizieren

```python
class RedactSecrets(PostToolUseHook):
    async def run(self, tool_name: str, tool_input: dict, tool_result: str) -> str:
        if tool_name == "Read":
            return redact_env_vars(tool_result)
        return tool_result
```

`PostToolUse`-Hooks empfangen die rohe Tool-Ausgabe und können eine modifizierte Version zurückgeben. Das modifizierte Ergebnis ist das, was das Model in seinen Kontext sieht – nicht die rohe Ausgabe. Verwenden Sie dies für Redaktion, Truncation oder Ergebnis-Normalisierung.

---

## Sessions und Wiederaufnehmbarkeit

Sessions serialisieren den Agent-Status zu JSONL, damit die Ausführung nach einer Unterbrechung wieder aufgenommen werden kann. Dies ist wesentlich für lang laufende Agenten (CI-Pipelines, Nacht-Läufe) und zum Debuggen.

### Eine Session speichern

```python
from claude_agent_sdk import Agent, AgentConfig, Session

agent = Agent(config=AgentConfig(model="claude-opus-4-7"))

session = Session(path="/tmp/refactor-session.jsonl")

async for event in agent.run("Refactor the authentication module", session=session):
    print(event)
    # Session state is written to disk after each turn automatically
```

Wenn der Prozess während des Ablaufs abstürzt, enthält `/tmp/refactor-session.jsonl` jeden abgeschlossenen Turn.

### Eine Session fortsetzen

```python
session = Session(path="/tmp/refactor-session.jsonl", resume=True)

# The agent reconstructs message history from the JSONL
# and continues from where it stopped
async for event in agent.run("Continue the refactor", session=session):
    print(event)
```

Wenn `resume=True`, setzt das SDK die JSONL in die Nachrichtenhistorie um, bevor es das Model aufruft. Das Model sieht den vollständigen früheren Kontext und setzt natürlich fort.

### Session Introspektion

```python
session = Session(path="/tmp/refactor-session.jsonl")
print(session.turns)         # number of completed turns
print(session.total_tokens)  # cumulative token usage
print(session.last_stop_reason)  # why the last session ended
```

Sessions sind Append-only JSONL – sicher mit `tail -f` zur Live-Überwachung zu lesen.

---

## Berechtigungen und Sicherheit

Das Berechtigungssystem kontrolliert, welche Tool-Aufrufe der Agent ohne menschliche Genehmigung machen kann. Konfigurieren Sie es auf der `AgentConfig`-Ebene.

### Berechtigungsmodi

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

`PermissionMode.STRICT` lehnt jeden Tool-Aufruf ab, der nicht explizit aufgeführt ist. `PermissionMode.PERMISSIVE` (Standard) erlaubt nicht aufgeführte Aufrufe. Verwenden Sie `STRICT` in Production Agenten, die auf sensible Infrastruktur laufen.

Berechtigungsmuster unterstützen Globs. `Bash(git *)` passt zu jedem Bash-Aufruf, dessen Befehl mit `git` beginnt. `Write(/home/deploy/*)` passt zu jedem Write in diesen Verzeichnisbaum.

### Behandlung von Ask-Responses

Wenn ein Tool die `ask`-Liste passt, feuert das SDK `AskUserQuestion` automatisch. In einer headless Anwendung möchten Sie dies handhaben:

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

## MCP-Integration

Das SDK verbindet sich mit MCP-Servern über HTTP. Die Konfiguration spiegelt das `settings.json`-Format des Claude Code CLI wider.

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

MCP-Tools erscheinen in der Tool-Liste des Models mit dem Server-Namen als Präfix (z.B. `github__create_pr`, `postgres__query`). Das Model ruft sie wie jeden anderen Built-in-Tool auf. Das SDK behandelt HTTP-Dispatch, Authentifizierung und Result-Formatierung.

**Authentifizierungsoptionen:**
- `api_key_env` — lesen Sie den Key aus einer Umgebungsvariablen (empfohlen)
- `api_key` — übergeben Sie den Key direkt (vermeiden Sie in Production – verwenden Sie env vars)
- `headers` — beliebige HTTP-Header für Custom Auth-Schemen

**MCP + Berechtigungen:** MCP Tool-Aufrufe gehen durch das gleiche Berechtigungssystem. Fügen Sie MCP Tool-Namen zu Ihren allow/deny/ask-Listen hinzu unter Verwendung ihrer präfixierten Namen:

```python
"allow": ["github__list_prs", "github__get_pr"],
"ask": ["github__create_pr", "github__merge_pr"],
"deny": ["github__delete_repo"],
```

---

## Prompt Caching

Anwendungen, die mit dem Agent SDK gebaut sind, müssen Prompt Caching verwenden. Ohne dies werden lange System-Prompts und CLAUDE.md-Inhalte bei jedem API-Aufruf in der Schleife neu tokenisiert – in Maßstab ist dies ein bedeutender und vermeidbarer Kostenaufwand.

Das SDK aktiviert Caching nicht automatisch. Verbinden Sie es explizit über `cache_config`:

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

Mit `auto_breakpoints=True` fügt das SDK `cache_control: {"type": "ephemeral"}`-Marker an optimalen Positionen ein (System-Prompt-Ende, Tool-Liste-Ende und rollierende Konversations-Ende).

**Cache Hit-Raten in der Praxis:**
- System-Prompt: nahe 100% nach dem ersten Aufruf in einer Session
- Tool-Definitionen: nahe 100% – sie ändern sich nicht zwischen Turns
- Konversationshistorie: Hits ab Turn 2 für statische Präfix-Inhalte

Bei einer 50-Turn-Agent-Sitzung mit einem 4.000-Token System-Prompt reduziert Caching typischerweise Input Token-Kosten um 40–60%. Bei Opus-Preisen ist dies erheblich.

**Manual Breakpoints** (wenn Sie präzise Kontrolle benötigen):

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

## Cloud Provider Deployment

Das SDK liest Cloud Provider-Umgebungsvariablen zum Routing von API-Aufrufen zu Bedrock, Vertex oder Foundry. Keine Code-Änderungen erforderlich – nur Umgebungskonfiguration.

### AWS Bedrock

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
# Or use an IAM role — the SDK uses boto3 credential chain
```

Das SDK verwendet automatisch den Bedrock Endpoint, wenn `CLAUDE_CODE_USE_BEDROCK=1` gesetzt ist. Model-IDs werden automatisch gemappt – Sie geben immer noch `model="claude-opus-4-7"` in Ihrem Code ein.

### Google Vertex AI

```bash
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project-id
# gcloud auth application-default login
```

### AWS Bedrock mit expliziter Cross-Account-Role

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

Foundry-Endpoints verhalten sich identisch zum Standard-API – gleiches SDK, gleiche Model-Namen, gleiches Event-Format. Wechseln Sie zwischen Foundry und Standard durch Umschalten der Umgebungsvariablen.

---

## Kostenmodell — Juni 2026 Update

Ab dem 15. Juni 2026 ziehen Agent SDK Sessions aus einem **separaten monatlichen Credit Pool**, der unabhängig von Ihren interaktiven Claude Code Terminal-Limits und Ihren Claude.ai Chat-Limits ist.

Praktische Auswirkungen:
- Das Ausführen eines lang laufenden autonomen Agenten über Nacht verbraucht nicht Ihr interaktives Kontingent
- Der Agent Pool hat sein eigenes monatliches Limit – überwachen Sie es separat in der Anthropic Console
- Subagenten, die vom SDK gespawnt werden, ziehen auch vom Agent Pool, nicht vom interaktiven Pool
- Managed Agents (`client.beta.sessions.create`) und Agent SDK Sessions teilen den gleichen Pool

Pool-Nutzung ist sichtbar unter console.anthropic.com → Usage → Agent SDK.

Wenn Sie den Agent Pool überschreiten, geben Aufrufe einen `429` mit `error_code: "agent_credit_exceeded"` zurück. Handhaben Sie dies in Production:

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

## End-to-End Beispiel: Autonomer Code-Fixing Agent

Ein realistischer Production Agent, der eine CI-Fehler-Queue überwacht, fehlgeschlagene Test-Ausgabe abruft, die Grundursache identifiziert, einen Fix anwendet und einen Pull Request öffnet.

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

Dieser Agent:
- Nutzt `STRICT`-Berechtigungen, sodass kein nicht aufgeführter Tool-Aufruf stillschweigend durchgeht
- Legt gefährliche Operationen (Writes, Pushes) in `ask`, sodass sie Hook-Genehmigung benötigen
- Cached den System-Prompt über alle Turns (bedeutsame Kostenersparnis über 30 Turns)
- Behält Session-Status in JSONL bei, sodass ein Crash während des Ablaufs wiederaufgenommen werden kann
- Verwendet Sonnet für Subagenten, um Kosten bei mechanischen Subtasks zu reduzieren
- Verbindet sich mit GitHub über MCP für PR-Erstellung ohne Shell-Level Git-Anmeldedaten
- Auditet jeden Tool-Aufruf für Compliance-Überprüfung

---

## Deployment Checkliste

Bevor Sie eine Agent SDK Anwendung in Production versenden:

- [ ] `CacheConfig(auto_breakpoints=True)` ist gesetzt – zahlen Sie nicht für wiederholte System-Prompt Tokenisierung
- [ ] `PermissionMode.STRICT` ist gesetzt – erlauben Sie nicht, dass beliebige Tool-Aufrufe in Production stillschweigend durchgehen
- [ ] `PreToolUseHook` blockiert gefährliche Bash-Muster – `rm -rf`, Force Pushes, Datenbank-Drops
- [ ] Sessions schreiben in dauerhaften Storage (nicht `/tmp`) – verwenden Sie S3, GCS oder ein mounted Volume
- [ ] `AgentCreditExceeded` wird geladen und gewarnt – der Agent Pool ist separat und kann erschöpft sein
- [ ] `max_turns` ist konservativ gesetzt – eine unbegrenzte Agent-Schleife ist unbegrenzte Kosten
- [ ] Cloud Provider Env Vars werden über Secrets Manager gesetzt – nicht hartcodiert
- [ ] MCP `api_key_env` referenziert Env Variablen – nicht Inline-Strings
- [ ] Subagenten verwenden ein günstigeres Model – reservieren Sie Opus für Orchestrierung, Sonnet für Ausführung
- [ ] `StopHook` loggt Token-Nutzung pro Session – erforderlich für Kostenattribution

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
