# Managed Agents

## Quand activer
Construction d'applications où les agents doivent fonctionner de manière autonome dans le cloud, ou quand l'utilisateur mentionne Claude Managed Agents, des tâches d'agent de longue durée, ou la construction de produits alimentés par agent via l'API Anthropic.

## Quand ne PAS utiliser
- Les sous-agents Claude Code s'exécutant dans une session terminale — ceux-ci utilisent l'outil `Task`, pas cette API
- Les demandes synchrones courtes qui se terminent en moins de 10 secondes — utiliser l'API Messages standard
- Les workflows nécessitant Zero Data Retention (ZDR) ou HIPAA BAA — Managed Agents ne sont pas admissibles

## Instructions

### Concepts fondamentaux
- **Agent :** une entité configurée avec un modèle, un système d'invite, et un ensemble d'outils autorisés
- **Environment :** un sandbox de calcul où l'agent s'exécute (hébergé dans le cloud par Anthropic, ou auto-hébergé)
- **Session :** une exécution — a un début, une fin, et un flux d'événements
- **Events :** flux d'événements envoyés par serveur (SSE) signalant ce que l'agent fait en temps réel

**Distinction clé par rapport aux sous-agents Claude Code :** Managed Agents s'exécutent indépendamment de votre terminal dans le cloud d'Anthropic. À utiliser pour les produits d'agent asynchrone, de longue durée, ou pilotés par API — pas pour les commandes Claude Code slash.

### En-tête bêta
Tous les appels d'API Managed Agents nécessitent :
```
anthropic-beta: managed-agents-2026-04-01
```

### Type d'outil
Pour donner à un agent l'accès à tous les outils intégrés (Bash, opérations de fichiers, recherche web, extraction web, MCP) :
```python
tools=[{"type": "agent_toolset_20260401"}]
```

### Modèle Python
```python
import anthropic

client = anthropic.Anthropic()

# 1. Create the agent (do once; reuse agent_id)
agent = client.beta.agents.create(
    model="claude-opus-4-5",
    name="research-agent",
    system="You are a research agent. When given a topic, search the web, gather facts, and produce a structured summary.",
    tools=[{"type": "agent_toolset_20260401"}],
)

# 2. Create an environment (cloud sandbox)
env = client.beta.environments.create(type="cloud")

# 3. Create a session and stream events
with client.beta.sessions.stream(
    agent_id=agent.id,
    environment_id=env.id,
    input="Research the latest developments in quantum computing and summarize in 3 bullet points.",
) as stream:
    for event in stream:
        if event.type == "agent.message":
            print(event.data.text, end="", flush=True)
        elif event.type == "agent.tool_use":
            print(f"\n[Tool: {event.data.name}]")
        elif event.type == "session.status_idle":
            print("\n[Session complete]")
            break
```

### Types d'événements
| Événement | Sens |
|---|---|
| `agent.message` | Agent produisant du texte de sortie |
| `agent.tool_use` | Agent appelant un outil — `data.name` est le nom de l'outil |
| `agent.tool_result` | Résultat retourné d'un appel d'outil |
| `session.status_idle` | L'agent a terminé et attend |
| `session.status_error` | La session s'est terminée avec une erreur |

### Session asynchrone (Lancer et interroger)
Pour les charges de travail où vous ne voulez pas tenir une connexion ouverte :
```python
# Start session without streaming
session = client.beta.sessions.create(
    agent_id=agent.id,
    environment_id=env.id,
    input="Analyze these 50 documents and extract action items.",
)
session_id = session.id

# Poll status later
import time
while True:
    session = client.beta.sessions.retrieve(session_id)
    if session.status in ("idle", "error"):
        break
    time.sleep(10)

# Retrieve output
output = client.beta.sessions.retrieve(session_id)
print(output.output)
```

### Limites de taux
| Opération | Limite |
|---|---|
| Create session | 300 RPM |
| Read session / stream | 600 RPM |

### Test avec le CLI `ant`
```bash
# Install
npm install -g @anthropic-ai/ant

# Test an agent interactively
ant run --agent-id <id> --environment cloud

# Run with a specific input
ant run --agent-id <id> --input "Summarize today's AI news"
```

### Gestion du cycle de vie des agents
- Les agents sont des configurations persistantes — créer une fois, réutiliser sur plusieurs sessions
- Les environnements sont des sandboxes de calcul par exécution — créer un nouveau par session pour l'isolation
- Les sessions sont éphémères — stocker la sortie avant expiration de la session
- Stocker `agent_id` dans la configuration de votre application ; stocker la sortie de session dans votre base de données

### Quand utiliser le cloud par rapport à l'environnement auto-hébergé
- **Cloud (`type: "cloud"`):** plus rapide à démarrer, aucune infrastructure, approprié pour la plupart des cas d'utilisation
- **Auto-hébergé :** quand l'agent a besoin d'accès aux ressources réseau internes, aux magasins de données privés, ou aux serveurs d'outils personnalisés non accessibles à partir du cloud d'Anthropic

## Exemple

Un produit qui permet aux utilisateurs de soumettre des tâches de recherche de manière asynchrone via un formulaire web :

1. L'utilisateur soumet : « Trouvez les 5 principaux concurrents de notre produit et résumez leur tarification »
2. L'application crée une session avec un environnement `type: "cloud"` — stocke `session_id` dans la file d'attente de jobs
3. L'application revient immédiatement : « Votre rapport de recherche sera prêt en ~10 minutes »
4. Le worker en arrière-plan interroge le statut de la session toutes les 30 secondes
5. Quand `session.status == "idle"`, le worker récupère `session.output` et envoie un e-mail à l'utilisateur
6. L'utilisateur reçoit une analyse de 5 concurrents structurée avec des tableaux de tarification

L'ensemble de l'exécution de l'agent — recherches web, extraction de données, synthèse — se produit dans le cloud d'Anthropic sans gestion d'infrastructure.

---
