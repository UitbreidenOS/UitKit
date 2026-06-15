---
name: content-freshness
description: "SLA de maintenance, seuils de staleness, et procédures de fraîcheur du contenu Claudient"
updated: 2026-06-15
---

# SLA de Fraîcheur du Contenu Claudient

Normes de maintenance et procédures pour maintenir le contenu Claudient actuel et précis. Ce guide définit les seuils de staleness, quoi vérifier par type de contenu, et le processus de mise à jour du frontmatter.

---

## Seuils de Staleness

Un fichier est considéré comme **stale** quand sa date `updated` dans le frontmatter YAML est plus ancienne que le seuil pour son type :

| Type de contenu | Seuil | Raison |
|---|---|---|
| Skills (productivité core, testing, debugging) | 6 mois | Les patterns essentiels changent fréquemment avec les mises à jour du modèle Claude |
| Skills (spécifiques au domaine : backend, frontend, etc.) | 6 mois | L'outillage et les meilleures pratiques évoluent rapidement |
| Agents (rôles essentiels : debugger, reviewer, etc.) | 6 mois | Les capacités des agents dépendent des capacités du modèle Claude |
| Guides (mise en route, conceptuels) | 9 mois | Le matériel de référence est plus stable que la procédure |
| Guides (spécifiques à l'outil/framework) | 6 mois | Les outils et APIs changent plus vite que les concepts |
| Flux de travail (tactiques : bug-investigation, code-review) | 6 mois | Ceux-ci reflètent les pratiques et outils actuels |
| Flux de travail (stratégiques : onboarding, planning) | 9 mois | Les processus long terme sont plus stables |
| Prompts | 6 mois | L'efficacité des prompts se dégrade à mesure que le comportement du modèle change |
| ADRs / Règles (décisions documentées) | 12 mois | Les décisions sont censées être durables ; examinez uniquement quand le contexte change |

**Règle globale :** Si elle a une date `updated` et qu'elle est plus ancienne que 6 mois, ajoutez-la à la file de rafraîchissement. Utilisez les seuils plus longs (9–12 mois) uniquement pour le contenu vraiment non-technique (exemples historiques, guides archivés).

---

## Indicateurs de Contenu Stale

Un fichier est fonctionnellement stale même si sa date est récente, s'il y a l'un de ceux-ci :

### Skills
- Exemples de syntaxe de commande qui ne fonctionnent plus (testez dans Claude Code)
- Noms d'outils qui ont été renommés ou supprimés
- Référence de capture d'écran ou UI obsolète
- Conditions de déclenchement de hook qui n'existent plus
- Exemple qui se casse dans Claude Code actuel
- Mentionne une fonctionnalité ou un nom de modèle dépréciée

### Agents
- Décrit les outils auxquels l'agent n'a plus accès
- Référence une version de modèle qui n'est plus disponible
- Les affirmations de capacité ne correspondent plus à la réalité
- Exemples de prompts qui reflètent l'ancien comportement API

### Guides
- Tableau de comparaison de fonctionnalités qui a changé (p. ex., tarification du modèle, fenêtres contextes)
- Instructions d'installation pour un outil avec une nouvelle version majeure
- Étapes de flux de travail qui dépendent d'une fonctionnalité supprimée
- Référence de capture d'écran ou interface obsolète
- Référence une ancienne structure ou convention de nommage du projet

### Flux de travail
- Référence un outil ou skill qui a été supprimé
- Les étapes parallèles dépendent des outils qui ne sont plus disponibles
- L'exemple suppose une structure de base de code qui n'est plus recommandée
- Métrique ou SLA qui n'est plus pertinente (tailles d'équipe obsolètes, niveaux de trafic)

### Tous les types de contenu
- Liens morts (404 vers les ressources externes)
- Références aux fonctionnalités « à venir » qui ont été expédiées il y a longtemps
- Exemples utilisant des versions dépréciées du langage/framework
- Affirmations ambiguës sans preuve à l'appui

---

## Format du Frontmatter

Chaque fichier dans `skills/`, `agents/`, `guides/`, `workflows/`, `rules/`, et `prompts/` doit avoir un bloc de frontmatter YAML au début :

```yaml
---
name: the-skill-name
description: "Objectif d'une phrase de ce fichier"
updated: 2026-06-15
---
```

### Règles du frontmatter

- **name :** kebab-case, correspond au nom du fichier (sans `.md`)
- **description :** ~50 caractères, tient sur une ligne, n'inclut pas le titre
- **updated :** Date ISO 8601 (`YYYY-MM-DD`), mise à jour aujourd'hui chaque fois que vous modifiez le fichier

**Exemple (fichier skill) :**
```yaml
---
name: freshness-auditor
description: "Exécutez des audits de fraîcheur et générez des listes de rafraîchissement priorisées"
updated: 2026-06-15
---
```

**Exemple (fichier de flux de travail) :**
```yaml
---
name: freshness-refresh
description: "Sprint de maintenance trimestriel pour auditer et rafraîchir le contenu stale"
updated: 2026-06-15
---
```

### Comment mettre à jour le frontmatter

