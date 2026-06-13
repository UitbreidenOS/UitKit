---
name: product-analytics
description: "Analytique produit : définir les cadres de métriques, construire des tableaux de bord, analyser l'adoption des fonctionnalités, mesurer l'activation et la rétention, interpréter les données pour prendre des décisions produit"
---

# Compétence d'Analytique Produit

## Quand l'activer
- Décider quelles métriques suivre pour un produit ou une fonctionnalité
- Analyser pourquoi une fonctionnalité a une faible adoption après le lancement
- Construire un tableau de bord de métriques de produit à partir de zéro
- Interpréter les données de rétention ou d'activation pour trouver des problèmes
- Préparer un examen de produit fondé sur les données ou une décision de feuille de route
- Concevoir un cadre de métriques (North Star, hiérarchie L1/L2)

## Quand NE PAS utiliser
- Configuration de l'infrastructure d'analyse — utilisez la compétence analytics-tracking
- Conception de tests A/B et statistiques — utilisez la compétence experiment-designer
- Analyse d'attribution marketing — c'est paid-ads ou analytics-tracking

## Instructions

### Conception du cadre de métriques

```
Concevez un cadre de métriques pour [produit].

Produit : [décrire]
Étape : [pré-PMF / croissance / mise à l'échelle]
Modèle commercial : [abonnement / basé sur l'utilisation / freemium / marché]
Taille de l'équipe : [1-5 / 6-20 / 20+]

Hiérarchie des métriques :

Niveau 0 — Métrique North Star (1 métrique) :
[La métrique unique qui représente le mieux la valeur livrée aux utilisateurs]
Doit être : indicateur avancé du revenu, mesurable, actionnable par l'équipe
Exemples : DAU, projets actifs hebdomadaires, messages envoyés, rapports générés

Niveau 1 — Métriques de pilier (3-5 métriques) :
[Les composants qui expliquent la Métrique North Star]
Cadre : Acquisition, Activation, Rétention, Parrainage, Revenu (AARRR)

Niveau 2 — Métriques diagnostiques (pour chaque pilier) :
[Métriques qui aident à diagnostiquer pourquoi une métrique L1 se déplace]

Exemple de cadre pour un outil SaaS B2B :
MSN : Équipes Actives Hebdomadaires (équipes avec ≥ 3 membres qui ont utilisé la fonctionnalité principale cette semaine)
L1 : 
  - Nouvelles équipes inscrites (Acquisition)
  - % qui ont invité 3+ membres dans la semaine 1 (Activation)
  - % conservés à la semaine 4 (Rétention)
  - Rétention Nette du Revenu (Revenu)
L2 (pour l'Activation) :
  - Temps pour la première action principale
  - % qui ont terminé la liste de contrôle d'intégration
  - Taux d'envoi d'invitations dans la session 1

Concevez le cadre pour mon produit. Incluez : ce qu'il ne faut PAS suivre (métriques de vanité).
```

### Analyse de l'adoption des fonctionnalités

