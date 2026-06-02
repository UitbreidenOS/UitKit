---
name: growth-dashboard
description: "Tableau de bord de croissance hebdomadaire : métriques d'acquisition, activation, rétention, revenu et recommandation avec analyse de tendances et commentaires pour les équipes de croissance"
---

# Compétence Tableau de Bord de Croissance

## Quand l'activer
- Construire le rapport de croissance hebdomadaire pour la direction ou l'équipe
- Rassembler les métriques AARRR sur l'acquisition, l'activation, la rétention, le revenu et la recommandation
- Diagnostiquer quel levier de croissance est en panne cette semaine par rapport à la semaine dernière
- Rédiger le commentaire narratif autour de vos métriques — pas seulement les chiffres
- Concevoir un nouveau tableau de bord de croissance dans Looker Studio, Metabase ou Notion
- Suivre la santé du portefeuille d'expériences parallèlement aux métriques business

## Quand NE PAS utiliser
- Analyse approfondie d'une seule métrique — c'est une compétence de synthèse, pas de débogage
- Mise en place de l'infrastructure analytics — utiliser `/analytics-tracking`
- Conception d'expériences individuelles — utiliser `/experiment-tracker`
- Modélisation financière pour les investisseurs — utiliser le workflow financial-model

## Instructions

### Prompt du tableau de bord de croissance hebdomadaire

```
Construire mon tableau de bord de croissance hebdomadaire pour la semaine du [DATE].

Produit : [décrire — SaaS / marketplace / application mobile / e-commerce]
Stade : [pre-PMF / post-PMF / scaling]
Métrique North Star : [le seul chiffre qui capture la santé du business]

Données de cette semaine :

ACQUISITION
- Nouveaux visiteurs : [N] (vs. [N] la semaine dernière, [N] il y a un mois)
- Nouvelles inscriptions / leads : [N] (vs. [N] SD)
- Taux d'inscription (visiteurs → inscriptions) : [X%]
- CAC par canal cette semaine : [Google : [X] € | Meta : [X] € | Organique : [X] € | Recommandation : [X] €]
- Dépenses payantes : [X] € (vs. [X] € SD)

ACTIVATION
- Nouveaux utilisateurs ayant complété l'événement d'activation : [N] / [N] nouvelles inscriptions = [X%] de taux d'activation
- Définition de l'activation : [ce qui compte comme activé — ex. "a créé son premier projet"]
- Temps jusqu'à l'activation (médiane) : [X heures/jours]

RÉTENTION
- DAU / WAU / MAU : [N] / [N] / [N]
- Ratio DAU/MAU (adhérence) : [X%]
- Rétention à 7 jours (des cohortes d'il y a 7 jours) : [X%]
- Rétention à 30 jours : [X%]
- Churn cette semaine : [N] clients / [X] € MRR

REVENU
- MRR : [X] € (vs. [X] € la semaine dernière)
- Nouveau MRR : [X] €
- MRR d'expansion : [X] €
- MRR perdu (churn) : [X] €
- Nouveau MRR net : [X] €
- Ratio LTV:CAC : [X:1]
- Période de récupération : [X mois]

RECOMMANDATION
- Inscriptions par recommandation cette semaine : [N]
- Taux de recommandation : [inscriptions par recommandation / total des inscriptions] : [X%]
- NPS (si mesuré cette semaine) : [X]

EXPÉRIENCES EN COURS
[Lister les tests A/B actifs, jours d'exécution, hausse actuelle vs. contrôle]

---

Produire le tableau de bord de croissance hebdomadaire avec :
1. Chiffres phares (cette semaine vs. semaine dernière vs. moyenne 4 semaines)
2. Statut feu tricolore pour chaque métrique (vert / orange / rouge vs. objectifs)
3. Top 3 des observations — ce qui a changé matériellement et pourquoi
4. Une hypothèse pour chaque tendance négative
5. Actions recommandées pour la semaine prochaine
6. Portefeuille d'expériences : quels tests conclure, quels prolonger
```

### Constructeur du framework AARRR

