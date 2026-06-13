# Hook: Prompt Guard — op LLM gebaseerde pre-tool evaluatiepoort

Demonstreert de `"type": "prompt"` hook, die een LLM-evaluatiestap als poort gebruikt voordat Claude een tool uitvoert. De hook-prompt ontvangt de tool-context en retourneert een gestructureerd verdict dat de harness gebruikt om de actie toe te staan of te blokkeren — geen script vereist.

## Wat het doet

Wanneer een overeenkomende tool call gaat worden uitgevoerd, doet de harness het volgende:

1. Serialiseert de tool-naam en invoer in een contextblok.
2. Roept de geconfigureerde evaluatieprompt aan (via de interne LLM) met die context toegevoegd.
3. Parseert de respons van de LLM naar een verdict-veld.
4. Als het verdict `"allow"` is — gaat de tool call ongewijzigd door.
5. Als het verdict `"block"` is — annuleert de harness de tool call en injecteert het `reason`-veld van de LLM-respons als een tool-fout, die Claude ziet en waarop reageert (bijv. door een veiligere alternatief voor te stellen).
6. Als het verdict `"warn"` is — gaat de tool call door maar wordt de reason toegevoegd aan de context van Claude zodat het het risico kan erkennen.

De evaluatie-LLM draait in het harness-proces en maakt geen zichtbare subagent. Het is snel (Haiku-klasse) en verbruikt het contextvenster van de sessie niet.

Voorbeeld: een `PreToolUse` guard op `Bash` die commando's die productie-infrastructuur aanraken blokkeert:

Inkomende tool-invoer:
```json
{
  "tool_name": "Bash",
  "tool_input": { "command": "kubectl delete deployment api-server --namespace=production" }
}
```

Evaluator-uitvoer:
```json
{
  "verdict": "block",
  "reason": "Command targets the production namespace and deletes a running deployment. This is a destructive, irreversible operation outside the approved scope of this session."
}
```

Claude ontvangt de reden als een tool-fout en reageert doorgaans: "Ik ben geblokkeerd voor het uitvoeren van dat commando. De guard heeft het als een destructieve productie-actie gemarkeerd. Moet ik in plaats daarvan een rollback-plan opstellen?"

## Wanneer het wordt geactiveerd

`PreToolUse` met een `matcher` gericht op de tools die je wilt beveiligen. Veelgebruikte guards:

| Matcher | Guard-doel |
|---|---|
| `Bash` | Shell-commando's blokkeren die productie aanraken, gegevens verwijderen of gevaarlijke patronen matchen |
| `Write` | Schrijfbewerkingen naar gevoelige paden blokkeren (`/etc/`, `~/.ssh/`, `.env`) |
| `mcp__*` | MCP-tool-calls blokkeren die onomkeerbare externe API-mutaties zouden veroorzaken |

## settings.json entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are a security gate for a developer's AI coding assistant. You will receive the name and input of a shell command that the assistant is about to run.\n\nEvaluate the command against these rules:\n- BLOCK if the command targets a production environment (production, prod, live namespaces or hostnames)\n- BLOCK if the command is irreversibly destructive (drop table, delete deployment, rm -rf on non-temp paths, format disk)\n- BLOCK if the command exfiltrates credentials or secrets (curl with Authorization headers to external hosts, cat ~/.ssh, printenv | curl)\n- WARN if the command modifies system configuration outside the project directory\n- ALLOW everything else\n\nRespond ONLY with valid JSON in this exact shape:\n{\"verdict\": \"allow\" | \"warn\" | \"block\", \"reason\": \"<one sentence explanation>\"}\n\nDo not add any text outside the JSON object.",
            "model": "claude-haiku-4-5",
            "timeout": 8
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are a file-write security gate. Evaluate the file path and content about to be written.\n\nBLOCK if the path is:\n- /etc/ or any system config directory\n- ~/.ssh/ or any SSH key directory\n- Any file named .env, .env.local, .env.production, secrets.json, credentials.json\n- /usr/, /bin/, /sbin/\n\nWARN if the file contains what appears to be a hardcoded secret (token, password, private key PEM block).\n\nALLOW everything else.\n\nRespond ONLY with valid JSON: {\"verdict\": \"allow\" | \"warn\" | \"block\", \"reason\": \"<one sentence>\"}",
            "model": "claude-haiku-4-5",
            "timeout": 8
          }
        ]
      }
    ]
  }
}
```

## Hoe het LLM-verdict de actie toestaat of blokkeert

De harness verwacht dat de evaluatieprompt een JSON-object retourneert met minstens een `"verdict"`-sleutel. De verdict-waarden hebben de volgende effecten:

| Verdict | Effect |
|---|---|
| `"allow"` | Tool call gaat door. De reden (indien aanwezig) wordt verwijderd. |
| `"warn"` | Tool call gaat door. De reden wordt toegevoegd aan de volgende context-beurt van Claude als een adviserende opmerking. Claude kan dit erkennen en doorgaan, of wijzigingen voorstellen. |
| `"block"` | Tool call wordt geannuleerd vóór uitvoering. De harness injecteert de reden als een tool-fout. Claude ontvangt de fout en moet beslissen hoe te handelen — het kan dezelfde call niet opnieuw proberen zonder bevestiging van de gebruiker. |

Als de evaluatie-LLM ongeldige JSON retourneert of times-out, keert de harness terug naar `"allow"` en registreert een waarschuwing. Om in plaats daarvan op evaluatiefout naar `"block"` te gaan, stelt u `"fail_open": false` in de hook-configuratie in.

## Opmerkingen

- Gebruik `"model": "claude-haiku-4-5"` voor de evaluator. Haiku is snel genoeg om de meeste commando's in minder dan 2 seconden te evalueren en houdt de guard-latentie onmerkbaar. Sonnet is overbodig voor patroonherkenning.
- Houd de evaluatieprompt gericht en op regels gebaseerd. Open-ended prompts ("is dit veilig?") produceren inconsistente verdicts. Specifieke benoemde patronen produceren betrouwbare allow/block-beslissingen.
- De evaluator heeft geen toegang tot het bestandssysteem of sessiegeschiedenis — alleen de tool-naam en invoervelden voor de huidige call. Voor context-aware guards (bijv. "blokkeer als dit de derde destructieve commando in een rij is"), gebruik je in plaats daarvan een `"command"` hook met een stateful script.
- Koppel meerdere hooks onder een enkele matcher: vermeld eerst een `"prompt"` hook en vervolgens een `"command"` hook. De command hook wordt alleen uitgevoerd als de prompt hook de actie toestaat.
- Test guards in `"warn"`-modus voordat je naar `"block"` overschakelt om valse-positief-percentages te kalibreren.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
