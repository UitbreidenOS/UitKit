# Guide du Graphe de Dépendances des Skills

Ce guide explique comment analyser et visualiser les relations entre les skills et les agents dans Claudient à l'aide des outils de graphe de dépendances.

---

## Présentation générale

Le dépôt Claudient est un réseau de skills et d'agents. Au fil du temps, les skills se référencent les uns les autres — soit par nom, par fonctionnalité, soit par contexte. Comprendre ces dépendances vous aide à :

- **Identifier les grappes** : quels skills fonctionnent ensemble
- **Repérer les orphelins** : skills auxquels personne ne fait référence (candidats à l'archivage)
- **Détecter les fragilités** : skills avec trop d'arêtes entrantes (fortement dépendus, risque élevé en cas de modification)
- **Planifier la refactorisation** : fusionner ou extraire des skills pour réduire le couplage

Les outils de graphe de dépendances analysent tous les fichiers `.md` dans les répertoires `skills/` et `agents/`, détectent les références croisées par appariement de noms, et produisent trois formats de sortie : diagrammes Mermaid, listes d'adjacence JSON, et statistiques récapitulatives.

---

## Le script principal : `scripts/dependency-graph.js`

Ce script Node.js explore les répertoires `skills/` et `agents/` et construit un graphe des références skill-à-skill et agent-à-agent.

### Fonctionnement

1. **Collecte tous les noms** : Lit chaque fichier `.md` dans `skills/` et `agents/`, en extrayant les noms de fichiers (kebab-case, convertis en minuscules) comme identifiants de nœuds.
2. **Trouve les références** : Pour chaque fichier, analyse son contenu (insensible à la casse) pour trouver les mentions d'autres skills ou agents en utilisant l'appariement par limite de mot avec regex.
3. **Construit la liste d'adjacence** : Mappe chaque skill/agent au nom des skills/agents auxquels il fait référence.
4. **Produit des sorties** : Génère un diagramme Mermaid, JSON, ou des statistiques selon les drapeaux.

### Utilisation

```bash
# Diagramme Mermaid (par défaut) — limité aux 50 meilleurs arcs
node scripts/dependency-graph.js

# Liste d'adjacence JSON — tous les arcs
node scripts/dependency-graph.js --json

# Statistiques uniquement
node scripts/dependency-graph.js --stats
```

### Formats de sortie

#### Sortie Diagramme Mermaid

```
graph LR
    agent_handoff["agent handoff"] --> session_handoff["session handoff"]
    skill_composition["skill composition"] --> agent_handoff["agent handoff"]
    ...
    %% ... affichant les 50 premiers arcs sur 237
```

Copiez-collez ceci dans un bloc de code Markdown (utilisez ` ```mermaid ... ``` `) pour rendre un diagramme flux interactif gauche-à-droite dans GitHub, Obsidian, ou tout visualiseur Markdown prenant en charge Mermaid.

**Remarque** : La sortie Mermaid est limitée à 50 arcs pour éviter les diagrammes écrasants. Utilisez `--json` pour le graphe complet.

#### Sortie JSON

```json
{
  "agent-handoff": ["session-handoff", "agent-tracing"],
  "skill-composition": ["agent-handoff"],
  "rag-architect": ["prompt-caching", "llm-eval"],
  ...
}
```

Chaque clé est un skill/agent ; la valeur est un tableau trié des skills/agents auxquels il fait référence. Utilisez ceci pour l'analyse programmatique ou l'alimentation des outils de visualisation.

#### Sortie Statistiques

```
Statistiques du Graphe de Dépendances :

  Total skills/agents : 427
  Nœuds avec références : 189
  Total arcs : 512
  Nœuds orphelins (sans références) : 238

  Top 10 les plus connectés :
    prompt-engineering: 24 références
    agent-handoff: 18 références
    claude-api: 16 références
    llm-eval: 14 références
    ...
```

Fournit une vue récapitulative : nœuds totaux, nombre ayant des dépendances, nombre d'arcs, nombre d'orphelins, et les 10 skills/agents les plus référencés.

---

## Utiliser le Visualiseur Interactif : `scripts/visualize-graph.js`

Pour l'exploration interactive, utilisez le visualiseur de graphe force-directed D3.js.

### Utilisation

```bash
# Générer JSON à partir du graphe de dépendances, canaliser vers le visualiseur
node scripts/dependency-graph.js --json | node scripts/visualize-graph.js

# Ou sauvegarder JSON d'abord, puis visualiser
node scripts/dependency-graph.js --json > /tmp/graph.json
node scripts/visualize-graph.js < /tmp/graph.json
```

Cela produit un fichier HTML autonome avec un graphe force-directed D3.js interactif. Ouvrez-le dans un navigateur web pour :

- **Glisser les nœuds** pour explorer le réseau
- **Zoomer et déplacer** pour naviguer
- **Survoler les nœuds** pour mettre en surbrillance les connexions
- **Cliquer sur les nœuds** pour les épingler/désépingler
- **Voir le degré du nœud** (degré entrant et sortant) dans les info-bulles

Le HTML inclut toutes les dépendances intégrées (aucune requête externe) et convient aux présentations ou au partage avec les membres de l'équipe.

---

## Flux de travail courants

### Trouver tous les skills qui dépendent d'un skill donné

Interrogez la sortie JSON :

```bash
node scripts/dependency-graph.js --json | jq 'to_entries[] | select(.value[] == "prompt-caching") | .key'
```

Cela retourne tous les skills qui référencent `prompt-caching`.

### Identifier les nœuds hautement connectés (hub skills)

```bash
node scripts/dependency-graph.js --json | jq 'to_entries | map({name: .key, count: (.value | length)}) | sort_by(.count) | reverse | .[0:10]'
```

Top 10 skills par références sortantes.

### Trouver les skills orphelins (sans dépendances)

```bash
node scripts/dependency-graph.js --json | jq 'to_entries[] | select(.value | length == 0) | .key'
```

Ceux-ci peuvent être des skills autonomes, des skills spécialisés domaine, ou des candidats à l'archivage s'ils ne sont pas activement maintenus.

### Vérifier les dépendances circulaires

Inspectez manuellement le graphe ou utilisez le visualiseur interactif pour repérer les cycles. Remarque : l'implémentation actuelle détecte uniquement les références directes ; la véritable détection de dépendances circulaires (A → B → A) nécessiterait un parcours de graphe.

---

## Interpréter les résultats

### Degré sortant élevé (nombreux arcs sortants)

Un skill qui référence plusieurs autres. Exemples :
- `agent-handoff` (référence `session-handoff`, `agent-tracing`, etc.) — un skill qui combine plusieurs concepts
- `skill-composition` — un guide ou meta-skill décrivant comment combiner d'autres skills

**Action** : Vérifiez que les références sont nécessaires. Consolidez s'il y a duplication.

### Degré entrant élevé (nombreux arcs entrants)

Un skill auquel beaucoup d'autres font référence. Exemples :
- `prompt-engineering` (référencé par de nombreux skills de niveau supérieur)
- `claude-api` (fondation pour les skills SDK)

**Action** : Traitez comme infrastructure centrale stable. Les modifications ici ont un impact large — examinez attentivement.

### Nœuds isolés (zéro arcs)

Un skill sans références croisées à d'autres skills. Exemples :
- Skills spécifiques au domaine (p. ex., `photography-studio` dans `skills/small-business/`)
- Skills nouvellement ajoutés pas encore intégrés
- Tutoriels autonomes

**Action** : Pas nécessairement mauvais. L'isolement peut indiquer une spécialisation domaine. Mais s'il s'agit d'un skill utilitaire, considérez si ce skill devrait être référencé ailleurs.

---

## Mettre à jour les dépendances (Manuellement)

Le graphe est construit à partir de **références textuelles** dans le contenu du fichier. Quand vous :

1. **Renommez un fichier skill** (p. ex., `foo.md` → `bar.md`) : Toutes les références existantes à "foo" se cassent automatiquement. Mettez à jour tous les fichiers qui mentionnent `foo` pour utiliser `bar`.
2. **Ajoutez une nouvelle référence** : Mentionnez l'autre skill par nom dans le contenu de votre fichier. La prochaine construction de graphe la détectera.
3. **Supprimez une référence** : Supprimez la mention. La prochaine construction de graphe supprimera l'arc.

Aucun manifeste de dépendance explicite n'est nécessaire — le graphe déduit du contenu.

---

## Intégration avec CI/CD

Ajoutez une vérification pre-commit ou CI pour valider le graphe de dépendances :

```bash
# Détectez les dépendances circulaires ou les skills isolés
node scripts/dependency-graph.js --stats | grep "Orphan nodes"
```

Ou utilisez le flux de travail `/skill-audit` (voir `workflows/skill-audit.md`) pour exécuter un audit de dépendance complet dans le cadre de votre processus d'examen.

---

## Exemple : Analyser la composition des skills

Supposons que vous vouliez comprendre la structure du guide `skill-composition` :

```bash
node scripts/dependency-graph.js --json | jq '.["skill-composition"]'
```

Sortie :
```json
["agent-handoff", "agent-memory", "llm-eval", "prompt-engineering"]
```

Le guide `skill-composition` référence quatre skills essentiels. Vous connaissez maintenant le chemin d'apprentissage : lisez ces quatre skills, puis retournez à `skill-composition` pour savoir comment les combiner.

---

## Dépannage

**Le graphe est vide ou a très peu d'arcs** : Assurez-vous que vous exécutez depuis la racine du dépôt (`/Users/tushar/Desktop/Claudient`). Le script cherche `skills/` et `agents/` relatif à la racine du dépôt.

**Faux positifs (références incorrectement détectées)** : L'appariement est insensible à la casse et utilise les limites de mot. Les chaînes comme "agent" correspondent à "agent-handoff" (correct) mais pourraient aussi correspondre à "agent_supervisor" si vous n'êtes pas prudent. Examinez le contenu réel du fichier skill pour confirmer que la référence est intentionnelle.

**Un skill manquant dans le graphe** : Le script indexe uniquement les fichiers `.md` dans les répertoires `skills/` et `agents/`. Les guides, les flux de travail, et les autres répertoires ne sont pas indexés (c'est intentionnel — le graphe se concentre sur le cœur skill/agent). Si un skill manque, vérifiez qu'il se trouve dans le bon répertoire.

---

## Prochaines étapes

- Exécutez `/skill-discovery` (voir `skills/ai-engineering/skill-discovery.md`) pour trouver les skills connexes de manière interactive.
- Exécutez le flux de travail `skill-audit` (`workflows/skill-audit.md`) pour identifier les écarts de couverture et les nœuds sur-connectés.
- Utilisez le visualiseur interactif (`scripts/visualize-graph.js`) pour explorer le réseau en temps réel.
