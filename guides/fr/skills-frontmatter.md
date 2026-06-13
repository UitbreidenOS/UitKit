# Référence Frontmatter des Compétences

Référence complète pour tous les champs YAML frontmatter dans les fichiers de compétences Claude Code. Le frontmatter contrôle l'activation correspondante, l'invocation automatique, les défauts d'effort, et si la compétence déclenche un appel au modèle du tout.

---

## Champs Obligatoires

### `name`

**Type :** `string` (kebab-case)
**Obligatoire :** Oui

L'identifiant qui devient la commande slash. `name: fastapi-crud` → `/fastapi-crud`.

```yaml
name: fastapi-crud
```

Règles :
- Doit être unique sur tous les fichiers de compétences dans le scope (projet + global)
- Kebab-case uniquement — pas de traits bas, pas de points
- Gardez-le assez court pour taper sans friction d'autocomplétion

---

### `description`

**Type :** `string`
**Obligatoire :** Oui
**Limite de caractères :** Compte vers la limite partagée de 1 536 caractères avec `when_to_use`

Le signal principal que Claude utilise pour l'appariement sémantique — à la fois pour l'invocation automatique et pour répondre aux commandes slash de l'utilisateur. Écrivez ceci comme une condition d'activation explicite, pas un résumé de capacité.

```yaml
description: "Création de points terminaux FastAPI avec validation Pydantic, gestionnaires d'itinéraires asynchrones et injection de dépendances. Activez pour les nouveaux itinéraires API, les définitions de modèles de requête ou la configuration de tâches en arrière-plan."
```

Mauvais : `"Une compétence pour FastAPI."` — trop vague, signal d'appariement faible.
Bon : l'exemple ci-dessus — technologie + type de tâche + sous-tâches spécifiques.

---

## Champs Optionnels

### `when_to_use`

**Type :** `string`
**Limite de caractères :** Limite partagée de 1 536 caractères avec `description`

Contexte d'activation supplémentaire ajouté à `description` dans le listing des compétences. Utilisez pour les conditions de déclenchement qui sont trop verbeux pour la description mais améliorent la précision d'appariement.

```yaml
when_to_use: "Activez quand l'utilisateur mentionne FastAPI, API Python asynchrone, modèles Pydantic, ou travaille dans un projet qui a main.py avec app = FastAPI() défini."
```

Traitez `description` comme le titre et `when_to_use` comme le contexte d'appariement étendu. Les deux comptent vers le même cap de 1 536 caractères — budgétisez en conséquence.

---

### `paths`

