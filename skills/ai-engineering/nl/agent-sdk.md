# Claude Agent SDK

## Wanneer activeren
Het bouwen van een Python- of TypeScript-applicatie die Claude Code-mogelijkheden programmatisch gebruikt; het implementeren van Claude als autonome agent in een product; het schrijven van code die de `claude` CLI in niet-interactieve modus aandrijft; het schrijven van agentic workflows die tool calls, retries en context management automatisch nodig hebben.

## Wanneer NIET gebruiken
Claude Code interactief in de terminal gebruiken — dat is de standaard ervaring, geen SDK use case; een eenvoudige chatbot of single-turn Q&A interface bouwen (gebruik direct de Messages API); wanneer Anthropic Managed Agents beter past (gehoste infrastructuur, automatische schaling, ingebouwde memory persistentie).

## Instructies

**Wat is de Agent SDK :**
Dezelfde tool loop, context management en agent capabilities als interactieve Claude Code — verpakt als bibliotheek die u in uw eigen applicatie insluit. U beheert de infrastructuur; Anthropic levert het model en agent loop.

**SDK versus alternatieven — kies de juiste laag :**

| Behoefte | Gebruik |
|---|---|
| Agentic Claude in app insluiten, infrastructuur controleren | Agent SDK |
| Agentic Claude gehost door Anthropic, hands-off ops | Managed Agents |
| Single-turn responses, geen tool loop nodig | Messages API |
| Interactieve terminal workflow | Claude Code CLI |

**Installatie :**

Python :
```bash
pip install claude-code-sdk
```

TypeScript :
```bash
npm install @anthropic-ai/claude-code
```

**`--bare`-vlag via opties :** Slaat `CLAUDE.md`-laden en MCP-server-detectie over. Gebruik dit in CI- en scripting-contexten waar opstartsnelheid telt — ongeveer 10x snellere initialisatie.

**Facturering (15 juni 2026+) :** Agent SDK-sessies putten uit een speciaal Agent SDK-creditpool, gescheiden van interactieve sessiegrenzenen.

**In-process tools :** Tools draaien in-process in plaats van subprocessen te spawnen. Gebruik dit voor high-frequency calls waar subprocess overhead optelt.

**Cloud provider-ondersteuning :** AWS Bedrock, Google Vertex AI en Microsoft Azure AI Foundry worden allemaal ondersteund. Configureer via omgevingsvariabelen — geen SDK-codewijzigingen vereist.

**Python-voorbeeld :**
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

**TypeScript-voorbeeld :**
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

**Agent SDK versus Managed Agents — besluitsingsleidraad :**
- Agent SDK: volledige infrastructuurcontrole, draait in uw CI/CD, latency-gevoelige workloads, aangepaste logging en observabiliteit
- Managed Agents: Anthropic handelt crashes, schaling en memory-persistentie af; geen infrastructuur om te beheren; beter voor niet-technische teams die agents als productfunctie implementeren

## Voorbeeld

Een code-review pipeline in CI: bij elke PR open-event roept een GitHub Actions job de Agent SDK aan met de PR diff als prompt. De agent controleert de diff, roept interne tools aan om de test-coverage database te controleren, en post een gestructureerde review-opmerking terug naar de PR via GitHub API. De `--bare`-vlag houdt cold-start time onder 2 seconden.

---
