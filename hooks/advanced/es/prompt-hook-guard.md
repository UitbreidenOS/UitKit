# Hook: Prompt Guard — Puerta de Evaluación Basada en LLM

Demuestra el hook `"type": "prompt"`, que utiliza un paso de evaluación LLM como puerta antes de que Claude ejecute una herramienta. El prompt del hook recibe el contexto de la herramienta y devuelve un veredicto estructurado que el harness usa para permitir o bloquear la acción, sin necesidad de script.

## Qué hace

Cuando una llamada de herramienta coincidente está a punto de ejecutarse, el harness:

1. Serializa el nombre de la herramienta y la entrada en un bloque de contexto.
2. Llama al prompt de evaluación configurado (a través del LLM interno) con ese contexto adjunto.
3. Analiza la respuesta del LLM para buscar un campo de veredicto.
4. Si el veredicto es `"allow"` — la llamada de herramienta procede sin cambios.
5. Si el veredicto es `"block"` — el harness cancela la llamada de herramienta e inyecta el campo `reason` de la respuesta del LLM como un error de herramienta, que Claude ve y responde (por ejemplo, proponiendo una alternativa más segura).
6. Si el veredicto es `"warn"` — la llamada de herramienta procede pero la razón se añade al contexto de Claude para que pueda reconocer el riesgo.

El LLM evaluador se ejecuta dentro del proceso harness y no crea un subagente visible. Es rápido (clase Haiku) y no consume la ventana de contexto de la sesión.

Ejemplo: una guardia `PreToolUse` en `Bash` que bloquea comandos que tocan la infraestructura de producción:

Entrada de herramienta entrante:
```json
{
  "tool_name": "Bash",
  "tool_input": { "command": "kubectl delete deployment api-server --namespace=production" }
}
```

Salida del evaluador:
```json
{
  "verdict": "block",
  "reason": "Command targets the production namespace and deletes a running deployment. This is a destructive, irreversible operation outside the approved scope of this session."
}
```

Claude recibe la razón como un error de herramienta y típicamente responde: "He sido bloqueado de ejecutar ese comando. La guardia lo marcó como una acción destructiva en producción. ¿Debería elaborar un plan de reversión en su lugar?"

## Cuándo se activa

`PreToolUse` con un `matcher` dirigido a las herramientas que desea proteger. Guardias comunes:

| Matcher | Propósito de la guardia |
|---|---|
| `Bash` | Bloquea comandos de shell que tocan producción, eliminan datos o coinciden con patrones peligrosos |
| `Write` | Bloquea escrituras en rutas sensibles (`/etc/`, `~/.ssh/`, `.env`) |
| `mcp__*` | Bloquea llamadas de herramienta MCP que harían mutaciones de API externas irreversibles |

## Entrada en settings.json

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

## Cómo el veredicto del LLM permite o bloquea la acción

El harness espera que el prompt de evaluación devuelva un objeto JSON con al menos una clave `"verdict"`. Los valores del veredicto tienen los siguientes efectos:

| Veredicto | Efecto |
|---|---|
| `"allow"` | La llamada de herramienta procede. La razón (si está presente) se descarta. |
| `"warn"` | La llamada de herramienta procede. La razón se añade al siguiente giro de contexto de Claude como una nota de asesoramiento. Claude puede reconocerlo y continuar, o proponer cambios. |
| `"block"` | La llamada de herramienta se cancela antes de la ejecución. El harness inyecta la razón como un error de herramienta. Claude recibe el error y debe decidir cómo proceder — no puede reintentar la misma llamada sin confirmación del usuario. |

Si el LLM de evaluación devuelve JSON malformado o agota el tiempo, el harness por defecto permite `"allow"` e registra una advertencia. Para por defecto bloquear en caso de fallo de evaluación, establezca `"fail_open": false` en la configuración del hook.

## Notas

- Use `"model": "claude-haiku-4-5"` para el evaluador. Haiku es lo suficientemente rápido para evaluar la mayoría de comandos en menos de 2 segundos y mantiene la latencia de guardia imperceptible. Sonnet es excesivo para coincidencia de patrones.
- Mantenga el prompt de evaluación enfocado y basado en reglas. Los prompts abiertos ("¿es seguro esto?") producen veredictos inconsistentes. Los patrones nombrados específicos producen decisiones de permitir/bloquear confiables.
- El evaluador no tiene acceso al sistema de archivos o al historial de sesión — solo a los campos de nombre de herramienta e input para la llamada actual. Para guardias conscientes del contexto (por ejemplo, "bloquear si este es el tercer comando destructivo seguido"), use un hook `"command"` con un script con estado en su lugar.
- Encadene múltiples hooks bajo un solo matcher: liste un hook `"prompt"` primero y un hook `"command"` segundo. El hook de comando solo se ejecuta si el hook de prompt permite la acción.
- Pruebe guardias en modo `"warn"` antes de cambiar a `"block"` para calibrar las tasas de falsos positivos.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
