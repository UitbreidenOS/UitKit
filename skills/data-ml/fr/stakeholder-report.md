---
name: stakeholder-report
description: "Rapport de données hebdomadaire et mensuel pour les parties prenantes : métriques phares, tendances, analyse des causes racines, actions — structuré pour les dirigeants et les publics transverses"
---

# Compétence : Rapport pour les Parties Prenantes

## Quand activer
- Rédiger le rapport de données hebdomadaire ou mensuel pour la direction, le conseil d'administration ou les parties prenantes transverses
- Transformer des analyses brutes en un document orienté décision — pas seulement un dump de données
- Présenter à la fois ce qui s'est passé et pourquoi, pas seulement des métriques
- Préparer la section analytique d'une revue d'activité, d'une QBR ou d'un dossier pour le conseil
- Communiquer des conclusions analytiques à un public mixte (technique et non technique)

## Quand NE PAS utiliser
- Mises à jour en direct des tableaux de bord — à configurer dans votre outil BI
- Exports de données brutes — les parties prenantes n'ont pas besoin de voir des CSV
- Articles de recherche statistique — il s'agit de communication commerciale, pas d'analyse académique
- Analyses exploratoires ponctuelles — utiliser `/sql` ou `/pandas-polars` pour le travail ad hoc

## Instructions

### Rapport hebdomadaire pour les parties prenantes

```
Rédiger un rapport de données hebdomadaire pour [public : équipe dirigeante / responsables de département / conseil d'administration].

ENTREPRISE/ÉQUIPE : [nom]
SEMAINE DU : [plage de dates]
AUTEUR DU RAPPORT : [votre nom/équipe]

MÉTRIQUES PHARES (vs. la semaine dernière et vs. objectif) :

Croissance :
- [Métrique 1] : [valeur] ([+/-X %] WoW, [+/-X %] vs. objectif)
- [Métrique 2] : [valeur] ([+/-X %] WoW, [+/-X %] vs. objectif)

Revenus :
- [Métrique] : [valeur] ([variation])

Engagement / Produit :
- [Métrique] : [valeur] ([variation])

Efficacité :
- [Métrique] : [valeur] ([variation])

CE QUI S'EST PASSÉ CETTE SEMAINE (événements qui expliquent les chiffres) :
- [Événement 1 : sortie produit, campagne, incident, accord partenaire, etc.]
- [Événement 2]

ANALYSE :
- Cause racine du plus grand mouvement positif : [décrire]
- Cause racine du plus grand mouvement négatif : [décrire]
- Toute anomalie ne correspondant pas au schéma habituel : [décrire ou "aucune"]

DÉCISIONS NÉCESSAIRES CETTE SEMAINE :
[Lister toutes les décisions que les données éclairent — que doit faire l'équipe différemment ?]

APERÇU DE LA SEMAINE PROCHAINE :
- Métriques à surveiller : [quelles métriques sont les plus susceptibles de bouger la semaine prochaine et pourquoi]
- Changements planifiés qui affecteront les données : [sorties, campagnes, etc.]

Générer un rapport au format narration + données. Commencer par un résumé exécutif d'un paragraphe. Utiliser des titres pour chaque section. Inclure des points de données spécifiques. Éviter le langage vague ("relativement bien" → "14 % au-dessus du plan"). Longueur totale : 600-800 mots.
```

---

### Rapport mensuel pour les parties prenantes