```
Concevoir un framework de métriques AARRR complet pour [produit].

Stade du produit : [pré-lancement / early / croissance / scale]
Modèle économique : [abonnement / transactionnel / usage / freemium]
Canal principal : [contenu / payant / PLG / commercial]

Construire les métriques pour chaque étape :

ACQUISITION — Comment les gens nous trouvent-ils ?
Métriques principales :
- Total nouveaux visiteurs / leads / inscriptions par canal
- CAC par canal (dépenses / nouveaux clients de ce canal)
- Répartition organique vs. payant
- Score d'efficacité du canal : [taux de conversion × LTV moyen / CAC]

Benchmarks :
- Bonne période de récupération du CAC : < 12 mois pour les PME, < 18 mois pour le mid-market
- L'organique doit croître en % du total dans le temps (pas stable ou en baisse)

ACTIVATION — Les nouveaux utilisateurs obtiennent-ils de la valeur ?
Métriques principales :
- Taux d'activation : % des inscriptions qui complètent [l'événement aha moment]
- Temps jusqu'à l'activation (médiane en jours)
- Complétion du aha moment par canal d'acquisition (les utilisateurs organiques s'activent différemment des payants)

Benchmarks :
- < 20% de taux d'activation : problème d'onboarding majeur
- 20-40% : opportunité d'amélioration
- 40-60% : sain pour les produits complexes
- > 60% : fort pour les outils simples

RÉTENTION — Les utilisateurs reviennent-ils ?
Métriques principales :
- Rétention J1 / J7 / J30 (% des utilisateurs qui reviennent ce jour-là)
- Courbes de rétention de cohortes hebdomadaires / mensuelles
- Ratio d'adhérence DAU/MAU
- Profondeur d'adoption des fonctionnalités (utilisateurs utilisant 1 fonctionnalité vs. 3+)

Benchmarks :
- Rétention J7 > 25% : viable (B2C), > 40% : viable (B2B SaaS)
- J30 > 15% (B2C), > 35% (B2B)
- DAU/MAU > 20% : produit engagé

REVENU — Monétisons-nous efficacement ?
Métriques principales :
- MRR / ARR et taux de croissance (SoS, MoM)
- ARPU / ARPA (par utilisateur / par compte)
- LTV (contrat moyen × marge brute / taux de churn)
- Ratio LTV:CAC
- Période de récupération
- Net Revenue Retention (NRR) : [expansion - churn] / MRR de début

Benchmarks :
- LTV:CAC > 3:1 : sain
- Période de récupération < 12 mois : bon, < 18 mois : acceptable
- NRR > 100% : l'expansion compense le churn (best-in-class > 120%)

RECOMMANDATION — Les utilisateurs en parlent-ils à d'autres ?
Métriques principales :
- Coefficient viral : nouveaux utilisateurs par utilisateur existant par période
- Taux de recommandation : % des inscriptions issues de recommandations
- NPS et pourcentage de promoteurs
- Avis / études de cas générés

Benchmarks :
- Coefficient viral > 0,5 : bouche-à-oreille significatif
- > 1,0 : viralité (rare, souvent de courte durée)
- NPS > 40 : base dominée par les promoteurs

Produire un modèle de tableau de bord pour [produit] avec les 15 métriques principales, les objectifs et les sources de données.
```

### Générateur de narration de croissance

```
Rédiger le commentaire de croissance pour mon rapport hebdomadaire/mensuel.

Audience : [direction / conseil / équipe croissance / ensemble de l'entreprise]
Ton : [analytique / résumé exécutif / conversationnel]

Performances de cette période :
- [Métrique clé] : [résultat vs. objectif — était-ce au-dessus/en-dessous/dans les clous ?]
- [Métrique clé] : [résultat]
- [Métrique clé] : [résultat]

Contexte à intégrer :
- Quels facteurs externes ont affecté les résultats ? [saisonnalité / actions concurrentes / macro]
- Quels changements internes ont eu lieu ? [campagnes lancées / changements produit / changements de tarification]
- Quelles expériences ont été conclues ? [résultats]
- Qu'est-ce qui fonctionne bien ? [1-2 choses qui marchent]
- Quel est le risque ? [1 chose qui vous préoccupe]
- Focus de la semaine prochaine : [le seul levier que vous actionnez]

Rédiger un commentaire de 200-300 mots qui :
1. Commence par le mouvement de la métrique North Star — positif ou négatif, le nommer
2. Attribue le mouvement à 1-2 causes spécifiques (pas vague — "le CAC payant a augmenté de 18% à cause des changements iOS 18 qui ont réduit la qualité des signaux Meta")
3. Identifie la métrique la plus importante de cette semaine et pourquoi
4. Donne une action concrète — pas "nous allons surveiller" mais "nous allons faire X d'ici vendredi"
5. Termine avec les perspectives : sommes-nous dans les clous pour le mois ?

Ne pas écrire : "Nous avons observé des résultats mitigés." Nommer les résultats et les assumer.
```

### Analyse de cohortes de revenu

```
Analyser mes cohortes de revenu pour comprendre la LTV et la récupération.

Produit : [SaaS par abonnement / transactionnel]
Définition de cohorte : [mois du premier paiement]
Données disponibles : [mois d'historique]

Format du tableau de cohortes :
Mois | MRR de départ | MRR mois 1 | Mois 3 | Mois 6 | Mois 12 | Estimation LTV

Fournir les données pour chaque cohorte : [coller CSV ou tableau]

Analyser :
1. Rétention par cohorte — quelles cohortes retiennent le mieux et pourquoi ?
   (Demander : qu'est-ce qui a changé dans l'acquisition, l'activation ou le produit autour de la date de début de cette cohorte ?)

2. Revenu d'expansion — les clients restants s'étendent-ils ?
   NRR = (MRR de début + expansion - churn - contraction) / MRR de début
   NRR > 100% : chaque cohorte vaut plus dans le temps (best-in-class : 120-140%)

3. Calcul de la LTV :
   Revenu mensuel moyen par client : [X] €
   Durée de vie moyenne du client : 1 / taux de churn mensuel = [X mois]
   LTV = revenu mensuel moyen × durée de vie moyenne × % marge brute
   LTV = [X] € × [X] × [X%] = [X] €

4. Période de récupération :
   CAC / (ARPU × % marge brute) = [X mois]
   Comparer à la durée de vie moyenne du client — si récupération > durée de vie, vous êtes en déficit

5. Quel canal produit les clients avec la LTV la plus élevée ?
   Décomposer la LTV par canal d'acquisition : [payant / organique / recommandation / commercial]
   Cela vous dit où doubler l'investissement en CAC

Produire : graphique LTV par cohorte, analyse de récupération et tableau comparatif de LTV par canal.
```

