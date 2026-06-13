---
name: product-roadmap
description: "Construction de feuille de route de produit : frameworks de priorisation (RICE, MoSCoW, notation d'opportunité), formats de feuille de route, alignement OKR, communication des parties prenantes et planification trimestrielle"
---

# Compétence Feuille de Route Produit

## Quand l'activer
- Construction ou restructuration d'une feuille de route de produit
- Priorisation d'un carnet de commandes de fonctionnalités et d'opportunités
- Alignement de la feuille de route sur les OKR de l'entreprise
- Communication de la feuille de route à différentes parties prenantes (ingénierie, ventes, direction, clients)
- Exécution d'un processus de planification trimestrielle
- Décider quoi couper quand la capacité est limitée

## Quand NE PAS utiliser
- Planification des tâches au niveau du sprint — c'est la gestion de la livraison, pas la feuille de route
- Découverte (décider quels problèmes résoudre) — utilisez la compétence product-discovery
- Rédaction de specs techniques ou d'histoires utilisateur — c'est après la décision de feuille de route
- Conception de tests A/B — utilisez la compétence experiment-designer

## Instructions

### Framework de priorisation

```
Priorisez ce carnet de commandes en utilisant [RICE / MoSCoW / notation d'opportunité].

Éléments à prioriser : [liste — peuvent être des fonctionnalités, des projets ou des domaines problématiques]
Contraintes : [taille de l'équipe, horizon temporel, budget]
Objectifs stratégiques ce trimestre : [OKR ou principales priorités]

Notation RICE (pour les décisions de fonctionnalités) :
| Élément | Portée | Impact | Confiance | Effort | Score RICE |
|---|---|---|---|---|---|
| Fonctionnalité A | 500 utilisateurs/t | 3 (élevé) | 80% | 3 semaines | (500×3×0,8)/3 = 400 |
| Fonctionnalité B | 1000 utilisateurs/t | 1 (faible) | 90% | 1 semaine | (1000×1×0,9)/1 = 900 |

Portée : utilisateurs affectés par trimestre
Impact : massif=3 / élevé=2 / moyen=1 / faible=0,5 / minimal=0,25
Confiance : % de certitude concernant les estimations de portée et d'impact
Effort : semaines d'ingénierie pour un ingénieur

MoSCoW (pour les mises à jour de portée fixe) :
- Doit avoir : sans cela, la mise à jour échoue
- Devrait avoir : haute valeur, inclure si la capacité le permet
- Pourrait avoir : agréable à avoir, d'abord à couper
- N'aura pas : explicitement hors du champ d'application (prévient l'expansion du champ d'application)

Notation d'opportunité (priorisation au niveau du problème) :
Score = Importance + (Importance − Satisfaction)
Les éléments marquant > 10 = forte opportunité

Appliquez le [framework choisi] à mon carnet de commandes et produisez une liste priorisée avec justification.
```

### Conception du format de feuille de route

```
Concevez un format de feuille de route pour [audience et horizon temporel].

Audience : [ingénierie interne / équipe de ventes / clients / équipe de direction / tous]
Horizon temporel : [trimestriel / annuel / roulement de 6 mois]
Niveau d'engagement : [engagé / directionnel / aspirationnel]
Outil actuel : [Linear / Jira / Notion / ProductBoard / feuille de calcul]

Formats de feuille de route par audience :

Feuille de route d'ingénierie (haute fidélité, à court terme engagée) :
| Thème | Fonctionnalité | Trimestre | Statut | Propriétaire | Dépendances |
|---|---|---|---|---|---|
Haute confiance dans Q1, directionnel pour Q2-Q3, espace réservé pour Q4.

Feuille de route des ventes (directionnelle, sans dates) :
Format « Maintenant / Suivant / Plus tard » — évite de s'engager sur des dates spécifiques avec les clients.
Maintenant : ce qui est en développement actif
Suivant : ce qui vient après (ce trimestre ou le suivant — pas de date spécifique)
Plus tard : ce que nous envisageons (aucun engagement)

Feuille de route exécutive (centrée sur les résultats, pas sur les listes de fonctionnalités) :
Montrez OKR → initiatives → résultats attendus
Non : « Construire la fonctionnalité X »
Oui : « Réduire le temps d'activation de 40 % → redessin d'intégration + séquence d'e-mail »

Feuille de route orientée client :
Thèmes uniquement, sans dates (« bientôt » / « planifié » / « exploration »)
Ne jamais inclure de dates sauf si la fonctionnalité est à quelques semaines
Sécurité : ne pas s'engager publiquement sur des fonctionnalités qui pourraient être coupées

Concevez le format de feuille de route pour mon audience spécifique et générez un modèle.
```

### Alignement OKR

