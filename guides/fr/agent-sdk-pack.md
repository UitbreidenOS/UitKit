# Agent SDK Pack — Guide complet pour développeurs

Le Kit de développement Claude Agent (`claude-agent-sdk` / `@anthropic-ai/claude-agent-sdk`) est une bibliothèque d'exécution dédiée pour créer des agents autonomes qui exécutent la boucle d'agent Claude Code complète de manière programmatique — en dehors du terminal interactif. Ce n'est pas un simple wrapper autour de l'API Messages. Il contient la boucle, les outils intégrés, le système de hooks, la persistance des sessions, le modèle de permissions et l'intégration MCP comme une bibliothèque de première classe que vous pouvez intégrer dans n'importe quelle application.

Ce guide s'adresse aux ingénieurs seniors construisant des agents en production. Il suppose que vous êtes déjà familier avec l'API Anthropic et Python ou TypeScript.

---

## Quand utiliser l'Agent SDK par rapport aux alternatives

Il existe trois niveaux. Choisissez délibérément.

| Dimension | Claude Code CLI interactif | Agent SDK | API Messages brute |
|---|---|---|---|
| Usage principal | Sessions pour développeurs humains | Code autonome dans votre application | Appels API uniques |
| Gestion de la boucle | Gérée par le CLI | Gérée par le SDK | Vous l'écrivez |
| Outils intégrés | Oui (Read, Write, Bash, etc.) | Oui — même ensemble | Non — vous définissez tous les outils |
| CLAUDE.md / skills | Oui | Oui (configurable) | Non |
| Système de hooks | Oui | Oui | Non |
| Sessions reprises | Oui (JSONL) | Oui (JSONL) | Non |
| Intégration MCP | Via settings.json | Via HTTP | Non |
| Permissions | Invites interactives | Config allow/deny/ask | N/A |
| Prompt caching | Automatique | Doit être câblé explicitement | Doit être câblé explicitement |
| Pool de crédits | Limites interactives | Pool d'agent séparé (juin 2026) | Budget du jeton API |
| Latence | 2–5 s de démarrage | ~100–300 ms premier appel | ~100 ms |
| Meilleur pour | Travail de développement humain | Produits, pipelines, automatisation | Retrieval simple, completion |

**Utilisez l'Agent SDK quand :**
- Vous intégrez un agent dans un produit (pas un terminal de développement)
- Vous avez besoin de l'ensemble complet des outils intégrés sans le réimplémenter
- Vous voulez les hooks, les sessions, les permissions et MCP câblés dès le premier jour
- Vous construisez une étape CI/CD, un travailleur en arrière-plan ou une automatisation déclenchée par l'utilisateur

**Utilisez l'API Messages brute quand :**
- Vous avez besoin d'une seule completion sans boucle d'outils
- Vous construisez un chatbot qui n'appelle pas d'outils ou appelle des outils que vous contrôlez entièrement
- La latence et le coût des jetons doivent être minimisés au strict minimum

**Restez dans le CLI interactif quand :**
- Un humain conduit la session
- Vous avez besoin du contexte en direct de votre machine locale (état git, services locaux)
- Vous voulez des invites de permission interactives et la possibilité d'interrompre

---

## Installation

**Python**

```bash
pip install claude-agent-sdk
```

Nécessite Python 3.10+. Le SDK installe `anthropic` comme dépendance — vous n'avez pas besoin de l'installer séparément.

**TypeScript / Node.js**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

Nécessite Node 18+. ESM et CJS sont tous deux supportés.

**Environnement**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Tous les appels SDK s'authentifient via cette variable sauf si vous transmettez `api_key` explicitement au constructeur du client.

---

## Exemples minimaux

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

Les deux exemples produisent le même comportement : l'agent reçoit une tâche, exécute la boucle de manière autonome (lisant des fichiers, éditant du code, exécutant des commandes Bash), et transmet les événements à votre code. Vous ne touchez jamais aux appels HTTP, à la distribution des outils ou à la logique de continuation.

---

## La boucle d'agent

Comprendre la boucle est un prérequis pour utiliser correctement les hooks, les outils personnalisés et les sessions.

```
Message de l'utilisateur
    |
    v
[Appel du modèle] → sortie texte et/ou blocs tool_use
    |
    |--- si texte uniquement → émettre des événements texte → vérifier la condition d'arrêt → fait ou continuer
    |
    |--- si tool_use:
    |       Pour chaque bloc tool_use (parallèle par défaut):
    |           1. Vérifier les permissions (allow/deny/ask)
    |           2. Exécuter l'outil
    |           3. Émettre tool_result
    |       Ajouter tool_results à l'historique des messages
    |       Revenir à [Appel du modèle]
    |
    v
Arrêtez quand :
    - Le modèle retourne end_turn sans tool_use
    - max_turns atteint
    - Un hook retourne HookAction.STOP
    - Permission refusée sur un outil requis
```

