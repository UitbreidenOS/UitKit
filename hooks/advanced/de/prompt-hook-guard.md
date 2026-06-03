# Hook: Prompt Guard — LLM-basiertes Pre-Tool-Evaluierungs-Gate

Demonstriert den `"type": "prompt"` Hook, der einen LLM-Evaluierungsschritt als Gate vor der Werkzeugausführung durch Claude nutzt. Der Hook-Prompt erhält den Werkzeugkontext und gibt ein strukturiertes Urteil zurück, das die Harness zur Zulassung oder Blockierung der Aktion verwendet — kein Skript erforderlich.

## Was es tut

Wenn ein entsprechender Werkzeugaufruf ausgeführt werden soll, führt die Harness folgende Schritte durch:

1. Serialisiert den Werkzeugnamen und die Eingabe in einen Kontextblock.
2. Ruft den konfigurierten Evaluierungsprompt (über das interne LLM) mit diesem angefügten Kontext auf.
3. Analysiert die Antwort des LLM nach einem Urteilsfeld.
4. Wenn das Urteil `"allow"` ist — führt der Werkzeugaufruf unverändert durch.
5. Wenn das Urteil `"block"` ist — bricht die Harness den Werkzeugaufruf ab und injiziert das Feld `reason` aus der LLM-Antwort als Werkzeugfehler, den Claude sieht und darauf reagiert (z. B. durch Vorschlag einer sichereren Alternative).
6. Wenn das Urteil `"warn"` ist — führt der Werkzeugaufruf durch, aber die Begründung wird an Claudes Kontext angefügt, damit es das Risiko bestätigen kann.

Das bewertende LLM läuft innerhalb des Harness-Prozesses und erstellt keinen sichtbaren Subagenten. Es ist schnell (Haiku-Klasse) und verbraucht nicht das Kontextfenster der Sitzung.

Beispiel: ein `PreToolUse` Guard auf `Bash`, der Befehle blockiert, die Produktionsinfrastruktur berühren:

Eingehende Werkzeugeingabe:
```json
{
  "tool_name": "Bash",
  "tool_input": { "command": "kubectl delete deployment api-server --namespace=production" }
}
```

Evaluator-Ausgabe:
```json
{
  "verdict": "block",
  "reason": "Command targets the production namespace and deletes a running deployment. This is a destructive, irreversible operation outside the approved scope of this session."
}
```

Claude erhält die Begründung als Werkzeugfehler und antwortet typischerweise: "Ich wurde blockiert, diesen Befehl auszuführen. Der Guard hat ihn als destruktive Produktionsaktion gekennzeichnet. Soll ich stattdessen einen Rollback-Plan erarbeiten?"

## Wann es ausgelöst wird

`PreToolUse` mit einem `matcher`, der auf die zu schützenden Werkzeuge abzielt. Häufige Guards:

| Matcher | Guard-Zweck |
|---|---|
| `Bash` | Blockiert Shell-Befehle, die die Produktion berühren, Daten löschen oder gefährlichen Mustern entsprechen |
| `Write` | Blockiert Schreibvorgänge in sensible Pfade (`/etc/`, `~/.ssh/`, `.env`) |
| `mcp__*` | Blockiert MCP-Werkzeugaufrufe, die irreversible externe API-Mutationen durchführen würden |

## settings.json Eintrag

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

## Wie das LLM-Urteil die Aktion zulässt oder blockiert

Die Harness erwartet, dass der Evaluierungsprompt ein JSON-Objekt mit mindestens einem `"verdict"` Schlüssel zurückgibt. Die Urteils-Werte haben folgende Auswirkungen:

| Urteil | Auswirkung |
|---|---|
| `"allow"` | Werkzeugaufruf wird ausgeführt. Die Begründung (falls vorhanden) wird verworfen. |
| `"warn"` | Werkzeugaufruf wird ausgeführt. Die Begründung wird als Hinweis an Claudes nächste Kontextphase angefügt. Claude kann sie bestätigen und fortfahren oder Änderungen vorschlagen. |
| `"block"` | Werkzeugaufruf wird vor der Ausführung abgebrochen. Die Harness injiziert die Begründung als Werkzeugfehler. Claude erhält den Fehler und muss entscheiden, wie es vorgeht — es kann denselben Aufruf nicht ohne Benutzerbestätigung erneut versuchen. |

Wenn das bewertende LLM fehlerhaftes JSON zurückgibt oder ausbricht, verwendet die Harness standardmäßig `"allow"` und protokolliert eine Warnung. Um standardmäßig `"block"` bei Evaluierungsfehlern zu verwenden, setzen Sie `"fail_open": false` in der Hook-Konfiguration.

## Notizen

- Verwenden Sie `"model": "claude-haiku-4-5"` für den Evaluator. Haiku ist schnell genug, um die meisten Befehle in weniger als 2 Sekunden zu evaluieren und hält die Guard-Latenz unmerklich. Sonnet ist für Mustererkennung übertrieben.
- Halten Sie den Evaluierungsprompt fokussiert und regelbasiert. Offene Prompts ("ist das sicher?") erzeugen inkonsistente Urteile. Spezifische benannte Muster erzeugen zuverlässige Allow/Block-Entscheidungen.
- Der Evaluator hat keinen Zugriff auf das Dateisystem oder die Sitzungshistorie — nur die Werkzeugnamen und Eingabefelder für den aktuellen Aufruf. Für kontextbewusste Guards (z. B. "blockieren, wenn dies der dritte destruktive Befehl in Folge ist"), verwenden Sie stattdessen einen `"command"` Hook mit einem stateful Script.
- Verketten Sie mehrere Hooks unter einem einzelnen Matcher: Listen Sie einen `"prompt"` Hook zuerst und einen `"command"` Hook zweite auf. Der Command-Hook läuft nur, wenn der Prompt-Hook die Aktion zulässt.
- Testen Sie Guards im `"warn"` Modus, bevor Sie zu `"block"` wechseln, um die False-Positive-Raten zu kalibrieren.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