```
Rédiger un rapport de données mensuel. Plus détaillé que le rapport hebdomadaire — inclut les tendances, l'analyse de cohortes et les commentaires prospectifs.

MOIS : [Mois Année]
PUBLIC : [direction / conseil d'administration / investisseurs / assemblée générale]

RÉSUMÉ EXÉCUTIF :
- Le mois en une phrase : [la chose la plus importante qui s'est passée]
- Le mois vs. plan : [en ligne / en avance / en retard — principal moteur]

MÉTRIQUES MENSUELLES (vs. le mois dernier et vs. le même mois l'an dernier) :

[Métrique] | [Ce mois] | [Mois dernier] | [MoM %] | [L'an dernier] | [YoY %] | [vs. plan]
Revenus | [X] M$ | [X] M$ | [+/-X %] | [X] M$ | [+/-X %] | [+/-X %]
[Métrique 2] | ... | ... | ... | ... | ... | ...
[Continuer pour chaque KPI]

ANALYSE DE TENDANCE :
- Tendance sur 3 mois pour [métrique la plus importante] : [décrire la direction et le rythme du changement]
- Tendance sur 12 mois pour [revenus ou KPI principal] : [décrire]
- Indicateurs avancés pour le mois prochain : [que disent les signaux précoces sur le mois prochain ?]

ANALYSE DES CAUSES RACINES — SUCCÈS :
[Pour le plus grand mouvement positif : ce qui l'a conduit, est-ce reproductible, que devons-nous faire davantage ?]

ANALYSE DES CAUSES RACINES — MANQUES :
[Pour le plus grand manque : ce qui l'a causé, est-ce ponctuel ou structurel, quel est le plan ?]

INSIGHTS PAR COHORTES (si applicable) :
[Performance des nouvelles cohortes d'utilisateurs, courbes de rétention, LTV par source d'acquisition]

MISE À JOUR DES PRÉVISIONS :
- Prévision T[?] révisée : [X] M$ (était [X] M$, changement dû à : [raison])
- Prévision annuelle : [X] M$ ([X] % au-dessus/en-dessous du plan initial)
- Changements d'hypothèses clés : [ce qui a changé dans le modèle]

ACTIONS ET RESPONSABLES :
| Action | Responsable | Date limite | Métrique de succès |
|---|---|---|---|
| [Action 1] | [Nom] | [Date] | [Comment nous la mesurons] |
| [Action 2] | [Nom] | [Date] | [Comment nous la mesurons] |

Générer le rapport mensuel complet. Ton narratif — pas un dump de bullets. Chaque section doit s'enchaîner avec la suivante.
```

---

### Section d'analyse des causes racines

Il s'agit de la section la plus précieuse et la plus difficile à rédiger. Utiliser cette invite pour la structurer :

```
Rédiger une analyse des causes racines pour [nom de la métrique] [en hausse/en baisse] de [X %] en [période].

SYMPTÔME :
[Métrique] a évolué de [X] à [X] — une [augmentation/diminution] de [X %].
C'était [attendu / inattendu / partiellement attendu].

DONNÉES DISPONIBLES :
- Ventilation par segment : [comment cette métrique se décompose-t-elle par [canal / cohorte / géographie / ligne de produit] ?]
- Corrélation avec d'autres métriques : [qu'est-ce qui a bougé en même temps ?]
- Chronologie : [quand exactement a-t-elle commencé à bouger ? Était-ce progressif ou soudain ?]

HYPOTHÈSES (liste par ordre de probabilité) :
1. [Cause la plus probable] — étayée par : [quelles données soutiennent cela]
2. [Deuxième hypothèse] — étayée par : [données]
3. [Troisième hypothèse] — étayée par : [données]

CE QUE J'AI ÉCARTÉ :
- [Hypothèse X] — parce que [preuves contre elle]

CONCLUSION :
- Cause principale : [votre meilleure évaluation]
- Confiance : [Élevée / Moyenne / Faible]
- Comment vérifier : [quelle analyse confirmerait cela]
- Action recommandée : [quoi faire à ce sujet]
- Impact attendu de l'action : [X % d'amélioration de la métrique sur X semaines]

Rédiger comme une section RCA de 300 mots prête à intégrer dans un rapport pour les parties prenantes.
```

---

### Résumé des données pour le conseil d'administration

```
Rédiger la section données/métriques d'une mise à jour au conseil.

RÉUNION DU CONSEIL : [date]
PÉRIODE DE REPORTING : [trimestre ou mois]
STADE DE L'ENTREPRISE : [amorçage / Série A / croissance / pré-IPO]

MÉTRIQUES PHARES VS. PLAN :
[Coller vos métriques clés avec la comparaison au plan]

Points clés que les conseils examinent (par stade) :

AMORÇAGE/SÉRIE A :
- Revenus/ARR et taux de croissance vs. plan
- Taux de consommation de trésorerie et runway
- Jalons clés produit ou client
- Recrutement vs. plan

STADE DE CROISSANCE :
- Revenus, marge brute et tendances des économies unitaires
- CAC et délai de remboursement — en amélioration ou en dégradation ?
- NRR — expansion vs. churn
- Chemin vers la rentabilité (si pertinent)

PRÉ-IPO :
- Métriques GAAP vs. non-GAAP
- Position sur la règle des 40
- Guidance trimestrielle et explication des écarts

Rédiger la section métriques :
1. Résumé de performance en 2 phrases (honnête — les conseils voient à travers la mise en scène)
2. Tableau des métriques clés avec vs. plan
3. 3 bullets : ce qui a conduit la performance (positif et négatif)
4. 1 phrase prospective : prévision révisée ou point de surveillance clé pour le prochain trimestre

Sous 300 mots. Pas de jargon. Commencer par les faits.
```

