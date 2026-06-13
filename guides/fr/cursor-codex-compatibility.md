# Utiliser les skills Claudient dans Cursor, Windsurf, Copilot et Codex

Les skills Claudient sont des fichiers Markdown simples. Rien dans leur format n'est spécifique à Claude Code — pas de binaire, pas de syntaxe propriétaire, pas d'appels API. Cela les rend portables vers tous les principaux outils de codage IA disposant d'un mécanisme d'injection de règles ou de contexte.

Ce guide couvre la mécanique du transfert d'un skill Claudient vers Cursor, Windsurf, GitHub Copilot et OpenAI Codex CLI — ce qui fonctionne, ce qui ne fonctionne pas, et où tracer la limite.

---

## Pourquoi ça fonctionne

Un skill Claudient est composé de quatre sections Markdown : `When to activate`, `When NOT to use`, `Instructions` et `Example`. Le modèle lit ceci comme du texte brut et ajuste son comportement en conséquence.

C'est exactement ce que chaque outil de codage IA fait quand vous placez du texte dans son fichier de règles ou d'instructions — le texte devient partie du prompt système avant que votre demande ne soit traitée. Le format de skill est déjà optimisé pour cela :

- `When to activate` et `When NOT to use` donnent au modèle des contraintes de portée qui préviennent la surappli­cation
- `Instructions` contient du langage directif (« toujours faire X », « ne jamais faire Y ») plutôt que du langage documentaire
- `Example` ancre le modèle dans la structure de sortie attendue

Tout modèle qui accepte un prompt système ou un fichier d'instructions personnalisées peut consommer un skill Claudient sans modification. Vous perdez les fonctionnalités spécifiques à Claude Code (invocation de commande slash, déclencheurs de hook, délégation de sous-agent) mais le guidage comportemental principal se transfère complètement.

---

## Référence rapide

| Outil | Où placer le skill |
|---|---|
| Claude Code | `.claude/skills/<skill>.md` (commande slash) ou import via `CLAUDE.md` |
| Cursor | `.cursor/rules/<skill>.mdc` (auto-chargé) ou `.cursorrules` (hérité) |
| Windsurf | `.windsurfrules` à la racine du projet |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenAI Codex CLI | `AGENTS.md` à la racine du projet, ou passer avec le drapeau `--context` |
| Zed | Fichier de règles du projet (`.zed/settings.json` → clé `"system_prompt"`) |
| Continue.dev | `~/.continue/config.json` → champ `"systemMessage"`, ou bloc `@Rules` |

---

## Cursor

Cursor est l'alternative la plus courante à Claude Code pour les équipes utilisant déjà VS Code. Il supporte des règles granulaires par projet avec des contrôles de portée.

### Emplacement du fichier de règles

Cursor charge automatiquement les règles de `.cursor/rules/`. Chaque fichier doit utiliser l'extension `.mdc`. Cursor lit tous les fichiers `.mdc` de ce répertoire au démarrage — vous n'avez pas besoin de les référencer manuellement.

```
your-project/
├── .cursor/
│   └── rules/
│       ├── fastapi.mdc
│       ├── db-migrations.mdc
│       └── test-coverage.mdc
└── src/
```

### Convertir un skill Claudient en règle Cursor

1. Copiez le fichier `.md` depuis `skills/` vers `.cursor/rules/`
2. Renommez l'extension de `.md` à `.mdc`
3. Ajoutez un bloc frontmatter MDC en haut pour contrôler la portée :

```
---
description: Patterns de points de terminaison FastAPI — activez lors de la création ou modification des routes FastAPI
globs: ["**/*.py", "**/routers/**"]
alwaysApply: false
---

# FastAPI CRUD

## When to activate
...
```

Le champ `globs` indique à Cursor d'attacher cette règle uniquement quand les fichiers correspondant à ces motifs sont ouverts en contexte. Le champ `description` est utilisé par la logique de correspondance des règles de Cursor — copiez le contenu de la section `When to activate` du skill comme une phrase de déclenchement concise.

Définir `alwaysApply: true` injecte la règle dans chaque demande indépendamment du fichier ouvert. Utilisez cela uniquement pour les standards de codage à l'échelle du projet, jamais pour les skills spécifiques à une tâche — cela gaspille le contexte et dégrade la qualité des réponses sur les tâches non liées.

### `.cursorrules` hérité

`.cursorrules` est un seul fichier à la racine du projet. Il est chargé pour chaque demande sans portée. Collez le contenu complet du skill ici seulement si :

- Le projet a une pile technologique dominant unique
- Vous voulez le skill actif indépendamment du fichier ouvert
- Vous n'utilisez pas encore la structure de répertoire `.cursor/rules/`

Pour les projets avec plusieurs skills, `.cursor/rules/` avec des fichiers `.mdc` séparés est strictement meilleur — chaque skill se charge uniquement quand c'est pertinent.

### Limitation spécifique à Cursor