Quand vous modifiez un fichier :
1. Trouvez le bloc `---` au haut
2. Changez la valeur `updated:` à la date d'aujourd'hui en format ISO
3. Ne modifiez pas `name` ou `description` (ce sont des identifiants stables)
4. Committez le fichier avec la date mise à jour

Si un fichier est stale mais toujours exact, mettez à jour uniquement la date `updated:` pour réinitialiser le compteur de staleness. Cela signale « fraîcheur confirmée — le contenu a été vérifié comme actuel ».

---

## Quoi vérifier par type de skill

### Skills de productivité
- Exécutez tous les exemples de commande dans une vraie session Claude Code — cela marche-t-il ?
- Si le skill appelle une slash command (p. ex., `/code-review`), vérifiez que cette commande existe toujours
- Si le skill référence un hook ou un setting (p. ex., configuration `settings.json`), vérifiez qu'il est toujours valide
- Vérifiez que les liens des outils externes (npm, GitHub, docs) ne donnent pas de 404

### Skills du domaine (backend, frontend, ML, etc.)
- Vérifiez que les recommandations de version du framework/libraire sont toujours actuelles
- Exécutez les exemples de code (s'ils sont autonomes) pour vous assurer que la syntaxe est valide
- Vérifiez si l'outil ou le framework a lancé une version majeure et a changé le comportement
- Vérifiez que les noms de packages et les chemins d'import n'ont pas changé

### Skills et guides conceptuels
- Relisez le contenu avec des yeux nouveaux — l'explication est-elle toujours claire et exacte ?
- Vérifiez les liens externes (tutoriels, specs, normes) pour les 404
- Si le skill compare deux options, vérifiez que les deux sont toujours en usage courant
- Si le skill décrit une « bonne pratique », vérifiez qu'il s'aligne avec le consensus actuel de l'industrie

### Agents
- Vérifiez que la recommandation de modèle de l'agent (Haiku/Sonnet/Opus) est toujours appropriée pour la tâche
- Vérifiez que le `tools:` listé existe toujours dans Claude Code
- Relisez la section `model guidance` — s'applique-t-elle toujours au modèle Claude actuel ?
- Vérifiez que les capacités supposées de l'agent n'ont pas été supprimées

### Flux de travail
- Lisez les étapes du flux de travail — tous les outils, commandes, et fonctionnalités référencés sont-ils toujours disponibles ?
- Vérifiez si l'une des étapes dépend d'un comportement dépréciée
- Vérifiez que les métriques ou SLAs mentionnées sont toujours réalistes
- Si le flux de travail crée des agents, assurez-vous que les définitions d'agent existent toujours et que leurs rôles n'ont pas changé

### Règles
- Vérifiez que la règle est toujours suivie dans la base de code
- Si la règle référence un outil ou une fonctionnalité, vérifiez qu'il existe toujours
- Relisez la justification — est-elle toujours valide ?

---

## Flux de travail de vérification de fraîcheur (Pour les contributeurs individuels)

Quand vous ajoutez ou modifiez un fichier :

1. **Mettez à jour le frontmatter :**
   ```yaml
   updated: [LA DATE D'AUJOURD'HUI AU FORMAT YYYY-MM-DD]
   ```

2. **Testez le cas échéant :**
   - Si le fichier inclut des commandes, exécutez-les
   - Si le fichier inclut du code, validez la syntaxe
   - Si le fichier référence une fonctionnalité, vérifiez qu'elle existe

3. **Vérifiez les liens :**
   - Les URLs externes dans le fichier ne devraient pas donner de 404
   - Les liens internes (vers d'autres fichiers dans Claudient) devraient référencer des fichiers existants

4. **Committez :**
   ```bash
   git add path/to/file.md
   git commit -m "chore: refresh [filename] — verify accuracy and update date"
   ```

---

## Sprint de fraîcheur trimestriel

Tous les 3 mois, exécutez le flux de travail complet `/workflows/freshness-refresh` :

1. **Générez un rapport :** `node scripts/generate-refresh-report.js`
2. **Triez les fichiers** par âge et importance
3. **Créez les agents de review** pour vérifier l'exactitude du contenu
4. **Appliquez les mises à jour** depuis les rapports des agents
5. **Committez le lot** et réinitialisez le compteur de staleness

---

## Cibles SLA

- **Skills core de productivité :** 95% frais (< 6 mois)
- **Tout autre contenu :** 85% frais
- **Dates de frontmatter manquantes :** 0 (tous les fichiers doivent avoir un champ `updated:`)
- **Liens cassés :** 0 (vérification CI signalée immédiatement)

Surveillez ces métriques dans le rapport de fraîcheur généré trimestriellement.

---

## Contenu connexe

- `/workflows/freshness-refresh` — procédure du sprint de maintenance trimestriel
- `/skills/productivity/freshness-auditor` — exécutez un audit de fraîcheur à la demande
- `/scripts/check-freshness.js` — outil CLI pour détecter les fichiers stale
- `/scripts/generate-refresh-report.js` — générez un rapport de fraîcheur détaillé

---
