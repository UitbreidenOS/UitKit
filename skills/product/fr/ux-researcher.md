---
name: ux-researcher
description: "Recherche UX : génération de personas d'utilisateurs, mappage de voyage, planification de tests d'utilisabilité, synthèse de recherche — traduire les données utilisateur en décisions de conception et de produit actionnables"
---

# Compétence Chercheur UX

## Quand l'activer
- Création de personas d'utilisateurs appuyés par des données à partir de la recherche ou de l'analyse
- Construction d'une carte de parcours client pour identifier les lacunes d'expérience
- Planification d'un test d'utilisabilité (script, tâches, métriques, taille de l'échantillon)
- Synthétiser les conclusions des entretiens utilisateur ou des enquêtes en thèmes
- Génération d'une carte d'empathie ou d'un cadre de besoins utilisateur

## Quand NE PAS utiliser
- Décisions de feuille de route du produit — utilisez la compétence product-discovery
- Conception de tests A/B — utilisez la compétence experiment-designer
- Analyse quantitative (analyse en entonnoir, rétention) — utilisez la compétence product-analytics
- Persona marketing pour le ciblage — objectif différent du persona UX

## Instructions

### Génération de personas d'utilisateurs

```
Générez un persona d'utilisateur à partir de [source de données].

Source de données : [entretiens d'utilisateurs / résultats d'enquête / analyse / tickets d'assistance / tous]
Produit : [décrire]
Segment à modéliser : [décrivez le type d'utilisateur — p. ex., « utilisateurs avancés qui utilisent la fonctionnalité principale quotidiennement »]

Structure du persona :

NOM DU PERSONA : [nom d'archétype — descriptif, pas un vrai nom]
Tagline : [une phrase qui capture leur frustration ou objectif principal]

DÉMOGRAPHIE (rester large, éviter les stéréotypes) :
Rôle : [titre du poste / fonction]
Taille de l'entreprise : [PME / marché intermédiaire / entreprise]
Compétence technique : [faible / modérée / élevée] dans [domaine pertinent]

OBJECTIFS (ce qu'ils essaient d'accomplir) :
Objectif principal : [le travail principal qu'ils essaient de faire]
Objectif secondaire : [objectif de soutien]
Le succès ressemble à : [résultat observable auquel ils tiennent]

FRUSTRATIONS (frustration actuelle avec les solutions existantes) :
1. [Frustration spécifique avec preuve — citation d'entretien ou stat à partir de données]
2. [Frustration spécifique]
3. [Frustration spécifique]

MODÈLES DE COMPORTEMENT :
Comment ils découvrent les outils : [bouche à oreille / recherche / mandat du responsable / etc.]
Comment ils évaluent : [essai d'abord / examen par les pairs / démo / processus d'approvisionnement]
Comment ils utilisent le produit : [quotidien / hebdomadaire / épisodique / dans une équipe / en solo]

CITATION (voix représentative) :
« [Citation littérale ou paraphrasée qui capture leur vision du monde] »

CE DONT ILS ONT BESOIN DE NOUS :
- [Besoin spécifique 1]
- [Besoin spécifique 2]
- [Besoin spécifique 3]

NE DOIT PAS inclure : description de stock photo, histoire fictive, démographie non pertinente (café préféré)
DOIT inclure : uniquement ce qui conduit les décisions produit

Générez le persona pour [segment] à partir des données que vous fournissez.
```

### Carte de voyage

```
Créez une carte de parcours client pour [expérience].

Expérience : [décrivez l'expérience de bout en bout — p. ex., « configuration de première fois jusqu'au moment de la première valeur »]
Persona utilisateur : [quel persona cette carte représente]
Points de contact à couvrir : [canaux — e-mail, produit, assistance, site Web]

Format de la carte de voyage :

PHASES : [énumrez les phases de haut niveau — p. ex., Sensibilisation → Considération → Intégration → Activation → Utilisation habituelle]

Pour chaque phase :

NOM DE LA PHASE : [étiquette]
Déclencheur d'entrée : [ce qui déplace l'utilisateur dans cette phase ?]
Durée : [temps typique passé dans cette phase]

Actions des utilisateurs :
- [Ce qu'ils font]
- [Ce qu'ils font]

Points de contact :
- [Où ils interagissent avec votre produit/marque]

Pensées (ce qu'ils pensent) :
- « [Monologue intérieur à ce moment] »

Sentiments : [Frustré / Curieux / Confiant / Anxieux / Ravi] — avec un score de sentiment 1-5

Points douloureux :
- 🔴 [Douleur critique — bloque la progression]
- 🟡 [Friction notable — ralentit]

Opportunités :
- [Amélioration de la conception ou du produit qui résout la douleur]

COURBE D'EXPÉRIENCE GLOBALE :
Tracez le sentiment (1 = très négatif, 5 = très positif) pour chaque phase :
[Phase 1] : X/5 → [Phase 2] : X/5 → [Phase 3] : X/5 → ...

Le point le plus bas du parcours = la plus haute opportunité de conception prioritaire.

Générez la carte de voyage pour mon expérience et mon persona.
```

### Plan de test d'utilisabilité

```
Planifiez un test d'utilisabilité pour [produit/fonctionnalité].

À tester : [flux spécifique, fonctionnalité ou conception]
Type d'utilisateur : [qui recruter]
Format de test : [modéré à distance / modéré en personne / non modéré]
Nombre de participants : [généralement 5-8 pour qualitatif ; 20+ pour quantitatif]
Questions clés : [que voulez-vous apprendre ?]

Plan de test :

OBJECTIF :
[À quelle question spécifique ce test répondra-t-il ?]
Critères de succès : [comment saurez-vous que le test a été utile ?]

CRITÈRES DE PARTICIPATION :
Questions de dépistage : [3-5 questions pour qualifier les participants]
Doit avoir : [exigence 1] + [exigence 2]
Ne doit pas avoir : [critères d'exclusion]
Incitatif : [carte-cadeau $X / crédit produit gratuit / autre]

CONCEPTION DES TÂCHES (5-7 tâches par session) :
Les tâches doivent être :
- Basées sur le scénario (« vous voulez faire X... ») pas instructionnelles (« cliquez sur Y »)
- Observable — pouvez-vous dire s'ils ont réussi ?
- Représentatif des objectifs réels des utilisateurs

Tâche 1 : [scénario]
Critères d'achèvement : [à quoi ressemble le succès ?]
Limite de temps : [X minutes]

Tâche 2 : [scénario]
Critères d'achèvement : [...]

MÉTRIQUES :
Quantitatif :
- Taux d'achèvement des tâches : % qui complètent chaque tâche sans assistance
- Temps par tâche : secondes médian par tâche
- Taux d'erreur : erreurs par tâche
- Score SUS (System Usability Scale) : composite 0-100

Qualitatif :
- Observations de réflexion à haute voix : que disent les utilisateurs alors qu'ils naviguent ?
- Points de confusion : où font-ils une pause, reviennent en arrière ou posent des questions ?
- Signaux émotionnels : où expriment-ils de la frustration ou de la joie ?

GUIDE DE SESSION :
Introduction (5 min) : expliquez la réflexion à haute voix, il n'y a pas de bonnes ou mauvaises réponses
Tâches (30-40 min) : présentez chaque tâche, observez et prenez des notes
Débriefing (10 min) : questions ouvertes sur l'expérience globale

CADRE D'ANALYSE :
Après [N] sessions :
- Carte d'affinité : regrouper les observations par thème
- Évaluation de la gravité : critique (bloque l'achèvement) / majeure (frustre) / mineure (cosmétique)
- Fréquence : combien de participants ont rencontré ce problème ?
- Score prioritaire : Gravité × Fréquence

Générez le plan de test pour ma fonctionnalité et mon type d'utilisateur spécifiques.
```

### Synthèse de la recherche

```
Synthétisez les conclusions de la recherche utilisateur à partir de [source].

Type de recherche : [entretiens d'utilisateurs / test d'utilisabilité / enquête / tickets d'assistance / tous]
Nombre de sessions/réponses : [X]
Conclusions brutes : [collez les observations, citations ou thèmes clés]

Cadre de synthèse :

Étape 1 — Clustering d'observations (mappage d'affinité) :
Regroupez les observations individuelles en thèmes.
Ne regroupez pas par question de recherche — regroupez par ce que les utilisateurs ont réellement dit et fait.
Bon thème : « Les utilisateurs ne trouvaient pas la fonctionnalité de filtre » (spécifique, observable)
Mauvais thème : « Problèmes de navigation » (trop vague)

Étape 2 — Priorisation des thèmes :
Pour chaque thème :
| Thème | Fréquence (X de N participants) | Gravité | Preuve |
|---|---|---|---|
| [Thème 1] | [X/N] | Critique / Majeure / Mineure | [citation ou observation] |

Étape 3 — Génération d'insights :
Insight = thème + implication (pas seulement « les utilisateurs ont fait X » mais « les utilisateurs ont fait X, ce qui signifie que nous devons Y »)

Format : « Quand [contexte], les utilisateurs [comportement]. Ceci suggère [implication produit/conception]. »

Exemple : « Quand les utilisateurs atteignent pour la première fois le tableau de bord, ils recherchent une barre de recherche avant de remarquer le panneau de filtrage dans la barre latérale. Ceci suggère que le mécanisme de découverte principal devrait se déplacer vers un endroit plus visible ou que la recherche devrait être ajoutée comme mode de navigation principal. »

Étape 4 — Recommandations (ordonnées par impact) :
🔴 P1 — Critique (corriger avant le lancement) : [recommandation spécifique + preuve]
🟡 P2 — Important (corriger bientôt) : [recommandation spécifique + preuve]
🟢 P3 — Sympa à avoir : [recommandation spécifique]

Étape 5 — Ce que nous ne savons pas encore :
[Questions que cette recherche ne pouvait pas répondre — concevoir la prochaine recherche pour répondre à ces questions]

Synthétisez mes conclusions de recherche en insights et recommandations priorisées.
```

## Exemple

**Utilisateur :** Nous avons fait 6 entretiens d'utilisateurs sur notre outil de gestion de projet. Principales conclusions : les utilisateurs adorent la vue chronologique mais ne savent pas comment ajouter des dépendances entre les tâches. Trois utilisateurs ont abandonné et ont dit « je vais juste utiliser Notion ». Comment transformer cela en action ?

**Synthèse de Claude :**

**Insight clé :**
« Quand les utilisateurs veulent connecter les tâches liées, ils ne trouvent pas l'interface utilisateur de création de dépendance sans assistance. Ce n'est pas une lacune de fonctionnalité — la fonctionnalité existe — c'est un problème de découvrabilité et de conception d'interaction. »

Preuve : 3/6 utilisateurs ont abandonné ; les 6 ont mentionné la chronologie comme la partie la plus forte de l'outil. Personne n'a suggéré qu'il avait besoin d'une fonctionnalité différente — il avait besoin que la fonctionnalité existante soit trouvable.

**Implications :**

🔴 P1 — L'expérience utilisateur de création de dépendance est cassée (corriger avant la croissance) :
Le point d'entrée pour ajouter des dépendances est invisible. Les utilisateurs recherchent une interaction de traînage (comme Miro/Linear) ou un menu contextuel au clic droit. Si votre flux actuel nécessite un panneau de paramètres ou un bouton d'ajout-lien distinct, c'est le problème.

Recommandation : Dans la vue chronologique, ajoutez une signalisation visuelle au survol d'une tâche (une poignée de connecteur ou un bouton « ajouter une dépendance » au survol). Envisagez un menu contextuel au clic droit avec « Ajouter une dépendance à... »

🟡 P2 — État vide / intégration pour les dépendances :
Si les utilisateurs atteignent la chronologie sans dépendances définis, il n'y a aucun indice que la fonctionnalité existe. Ajoutez une info-bulle ou un message d'état vide : « Connectez les tâches en les traînant d'une à l'autre » avec une animation de démonstration de 3 secondes.

🟢 P3 — Documentation d'aide :
« Dépendances de tâche » est enterré dans docs. Déplacez-le vers un guide « Commencer avec les chronologies » qui apparaît contextuellement quand un utilisateur ouvre la chronologie pour la première fois.

**Cette recherche n'a pas répondu à :**
- Les utilisateurs veulent-ils que les dépendances se cascade automatiquement (si A est retardé, B se décale-t-il) ?
- Y a-t-il des utilisateurs avancés qui ont trouvé et utilisent les dépendances aujourd'hui ? Qu'est-ce qui les rendus trouvables pour eux ?

Exécutez une session de suivi de 15 minutes avec 3 utilisateurs : montrez-leur où se trouve la fonction de dépendance, demandez-leur de l'utiliser, observez — l'interaction elle-même est-elle claire une fois trouvée ?

---
