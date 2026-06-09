---
description: Générer un agent Claude multi-étapes avec utilisation d'outils, mémoire et condition d'arrêt définie
argument-hint: "[agent goal or task description]"
---
Scaffold a production Claude agent that accomplishes: $ARGUMENTS

**Étape 1 — Spécification de conception de l'agent**

Avant d'écrire du code, définissez :

- **Objectif** — la condition de succès terminal (pas un processus, un état)
- **Entrées** — ce que l'agent reçoit au lancement (chaînes de caractères, chemins de fichiers, données structurées)
- **Sorties** — ce qu'il produit une fois terminé (fichiers écrits, appels API effectués, résultat structuré renvoyé)
- **Outils nécessaires** — énumérez chaque outil : nom, objectif, schéma d'entrée, forme de retour
- **Modèle de mémoire** — choisissez l'un d'entre eux :
  - Stateless (fenêtre de contexte uniquement, convient pour <20 appels d'outils)
  - Memory summary (compresser l'historique avec Haiku après chaque N étapes)
  - Mémoire externe (écrire des faits clés dans un fichier de brouillon ou un magasin clé-valeur)
- **Conditions d'arrêt** — ce qui déclenche le retour de l'agent à la sortie finale par rapport à la continuation de la boucle :
  - Succès : état d'objectif atteint
  - Échec : nombre d'erreurs dépassé, état contradictoire détecté
  - Plafond : max_iterations atteint (toujours inclure)

**Étape 2 — Générer l'agent**

Écrivez `agent.py` en utilisant le SDK Python Anthropic. Exigences :

- Modèle : `claude-sonnet-4-6` (configurable via la variable d'environnement `AGENT_MODEL`)
- Implémenter la boucle agentic :
  ```
  while not done and iterations < max_iterations:
      response = client.messages.create(tools=tools, messages=history)
      if response.stop_reason == "tool_use":
          results = execute_tools(response)
          history.append(assistant_turn)
          history.append(tool_results_turn)
      elif response.stop_reason == "end_turn":
          done = True
  ```
- Définissez chaque outil comme un dictionnaire avec `name`, `description`, `input_schema` (JSON Schema)
- Dispatch d'outils : une fonction `dispatch(tool_name, tool_input)` qui achemine vers des callables Python
- Utilisez `cache_control: {"type": "ephemeral"}` sur le message du message système
- Sortie finale structurée : l'agent retourne une dataclass typée, pas du texte brut
- Enregistrez chaque itération : outil appelé, résumé d'entrée, résumé de résultat (pas le contenu complet)

**Étape 3 — Gestion des erreurs**

- Enveloppez chaque appel d'outil dans try/except ; retournez `{"error": str(e)}` comme résultat d'outil — ne jamais lever dans la boucle
- Si `max_iterations` est dépassé : retournez les résultats partiels avec un drapeau `status: "incomplete"`
- En cas d'erreurs API (`anthropic.APIStatusError`) : réessayez jusqu'à 3 fois avec backoff exponentiel

**Étape 4 — Point d'entrée CLI**

Exposer via `argparse` :
- `--goal` (ou positionnel) : remplacer l'objectif codé en dur
- `--max-iterations` : par défaut 25
- `--dry-run` : imprimer le plan (message système + outils) sans exécution

**Sortie :** `agent.py` avec tous les outils implémentés, pas de stubs. Incluez un exemple d'utilisation dans un bloc de commentaire en haut du fichier.
