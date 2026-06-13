# Ultraplan — Mode de planification approfondie

Ultraplan est un mode de planification étendu qui instruit Claude de réfléchir de manière exhaustive avant d'agir. Il lit la base de code, cartographie les dépendances, identifie les risques et produit un plan complet avant de toucher à n'importe quel code. L'objectif est d'obtenir le plan correct la première fois sur le travail où un plan incorrect est coûteux à dénouer.

---

## Comment activer

**Commande slash :**
```
/ultraplan
```

Ensuite, décrivez la tâche. Ultraplan prend le relais pour la phase de planification.

**Drapeau CLI :**
```bash
claude --ultraplan "Ajouter le support multi-locataire au module de facturation"
```

**Combiné avec l'effort :**
```bash
claude --ultraplan --effort xhigh "Migrer l'authentification de JWT à basée sur la session"
```

---

## Ce qu'Ultraplan fait différemment de `/plan`

| | `/plan` | `/ultraplan` |
|---|---|---|
| **Lectures de fichier** | Fichiers référencés uniquement | Tous les fichiers dans le chemin affecté + leurs dépendances |
| **Vérification des modèles** | Aucune | Lit les modèles existants avant de proposer de nouveaux |
| **Cartographie des dépendances** | Implicite | Graphe de dépendance explicite dans la sortie |
| **Évaluation des risques** | Aucune | Section de risque dédiée avec atténuations |
| **Plan de restauration** | Aucun | Étapes de restauration explicites pour chaque phase |
| **Coût en jetons** | ~1× | ~3–5× |
| **Longueur de sortie** | Court | Long (complet) |

La phase de recherche d'Ultraplan justifie le coût. Elle lit la base de code réelle avant la planification — pas seulement les fichiers que vous mentionnez, mais les fichiers que ces fichiers importent, les tests qui les couvrent, l'historique de migration si pertinent, et les modèles existants qu'elle doit correspondre.

---

## Structure de sortie Ultraplan

Un Ultraplan complété produit un document avec ces sections dans l'ordre :

**1. Résumé du contexte**
Ce qu'Ultraplan a trouvé pendant sa phase de recherche — fichiers clés, modèles existants, décisions pertinentes antérieures.

**2. Évaluation des risques**
Risques classés par gravité. Chaque risque a : description, probabilité, impact et atténuation proposée.

**3. Cartographie des dépendances**
Quels composants dépendent de quoi. Met en évidence les dépendances circulaires, l'état partagé et les intégrations externes que le changement touche.

**4. Étapes ordonnées**
Le plan d'implémentation en séquence. Chaque étape spécifie : ce qui change, quels fichiers, ce à tester après cette étape et si un commit partiel est approprié ici.

**5. Plan de restauration**
Comment annuler chaque phase si quelque chose se passe mal — commandes git spécifiques, basculements de drapeau de fonctionnalité ou inversions de migration.

---

## Quand utiliser

- **Fonctionnalités complexes couvrant plusieurs fichiers** — surtout quand vous n'êtes pas sûr de ce qui dépend de quoi
- **Bases de code non familières** — avant de toucher le code que vous n'avez pas lu, la phase de recherche d'Ultraplan construit le contexte que vous passeriez des heures à construire manuellement
- **Changements critiques** — les réécritures du système d'authentification, les migrations de schéma de base de données, les changements d'API publique, n'importe quoi où une mauvaise approche signifie un reworking important
- **Fonctionnalités estimées à plus d'un jour** — l'investissement de planification se rembourse plus vite plus la mise en œuvre est longue

---

## Quand NE PAS utiliser

- **Tâches simples** — un correctif de fonction unique ne nécessite pas une cartographie de dépendance
- **Hotfixes** — vous savez déjà ce qui est cassé ; les frais généraux de plan vous ralentissent
- **Travail exploratoire / spike** — quand vous prototypez pour apprendre, vous voulez itérer vite, pas planifier de manière exhaustive à l'avance
- **Changements bien compris** — si vous avez fait ce type de changement dix fois dans cette base de code, vous n'avez pas besoin de la phase de recherche d'Ultraplan
- **Sessions sensibles aux coûts** — avec un coût de jetons de 3–5×, Ultraplan sur les tâches triviales gaspille le budget

---

## Intégration d'effort

`--effort` contrôle la profondeur de réflexion de Claude au sein de chaque tour. Ultraplan + effort composent :

```bash
# Profondeur maximale : recherche large d'Ultraplan + raisonnement maximal par tour
claude --ultraplan --effort xhigh "Refactoriser le module de traitement des paiements"
```

| Combinaison | Utiliser pour |
|---|---|
| `--ultraplan` seul | Fonctionnalités complexes standard |
| `--ultraplan --effort high` | Décisions architecturales, bases de code non familières |
| `--ultraplan --effort xhigh` | Planification de migration, changements critiques pour la sécurité |

Éviter `--ultraplan --effort low` — vous êtes en train d'échanger la profondeur de recherche qui rend Ultraplan valeureux.

---

## Compromis de coût

Ultraplan dépense des jetons sur la recherche à l'avance. Le point d'équilibre est environ :

- Si le plan économise 1 heure de débogage ou de reworking : équilibre à ~2–5 $ de jetons supplémentaires
- Si le plan prévient une mauvaise décision architecturale : équilibre à ~10–50 $ de jetons supplémentaires

Pour les fonctionnalités estimées à plus d'un jour de travail, Ultraplan vaut presque toujours le coup. Pour les tâches d'une demi-journée, cela dépend de la connaissance que vous avez de la base de code.

---

## Combinaison d'Ultraplan avec RIPER

Le cadre RIPER (Recherche → Implémenter → Sonder → Évaluer → Réfléchir) correspond proprement à Ultraplan :

- **Recherche** → Phase de recherche d'Ultraplan (lecture de fichiers, identification de modèles)
- **Implémenter** → Exécuter les étapes ordonnées à partir de la sortie Ultraplan
- **Sonder** → Exécuter des tests après chaque étape comme spécifié dans le plan
- **Évaluer** → Vérifier l'évaluation des risques d'Ultraplan — des risques prédits se sont-ils matérialisés?
- **Réfléchir** → Examiner le plan de restauration ; mettre à jour si la mise en œuvre a divergé du plan

Exécuter Ultraplan avant d'entrer dans la phase d'implémentation de RIPER. La sortie Ultraplan devient le brief de phase d'implémentation.

```
/ultraplan
[décrivez la fonctionnalité]

[examinez le plan]

/riper implement
[exécutez le plan étape par étape]
```

---