Cursor ne supporte pas l'invocation de commande slash des skills individuels de la manière que Claude Code le fait. Tous les fichiers `.mdc` qui correspondent au contexte actuel sont chargés simultanément. Si vous avez cinq skills installés et que tous les cinq correspondent (par ex. tous ont `alwaysApply: true`), Cursor injecte les cinq dans le prompt système. Gardez la portée serrée via `globs` et des valeurs `description` précises pour éviter cela.

---

## Windsurf

Windsurf (l'éditeur de Codeium) utilise un seul fichier de règles par projet.

### Emplacement du fichier de règles

Placez un fichier `.windsurfrules` à la racine du projet :

```
your-project/
├── .windsurfrules
├── src/
└── package.json
```

### Convertir un skill Claudient

Collez le contenu du skill directement dans `.windsurfrules`. Pour plusieurs skills, concaténez-les avec une ligne horizontale (`---`) comme séparateur :

```markdown
# FastAPI CRUD

## When to activate
- Création d'un nouveau point de terminaison FastAPI (GET, POST, PUT, DELETE)
...

## Instructions
...

---

# Database Migrations

## When to activate
- Exécution de migrations Alembic
...
```

Windsurf charge le fichier complet `.windsurfrules` pour chaque demande. Il n'y a pas de mécanisme de portée par fichier — le modèle doit utiliser les sections `When to activate` et `When NOT to use` pour s'auto-sélectionner. Cela fonctionne, mais les fichiers volumineux (au-delà de 3–4 skills) commencent à diluer l'attention du modèle. Gardez `.windsurfrules` aux 2–3 skills les plus pertinents pour le flux de travail actuel et faites pivoter selon les besoins.

---

## GitHub Copilot

Le fichier d'instructions personnalisées de Copilot s'applique à toutes les interactions Copilot dans un dépôt.

### Emplacement du fichier de règles

```
your-project/
├── .github/
│   └── copilot-instructions.md
└── src/
```

Le nom du fichier doit être exactement `copilot-instructions.md`. Copilot le lit automatiquement pour tout dépôt où il est présent.

### Convertir un skill Claudient

Collez le contenu du skill dans `copilot-instructions.md`. Le format à quatre sections est compris par les modèles de classe GPT-4 alimentant Copilot — la section `When NOT to use` est particulièrement efficace pour empêcher Copilot d'appliquer les patterns dans le mauvais contexte.

```markdown
# FastAPI CRUD

## When to activate
- Création d'un nouveau point de terminaison FastAPI
- Ajout de modèles Pydantic pour les requêtes/réponses
- Implémentation de l'injection de dépendances dans les routes

## When NOT to use
- Projets Flask ou Django existants
- Scripts simples sans couche API
- APIs gRPC ou GraphQL

## Instructions

Définissez toujours un modèle Pydantic pour les corps de demande. Ne jamais accepter de dicts bruts.
Levez `HTTPException` avec le code de statut correct — 422 pour les erreurs de validation,
404 pour non-trouvé, 500 uniquement pour les défaillances inattendues.

## Example

**User:** Ajoutez un point de terminaison POST pour créer un nouvel utilisateur.

**Expected:**
- Modèle Pydantic `UserCreate` avec `email: EmailStr` et `password: str`
- Route à `POST /users` retournant `UserResponse` (pas de champ password)
- `HTTPException(409)` si l'email existe déjà
```

### Limites de caractères de Copilot

Depuis mi-2025, Copilot applique un plafond souple sur le contenu `copilot-instructions.md` chargé par demande. Les fichiers au-delà d'environ 8 000 caractères peuvent être tronqués. Pour les projets multi-skills, priorisez les skills les plus fréquemment déclenchés et gardez les sections `Instructions` individuelles denses plutôt qu'exhaustives.

---

## OpenAI Codex CLI

Codex CLI (commande `codex`) utilise `AGENTS.md` pour le contexte persistant, équivalent à CLAUDE.md dans Claude Code.

### Emplacement du fichier de règles

Placez `AGENTS.md` à la racine du projet :

```
your-project/
├── AGENTS.md
└── src/
```

### Convertir un skill Claudient

Collez le skill directement dans `AGENTS.md`. Codex lit ce fichier au démarrage de la session et l'inclut dans le prompt système pour chaque demande dans ce répertoire.

```markdown
# FastAPI CRUD

## When to activate
...

## Instructions
...
```

Pour les invocations ponctuelles sans modifier `AGENTS.md`, passez le skill en tant que fichier de contexte :

```bash
codex --context skills/backend/python/fastapi.md "Ajouter un point de terminaison POST /users"
```

Le drapeau `--context` accepte un chemin de fichier et ajoute son contenu au prompt système pour cette invocation uniquement. Utile pour tester les skills avant de les valider dans `AGENTS.md`.

### Imbrication

Comme CLAUDE.md, `AGENTS.md` supporte les remplacements au niveau du répertoire. Un fichier à `services/api/AGENTS.md` s'applique uniquement quand Codex opère dans ce sous-arbre, permettant l'assignation de skills par service dans un monorepo.

---

## Zed et Continue.dev

### Zed

Le contexte IA de Zed est configuré dans `.zed/settings.json`. Collez le contenu du skill dans le champ `"system_prompt"` :

```json
{
  "assistant": {
    "default_model": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-5"
    },
    "system_prompt": "# FastAPI CRUD\n\n## When to activate\n..."
  }
}
```

Pour les setups multi-skills, concaténez les skills comme une seule chaîne. Zed ne supporte pas les imports de règles basés sur les fichiers, donc le contexte entier doit vivre en ligne dans `settings.json`.

### Continue.dev

Continue supporte les remplacements de message système globaux et au niveau du projet. Dans `~/.continue/config.json` :

```json
{
  "models": [
    {
      "title": "Claude Sonnet",
      "provider": "anthropic",
      "model": "claude-sonnet-4-5",
      "systemMessage": "# FastAPI CRUD\n\n## When to activate\n..."
    }
  ]
}
```

Pour les règles au niveau du projet, Continue supporte les blocs `@Rules` dans `.continue/rules.md` (version 0.9+). Collez le contenu du skill là — Continue l'injecte aux côtés du prompt système du modèle pour les demandes faites dans ce projet.

---

## Ce qui se transfère bien

**La section Instructions** — le langage directif fonctionne de manière identique entre les modèles. « Définissez toujours un modèle Pydantic pour les corps de demande. Ne jamais accepter de dicts bruts. » est sans ambiguïté pour GPT-4o, Claude, Gemini et tout autre modèle avec capacité de suivi d'instructions.

**La section Example** — l'ancrage en quelques shots est indépendant du modèle. Un exemple montrant la structure de sortie attendue améliore l'adhérence sur tous les modèles, pas seulement Claude.

**La section When NOT to use** — les contraintes négatives sont sous-utilisées dans la plupart des fichiers de règles. Cette section est souvent la différence entre un skill qui aide et un qui interfère avec le travail non lié.

**Les règles ciblées par fichier (Cursor globs)** — le format `.mdc` de Cursor avec `globs` réplique le champ frontmatter `paths` de Claude Code. Les skills qui spécifient les motifs de fichiers dans leur section `When to activate` se traduisent naturellement aux `globs` de Cursor — automatisez la conversion.

---

## Ce qui ne se transfère pas

**Invocation de commande slash** — `/skill-name` est spécifique à Claude Code. Les autres outils chargent les skills passivement depuis leur fichier de règles ; vous ne pouvez pas déclencher un skill à la demande en cours de session de la même manière.

**Hooks** — les hooks `.claude/settings.json` (`PreToolUse`, `PostToolUse`, `Notification`, `Stop`) sont uniquement Claude Code. Les scripts shell déclenchés sur les événements d'outils n'ont pas d'équivalent dans Cursor, Windsurf ou Copilot. Ne tentez pas de traduire les fichiers de hook.

**Délégation de sous-agent** — Les skills qui instruisent Claude pour générer un sous-agent (outil `Task`, références `subagent_type`) ne s'exécuteront pas dans les autres outils. Le modèle lira l'instruction et ne fera rien de significatif avec, ou tentera de simuler le comportement dans une fenêtre de contexte unique.

**Références d'outils MCP** — Les instructions qui référencent des outils MCP spécifiques (`mcp__tool_name`) fonctionnent uniquement dans Claude Code avec le serveur MCP configuré. Retirez-les des skills avant de les utiliser dans d'autres outils, ou remplacez-les par des instructions d'outils natifs équivalentes pour la plateforme cible.

**Injection d'exécution `!command`** — La syntaxe `!git branch --show-current` pour intégrer la sortie de shell dans le contexte du skill au moment de l'activation est spécifique à Claude Code. Les autres outils n'exécutent pas ces commandes en ligne. Remplacez-les par du texte statique ou supprimez-les entièrement lors du portage.

---

## Flux de travail pratique pour porter un skill

1. Ouvrez le fichier de skill depuis `skills/`
2. Retirez toute injection en ligne `!command`
3. Retirez ou réécrivez les sections qui référencent les agents Claude Code, les hooks ou les outils MCP
4. Déterminez l'outil cible et le fichier de destination (voir le tableau en haut)
5. Pour Cursor : ajoutez le bloc frontmatter MDC ; extrayez le contenu `When to activate` comme valeur `description` ; mappez les motifs de fichiers à `globs`
6. Pour les destinations à fichier unique (Windsurf, Copilot, Codex) : collez tel quel avec un séparateur si concaténant plusieurs skills
7. Testez avec une tâche qui correspond à `When to activate` — vérifiez que le modèle applique les patterns `Instructions`
8. Testez avec une tâche qui correspond à `When NOT to use` — vérifiez que le modèle n'applique pas les patterns

La structure à quatre sections a été conçue pour être autonome. Un skill Claudient bien écrit devrait nécessiter moins de 10 minutes pour être porté vers l'un de ces outils.

---
