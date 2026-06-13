---
name: experiment-designer
description: "Conception de tests A/B et d'expériences : rédaction d'hypothèses, calcul de la taille de l'échantillon, signification statistique, suivi des expériences, éviter les pièges courants et interpréter les résultats"
---

# Compétence Concepteur d'Expériences

## Quand l'activer
- Conception d'un test A/B ou d'une expérience multivariée
- Calcul de la taille d'échantillon requise avant d'exécuter un test
- Interprétation des résultats d'expérience (est-ce significatif ? devrions-nous le livrer ?)
- Configuration d'un framework d'expérimentation pour une équipe
- Éviter les erreurs courantes de test (regard furtif, effet de nouveauté, comparaisons multiples)
- Décider si exécuter une expérience ou simplement livrer

## Quand NE PAS utiliser
- Quand vous avez < 1 000 utilisateurs/semaine — pas assez de trafic pour des tests significatifs ; utilisez plutôt la recherche qualitative
- Quand le changement est une correction de bug ou clairement bon — ne testez pas l'évident, livrez-le
- Quand vous avez besoin de résultats en < 1 semaine — les tests sous-alimentés sont pires que pas de tests
- Configuration de l'outil d'analyse — utilisez la compétence analytics-tracking

## Instructions

### Conception d'hypothèses et d'expériences

```
Concevez un test A/B pour [changement].

Ce que nous voulons tester : [décrivez le changement — copie, interface utilisateur, flux, fonctionnalité]
Pourquoi nous pensons que cela fonctionnera : [l'insight ou les données derrière cette idée]
Métrique principale : [la métrique que nous optimisons]
Métriques secondaires : [métriques à surveiller pour les régressions]
Trafic disponible : [sessions/jour ou utilisateurs/semaine sur cette page/flux]

Conception d'expérience :

1. Hypothèse (rédigez-la avant de toucher le code) :
   Format : « Nous croyons que [changement] augmentera [métrique] pour [segment utilisateur] parce que [raison basée sur insight/données]. »
   
   Mauvais : « Nous croyons qu'un bouton CTA plus gros augmentera les conversions. »
   Bon : « Nous croyons que changer le texte CTA de « Commencer » à « Commencer l'essai gratuit » augmentera les inscriptions à l'essai pour les visiteurs pour la première fois, car nos données d'entretien montrent que les utilisateurs ne réalisent pas que l'essai est gratuit. »

2. Variantes :
   - Contrôle (A) : état actuel — inchangé
   - Variante B : le changement
   - (Optionnel) Variante C : une version plus audacieuse du changement
   
   Règle : testez une seule chose par expérience. Deux changements = vous ne savez pas lequel a entraîné le résultat.

3. Répartition du trafic :
   - 2 variantes : 50/50 (puissance statistique maximale)
   - 3 variantes : 33/33/33 — nécessite plus de trafic ou un test plus long
   - Montée en charge : commencez à 5-10% → confirmez aucun bug → exposition complète

4. Métrique principale :
   [Nom] — mesuré comme : [définition]
   Effet minimum détectable : [X% d'amélioration relative que nous considérons significative]
   
5. Critères de succès (décidez avant le lancement — pas de changement des objectifs) :
   Gagne : p-value < 0,05 ET MDE atteint ET aucune régression significative dans les métriques secondaires
   Appelez-le tôt : seulement s'il est clairement dommageable — N'arrêtez PAS pour un résultat gagnant tôt

Générez le brief d'expérience complet pour mon test.
```

### Calculatrice de taille d'échantillon

```
Calculez la taille d'échantillon requise pour [expérience].

Type de métrique principale : [taux de conversion / valeur moyenne / proportion]
Ligne de base actuelle : [X% taux de conversion / $X moyenne / X% d'utilisateurs]
Effet minimum détectable (MDE) : [X% changement relatif — la plus petite victoire qu'il vaut la peine de livrer]
Puissance statistique : [80% standard / 90% pour les expériences critiques]
Niveau de signification : [α = 0,05 standard / α = 0,01 pour les enjeux élevés]
Nombre de variantes : [2 / 3 / 4]

Formule de taille d'échantillon (pour les proportions) :
n = 2 × (z_α/2 + z_β)² × p(1-p) / δ²

où :
- z_α/2 = 1,96 (pour α=0,05, deux queues)
- z_β = 0,84 (pour la puissance 80%)
- p = taux de conversion de la ligne de base
- δ = différence absolue (ligne de base × MDE)

Pour vos entrées :
Ligne de base : [X%]
MDE : [X% relatif] = [Y% absolu]
n requise par variante : [calculé]
Exemple total : [n × nombre de variantes]

Au niveau de votre trafic ([X visiteurs/jour]) :
Durée du test nécessaire : [X jours]

Drapeaux d'avertissement :
- Si durée > 4 semaines : repenser le test (augmenter MDE, ou attendre plus de trafic)
- Si MDE est < 1% : probablement pas la peine de tester — difficile d'atteindre la signification
- Si MDE > 30% : très optimiste — vérifiez que l'affaire commerciale est réelle

Calculez pour mes entrées spécifiques et confirmez que la durée est réalisable.
```

### Erreurs courantes d'expérience