### Optimisation du mix de canaux

```
Optimiser mon mix de canaux marketing pour la croissance.

Performances actuelles par canal :
| Canal | Dépenses | Nouveaux clients | CAC | LTV moy. | LTV:CAC | Récupération |
|---|---|---|---|---|---|---|
| Google Ads | [X] € | [N] | [X] € | [X] € | [X:1] | [X mois] |
| Meta Ads | [X] € | [N] | [X] € | [X] € | [X:1] | [X mois] |
| Contenu/SEO | [X] € | [N] | [X] € | [X] € | [X:1] | [X mois] |
| Recommandation | [X] € | [N] | [X] € | [X] € | [X:1] | [X mois] |
| Ventes sortantes | [X] € | [N] | [X] € | [X] € | [X:1] | [X mois] |

Budget total : [X] €/mois
Objectif de croissance : [X nouveaux clients/mois ou [X] € de nouveau MRR]

Analyse :
1. Classer les canaux par LTV:CAC — allouer davantage aux canaux avec ratio > 3:1
2. Identifier les canaux saturés — si le CAC augmente MoM sur un canal, vous atteignez le plafond de capacité
3. Identifier les canaux sous-investis — l'organique/recommandation a souvent la meilleure LTV mais le plus faible investissement
4. Économie marginale : à 2x les dépenses sur [canal], qu'arrive-t-il au CAC ? (augmente généralement)
5. Dépense minimale viable — certains canaux (ex. SEO, communauté) nécessitent un investissement seuil pour produire des résultats

Recommandation de réallocation budgétaire :
- Augmenter : [canal] — LTV:CAC le plus élevé, pas encore saturé
- Maintenir : [canal] — fonctionne à l'objectif, CAC stable
- Réduire : [canal] — CAC en hausse, LTV:CAC en dessous de 2:1
- Expérimenter : [canal] — non testé, faible coût de validation

Nouvelle allocation budgétaire : [tableau avant vs. après]
Impact projeté : [X clients supplémentaires/mois aux taux de conversion actuels]
```

## Exemple

**Utilisateur :** Voici nos chiffres hebdomadaires. Dites-moi ce qui se passe et quoi faire. Inscriptions : 342 (en baisse par rapport à 410 la semaine dernière). Activation : 31% (en baisse par rapport à 35%). MRR : 48 200 € (en hausse de 1 100 € par rapport à la semaine dernière). Churn : 2 clients (400 € MRR). Dépenses payantes : 12 000 €.

**Résultat du tableau de bord de Claude :**

**Semaine du [DATE] — Tableau de bord de croissance**

**North Star : MRR 48 200 € (+1 100 € SoS) — dans les clous**

| Métrique | Cette semaine | Semaine dernière | Tendance |
|---|---|---|---|
| Inscriptions | 342 | 410 | -17% |
| Taux d'activation | 31% | 35% | -4pp |
| Nouveau MRR | 1 500 € | 1 800 € | -17% |
| MRR perdu | 400 € | 300 € | +33% |
| Nouveau MRR net | 1 100 € | 1 500 € | -27% |
| CAC (global) | 35 € | 29 € | +21% |

**Top 3 des observations :**

1. Le volume d'inscriptions a chuté de 17% — avec des dépenses stables à 12 000 €, le CAC est passé de 29 € à 35 €. C'est un problème de qualité de signal d'acquisition payante, pas un problème de budget. Vérifier les rapports de termes de recherche Google Ads et la fréquence des publicités Meta — probablement une fatigue d'audience.

2. L'activation a baissé de 4 points — 342 inscriptions × baisse de 4pp = ~14 activations de moins qu'attendu. Au taux de conversion habituel de l'activation vers le payant, cela représente ~700 € à risque dans les 30 prochains jours. Quelque chose dans le flux d'onboarding a changé ou s'est cassé cette semaine — vérifier si des changements UI/produit ont été déployés.

3. Le MRR est toujours positif parce que l'expansion a tenu — les clients qui passent à des plans supérieurs ont compensé le ralentissement des nouveaux clients. C'est fragile ; l'expansion ne peut pas porter le business si le flux de nouveaux utilisateurs continue de décliner.

**Actions pour la semaine prochaine :**
- Payant : récupérer le rapport de fréquence Meta ; si fréquence > 4 par personne, lancer un nouveau set de créatifs
- Activation : exécuter des enregistrements de sessions sur le parcours inscription → aha moment (Hotjar/FullStory) — trouver le point de décrochage
- Churn : appeler les 2 clients churned cette semaine ; comprendre si c'est le produit, le prix ou un concurrent

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
