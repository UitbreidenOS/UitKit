# Claude Agent SDK

## Wann aktivieren
Aufbau einer Python- oder TypeScript-Anwendung, die Claude Code-Funktionen programmgesteuert nutzt; Bereitstellung von Claude als autonomer Agent in einem Produkt; Schreiben von Code, der die `claude` CLI im Non-Interactive-Modus steuert; Scripting von agentic-Workflows, die Tool-Aufrufe, Versuche und Kontextverwaltung automatisch benötigen.

## Wann NICHT verwenden
Interaktive Nutzung von Claude Code im Terminal — das ist die Standarderfahrung, kein SDK-Anwendungsfall; Aufbau eines einfachen Chatbots oder Single-Turn-Q&A-Interface (direkt Messages API nutzen); wenn Anthropic Managed Agents besser passt (gehostete Infrastruktur, automatische Skalierung, integrierte Memory-Persistierung).

## Anweisungen

**Was ist das Agent SDK :**
Gleiche Tool-Loop, Kontextverwaltung, und Agent-Funktionen wie interaktives Claude Code — als Bibliothek verpackt, die Sie in Ihre eigene Anwendung einbetten. Sie kontrollieren die Infrastruktur; Anthropic bietet das Modell und die Agent-Loop.

**SDK vs Alternativen — richtige Layer wählen :**

| Bedarf | Nutzen |
|---|---|
| Agentic Claude in App einbetten, Infra kontrollieren | Agent SDK |
| Agentic Claude von Anthropic gehostet, Ops Hands-Off | Managed Agents |
| Single-Turn-Antworten, keine Tool-Loop nötig | Messages API |
| Interaktiver Terminal-Workflow | Claude Code CLI |

**Installation :**

Python :
```bash
pip install claude-code-sdk
```

TypeScript :
```bash
npm install @anthropic-ai/claude-code
```

**`--bare`-Flag via Optionen :** Überspringt `CLAUDE.md`-Laden und MCP-Server-Erkennung. Nutzen Sie dies in CI und Scripting-Kontexten, wo Startup-Geschwindigkeit zählt — ungefähr 10× schnellere Initialisierung.

**Abrechnung (15. Juni 2026+) :** Agent SDK Sessions zeichnen aus einem dedizierten Agent SDK Credit Pool, getrennt von Interactive Session Limits.

**In-Process Tools :** Tools laufen in-process statt Subprozesse zu spawnen. Nutzen Sie dies für hochfrequente Aufrufe, wo Subprocess-Overhead sich addiert.

**Cloud-Provider-Unterstützung :** AWS Bedrock, Google Vertex AI und Microsoft Azure AI Foundry werden alle unterstützt. Konfigurieren Sie via Umgebungsvariablen — keine SDK-Code-Änderungen erforderlich.

**Python-Beispiel :**
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

**TypeScript-Beispiel :**
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

**Agent SDK vs Managed Agents — Entscheidungsleitfaden :**
- Agent SDK: volle Infrastruktur-Kontrolle, läuft in Ihrem CI/CD, latensempfindliche Workloads, benutzerdefiniertes Logging und Observability
- Managed Agents: Anthropic kümmert sich um Crashes, Skalierung und Memory-Persistierung; keine Infrastruktur zu verwalten; besser für nicht-technische Teams, die Agents als Product-Feature bereitstellen

## Beispiel

Eine Code-Review-Pipeline in CI: Bei jedem PR Open-Event ruft ein GitHub Actions Job das Agent SDK mit dem PR Diff als Prompt auf. Der Agent überprüft den Diff, ruft interne Tools auf, um die Test-Coverage-Datenbank zu prüfen, und postet einen strukturierten Review-Kommentar zurück auf den PR via GitHub API. Das `--bare`-Flag hält Cold-Start-Zeit unter 2 Sekunden.

---

> **Arbeiten Sie mit uns :** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwicklergemeinschaften.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
