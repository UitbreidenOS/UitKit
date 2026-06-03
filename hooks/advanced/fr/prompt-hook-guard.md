# Hook: Prompt Guard — Portail d'Évaluation Basé sur LLM Avant Exécution d'Outil

Démontre le hook `"type": "prompt"`, qui utilise une étape d'évaluation par LLM comme portail avant que Claude exécute un outil. Le prompt du hook reçoit le contexte de l'outil et retourne un verdict structuré que le harness utilise pour autoriser ou bloquer l'action — aucun script requis.

## Ce qu'il fait

Quand un appel d'outil correspondant est sur le point de s'exécuter, le harness :

1. Sérialise le nom de l'outil et son entrée dans un bloc de contexte.
2. Appelle le prompt d'évaluation configuré (via le LLM interne) avec ce contexte ajouté.
3. Analyse la réponse du LLM pour extraire un champ de verdict.
4. Si le verdict est `"allow"` — l'appel d'outil procède sans modification.
5. Si le verdict est `"block"` — le harness annule l'appel d'outil et injecte le champ `reason` de la réponse du LLM comme erreur d'outil, que Claude voit et auquel il répond (par exemple, en proposant une alternative plus sûre).
6. Si le verdict est `"warn"` — l'appel d'outil procède mais la raison est ajoutée au contexte de Claude afin qu'il puisse reconnaître le risque.

Le LLM d'évaluation s'exécute à l'intérieur du processus harness et ne crée pas de sous-agent visible. Il est rapide (classe Haiku) et ne consomme pas la fenêtre de contexte de la session.

Exemple : un garde `PreToolUse` sur `Bash` qui bloque les commandes touchant l'infrastructure de production :

Entrée d'outil entrante :
```json
{
  "tool_name": "Bash",
  "tool_input": { "command": "kubectl delete deployment api-server --namespace=production" }
}
```

Sortie d'évaluateur :
```json
{
  "verdict": "block",
  "reason": "Command targets the production namespace and deletes a running deployment. This is a destructive, irreversible operation outside the approved scope of this session."
}
```

Claude reçoit la raison comme une erreur d'outil et répond généralement : « J'ai été bloqué de l'exécution de cette commande. Le garde l'a signalée comme une action de production destructive. Devrais-je plutôt rédiger un plan de restauration ? »

## Quand il se déclenche

`PreToolUse` avec un `matcher` ciblant les outils que vous souhaitez protéger. Gardes courants :

| Matcher | Objectif du garde |
|---|---|
| `Bash` | Bloquer les commandes shell qui touchent la production, suppriment des données, ou correspondent à des modèles dangereux |
| `Write` | Bloquer les écritures vers des chemins sensibles (`/etc/`, `~/.ssh/`, `.env`) |
| `mcp__*` | Bloquer les appels d'outil MCP qui entraîneraient des mutations externes irréversibles d'API |

## Entrée settings.json

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

## Comment le verdict du LLM autorise ou bloque l'action

Le harness attend que le prompt d'évaluation retourne un objet JSON avec au minimum une clé `"verdict"`. Les valeurs du verdict ont les effets suivants :

| Verdict | Effet |
|---|---|
| `"allow"` | L'appel d'outil procède. La raison (si présente) est ignorée. |
| `"warn"` | L'appel d'outil procède. La raison est ajoutée au prochain tour de contexte de Claude comme une note informative. Claude peut la reconnaître et continuer, ou proposer des modifications. |
| `"block"` | L'appel d'outil est annulé avant exécution. Le harness injecte la raison comme une erreur d'outil. Claude reçoit l'erreur et doit décider comment procéder — il ne peut pas réessayer le même appel sans confirmation de l'utilisateur. |

Si le LLM d'évaluation retourne du JSON mal formé ou expire, le harness utilise par défaut `"allow"` et enregistre un avertissement. Pour utiliser par défaut `"block"` en cas d'échec d'évaluation, définissez `"fail_open": false` dans la configuration du hook.

## Notes

- Utilisez `"model": "claude-haiku-4-5"` pour l'évaluateur. Haiku est suffisamment rapide pour évaluer la plupart des commandes en moins de 2 secondes et maintient la latence du garde imperceptible. Sonnet est excessif pour la correspondance de modèles.
- Gardez le prompt d'évaluation concentré et basé sur des règles. Les prompts ouverts (« est-ce sûr ? ») produisent des verdicts incohérents. Les modèles nommés spécifiques produisent des décisions allow/block fiables.
- L'évaluateur n'a pas accès au système de fichiers ou à l'historique de la session — seulement le nom de l'outil et les champs d'entrée pour l'appel actuel. Pour les gardes conscients du contexte (par exemple, « bloquer si c'est la troisième commande destructive d'affilée »), utilisez un hook `"command"` avec un script avec état à la place.
- Enchaînez plusieurs hooks sous un même matcher : listez un hook `"prompt"` en premier et un hook `"command"` en second. Le hook de commande ne s'exécute que si le hook de prompt autorise l'action.
- Testez les gardes en mode `"warn"` avant de basculer vers `"block"` pour calibrer les taux de faux positifs.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