```
Analysez l'adoption pour [fonctionnalité].

Fonctionnalité : [décrire ce qu'elle fait]
Date de lancement : [il y a X semaines/mois]
Taux d'adoption actuel : [X% des utilisateurs éligibles l'ont utilisé]
Taux d'adoption cible : [X%]
Outil d'analyse : [Mixpanel / Amplitude / PostHog / GA4]

Cadre d'analyse de l'adoption :

1. Définir « adopté » :
   □ Première utilisation ? (sensibilisation) — trop vague
   □ Utilisé X fois ? (engagement) — mieux
   □ Utilisé dans X% des sessions ? (habitude) — meilleur
   [Définissez un seuil d'adoption clair avant l'analyse]

2. Entonnoir de la découverte des fonctionnalités à l'adoption :
   - A vu le point d'entrée de la fonctionnalité : [X%]
   - A cliqué / initié : [X%]
   - A terminé la première utilisation : [X%]
   - A revenu et utilisé à nouveau : [X%]
   - « Adopté » (selon votre définition) : [X%]

3. Segmentation (quels utilisateurs adoptent ou non) :
   - Par rôle utilisateur / plan / taille d'entreprise
   - Par cohorte d'activation (utilisateurs plus nouveaux vs plus anciens)
   - Par cas d'utilisation ou flux de travail principal

4. Barrières à l'adoption (qualitatives) :
   - La fonctionnalité est-elle découvrable ? (vérifier : les utilisateurs savent-ils même qu'elle existe ?)
   - La valeur est-elle immédiatement claire ? (première expérience d'utilisation)
   - Nécessite-t-il une configuration ou un état préalable ?
   - Y a-t-il un flux de travail concurrent déjà utilisé ?

5. Recommandations par point d'abandon :
   - Faible sensibilisation → annonce dans l'application, info-bulle, e-mail
   - Faible réussite de première utilisation → simplifier l'interface utilisateur ou ajouter une configuration guidée
   - Faible utilisation répétée → vérifier si la valeur principale a été livrée lors de la première utilisation

Requête à exécuter dans [outil d'analyse] + interprétation des résultats.
```

### Analyse de la rétention

```
Analysez les données de rétention et identifiez les opportunités d'amélioration.

Produit : [décrire]
Définition de la rétention : [l'utilisateur a fait X dans les Y jours]
Rétention D1/D7/D14/D30 actuelle : [X% / X% / X% / X%]
Repère de votre catégorie : [recherchez votre vertical — varie considérablement]
Outil d'analyse : [outil]

Étapes d'analyse de la rétention :

1. Analyse de la forme :
   - Courbe d'aplatissement : la rétention atteint un plancher → le produit a une rétention fondamentale (bien)
   - Déclin continu : aucun plancher de rétention → problème PMF, pas un problème d'optimisation
   - Baisse de fonction d'étape à un jour spécifique : quelque chose se passe à ce moment (essai expire ? l'e-mail s'arrête ? limite de fonctionnalité atteinte ?)

2. Comparaison de cohorte :
   - Comparez les cohortes hebdomadaires — les cohortes récentes retiennent-elles mieux que les plus anciennes ?
   - Amélioration : vos changements fonctionnent
   - Déclin : quelque chose a régressé (fonctionnalité dégradée, concurrence améliorée)
   - Plat : pas d'amélioration, pas de régression

3. Rétention des segments :
   Quels utilisateurs retiennent le mieux ?
   - Canal (organique vs payé — organique retient généralement 2-3x mieux)
   - Utilisation des fonctionnalités (les utilisateurs qui ont utilisé la fonctionnalité X retiennent à Y% vs Z% pour les non-utilisateurs)
   - Chemin d'intégration (liste de contrôle terminée ou non)
   - Taille de l'entreprise ou plan

4. Identifier la « fonctionnalité d'activation » :
   Trouvez l'événement/fonctionnalité qui se corrèle le plus avec la rétention du jour 30.
   Exécutez : corrélation d'événement → analyse de rétention dans Amplitude ou Mixpanel
   Faites de cette fonctionnalité une partie du flux d'intégration.

5. Conception de l'intervention :
   Baisse D1 (< 40% retournent le jour 1) : problème d'intégration
   Baisse D7 : problème de formation d'habitude (notifications push, e-mail, nudge dans l'application)
   Baisse D30 : problème d'approfondissement de la valeur (nouvelles fonctionnalités, intégrations, expansion d'équipe)

Analysez mes données de rétention et recommandez l'intervention au levier le plus élevé.
```

### Tableau de bord d'examen des produits

