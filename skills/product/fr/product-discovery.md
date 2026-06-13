---
name: product-discovery
description: "Découverte produit : entretiens clients, validation de problèmes, notation des opportunités, cadre Jobs-to-be-Done, définition de ce qu'il faut construire ensuite et pourquoi"
---

# Compétence Découverte Produit

## Quand l'activer
- Décider quoi construire ensuite avec peu de preuves
- Valider une idée de produit avant d'investir dans le développement
- Mener des entretiens clients et synthétiser les insights
- Appliquer le cadre Jobs-to-be-Done (JTBD) pour comprendre les motivations des utilisateurs
- Rédiger une déclaration de problème ou un résumé d'opportunité
- Noter et prioriser un carnet de commandes de fonctionnalités potentielles

## Quand ne pas l'utiliser
- Après la décision de construire — c'est la spécification produit et la livraison
- Conception UX/UI — utiliser un outil de conception ou un processus de design-sprint
- Conception de test A/B — utiliser la compétence experiment-designer
- Dimensionnement du marché pour les investisseurs — c'est un modèle financier, pas une découverte

## Instructions

### Guide d'entretien client

```
Écrivez un guide d'entretien client pour [domaine problématique/produit].

Ce que nous essayons d'apprendre : [incertitude spécifique ou hypothèse à valider]
Cible de l'entretien : [qui interroger — rôle, type d'entreprise, contexte]
Nombre d'entretiens prévus : [X]

Structure de l'entretien (45-60 minutes) :

1. Échauffement (5 min) :
   - « Parlez-moi de votre rôle et à quoi ressemble une typique [semaine / projet] »
   - « Depuis combien de temps faites-vous cela ? »
   - Objectif : construire du rapport, comprendre le contexte — NE posez PAS encore de questions sur le produit

2. Situation actuelle (10 min) :
   - « Parcourez la dernière fois que vous avez dû [faire la chose que nous résolvons] »
   - « À quoi ressemble ce processus aujourd'hui ? »
   - « Qui d'autre est impliqué ? »
   - Règle : posez des questions sur le comportement passé, pas sur le comportement futur hypothétique

3. Douleur et friction (15 min) :
   - « Quelle est la partie la plus difficile de ce processus ? »
   - « Combien de temps cela prend-il ? À quelle fréquence ? »
   - « Qu'avez-vous essayé pour corriger cela ? Qu'est-il arrivé ? »
   - « Comment résolvez-vous cela aujourd'hui ? Qu'est-ce qui ne va pas avec cette solution ? »

4. Motivation et résultat (10 min) :
   - « Pourquoi cela vous importe / à votre équipe / à votre entreprise ? »
   - « Que serait différent si c'était complètement résolu ? »
   - « Quel est le coût de ne pas résoudre cela ? » (temps, argent, risque, émotion)

5. Conclusion (5 min) :
   - « Y a-t-il quelque chose que je n'ai pas demandé qui vous aiderait ? »
   - « À qui d'autre devrais-je parler ? »

Règles :
- Ne posez jamais « Utiliseriez-vous X ? » — les gens disent oui à tout ce qui est hypothétique
- Ne montrez jamais le produit ou une maquette avant de comprendre le problème
- Demandez constamment « Parlez-moi plus » et « Pourquoi »
- Prenez des notes sur les mots exacts (le vocabulaire compte pour la messagerie)

Générez le guide pour mon domaine problématique spécifique avec des questions sur mesure.
```

### Analyse Jobs-to-be-Done

```
Appliquez le cadre Jobs-to-be-Done pour comprendre [produit/fonctionnalité].

Contexte : [décrivez le produit et l'utilisateur faisant le travail]

Cadre JTBD :

1. Définir le travail :
   Format : Quand [situation], je veux [motivation], pour pouvoir [résultat].
   
   Exemple : « Quand j'intègre un nouveau développeur à la base de code, je veux les rendre productifs rapidement, pour maintenir la vélocité de l'équipe sans devenir un goulot d'étranglement. »
   
   Travail pour mon contexte : [écrivez la déclaration de travail]

2. Décomposer le travail en étapes (job map) :
   Étape 1 — Définir : que fait l'utilisateur pour cadrer ou délimiter la tâche ?
   Étape 2 — Localiser : quelle information ou ressource doit-il trouver ?
   Étape 3 — Préparer : comment se met-il en place pour faire le travail ?
   Étape 4 — Exécuter : quel est le cœur de l'action de travail ?
   Étape 5 — Surveiller : comment suit-il les progrès ou la qualité ?
   Étape 6 — Modifier : qu'ajuste-t-il quand les choses ne vont pas selon le plan ?
   Étape 7 — Conclure : comment termine-t-il et transmet-il ?

3. Identifier les résultats (ce que l'utilisateur mesure le succès par) :
   - Vitesse : à quelle vitesse peut-il faire [étape X] ?
   - Précision : avec quelle fiabilité [étape X] produit-elle le bon résultat ?
   - Effort : quel effort cognitif/physique [étape X] nécessite-t-elle ?
   - Risque : à quel point est-il certain que [étape X] ne va pas échouer ?

4. Trouver les résultats mal desservis (l'opportunité) :
   Notez chaque résultat : importance vs. satisfaction actuelle (échelle 1-10)
   Score d'opportunité = importance + (importance - satisfaction)
   Score > 10 : forte opportunité d'adresser

Appliquez pour : [utilisateur spécifique et travail dans mon produit].
```

### Notation des opportunités

