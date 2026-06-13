# Agents gérés Claude

Managed Agents est l'exécution d'agent hébergée dans le cloud d'Anthropic, accessible via l'API Anthropic. Vous définissez un agent — son modèle, son invite système et ses outils — et Anthropic gère l'infrastructure: les bacs à sable de calcul, les boucles d'exécution, la mise en réseau et le cycle de vie de la session. Vous interagissez avec elle via le SDK standard d'Anthropic ou la CLI `ant`.

C'est distinct des sous-agents Claude Code. Les sous-agents s'exécutent dans votre session Claude Code locale. Les agents gérés s'exécutent dans le cloud d'Anthropic, indépendamment de votre terminal, et peuvent être déclenchés par programme à partir de votre propre produit.

---

## Quatre concepts fondamentaux

**Agent** — Le modèle, l'invite système et la configuration des outils. Définit ce que l'agent est et ce qu'il peut faire. Créé une fois, réutilisé sur plusieurs sessions.

**Environnement** — Le bac à sable de calcul où l'agent s'exécute. Peut être hébergé dans le cloud (géré par Anthropic) ou auto-hébergé. Les environnements persistent entre les sessions s'ils sont configurés pour le faire — ils peuvent contenir l'état, les fichiers et les packages installés.

**Session** — Une seule exécution: un agent dans un environnement, déclenché par un message initial. Les sessions produisent un flux d'événements. Une session se termine quand l'agent s'arrête ou génère une erreur.

**Événements** — Événements envoyés par le serveur (SSE) émis tout au long d'une session. Les types d'événements incluent `agent.message` (sortie texte), `agent.tool_use` (invocations d'outils), `agent.tool_result` (sortie d'outils) et `agent.done` (fin de session). Votre application consomme ce flux.

---

## Exigences et disponibilité

**En-tête bêta:** L'API est en bêta. Toutes les demandes nécessitent l'en-tête `anthropic-beta: managed-agents-2026-04-01`. Les SDK Python et TypeScript le définissent automatiquement quand vous utilisez l'espace de noms `client.beta.agents`.

**Type d'outil:** Pour donner à un agent l'ensemble complet d'outils intégrés (Bash, opérations de fichiers, recherche web, extraction web, serveurs MCP), incluez cette configuration d'outil:

```json
{ "type": "agent_toolset_20260401" }
```

**Non éligible pour:** Zero Data Retention ou HIPAA BAA. N'utilisez pas Managed Agents pour les données de santé ou les charges de travail nécessitant ZDR.

**Limites de débit:** 300 RPM pour les opérations de création, 600 RPM pour les opérations de lecture.

**Support SDK:** Python, TypeScript, Java, Go, C#, Ruby, PHP.

---

## Types d'environnement

```python
# Géré par le cloud — Anthropic fournit le calcul
# networking.type: "unrestricted" (internet complet) ou "none" (isolé)
config = {"type": "cloud", "networking": {"type": "unrestricted"}}

# Auto-hébergé — vous fournissez le bac à sable
config = {"type": "self_hosted", "url": "https://your-sandbox.example.com"}
```

Utilisez le networking `unrestricted` quand l'agent a besoin de récupérer des URL, d'appeler des API externes ou de cloner des repos. Utilisez `none` pour l'exécution de code isolée ou les tâches d'analyse où l'accès réseau serait un inconvénient.

---

## SDK Python

### Installation

```bash
pip install anthropic
```

### Exemple complet

```python
import anthropic

client = anthropic.Anthropic()

# 1. Créer l'agent (faire ceci une fois — réutiliser l'ID)
agent = client.beta.agents.create(
    name="code-reviewer",
    model="claude-opus-4-7",
    tools=[{"type": "agent_toolset_20260401"}],
    system="You are a senior engineer. Review code for correctness, performance, and security. Be specific — cite line numbers and explain your reasoning."
)

# 2. Créer l'environnement
environment = client.beta.environments.create(
    name="review-env",
    config={"type": "cloud", "networking": {"type": "none"}}
)

# 3. Démarrer une session
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    initial_message="Clone https://github.com/my-org/my-repo and review the auth module for security issues."
)

# 4. Événements du flux
with client.beta.sessions.events.stream(session.id) as stream:
    for event in stream:
        if event.type == "agent.message":
            print(event.content, end="", flush=True)
        elif event.type == "agent.tool_use":
            print(f"\n[tool: {event.name}]")
        elif event.type == "agent.done":
            print(f"\n[session complete — status: {event.status}]")
```

### Réutilisation des agents et des environnements

La création d'agent et d'environnement est distincte de la création de session par conception. Créez l'agent une fois, stockez son ID et réutilisez-le:

```python
# Stocker agent.id et environment.id dans votre base de données ou configuration
AGENT_ID = "agt_01abc..."
ENV_ID = "env_01xyz..."

# Déclencher une nouvelle session pour chaque tâche
session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    initial_message=user_request
)
```

### Interrogation au lieu du streaming