```
Concevez un tableau de bord d'examen des produits hebdomadaire pour [produit/équipe].

Équipe : [produit / ingénierie / entreprise complète]
Fréquence : [hebdomadaire / bihebdomadaire]
Objectifs : [prendre des décisions de feuille de route / identifier les régressions / suivre la progression des OKR]

Sections du tableau de bord :

1. Métrique North Star (semaine sur semaine) :
   [Nom de la métrique] : [valeur actuelle] vs [semaine dernière] vs [même semaine le mois dernier]
   Tendance : ↑/↓ [X%] — [cela se situe-t-il dans la plage attendue ?]

2. Acquisition :
   Nouvelles inscriptions : [X] (semaine) / [X] (mois) / [X cible]
   CAC par canal : [organique / payé / parrainage]

3. Activation :
   Taux d'activation (défini comme [X]) : [X%] vs cible [X%]
   Temps d'activation : p50 [Xh] / p90 [Xh]

4. Rétention :
   Rétention D7 : [X%] / Rétention D30 : [X%]
   Tendance des utilisateurs actifs hebdomadaires : [données sparkline]

5. Revenu :
   MRR : $[X] — [+/-X% SoS]
   MRR nouveau : $[X] / Expansion : $[X] / Churn : $[X]
   Changement MRR net : $[X]

6. Santé du produit :
   Fonctionnalité supérieure par utilisation cette semaine : [X]
   Adoption de fonctionnalités sur les lancements récents : [noms + %]
   Volume d'assistance : [X tickets] — [tendance]

7. Expériences :
   En cours d'exécution : [nom du test] — [jours restants] — [résultat actuel]
   Conclue cette semaine : [nom du test] — [résultat] — [décision]

8. Questions clés pour cette semaine :
   - [Qu'est-ce qui a changé et pourquoi ?]
   - [Qu'est-ce qui a besoin d'une décision ?]
   - [Qu'est-ce que nous ne savons pas encore ?]

Construisez ce tableau de bord dans [Mixpanel / Amplitude / PostHog / Metabase / Notion].
```

## Exemple

**Utilisateur :** Notre SaaS (outil de collaboration B2B en équipe) a 35% de rétention D30. Nous pensons que c'est un problème d'activation. Analytics dans Mixpanel. Qu'est-ce que nous devrions enquêter ?

**Plan d'analyse de Claude :**

35% D30 pour un outil de collaboration B2B est inférieur au typiqueque (45-60% pour la catégorie). Mais « problème d'activation » est une hypothèse — validons-la avant de corriger.

**Étape 1 — Confirmez l'emplacement de l'abandon dans Mixpanel :**
Construisez cet entonnoir : Inscription → Première connexion → Invitation d'équipe envoyée → Fonctionnalité principale utilisée × 3 → D30 conservé.

Si le taux de rétention pour les utilisateurs qui complètent toutes les étapes d'entonnoir est > 60%, le problème EST l'activation (pas la valeur du produit). Vous avez un bon produit que la plupart des utilisateurs n'expérient jamais.

**Étape 2 — Trouvez le prédicteur d'activation :**
Dans Mixpanel : Rétention → Comparer par « Avez-vous l'événement X dans les 7 premiers jours ». Testez ces événements :
- A invité un membre de l'équipe → retenu au D30 ?
- Utilisé [fonctionnalité principale] 3+ fois → retenu au D30 ?
- A connecté une intégration → retenu au D30 ?

L'événement avec la corrélation de rétention D30 la plus élevée = votre moment aha. Faites-en l'objectif d'activation.

**Étape 3 — Trouvez la barrière :**
Si l'événement d'activation est « invitation d'équipe envoyée » et seuls 22 % des inscriptions en envoient une la semaine 1, la question est : pourquoi n'invitent-ils pas leur équipe ?

Segmentez par : inscriptions en solo vs inscriptions d'équipe. Si les inscriptions en solo retiennent à 15% et les inscriptions d'équipe à 58%, le problème est que vous acquérez trop d'utilisateurs en solo, pas que votre flux d'activation soit cassé.

**Sortie de l'arbre de décision :**
- Taux d'activation faible + rétention élevée post-activation → réparez le flux d'activation
- Taux d'activation élevé + rétention faible → réparez la valeur du produit ou le segment cible
- Activation faible + rétention faible post-activation → découverte plus approfondie nécessaire

---
