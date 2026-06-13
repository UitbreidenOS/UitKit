# MCP : Task Master

Gestion des tâches alimentée par l'IA avec isolement du contexte — décomposez les grandes fonctionnalités en sous-tâches suivies, maintenez la progression sur les sessions et coordonnez le travail multi-agents à partir d'un graphique de tâches structuré.

## Pourquoi vous avez besoin de ceci

Les longues fonctionnalités s'étendent sur plusieurs sessions et impliquent souvent des flux de travail parallèles. Sans suivi des tâches persistant, Claude commence chaque session sans savoir ce qui est fait, ce qui vient ensuite ou ce qui est bloqué. Task Master résout cela :
- Une PRD ou une description de fonctionnalité devient une liste de tâches structurée, ordonnée par dépendance, en une seule invite
- La progression persiste dans votre référentiel — chaque session reprend exactement où la dernière s'est arrêtée
- L'ordre des dépendances signifie que `next_task` retourne toujours la bonne chose sur laquelle travailler, pas une supposition
- Les tâches complexes peuvent être développées en sous-tâches et confiées aux agents parallèles, chacun avec un contexte isolé
- L'analyse de complexité expose les tâches à haut risque avant qu'elles ne deviennent des problèmes d'horaire

## Installation

```bash
npm install -g task-master-ai
```

## Configuration

Ajoutez à `~/.claude.json` ou au projet `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your-anthropic-api-key-here",
        "PERPLEXITY_API_KEY": "your-perplexity-api-key-here"
      }
    }
  }
}
```

`ANTHROPIC_API_KEY` est requis — Task Master appelle Claude en interne pour analyser les PRDs et les tâches. `PERPLEXITY_API_KEY` est optionnel ; cela permet les décompositions de tâches améliorées par la recherche qui tirent les meilleures pratiques actuelles.

## Outils clés / Ce qu'ils font

- `initialize_project` — configurer Task Master dans le projet actuel, créer le répertoire `.taskmaster/`
- `parse_prd` — lire une PRD ou une description de fonctionnalité et générer automatiquement une liste de tâches structurée avec dépendances et priorités
- `get_tasks` — lister toutes les tâches avec statut, priorité et résumé des dépendances
- `get_task` — obtenir les détails complets sur une seule tâche incluant la description, les sous-tâches et les notes
- `create_task` — créer manuellement une tâche avec titre, description, priorité et dépendances
- `update_task` — mettre à jour le titre, la description, la priorité ou les dépendances d'une tâche
- `set_task_status` — marquer une tâche comme `pending`, `in-progress`, `done` ou `blocked`
- `next_task` — retourner la tâche la plus élevée priorité non bloquée prête à travailler, en respectant l'ordre des dépendances
- `expand_task` — décomposer une tâche en sous-tâches pour l'exécution parallèle ou le suivi plus fin
- `add_subtask` — ajouter manuellement une sous-tâche à une tâche existante
- `analyze_project_complexity` — noter toutes les tâches par complexité et signaler les éléments à haut risque avec raisonnement
- `generate_task_files` — écrire les fichiers markdown individuels par tâche à `.taskmaster/tasks/` pour le contexte de l'agent

## Exemples d'utilisation

```
Initialiser Task Master pour ce projet, puis analyser la PRD à docs/prd.md
et générer la liste de tâches complète. Montrez-moi le graphique des dépendances.
```

```
Quelle est la prochaine tâche sur laquelle je dois travailler ? Respectez l'ordre des dépendances
et montrez-moi la description de la tâche et toutes les sous-tâches.
```

```
J'ai terminé la tâche 5. Marquez-la comme terminée, puis montrez-moi quelles tâches viennent
d'être débloquées et celle qui a la priorité la plus élevée.
```

```
Développez la tâche 8 en sous-tâches assez détaillées pour l'exécution parallèle de l'agent.
Chaque sous-tâche doit être réalisable indépendamment en moins de 2 heures.
```

```
Analysez la complexité de toutes les tâches restantes. Signaler tout ce qui dépasse
un score de complexité de 7, expliquer pourquoi c'est complexe et suggérer
comment le réduire avant que nous commencions.
```

## Authentification

**Requis :** `ANTHROPIC_API_KEY` — obtenir de console.anthropic.com. Task Master utilise Claude pour analyser les PRDs, la complexité des analyses et développer les tâches. La clé est appelée en interne par le serveur MCP, pas directement par la session Claude Code.

**Optionnel :** `PERPLEXITY_API_KEY` — obtenir de perplexity.ai/api. Permet à Task Master d'augmenter les décompositions de tâches avec les versions actuelles de la bibliothèque, les problèmes de migration connus et les modèles communautaires pertinents. Utile pour les tâches impliquant des piles technologiques peu familières.

## Conseils

**Commiter `.taskmaster/` à git :** Les données de tâche vivent dans `.taskmaster/tasks.json`. Le commiter signifie que votre équipe entière voit le même état de tâche, la progression est vérifiable dans l'historique et les sessions reprennent avec un contexte complet après tout écart.

**Utilisez toujours `next_task` au lieu de choisir manuellement :** Task Master construit un graphique de dépendances lors de l'analyse de la PRD. `next_task` traverse ce graphique pour faire surface ce qui est actuellement débloqué et de plus haute priorité. Le choix manuel contourne cette logique et risque de commencer des tâches dont les dépendances ne sont pas terminées.

**`expand_task` avant le travail des agents parallèles :** Lors de la transmission à plusieurs agents via des worktrees, développez d'abord la tâche pertinente. Chaque sous-tâche devient une unité de travail isolée avec son propre contexte — les agents ne se marchent pas dessus.

**`generate_task_files` pour le contexte de l'agent :** L'écriture de fichiers de tâches individuels à `.taskmaster/tasks/` donne à chaque agent un fichier de contexte propre et concentré avec juste ce dont il a besoin pour une tâche. Les agents n'ont pas besoin d'analyser la liste de tâches complète.

**`analyze_project_complexity` tôt :** Exécutez l'analyse de complexité juste après `parse_prd`, avant de commencer le travail. Les tâches marquées comme hautement complexes sont l'endroit où vivent les risques d'horaire. Résolvez l'ambiguïté ou décomposez-les davantage avant de vous engager sur une chronologie.

**Les tâches bloquées nécessitent un déblocage explicite :** Si une tâche est marquée `blocked`, Task Master ne la fera pas surface via `next_task` jusqu'à ce que son statut soit mis à jour. Quand un blocker est résolu, remettez la tâche bloquée à `pending` et ajoutez une note expliquant ce qui a changé.

---