```python
import time

session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    initial_message="Summarize the README."
)

# Interroger jusqu'à ce que ce soit fait
while True:
    status = client.beta.sessions.retrieve(session.id)
    if status.status in ("completed", "failed", "cancelled"):
        break
    time.sleep(2)

# Récupérer la sortie complète
events = client.beta.sessions.events.list(session.id)
for event in events.data:
    if event.type == "agent.message":
        print(event.content)
```

---

## SDK TypeScript

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const agent = await client.beta.agents.create({
  name: "code-reviewer",
  model: "claude-opus-4-7",
  tools: [{ type: "agent_toolset_20260401" }],
  system: "You are a senior engineer. Review code for correctness, performance, and security.",
});

const environment = await client.beta.environments.create({
  name: "review-env",
  config: { type: "cloud", networking: { type: "none" } },
});

const session = await client.beta.sessions.create({
  agent: agent.id,
  environment_id: environment.id,
  initial_message: "Review the auth module for security issues.",
});

const stream = client.beta.sessions.events.stream(session.id);

for await (const event of stream) {
  if (event.type === "agent.message") {
    process.stdout.write(event.content);
  } else if (event.type === "agent.done") {
    console.log(`\nDone — status: ${event.status}`);
  }
}
```

---

## La CLI `ant`

Anthropic expédie une CLI séparée (`ant`) pour travailler avec Managed Agents depuis le terminal. C'est distinct de la CLI `claude`.

**Installation:**

```bash
# macOS via Homebrew
brew install anthropic/tap/ant

# Programme d'installation curl
curl -fsSL https://anthropic.com/install-ant.sh | sh

# Go
go install github.com/anthropics/ant@latest
```

**Commandes de base:**

```bash
# Créer un agent à partir d'un fichier de configuration
ant agents create --config agent.yaml

# Démarrer une session de manière interactive
ant sessions start --agent agt_01abc --env env_01xyz

# Suivre le flux d'événement d'une session en cours d'exécution
ant sessions tail <session-id>

# Lister les sessions en cours d'exécution
ant sessions list
```

**Intégration:** Depuis Claude Code, exécutez `/claude-api managed-agents-onboard` pour accéder de manière interactive à la liaison de compte, la création du premier agent et la configuration de l'environnement.

---

## Agents gérés vs sous-agents Claude Code

| Dimension | Agents gérés | Sous-agents Claude Code |
|---|---|---|
| Où ils s'exécutent | Cloud d'Anthropic (ou votre bac à sable) | Votre session Claude Code locale |
| Terminal requis | Non — s'exécute indépendamment | Oui — vit dans votre session |
| Cas d'utilisation | Async, orienté API, intégré au produit | Interactif, flux de travail de développement local |
| Déclenchement | Via API ou CLI `ant` | Via `/agent` ou orchestration dans CLAUDE.md |
| Persistance de l'état | L'environnement persiste entre les sessions | Session-scoped uniquement |
| Mise en réseau | Configurable (illimitée ou aucune) | Hérite du réseau local |
| ZDR / HIPAA | Non éligible | Dépend du niveau de votre compte |

**Utilisez Managed Agents quand:**
- Vous avez besoin qu'un agent s'exécute sans que votre terminal reste ouvert
- Vous construisez un produit où les utilisateurs déclenchent les agents par programme
- Vous voulez des exécutions parallèles isolées (un environnement par client)
- La tâche est longue et vous voulez l'exécution hébergée dans le cloud

**Utilisez les sous-agents Claude Code quand:**
- Vous êtes dans un flux de travail de développement local
- L'agent a besoin de lire des fichiers locaux, exécuter des services locaux ou utiliser les outils de votre machine
- Vous voulez un contrôle interactif étroit avec la possibilité d'interrompre et de rediriger

---

## Motifs pratiques

### Fan-out: exécuter les agents en parallèle

```python
import asyncio
import anthropic

client = anthropic.Anthropic()

async def run_agent_session(agent_id: str, env_id: str, task: str) -> str:
    session = client.beta.sessions.create(
        agent=agent_id,
        environment_id=env_id,
        initial_message=task
    )
    output = []
    with client.beta.sessions.events.stream(session.id) as stream:
        for event in stream:
            if event.type == "agent.message":
                output.append(event.content)
    return "".join(output)

# Exécuter plusieurs tâches en parallèle sur des environnements séparés
tasks = [
    "Review module A for security issues",
    "Review module B for performance issues",
    "Review module C for correctness",
]

results = asyncio.run(asyncio.gather(*[
    run_agent_session(AGENT_ID, env_id, task)
    for env_id, task in zip(env_ids, tasks)
]))
```

### Agents déclenchés par webhook

```python
from flask import Flask, request
import anthropic

app = Flask(__name__)
client = anthropic.Anthropic()

@app.route("/trigger", methods=["POST"])
def trigger_agent():
    data = request.json
    session = client.beta.sessions.create(
        agent=AGENT_ID,
        environment_id=ENV_ID,
        initial_message=data["task"]
    )
    # Retourner l'ID de session — le client interroge ou s'abonne via SSE
    return {"session_id": session.id}
```

---
