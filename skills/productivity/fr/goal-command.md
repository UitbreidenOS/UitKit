# /goal — Complètement de Tâches Autonome

## Quand activer
L'utilisateur veut que Claude continue de travailler sur une tâche sans s'arrêter pour vérifier ; l'utilisateur veut définir une condition d'achèvement et s'en aller ; l'utilisateur pose des questions sur le fonctionnement autonome ou le maintien de Claude en cours d'exécution jusqu'à ce qu'un résultat spécifique soit atteint.

## Quand ne PAS utiliser
Tâches simples à une seule étape où une réponse suffit ; tâches où l'utilisateur veut que Claude fasse une pause et confirme après chaque action ; sessions de débogage interactives où l'allers-retours est le point.

## Instructions

**Syntaxe :**
```
/goal <condition d'achèvement>
```

La condition est évaluée après chaque tour de l'assistant. Claude continue à travailler — écrit du code, exécute des commandes, voir les défaillances, s'ajuste — jusqu'à ce que la condition soit remplie, puis s'arrête et fait un rapport.

**Écrire de bonnes conditions :**

Le langage naturel fonctionne. La condition devrait être observable et non ambiguë :

- `Tous les tests réussissent` — Claude exécute la suite de tests, corrige les défaillances, réexécute, jusqu'à ce qu'elle soit verte
- `Le PR est créé` — Claude termine le travail et ouvre un PR
- `La migration s'exécute sans erreurs` — Claude applique la migration, vérifie les erreurs, corrige les problèmes de schéma
- `tsc --noEmit quitte 0` — Claude résout les erreurs TypeScript jusqu'à ce que le compilateur soit propre
- `CHANGELOG.md existe et a la date d'aujourd'hui` — Claude écrit le fichier changelog

**Mauvaises conditions à éviter :**
- Subjectives : "semble bon", "est propre" — non vérifiables par Claude
- Ouvertes : "continue à améliorer le code" — pas de condition d'arrêt
- Basées sur le temps : "exécuter pendant une heure" — pas un résultat

**Combiner avec le niveau d'effort** pour l'autonomie maximale :
```
/goal Tous les tests réussissent
/effort xhigh
```

**Interruption :** Envoyez n'importe quel message pour interrompre, ou supprimez `.claude/goal` pour annuler. L'état du goal persiste entre les compressions de contexte — Claude se souvient du goal même après la compression de la fenêtre de contexte.

**Sessions en arrière-plan :** Fonctionne avec `claude --bg`. Définissez le goal, fermez votre terminal, revenez quand c'est fait.

**Ce qui se passe à chaque tour :**
1. Claude prend des mesures (édite les fichiers, exécute les commandes)
2. Évalue : la condition est-elle remplie ?
3. Si non — continue
4. Si oui — s'arrête et rapporte ce qui a été fait

## Exemple

```
/goal Tous les erreurs TypeScript sont résolues et tsc --noEmit quitte 0
```

Claude exécute `tsc --noEmit`, lit la liste des erreurs, corrige chaque erreur, exécute à nouveau, voit les erreurs restantes, corrige celles-ci, exécute à nouveau — la boucle continue jusqu'à zéro erreurs. Puis s'arrête et rapporte : "Résolu 14 erreurs TypeScript sur 6 fichiers. `tsc --noEmit` quitte proprement."

---