```
Passez en revue la conception de mon expérience et signalez les problèmes potentiels.

Description de l'expérience : [décrivez le test que vous prévoyez]
Durée prévue : [X jours]
Source de trafic : [tout le trafic / segment / page spécifique]

Erreurs courantes à vérifier :

□ REGARD FURTIF : Arrêter un test tôt parce que les résultats semblent bons
  Risque : le taux de faux positifs monte en flèche — la variante gagnante est souvent un coup de chance
  Correction : Décidez la durée d'exécution avant le lancement et respectez-la (ou utilisez des tests séquentiels)

□ COMPARAISONS MULTIPLES : Tester 5 variantes = 5 chances de trouver un faux positif
  Risque : à α=0,05, l'exécution de 5 tests → 0,25 faux positifs prévus par lot
  Correction : Utilisez la correction de Bonferroni (α/n) ou limitez à 2-3 variantes

□ EFFET DE NOUVEAUTÉ : Les utilisateurs pour la première fois réagissent à tout ce qui est nouveau
  Risque : l'augmentation initiale disparaît après la première exposition
  Correction : Exécutez le test pendant 2+ cycles commerciaux complets (minimum 2 semaines typiquement)

□ DÉCALAGE DE RATIO D'ÉCHANTILLON : Trafic inégal vers les variantes
  Risque : la randomisation est cassée — les résultats ne sont pas valides
  Correction : Tracez le ratio d'attribution cumulatif quotidiennement ; alertez si > 5% de la cible

□ EFFETS RÉSEAU : Les utilisateurs interagissent les uns avec les autres
  Risque : les groupes de contrôle et variante ne sont pas indépendants
  Correction : Randomisez les grappes par équipe/compte, pas par utilisateur individuel

□ BIAIS DE SURVIVANCE : Mesurer uniquement les utilisateurs engagés
  Risque : la hausse semble excellente mais seulement pour les utilisateurs qui auraient converti de toute façon
  Correction : Incluez tous les utilisateurs éligibles, pas seulement ceux qui se sont « engagés » avec la variante

□ LAG D'INSTRUMENTATION : Le calcul des métriques est en retard sur l'expérience
  Risque : les résultats précoces montrent des nombres gonflés ou dégonflés
  Correction : Ajoutez 24-48 heures avant de lire les résultats ; vérifiez le tir d'événement en mode débogage

Signalez lesquels d'entre eux s'appliquent à mon expérience prévue + les corrections spécifiques.
```

### Interprétation des résultats

```
Interprétez mes résultats d'expérience.

Expérience : [décrivez le test]
Durée : [X jours]
Taille de l'échantillon par variante : [X contrôle / X variante]
Métrique principale :
  Contrôle : [X%]
  Variante : [X%]
  Hausse relative : [+X%]
  p-value : [X]
  Intervalle de confiance : [X% à X%]
Métriques secondaires : [liste et si elles se sont déplacées]

Cadre d'interprétation :

Statistiquement significatif + pratiquement significatif : LIVRER
  Both p < 0,05 ET augmentation relative ≥ MDE → victoire claire, livrer

Statistiquement significatif + PAS pratiquement significatif : NE LIVREZ PAS
  p < 0,05 mais augmentation de 0,3% sur une ligne de base de 2% → réel mais pas la peine du coût de maintenance

PAS significatif + directionnellement positif : PROLONGER OU REPENSER
  p = 0,12 avec tendance positive → sous-alimenté ; prolongez si le coût est faible ; repensez si cher

PAS significatif + plat : CONTINUEZ
  p > 0,5, effet près de zéro → l'idée n'a pas fonctionné ; échouez vite et essayez l'hypothèse suivante

Régression significative dans les métriques secondaires : ARRÊTER, NE LIVREZ PAS
  Même si la métrique principale a gagné, une régression dans les revenus ou la rétention l'emporte

Pour mes résultats :
1. Conclusion statistique : [significatif / pas significatif / limite]
2. Signification pratique : [significatif / pas significatif]
3. Évaluation des métriques secondaires : [y a-t-il des régressions ?]
4. Décision : [livrer / ne pas livrer / prolonger / repenser]
5. Ce que nous avons appris (même si nous ne livrons pas) : [l'insight qui rend le test suivant meilleur]
```

## Exemple

**Utilisateur :** Nous testons un nouveau flux de paiement. La conversion de base est de 3,2%. Nous voulons détecter une amélioration de 15% (à 3,68%). Nous obtenons 500 visiteurs/jour au paiement. Combien de temps devrions-nous exécuter ?

**Calcul de Claude :**

**Calcul de la taille de l'échantillon :**
- Ligne de base : 3,2%
- Cible : 3,68% (augmentation relative de 15% = 0,48% absolu)
- α = 0,05 (deux queues), Puissance = 80%
- n requise par variante ≈ **4 950 utilisateurs**
- Échantillon total nécessaire : **9 900 utilisateurs** (deux variantes)

**À 500 visiteurs/jour :**
- 9 900 ÷ 500 = **~20 jours minimum**

**Ma recommandation : exécutez pendant 28 jours (4 semaines complètes)**

Pourquoi 4 semaines, pas 20 jours :
1. Capture la saisonnalité hebdomadaire complète (le comportement de paiement diffère semaine vs week-end)
2. Tampon pour l'effet de nouveauté — la nouvelle interface utilisateur de paiement peut sembler artificiellement bonne la semaine 1
3. Permet 4 cycles commerciaux complets (lundi-dimanche)

**Avant de lancer :**
- Confirmez que votre outil d'analyse enregistre correctement l'événement « paiement visité » et l'événement « achat terminé » séparément et correctement
- Fixez maintenant vos critères de succès : « Nous livrons si p < 0,05 ET augmentation ≥ 15% ET pas de régression dans la valeur de commande moyenne »
- Ne regardez pas les résultats jusqu'au jour 28

**Une mise en garde :** Si votre chiffre de 500 visiteurs/jour comprend les utilisateurs mobiles et de bureau, segmentez les résultats par appareil. Les flux de paiement se comportent très différemment sur mobile par rapport au bureau — un résultat gagnant global pourrait masquer une régression sur une plate-forme.

---