**Type :** `array` de chaînes glob
**Défaut :** Aucun (la compétence n'est jamais auto-activée par le contexte de fichier)

Auto-active la compétence quand Claude touche un fichier correspondant à un modèle listé. Utile pour les utilitaires de test, les aides de fichier config, et les outils de schéma qui devraient charger silencieusement quand Claude ouvre des fichiers spécifiques.

```yaml
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "tests/**"
  - "**/jest.config.*"
```

Remarques :
- L'appariement se fait contre le chemin du fichier que Claude lit ou édite actuellement, pas le répertoire de travail
- Les compétences avec `paths:` s'activent silencieusement — l'utilisateur ne voit pas une invocation de commande slash
- Plusieurs compétences peuvent s'activer via `paths:` simultanément — il n'y a pas de résolution de conflit ; toutes les compétences activées sont chargées

---

### `effort`

**Type :** `string` — `"low"` | `"medium"` | `"high"` | `"xhigh"`
**Défaut :** Hérité du paramètre d'effort actif de la session

Remplace le niveau d'effort pour les sessions où cette compétence est active. Utilisez `"xhigh"` pour les compétences qui impliquent l'analyse de sécurité, les décisions architecturales, ou toute tâche où manquer une contrainte subtile a des conséquences réelles.

```yaml
effort: xhigh
```

| Valeur | Approprié pour |
|---|---|
| `"low"` | Reformatage, renommage, génération de boilerplate, classification simple |
| `"medium"` | Implémentation de fonctionnalités de routine, refactorisations simples |
| `"high"` | Travail complexe sur les fonctionnalités, changements multi-fichiers avec dépendances |
| `"xhigh"` | Revue de sécurité, décisions architecturales, débogage de problèmes profonds |

---

### `shell`

**Type :** `string`
**Défaut :** `"bash"`

Remplace l'interpréteur de shell pour les blocs de script au sein de la compétence. Pertinent uniquement pour les compétences Windows où PowerShell est requis.

```yaml
shell: powershell
```

Laissez ceci non défini pour toute compétence ciblant macOS, Linux, ou des environnements cross-platform.

---

### `disable-model-invocation`

**Type :** `boolean`
**Défaut :** `false`

Quand `true`, activer la compétence ne déclenche pas une réponse du modèle. Le corps de la compétence est chargé en contexte comme une directive, et le modèle l'applique aux interactions ultérieures plutôt que de générer une réponse immédiate.

```yaml
disable-model-invocation: true
```

Utilisez pour :
- Les compétences qui configurent le comportement sans avoir besoin de « répondre » (par exemple, des directives de style `always-use-typescript`)
- Les compétences qui injectent du contexte passivement (par exemple, une compétence qui charge les conventions du projet en contexte sans agir sur elles immédiatement)

---

## Budget de Caractères

Le listing des compétences utilisé pour l'appariement d'invocation automatique a une limite stricte :

| Champ | Budget |
|---|---|
| `description` + `when_to_use` combinés | 1 536 caractères |
| Corps complet de la compétence (chargé sur correspondance) | ~15 000 caractères |

**Stratégie :** Mettez les déclencheurs d'activation denses et riches en mots-clés dans `description` et `when_to_use`. Mettez les instructions détaillées, les exemples de code, et les modèles dans le corps de la compétence. Le corps n'est chargé qu'après que la correspondance soit faite — il n'affecte pas la performance d'appariement.

---

## Découverte de Monorepo

Les compétences ne remontent **pas** l'arborescence de répertoires. C'est la source la plus courante de confusion lors de la migration à partir de modèles CLAUDE.md.

| Fonctionnalité | Remonte l'arborescence ? |
|---|---|
| `CLAUDE.md` | Oui — remonte du fichier actuel à la racine du repo |
| `.claude/rules/` | Non — utilise l'appariement frontmatter `paths:` |
| `.claude/skills/` | Non — seules les compétences dans le `.claude/skills/` le plus proche sont actives |
| `~/.claude/skills/` | Toujours actif quel que soit le répertoire |

Dans un monorepo :
- Les compétences globales (`~/.claude/skills/`) sont disponibles partout
- Les compétences de niveau racine `.claude/skills/` sont disponibles uniquement à partir de la racine du repo
- Les répertoires `.claude/skills/` au niveau paquet sont nécessaires pour les compétences spécifiques aux paquets

---

## Exemple Frontmatter Complet

```yaml
---
name: drizzle-orm
description: "Définition de schéma Drizzle ORM, construction de requêtes, et intégration Neon Postgres en TypeScript. Activez pour le travail de schéma de base de données, les modèles de requête ORM, ou la création de migrations."
when_to_use: "Utilisez lors du travail avec des fichiers drizzle.config.ts, schema.ts, le répertoire db/, ou quand l'utilisateur mentionne Drizzle, Neon, ou les migrations de base de données dans un projet TypeScript."
paths:
  - "**/schema.ts"
  - "**/drizzle.config.ts"
  - "db/**"
  - "**/migrations/**"
effort: high
---

# Drizzle ORM

## Quand activer
...
```

---

## Résumé de Compatibilité des Champs

| Champ | Obligatoire | Effet d'invocation automatique | Effet d'invocation manuelle |
|---|---|---|---|
| `name` | Oui | Nom de la commande slash | Identifiant principal |
| `description` | Oui | Signal d'appariement principal | Affiché dans le listing des compétences |
| `when_to_use` | Non | Signal d'appariement secondaire | Affiché dans le listing des compétences |
| `paths` | Non | Auto-activation basée sur fichier | Aucun effet |
| `effort` | Non | Définit l'effort quand la compétence s'active | Définit l'effort quand la compétence s'active |
| `shell` | Non | Aucun effet sur l'appariement | Change l'interpréteur de script |
| `disable-model-invocation` | Non | Aucune réponse générée | Aucune réponse générée |

---