```
Alignez les éléments de feuille de route sur les OKR.

OKR d'entreprise pour [trimestre/année] : [liste — objectif + résultats clés]
OKR de produit (le cas échéant) : [liste]
Éléments de feuille de route actuellement prévus : [liste des fonctionnalités ou initiatives]

Vérification d'alignement :

Pour chaque élément de feuille de route :
- À quel OKR contribue-t-il ? (doit lier à au moins un)
- Quel résultat clé bouge-t-il ? (soyez spécifique)
- À quel point sommes-nous confiants qu'il bougera ce résultat clé ? (élevé / moyen / faible)
- Éléments sans lien OKR : couper ou déprioritiser sauf s'il y a une exception convaincante

Pour chaque OKR :
- Quels éléments de feuille de route contribuent ? (devrait être 1-3 éléments par résultat clé)
- Y a-t-il un résultat clé sans couverture de feuille de route ? (écart — besoin d'ajouter des initiatives)
- Y a-t-il un résultat clé sur-couvert ? (trop d'éléments poursuivant le même résultat — se concentrer)

Résultat : 
- Tableau de mappage feuille de route vers OKR
- Lacunes (OKR sans couverture)
- Sur-investissements (trop d'éléments sur un OKR)
- Recommandations pour les coupes ou les ajouts

Alignez ma feuille de route sur les OKR que j'ai fournis.
```

### Processus de planification trimestrielle

```
Exécutez un processus de planification trimestrielle pour [équipe produit].

Taille de l'équipe : [X ingénieurs + X PM + X designers]
Horizon de planification : [T3 2026 — juillet à septembre]
OKR actuels : [coller]
Capacité : [X semaines d'ingénierie disponibles après astreinte, dette technique, bugs]

Calendrier de planification trimestrielle (processus de 4 semaines) :

Semaine 1 — Collecte des entrées :
□ Compilez : retours des clients, tickets d'assistance, verbatims NPS, raisons gagnées/perdues en ventes
□ Exécutez : examen des données (quelles métriques sont saines / malsaines ?)
□ Collectez : demandes des parties prenantes (des ventes, SC, marketing)
□ Identifiez : la dette technique qui ralentit activement l'équipe

Semaine 2 — Dimensionnement des opportunités :
□ Clustering des entrées en thèmes (pas encore des fonctionnalités — des problèmes)
□ Notez chaque thème : impact utilisateur × fréquence × ajustement stratégique
□ Identifiez les 3-5 meilleures opportunités pour le trimestre

Semaine 3 — Scoping et séquençage :
□ Pour chaque opportunité : taille approximative de T-shirt (P/M/G/TG)
□ Ajustement de capacité : X semaines d'ingénierie au total
□ Séquence : qu'est-ce qui doit venir en premier (dépendances, risque) ?
□ Négociez : coupez jusqu'à ce que la capacité soit atteinte + tampon de 20%

Semaine 4 — Alignement et communication :
□ Examen de l'ingénierie : vérification de faisabilité technique
□ Approbation exécutive : alignement OKR confirmé
□ Bilan des ventes/SC : ce qui arrive, ce qui ne l'est pas
□ Publier : feuille de route interne mise à jour
□ Coup d'envoi de l'équipe : planification du T3 terminée

Résultat : modèle de plan trimestriel complété avec éléments, propriétaires et allocation de capacité.
```

## Exemple

**Utilisateur :** Nous avons 8 ingénieurs, 2 PM, les OKR du T3 se concentrent sur le taux d'activation (+30%) et NPS (+10 points). Le carnet de commandes a 23 éléments. Aidez-moi à prioriser.

**Processus de Claude :**

D'abord — filtrez impitoyablement avant la notation.

**Filtre 1 — Pertinence OKR :**
Sur vos 23 éléments, séparez en :
- Impact d'activation : [éléments qui affectent le temps-à-valeur, l'intégration, l'engagement de première semaine]
- Impact NPS : [éléments que les clients ont explicitement demandés ou dont ils se sont plaints]
- Aucun des deux : [éléments techniquement intéressants mais qui ne bougent pas ces deux résultats clés]

La pile « aucun des deux » doit être coupée ou déplacée au T4 avant même de noter.

**Filtre 2 — Vérification de la réalité des efforts :**
Avec 8 ingénieurs pendant 13 semaines = ~104 semaines d'ingénierie. Réservez 20% pour les bugs/incidents = ~83 semaines disponibles.
Éléments TG (>8 semaines chacun) = peut en faire seulement 2-3 par trimestre. Coupez le reste ou réduisez le champ d'application.

**Notation RICE de la liste courte (exemple) :**

| Élément | Portée | Impact | Confiance | Effort | RICE | OKR |
|---|---|---|---|---|---|---|
| Redessin de la liste de contrôle d'intégration | 400 | 3 | 85% | 3w | 340 | Activation |
| Amélioration de la séquence d'e-mail | 800 | 2 | 70% | 2w | 560 | Activation |
| Sondage NPS dans l'application | 1000 | 1 | 90% | 1w | 900 | NPS |
| Fonction d'export en masse | 200 | 2 | 60% | 6w | 40 | Aucun des deux |

**Recommandation :**
Sondage NPS dans l'application (1w, RICE élevé) en premier — victoire rapide, permet la mesure de votre OKR NPS.
Séquence d'e-mail (2w) ensuite — plus grand ROI d'activation par semaine.
Redessin d'intégration (3w) ensuite — amélioration d'activation la plus stratégique.
Export en masse — repousser au T4 sauf si les ventes perdent des transactions à cause de cela.

---