Chaque itération est un appel API complet. Le SDK gère automatiquement l'historique des messages — vous n'ajoutez jamais manuellement les tours d'assistant et de tool_result.

**Parallélisme :** Quand le modèle retourne plusieurs blocs `tool_use` dans une réponse, le SDK les distribue concurrence par défaut. Si vous avez des outils avec effets secondaires qui doivent s'exécuter séquentiellement, définissez `parallel_tool_execution=False` (Python) / `parallelToolExecution: false` (TS) dans votre configuration.

**Gestion de la fenêtre de contexte :** Le SDK suit l'utilisation des jetons à travers les tours. Quand vous approchez de la limite de contexte, il résume les tours antérieurs en utilisant une stratégie compacte (identique à la commande `/compact` du CLI Claude Code). Vous pouvez désactiver cela avec `auto_compact=False` ou injecter votre propre hook de résumé.

---

## Outils intégrés

Le SDK contient les mêmes outils intégrés que le CLI Claude Code. Vous ne les définissez pas — ils sont disponibles pour le modèle automatiquement sauf si vous les excluez explicitement.

| Outil | Ce qu'il fait |
|---|---|
| `Read` | Lire le contenu des fichiers |
| `Write` | Écrire/réécrire un fichier |
| `Edit` | Édits de remplacement de chaîne précis |
| `Glob` | Découverte de fichiers basée sur des motifs |
| `Grep` | Recherche de contenu dans les fichiers |
| `Bash` | Exécuter les commandes du shell |
| `WebSearch` | Recherche web |
| `WebFetch` | Récupérer et analyser une URL |
| `AskUserQuestion` | Mettre en pause la boucle, demander une entrée humaine |
| `Agent` | Créer un sous-agent |

Pour restreindre les outils disponibles :

```python
# Python — autoriser uniquement les outils de fichiers, pas Bash, pas web
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

Passer une liste explicite d'`tools` remplace l'ensemble complet par défaut. Pour ajouter des outils personnalisés en plus des valeurs par défaut, utilisez le paramètre `extra_tools`.

---

## Outils personnalisés

Définissez les outils personnalisés avec un schéma et un gestionnaire asynchrone. Le SDK les injecte dans la liste d'outils du modèle et distribue automatiquement les appels à votre gestionnaire.

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

Les outils personnalisés apparaissent dans la liste d'outils du modèle aux côtés des outils intégrés. Le modèle décide quand les appeler en fonction de votre description — écrivez des descriptions qui rendent le compromis entre votre outil et une alternative intégrée explicite.

---

## Sous-agents

L'outil `Agent` intégré permet à l'agent primaire de créer des sous-agents. Chaque sous-agent obtient sa propre boucle isolée, ensemble d'outils et historique de messages. Les résultats retournent au parent comme résultat d'outil.

**Du point de vue du modèle**, l'appel de l'outil `Agent` est identique à l'appel de tout autre outil. Le SDK l'intercepte, crée une instance d'enfant `Agent`, l'exécute jusqu'au bout et retourne le résultat.

**Du point de vue de votre code**, vous configurez le comportement des sous-agents via `SubagentConfig` :

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

Utilisez un modèle moins cher pour les sous-agents effectuant un travail mécanique (lectures de fichiers, édits, recherches). Réservez Opus pour l'agent qui orchestre en faisant du raisonnement et de la planification.

La profondeur d'imbrication des sous-agents est configurable (`max_subagent_depth`, par défaut 3). L'imbrication profonde est rarement utile et coûteuse — maintenez l'orchestration peu profonde.

---

## Hooks

Les hooks sont des fonctions qui se déclenchent lors d'événements de cycle de vie dans la boucle d'agent. Ils sont le mécanisme principal pour l'observabilité, l'application de la sécurité, le contrôle des coûts et le routage personnalisé.

### Types de hooks

| Hook | Quand il se déclenche | Peut bloquer/modifier ? |
|---|---|---|
| `SessionStart` | Avant le premier appel du modèle | Non |
| `UserPromptSubmit` | Quand un message utilisateur entre dans la boucle | Oui — peut réécrire le message |
| `PreToolUse` | Avant chaque exécution d'outil | Oui — peut bloquer ou modifier l'entrée |
| `PostToolUse` | Après chaque exécution d'outil | Oui — peut modifier le résultat |
| `Stop` | Quand la boucle d'agent se termine | Non |
| `SessionEnd` | Après le nettoyage | Non |

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

### PostToolUse — Modifier les résultats

```python
class RedactSecrets(PostToolUseHook):
    async def run(self, tool_name: str, tool_input: dict, tool_result: str) -> str:
        if tool_name == "Read":
            return redact_env_vars(tool_result)
        return tool_result