---

### Dossier de données pour la QBR (revue trimestrielle d'activité)

```
Rédiger le dossier de données pour une revue trimestrielle d'activité avec [public : clients / direction interne / partenaires].

TRIMESTRE : T[?] [Année]
TYPE : [QBR Interne / QBR Client / QBR Partenaire]

QBR INTERNE (équipe dirigeante) :
- Performance du trimestre vs. OKR
- Top 3 des succès avec données
- Top 3 des manques avec cause racine
- Prévision annuelle révisée
- Recommandations de ressources pour le prochain trimestre

QBR CLIENT (pour une revue de succès client SaaS) :
Client : [nom]
- Métriques d'utilisation : [DAU, fonctionnalités clés utilisées, adoption vs. licences contractées]
- Valeur délivrée : [résultats obtenus — quantifier si possible]
- Fonctionnalités roadmap à venir pertinentes pour eux
- Niveau de risque de renouvellement : [Vert / Jaune / Rouge]
- Prochaines étapes recommandées pour leur compte

QBR PARTENAIRE :
- Pipeline conjoint généré : [X] M$
- Succès conjoints : [N] clients, [X] M$ ARR
- Pipeline à risque : [N] opportunités, raisons
- Performance du co-marketing
- Investissements recommandés pour le prochain trimestre

Générer le dossier de données QBR approprié selon le type sélectionné.
```

---

### Section glossaire des métriques

Quand vos parties prenantes ne connaissent pas ce que signifient les métriques :

```
Générer un glossaire des métriques en langage clair pour notre rapport aux parties prenantes.

MÉTRIQUES À DÉFINIR :
[Lister vos métriques]

Pour chaque métrique :
- Nom : [nom officiel]
- En langage clair : [ce qu'elle mesure en une phrase — sans jargon]
- Pourquoi c'est important : [pourquoi cette métrique nous dit si l'activité est saine]
- Comment elle est calculée : [formule ou brève description]
- Plage cible : [ce qu'est "bien" pour notre activité]
- Ce qui la fait bouger : [les principaux moteurs]

Limiter chaque définition à 80 mots. Écrire pour un dirigeant non technique qui est intelligent mais pas analyste de données.
```

## Exemple

**Utilisateur :** Rapport mensuel pour l'équipe dirigeante. Revenus d'octobre : 2,1 M$ (plan : 2,0 M$, +5 %). Croissance MoM : +12 %. YoY : +47 %. Churn : 2,1 % (était 1,8 % le mois dernier). NRR : 108 % (était 112 % le mois dernier). Événement principal : un client enterprise a churné à mi-mois (représentait 8 % de l'ARR). Nouveaux logos : 14 (meilleur mois jamais). Public : PDG, DAF, VP Ventes, VP Produit.

**Résultat attendu :** Rapport mensuel complet s'ouvrant sur "Octobre a été un mois record pour les nouvelles affaires, partiellement compensé par l'événement de churn le plus important de notre historique." La section revenus affiche 2,1 M$ vs. plan de 2,0 M$. Cause racine du churn : le départ du client enterprise a conduit le déclin du NRR de 112 % à 108 % — un événement structurel, pas de tendance. Le record de nouveaux logos est un vrai signal. Tableau d'actions : post-mortem du compte churné (VP Succès Client, 7 nov.), affinement du PCI pour éliminer les clients présentant un profil de risque similaire (VP Produit + VP Ventes, 14 nov.). Liste de surveillance : pipeline de renouvellement enterprise pour le T4.

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
