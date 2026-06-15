---
name: skill-discovery
description: "Découvrir des compétences connexes via analyse de graphe de dépendances, trouver des parcours d'apprentissage et identifier des clusters de compétences"
updated: 2026-06-15
---

# Compétence de Découverte de Compétences

## Quand l'activer

- Rechercher des compétences liées à un sujet (par exemple, « J'ai besoin de travailler avec RAG — quelles compétences devrais-je lire ? »)
- Construire un parcours d'apprentissage (par exemple, « Quelles compétences mènent aux équipes d'agents ? »)
- Trouver une compétence par description partielle
- Identifier les clusters de compétences et les outils connexes au sein d'un domaine
- Planifier un flux de travail multi-compétences et connaître les dépendances
- Débogage : comprendre pourquoi une compétence référence une autre

## Quand NE PAS l'utiliser

- Rechercher des ressources non-compétences (guides, flux de travail, agents, règles)
- Questions triviales ponctuelles
- Questions génériques sur Claude ou les LLM non liées à Claudient

## Instructions

### Étape 1 — Demander une compétence ou un sujet

Formulez votre requête comme l'une des options suivantes :

- « Trouver les compétences liées à [sujet] » → Retourne toutes les compétences de cette catégorie
- « Qu'est-ce qui mène à [nom de compétence] ? » → Montre les prérequis
- « Qu'est-ce qui s'appuie sur [nom de compétence] ? » → Montre les prochaines étapes
- « Montrez-moi un parcours d'apprentissage pour [objectif] » → Construit une séquence
- « J'ai besoin d'une compétence pour [description] » → Correspondance sémantique
- « Trouver les compétences orphelines » → Liste les compétences sans références croisées
- « Quelles sont les compétences les plus centrales ? » → Retourne les nœuds de haut degré

### Étape 2 — Générer ou récupérer le graphe de dépendances

Exécutez le script de graphe de dépendances :

```bash
node scripts/dependency-graph.js --json
```

Cela produit une liste d'adjacence : `{ "skill-name": ["ref1", "ref2", ...], ... }`

Pour les statistiques :

```bash
node scripts/dependency-graph.js --stats
```

### Étape 3 — Analyser le graphe pour votre requête

#### Pour les requêtes « compétences connexes » :

1. Trouvez la compétence dans le graphe par nom
2. Retournez toutes les compétences qu'elle référence (arêtes sortantes)
3. Trouvez toutes les compétences qui la référencent (arêtes entrantes)
4. Groupez par catégorie pour plus de clarté

#### Pour les requêtes « parcours d'apprentissage » :

1. Commencez par la compétence cible
2. Suivez récursivement les arêtes entrantes (jusqu'à 3 sauts)
3. Ordonnez par dépendance : prérequis en premier, cible en dernier
4. Incluez de brèves descriptions

#### Pour les requêtes « compétences orphelines » :

Comparez la sortie du graphe JSON avec l'inventaire complet :
- Compétences dans le graphe JSON = ont des arêtes
- Compétences non dans le graphe JSON = zéro références

#### Pour les requêtes « compétences les plus centrales » :

1. Comptez les arêtes sortantes par compétence
2. Comptez les arêtes entrantes par compétence
3. Retournez les 10–15 premiers par centralité

### Étape 4 — Présenter les résultats avec contexte

Pour chaque résultat, fournissez :

1. **Nom de la compétence** et **description**
2. **Localisation** (par exemple, `skills/ai-engineering/`)
3. **Direction de la relation**
4. **Résumé bref** de la relation
5. **Ordre de lecture suggéré**

### Étape 5 — Offrir une exploration interactive

Si l'utilisateur souhaite approfondir :
- Visualiser le graphe complet avec le visualiseur D3.js
- Explorer les voisins d'une compétence spécifique
- Comparer les motifs de référence de deux compétences
- Exécuter le flux de travail d'audit complet

---

## Exemple

**Requête Utilisateur :** « Je veux en savoir plus sur les flux de travail multi-agents. Par où devrais-je commencer ? »

**Résultat :**
```
Parcours d'apprentissage des flux de travail multi-agents :

1. **session-handoff** — comprendre comment les agents transfèrent l'état
2. **agent-handoff** — protocoles structurés pour le transfert agent-à-agent
3. **agent-tracing** — observer l'exécution multi-agent
4. Choisir un :
   - **multi-agent-memory** (état partagé entre agents)
   - **agent-teams** (groupes d'agents coordonnés)

Temps de lecture estimé : 20–30 minutes
```

---

## Intégration avec le Graphe de Dépendances

Cette compétence repose sur `scripts/dependency-graph.js` et doit être invoquée chaque fois qu'un utilisateur pose une question de découverte. La compétence rend le graphe interrogeable en langage naturel.

Pour une utilisation programmatique, référencez le guide à `guides/skill-dependency-graph.md`.