```

Les hooks `PostToolUse` reçoivent la sortie brute de l'outil et peuvent retourner une version modifiée. Le résultat modifié est ce que le modèle voit dans son contexte — pas la sortie brute. Utilisez ceci pour la rédaction, la troncature ou la normalisation des résultats.

---

## Sessions et reprises

Les sessions sérialisent l'état de l'agent en JSONL pour que l'exécution puisse reprendre après une interruption. C'est essentiel pour les agents de longue durée (pipelines CI, exécutions nocturnes) et pour le débogage.

### Enregistrement d'une session

```python
from claude_agent_sdk import Agent, AgentConfig, Session

agent = Agent(config=AgentConfig(model="claude-opus-4-7"))

session = Session(path="/tmp/refactor-session.jsonl")

async for event in agent.run("Refactor the authentication module", session=session):
    print(event)
    # Session state is written to disk after each turn automatically
```

Si le processus s'écrase en cours de route, `/tmp/refactor-session.jsonl` contient chaque tour complété.

### Reprise d'une session

```python
session = Session(path="/tmp/refactor-session.jsonl", resume=True)

# The agent reconstructs message history from the JSONL
# and continues from where it stopped
async for event in agent.run("Continue the refactor", session=session):
    print(event)
```

Quand `resume=True`, le SDK rejoue le JSONL dans l'historique des messages avant d'appeler le modèle. Le modèle voit le contexte antérieur complet et continue naturellement.

### Introspection des sessions

```python
session = Session(path="/tmp/refactor-session.jsonl")
print(session.turns)         # number of completed turns
print(session.total_tokens)  # cumulative token usage
print(session.last_stop_reason)  # why the last session ended
```

Les sessions sont JSONL à ajout seulement — sûr pour taire avec `tail -f` pour la surveillance en direct.

---

## Permissions et sécurité

Le système de permissions contrôle quels appels d'outils l'agent peut faire sans approbation humaine. Configurez-le au niveau `AgentConfig`.

### Modes de permission

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

`PermissionMode.STRICT` rejette tout appel d'outil non explicitement listé. `PermissionMode.PERMISSIVE` (par défaut) autoriser les appels non listés. Utilisez `STRICT` dans les agents de production qui opèrent sur une infrastructure sensible.

Les motifs de permissions supportent les globs. `Bash(git *)` correspond à tout appel Bash dont la commande commence par `git`. `Write(/home/deploy/*)` correspond à tout Write vers cet arborescence.

### Gestion des réponses Ask

Quand un outil correspond à la liste `ask`, le SDK déclenche automatiquement `AskUserQuestion`. Dans une application sans interface, vous voudrez gérer ceci :

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

## Intégration MCP

Le SDK se connecte aux serveurs MCP sur HTTP. La configuration reflète le format `settings.json` du CLI Claude Code.

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

Les outils MCP apparaissent dans la liste d'outils du modèle avec le nom du serveur comme préfixe (par exemple, `github__create_pr`, `postgres__query`). Le modèle les appelle comme n'importe quel outil intégré. Le SDK gère la distribution HTTP, l'authentification et le formatage des résultats.

**Options d'authentification :**
- `api_key_env` — lire la clé à partir d'une variable d'environnement (recommandé)
- `api_key` — passer la clé directement (à éviter en production — utiliser les variables d'environnement)
- `headers` — en-têtes HTTP arbitraires pour les schémas d'authentification personnalisés

**MCP + permissions :** Les appels d'outils MCP passent par le même système de permissions. Ajoutez les noms d'outils MCP à vos listes allow/deny/ask en utilisant leurs noms préfixés :

```python
"allow": ["github__list_prs", "github__get_pr"],
"ask": ["github__create_pr", "github__merge_pr"],
"deny": ["github__delete_repo"],
```

---

## Prompt caching

Les applications construites avec l'Agent SDK doivent utiliser le prompt caching. Sans cela, les invites système longues et le contenu CLAUDE.md sont re-tokenisés à chaque appel API dans la boucle — à l'échelle c'est un coût significatif et évitable.

Le SDK n'active pas le caching automatiquement. Câblez-le explicitement via `cache_config` :

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

Avec `auto_breakpoints=True`, le SDK insère des marqueurs `cache_control: {"type": "ephemeral"}` aux positions optimales (queue de l'invite système, queue de la liste d'outils et queue de la conversation roulante).

**Taux de cache hit en pratique :**
- Invite système : près de 100% après le premier appel dans une session
- Définitions d'outils : près de 100% — elles ne changent pas entre les tours
- Historique de la conversation : hits à partir du tour 2 pour le contenu du préfixe statique

Pour une session d'agent de 50 tours avec une invite système de 4 000 jetons, le caching réduit généralement les coûts des jetons d'entrée de 40–60%. À la tarification d'Opus, c'est significatif.

**Breakpoints manuels** (quand vous avez besoin d'un contrôle précis) :

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

## Déploiement chez un fournisseur cloud

Le SDK lit les variables d'environnement du fournisseur pour router les appels API vers Bedrock, Vertex ou Foundry. Aucune modification de code requise — seulement la configuration de l'environnement.

### AWS Bedrock

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
# Or use an IAM role — the SDK uses boto3 credential chain
```

Le SDK utilise automatiquement le point de terminaison Bedrock quand `CLAUDE_CODE_USE_BEDROCK=1` est défini. Les IDs de modèle sont mappés automatiquement — vous transmettez toujours `model="claude-opus-4-7"` dans votre code.

### Google Vertex AI

```bash
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project-id
# gcloud auth application-default login
```

### AWS Bedrock avec rôle inter-comptes explicite

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

Les points de terminaison Foundry se comportent de manière identique à l'API standard — même SDK, mêmes noms de modèle, même format d'événement. Basculez entre Foundry et standard en basculant la variable d'environnement.

---

## Modèle de coûts — Mise à jour de juin 2026

À partir du 15 juin 2026, les sessions Agent SDK puisent dans un **pool de crédits mensuels séparé** indépendant de vos limites de terminal Claude Code interactif et de vos limites de chat Claude.ai.

Implications pratiques :
- L'exécution d'un agent autonome long pendant la nuit ne consomme pas votre quota interactif
- Le pool d'agent a sa propre limite mensuelle — surveillez-le séparément dans la console Anthropic
- Les sous-agents générés par le SDK puisent également dans le pool d'agent, pas le pool interactif
- Managed Agents (`client.beta.sessions.create`) et les sessions Agent SDK partagent le même pool

L'utilisation du pool est visible à console.anthropic.com → Usage → Agent SDK.

Si vous dépassez le pool d'agent, les appels retournent un `429` avec `error_code: "agent_credit_exceeded"`. Gérez ceci en production :

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

## Exemple de bout en bout : Agent de correction de code autonome

Un agent de production réaliste qui surveille une file d'attente d'échec CI, extrait la sortie de test défaillante, identifie la cause première, applique un correctif et ouvre une pull request.

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

Cet agent :
- Utilise les permissions `STRICT` pour qu'aucun appel d'outil non listé ne passe silencieusement
- Met les opérations dangereuses (écritures, pushes) dans `ask` pour qu'elles nécessitent une approbation par hook
- Cache l'invite système à travers tous les tours (économie de coûts significative sur 30 tours)
- Persiste l'état de session en JSONL pour qu'un crash en cours de route puisse être repris
- Utilise Sonnet pour les sous-agents pour réduire le coût sur les sous-tâches mécaniques
- Se connecte à GitHub via MCP pour la création de PR sans identifiants git au niveau du shell
- Audite chaque appel d'outil pour la conformité

---

## Liste de vérification de déploiement

Avant d'expédier une application Agent SDK en production :

- [ ] `CacheConfig(auto_breakpoints=True)` est défini — ne payez pas pour la re-tokenization répétée de l'invite système
- [ ] `PermissionMode.STRICT` est défini — ne permettez pas aux appels d'outils arbitraires de passer en production
- [ ] `PreToolUseHook` bloque les motifs Bash dangereux — `rm -rf`, force pushes, database drops
- [ ] Les sessions écrivent dans un stockage durable (pas `/tmp`) — utilisez S3, GCS ou un volume monté
- [ ] `AgentCreditExceeded` est rattrapé et alerté — le pool d'agent est séparé et peut s'épuiser
- [ ] `max_turns` est défini de manière conservative — une boucle d'agent non plafonnée est un coût non limité
- [ ] Les variables d'environnement du fournisseur cloud sont définies via le gestionnaire de secrets — pas codées en dur
- [ ] MCP `api_key_env` référence les variables d'environnement — pas les chaînes en ligne
- [ ] Les sous-agents utilisent un modèle moins cher — réservez Opus pour l'orchestration, Sonnet pour l'exécution
- [ ] `StopHook` enregistre l'utilisation des jetons par session — nécessaire pour l'attribution des coûts

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
