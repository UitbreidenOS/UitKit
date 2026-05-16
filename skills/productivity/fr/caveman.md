> 🇫🇷 Version française. [English version](../caveman.md).

# Skill Mode Caveman

## Quand activer
- Vous souhaitez réduire drastiquement l'utilisation des tokens sur une longue session
- La fenêtre de contexte se remplit et vous devez prolonger la durée de vie utile de la session
- Vous exécutez une charge de travail sensible au coût (nombreux agents parallèles, traitement par lots)
- Les réponses de Claude sont verbeuses et vous voulez une sortie concise en style fragmenté
- Vous souhaitez compresser des fichiers mémoire ou CLAUDE.md existants pour réduire les tokens d'entrée

## Quand NE PAS utiliser
- Avertissements de sécurité ou confirmations d'actions irréversibles — ceux-ci nécessitent des phrases complètes
- Séquences en plusieurs étapes où l'ambiguité des fragments pourrait provoquer des actions mal interprétées
- Intégration de nouveaux membres d'équipe dans une base de code — la clarté prime sur la brièveté ici
- Rédaction de documentation destinée à des personnes externes

## Instructions

Le mode Caveman est une technique de compression de tokens établie avec une implémentation dédiée sur [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman). Ce skill est un pointeur — utilisez le dépôt original, ne le dupliquez pas.

### Ce qu'il fait

Le mode Caveman demande à Claude de produire une prose compressée en style fragmenté :

| Niveau | Règle | Exemple |
|--------|-------|---------|
| `lite` | Supprimer les mots de remplissage et les formules d'atténuation, garder les articles et les phrases complètes | "The function handles edge cases." |
| `full` | Supprimer les articles, fragments acceptés, synonymes courts | "func handles edge cases" |
| `ultra` | Abréger les mots en prose, supprimer les conjonctions, flèches pour la causalité | "fn→edge cases handled" |

Résultats mesurés (mars 2026, [arxiv.org/abs/2604.00025](https://arxiv.org/abs/2604.00025)) :
- ~65 % de réduction des tokens de sortie
- Amélioration de 26 points sur les benchmarks (la brièveté affine le raisonnement)
- 100 % de précision technique maintenue

### Sous-skill caveman-compress
Réécrit les fichiers mémoire `.md` et CLAUDE.md en prose caveman — environ 46 % d'économies de tokens d'entrée à chaque session, car les fichiers compressés sont relus à chaque chargement du contexte.

### Sous-agents cavecrew
Sous-agents basés sur Haiku fonctionnant en mode Caveman — environ 60 % de tokens en moins que des agents classiques pour les tâches simples de classification, d'extraction et de routage.

### Middleware MCP caveman-shrink
Compresse les descriptions d'outils MCP avant qu'elles n'entrent dans le contexte de Claude — réduit la surcharge MCP d'environ 30 % sans modifier le comportement des outils.

## Exemple

**Activation du mode Caveman dans une session :**
```
Use caveman mode (full level) for this session. Drop articles, use fragments,
short synonyms. Auto-revert to normal prose for: security warnings,
irreversible action confirmations, multi-step sequences.
```

**Utilisation de caveman-compress sur un fichier mémoire :**
```
/caveman-compress .claude/memory/project-context.md
```

**Utilisation de cavecrew pour une tâche de classification :**
```
Spawn a cavecrew subagent (Haiku, caveman full) to classify these 200 support
tickets into 5 categories. Return only: ticket_id, category.
```

---

**Référence :** [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — l'implémentation Caveman de référence. Claudient fait référence à ce travail ; il n'est pas dupliqué ici.

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs. [uitbreiden.com](https://uitbreiden.com/)
