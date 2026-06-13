# SDK Agent Claude

## Quand activer
Construction d'une application Python ou TypeScript qui utilise les capacités Claude Code programmatiquement ; déploiement de Claude comme agent autonome à l'intérieur d'un produit ; écriture de code qui pilote le CLI `claude` en mode non-interactif ; scripting de workflows agentic qui nécessitent des appels d'outils, des réessais, et la gestion du contexte automatiquement.

## Quand ne PAS utiliser
Utilisation de Claude Code interactivement dans le terminal — c'est l'expérience par défaut, pas un cas d'usage SDK ; construction d'un simple chatbot ou interface Q&R à tour unique (utiliser directement l'API Messages) ; quand Anthropic Managed Agents est un meilleur ajustement (infrastructure hébergée, mise à l'échelle automatique, persistance de mémoire intégrée).

## Instructions

**Ce qu'est le SDK Agent :**
Même boucle d'outils, gestion du contexte, et capacités d'agent que Claude Code interactif — emballé comme une bibliothèque que vous pouvez intégrer dans votre propre application. Vous contrôlez l'infrastructure ; Anthropic fournit le modèle et la boucle d'agent.

**SDK vs alternatives — choisir la bonne couche :**

| Besoin | Utiliser |
|---|---|
| Intégrer Claude agentic dans votre app, posséder l'infra | SDK Agent |
| Claude agentic hébergé par Anthropic, ops hands-off | Managed Agents |
| Réponses à tour unique, pas de boucle d'outils nécessaire | API Messages |
| Workflow interactif en terminal | Claude Code CLI |

**Installation :**

Python :
```bash
pip install claude-code-sdk
```

TypeScript :
```bash
npm install @anthropic-ai/claude-code
```

**Drapeau `--bare` via options :** Saute le chargement de `CLAUDE.md` et la découverte du serveur MCP. Utilisez ceci dans des contextes CI et scripting où la vitesse de démarrage compte — initialisation environ 10× plus rapide.

**Facturation (15 juin 2026+) :** Les sessions du SDK Agent puisent dans un pool de crédits dédiés au SDK Agent, séparé des limites de session interactives.

**Outils en processus :** Les outils s'exécutent en processus plutôt que de générer des sous-processus. Utilisez ceci pour les appels à haute fréquence où les frais généraux des sous-processus s'additionnent.

**Support du fournisseur cloud :** AWS Bedrock, Google Vertex AI, et Microsoft Azure AI Foundry sont tous supportés. Configurez via des variables d'environnement — aucune modification du code SDK requise.

**Exemple Python :**
```python
import asyncio
from claude_code_sdk import query, ClaudeCodeOptions

async def run_agent(task: str):
    options = ClaudeCodeOptions(system_prompt="You are a code reviewer.")
    async for message in query(prompt=task, options=options):
        if message.type == "result":
            print(message.result)

asyncio.run(run_agent("Review this PR diff and list security issues"))
```

**Exemple TypeScript :**
```typescript
import { query, ClaudeCodeOptions } from "@anthropic-ai/claude-code";

const options: ClaudeCodeOptions = {
  systemPrompt: "You are a code reviewer.",
};

for await (const message of query({ prompt: "Review this PR diff", options })) {
  if (message.type === "result") {
    console.log(message.result);
  }
}
```

**SDK Agent vs Managed Agents — guide de décision :**
- SDK Agent : contrôle complet de l'infrastructure, s'exécute dans votre CI/CD, charges de travail sensibles à la latence, logging et observabilité personnalisés
- Managed Agents : Anthropic gère les crashes, la mise à l'échelle, et la persistance de mémoire ; aucune infrastructure à gérer ; meilleur pour les équipes non-techniques déployant des agents comme fonctionnalité de produit

## Exemple

Un pipeline d'examen de code en CI : sur chaque événement d'ouverture de PR, un job GitHub Actions appelle le SDK Agent avec le diff du PR comme prompt. L'agent examine le diff, appelle des outils internes pour vérifier la base de données de couverture de test, et poste un commentaire de review structuré sur le PR via l'API GitHub. Le drapeau `--bare` garde le temps de démarrage froid en dessous de 2 secondes.

---