```
Notez et priorisez les opportunités produit.

Opportunités à évaluer : [liste — peuvent être des fonctionnalités, des problèmes à résoudre ou des segments à servir]
Données disponibles : [entretiens clients / tickets d'assistance / commentaires NPS / analytique / aucun]

Cadre de notation des opportunités (RICE ou critères pondérés) :

Notation RICE :
Reach : combien d'utilisateurs affectés par trimestre ? [X]
Impact : à quel point améliore-t-elle leur résultat ? [massif=3 / élevé=2 / moyen=1 / faible=0.5]
Confidence : à quel point sommes-nous certains de la portée et de l'impact ? [élevée=100% / moyen=80% / faible=50%]
Effort : semaines d'ingénierie pour construire ? [X]
RICE = (Reach × Impact × Confidence) / Effort

Alternatif : critères pondérés (si vous voulez inclure l'ajustement stratégique) :
| Opportunité | Douleur Utilisateur (30%) | Ajustement Stratégique (20%) | Fréquence (20%) | Effort (30%) | Total |
|---|---|---|---|---|---|
| [A] | 8 | 7 | 9 | 5 | 7.2 |
| [B] | 6 | 9 | 4 | 8 | 6.8 |

Que inclure dans la notation :
- Sévérité de la douleur utilisateur : à quel point le problème est mauvais aujourd'hui ?
- Fréquence : à quelle fréquence l'utilisateur frappe cela ?
- Alignement stratégique : cela fait-il progresser notre thèse centrale ?
- Faisabilité : pouvons-nous réellement bien le construire ?
- Différenciation du marché : un concurrent fait-il déjà cela bien ?

Notez mes [X] opportunités et produisez une liste priorisée avec justification.
```

### Résumé du problème

```
Rédigez un résumé de problème pour [opportunité].

Contexte : [ce que nous savons de ce problème d'après la recherche]
Preuves : [citations d'entretiens, volume de tickets d'assistance, données d'analytique]
Segment affecté : [qui l'expérimente, combien d'utilisateurs]

Structure du résumé du problème :

## Le Problème
[2-3 phrases décrivant la situation spécifique, la friction et l'impact. Pas de solution encore.]

## Qui l'expérimente
[Persona utilisateur + quantification : « X% de nos utilisateurs [segment] font face à cela quand... »]

## Preuves
- Insight d'entretien : « [Citation exacte d'un utilisateur] » — [Rôle, Entreprise]
- Analytique : [point de données pertinent]
- Assistance : [volume ou modèle à partir de l'assistance]

## Solutions de contournement actuelles
[Comment les utilisateurs résoudre cela aujourd'hui — et pourquoi ces solutions sont insuffisantes]

## Pourquoi cela importe
[Cas commercial : impact sur la rétention, l'acquisition, les revenus ou la position stratégique]

## À quoi ressemble le succès
[Résultat mesurable — pas une fonctionnalité, mais le comportement ou le résultat modifié de l'utilisateur]

## Ce que ce n'est PAS
[Contraintes et clarifications hors de portée — ce que nous n'essaierons pas de résoudre]

---
Questions ouvertes avant que nous construisions :
- [Question 1 — que ne savons-nous toujours pas ?]
- [Question 2]
Propriétaire de la découverte : [nom]
Prochaine étape : [X plus d'entretiens / test de prototype / construire ?]

Rédigez un résumé de problème pour mon opportunité en utilisant les preuves que je fournis.
```

## Exemple

**Utilisateur :** Nous sommes un outil de gestion de projets pour les équipes d'ingénierie. Nous n'arrêtons pas d'entendre « nos ingénieurs ne mettent pas à jour les tickets ». Devrions-nous construire une meilleure synchronisation Jira, plus de rappels ou forcer les mises à jour de tickets ? Découverte d'abord.

**Plan de découverte de Claude :**

Ne construisez pas encore. « Les ingénieurs ne mettent pas à jour les tickets » est un symptôme avec au moins 3 causes racines différentes — chacune nécessitant une solution différente.

**3 hypothèses à tester dans les entretiens :**
1. **Hypothèse de friction :** Les ingénieurs savent qu'ils devraient mettre à jour mais le flux de travail est trop lent (→ résoudre avec une meilleure interface utilisateur, raccourcis clavier, intégration Slack)
2. **Hypothèse de confiance :** Les ingénieurs pensent que les données de ticket ne comptent pas car les PM ne les lisent pas réellement (→ résoudre avec de meilleurs outils de visibilité pour les PM, pas les flux d'ingénieur)
3. **Hypothèse d'irrélevance :** Les tickets deviennent périmés parce que les exigences changent en cours de sprint et personne ne met à jour la source de vérité (→ résoudre avec un flux de replanification léger, pas de rappels)

**5 questions d'entretien à poser (aux ingénieurs, pas aux PM) :**
1. « Parcourez le dernier ticket sur lequel vous avez travaillé — quand l'avez-vous regardé pour la première fois, quand l'avez-vous mis à jour pour la dernière fois ? »
2. « Quand vous terminez une tâche, que faites-vous ensuite ? » (écouter : ne mentionnent jamais les tickets)
3. « Que se passe-t-il si vous ne mettez pas à jour votre ticket ? » (écouter : rien / PM me demande / la critique de sprint est déroutante)
4. « Avez-vous jamais mis à jour un ticket et rien n'est arrivé ? » (valide l'hypothèse de confiance)
5. « Qu'est-ce qui vous ferait réellement vouloir mettre à jour les tickets ? » (ouvert, écoutez sans projeter)

Menez 5 entretiens. Vous saurez quelle hypothèse est vraie — et vous économiserez probablement 2-3 mois construisant la mauvaise chose.

---
