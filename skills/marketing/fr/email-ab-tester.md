---
name: email-ab-tester
description: "Conception et analyse de tests A/B email : hypothèse, variantes, taille d'échantillon, interprétation des résultats"
---

# Compétence Test A/B Email

## Quand l'activer
- Vous souhaitez améliorer le taux d'ouverture, le taux de clic ou la conversion de vos campagnes email
- Vous devez choisir entre deux lignes d'objet, CTA ou structures d'email
- Vous avez des résultats d'un test fractionné et souhaitez savoir s'ils sont statistiquement significatifs
- Construire un backlog d'optimisation à long terme d'hypothèses email à tester
- Vous avez exécuté un test A/B et ne savez pas comment interpréter "gagnant" vs "bruit"

## Quand NE PAS utiliser
- Votre liste compte moins de 1 000 abonnés — vous n'aurez pas de significance statistique sans volume suffisant ; optimisez avec des méthodes qualitatives à la place
- Tester des campagnes entièrement différentes (offres différentes, audiences différentes) — c'est un changement de stratégie, pas un test A/B
- Tester plus d'une variable à la fois (sauf si vous souhaitez explicitement faire du multivarié) — isolez la variable sinon les résultats sont ininterprétables
- Vous savez déjà ce qui fonctionne — ne testez pas pour confirmer, testez pour apprendre

## Instructions

### Prompt de conception d'un test A/B

```
Concevoir un test A/B pour ma campagne email.

Type de campagne : [newsletter / promotionnelle / séquence automatisée / transactionnelle]
Taille de liste disponible pour le test : [X abonnés]
Objectif principal : [taux d'ouverture / taux de clic / conversion / revenu par email]
Ce que je veux tester : [ligne d'objet / nom d'expéditeur / heure d'envoi / CTA / longueur d'email / format / formulation de l'offre]

Référence actuelle :
- Taux d'ouverture moyen : [X%]
- Taux de clic moyen : [X%]
- Taux de conversion moyen : [X%]

Ce que je crois être vrai (hypothèse) : [ex. "Une ligne d'objet basée sur la curiosité surpassera une ligne d'objet à bénéfice direct pour ce segment car notre audience est orientée recherche"]

Concevoir le test :

## Hypothèse
Structure Si/Alors/Parce que :
Si [changement], Alors [métrique] va [augmenter/diminuer] de [X%], Parce que [raison basée sur ce que vous savez de l'audience].

Pourquoi ce format est important : "essayer juste différentes lignes d'objet" n'est pas une hypothèse — c'est de la variation aléatoire. Une hypothèse correcte vous force à comprendre pourquoi quelque chose pourrait fonctionner, afin que vous appreniez même quand le test échoue.

## Variable à tester (isoler UNE)
Ce qui change exactement entre A et B :
Variante A (contrôle) : [version actuelle / texte spécifique]
Variante B (challenger) : [nouvelle version / texte spécifique]

Ce qui reste identique :
- Heure d'envoi : identique
- Nom d'expéditeur : identique
- Corps de l'email : identique
- Segment d'audience : identique
- Tout le reste : identique

## Calcul de la taille d'échantillon
Avec un niveau de confiance à 95% et une puissance statistique à 80% :

Taux de conversion de référence (métrique actuelle) : [X%]
Effet minimum détectable (MDE) : [% d'amélioration que vous devez observer pour que cela vaille la peine d'agir — ex. 10% d'amélioration relative]
Échantillon requis par variante : [calculer ou Claude calculera]
Total d'abonnés nécessaires : [2 × échantillon par variante]
Note : si votre liste est plus petite que cela, le test peut être sous-dimensionné.

Référence rapide (pour les tests de taux d'ouverture, base 25%) :
Pour détecter une amélioration relative de 10% (25% → 27,5%) : ~3 800 par variante
Pour détecter une amélioration relative de 20% (25% → 30%) : ~950 par variante
Pour détecter une amélioration relative de 30% (25% → 32,5%) : ~430 par variante

## Plan d'exécution du test
1. Segmenter l'audience du test aléatoirement (pas par engagement — cela biaise les résultats)
2. Envoyer les deux variantes simultanément (même heure, même jour — ou dans un délai d'1 heure)
3. Attendre la significance statistique avant de déclarer un gagnant
4. Ne pas regarder les résultats prématurément et déclarer un gagnant après 4 heures de données — cela gonfle les faux positifs

## Ce qu'il faut mesurer
Métrique principale : [la seule métrique sur laquelle votre hypothèse porte]
Métriques secondaires : [surveiller celles-ci, mais ne pas prendre de décisions basées uniquement sur elles]
Métriques de protection : [métriques que vous ne voulez pas dégrader — ex. taux de désabonnement]

## Règle de décision
Si la variante B surpasse la variante A du MDE à 95% de confiance → adopter B
Si les résultats ne sont pas significatifs → le test est non concluant — ne pas appeler cela une égalité
Si la variante A gagne → comprendre pourquoi B a échoué avant de tester un autre challenger
```

### Générateur de variantes de lignes d'objet pour test A/B

```
Générer des variantes de test A/B pour les lignes d'objet.

Contenu de l'email : [décrire de quoi parle l'email]
Audience cible : [qui ils sont et ce qui les intéresse]
Voix de la marque : [formelle / conversationnelle / ludique / directe]
Meilleure ligne d'objet actuelle : [la coller — ou décrire ce que vous avez essayé]

Générer 5 paires de variantes de lignes d'objet, chacune testant un levier psychologique différent :

Paire 1 — Bénéfice direct vs. Curiosité
A : [énonce le bénéfice clairement]
B : [crée un écart de curiosité ou une boucle ouverte]

Paire 2 — Personnalisation vs. Preuve sociale
A : [utilise le nom du destinataire ou son segment]
B : [fait référence à une foule ou une autorité]

Paire 3 — Chiffre précis vs. Titre conceptuel
A : [point de données ou chiffre spécifique]
B : [bénéfice sans le chiffre]

Paire 4 — Question vs. Affirmation
A : [pose une question au lecteur]
B : [fait une affirmation directe]

Paire 5 — Court (< 35 caractères) vs. Descriptif (40-55 caractères)
A : [percutant, moins de 35 caractères]
B : [plus descriptif, moins de 55 caractères]

Pour chaque paire, identifier :
- L'hypothèse qu'elle teste
- Ce qu'une victoire pour A signifie vs. ce qu'une victoire pour B signifie pour la stratégie future
- Le texte de prévisualisation à associer à chaque ligne d'objet
```

### Interpréteur de résultats de test A/B

```
Interpréter mes résultats de test A/B.

Détails du test :
- Ce qui a été testé : [ligne d'objet / CTA / heure d'envoi / etc.]
- Variante A (contrôle) : [description]
- Variante B (challenger) : [description]
- Taille d'échantillon : Variante A : [X emails], Variante B : [X emails]
- Résultat :
  - Variante A : [métrique, ex. 24,3% taux d'ouverture]
  - Variante B : [métrique, ex. 27,1% taux d'ouverture]
- Durée du test : [X heures / X jours]
- Niveau de confiance rapporté par la plateforme (si disponible) : [X%]

Interpréter :

## Ce résultat est-il statistiquement significatif ?
Calculer (ou vérifier le calcul de la plateforme) :
- Amélioration relative : ([B - A] / A) × 100 = X%
- Test z à deux proportions :
  p1 = taux variante A, n1 = envois variante A
  p2 = taux variante B, n2 = envois variante B
- Interprétation de la p-valeur :
  p < 0,05 : statistiquement significatif à 95% de confiance → sûr d'agir
  p 0,05-0,10 : marginalement significatif → procéder avec prudence, retester
  p > 0,10 : non significatif → ne pas agir sur ce résultat

## Significance pratique
Même si statistiquement significatif, l'amélioration est-elle meaningful ?
- Combien d'ouvertures/clics supplémentaires pour 1 000 envois ?
- Quel est l'impact annuel projeté si vous l'appliquez à l'ensemble de votre programme ?

## Erreurs courantes d'interprétation à éviter
1. Déclarer le gagnant tôt : de nombreuses plateformes affichent un "gagnant" en quelques heures. Ignorer jusqu'à la fin de l'envoi complet.
2. Confondre par le temps : A est-il sorti un lundi matin et B un vendredi après-midi ? Les différences de temps invalident les résultats.
3. Contamination de l'échantillon : certains abonnés ont-ils reçu les deux variantes ? Cela arrive avec les segments de ré-engagement.
4. Problème de tests multiples : si vous avez testé 10 lignes d'objet et "trouvé" un gagnant, la probabilité d'un faux positif est élevée. Corriger pour cela.

## Que faire avec ce résultat
Si B gagne (significatif) : [action spécifique — mettre à jour le modèle, documenter le principe appris, appliquer à la prochaine campagne]
Si non concluant : [quoi tester ensuite — plus grand échantillon, plus grande différence entre variantes, métrique différente]
Si A gagne (B est pire) : [noter POURQUOI — qu'est-ce que cela vous dit sur l'audience ? Quel principe cela confirme ou infirme-t-il ?]

## Apprentissage à enregistrer
Chaque résultat de test A/B — victoire, défaite ou non concluant — doit enrichir votre base de connaissances email :
Hypothèse testée : [répéter l'hypothèse]
Résultat : [ce qui s'est passé]
Principe extrait : [généralisation en 1 phrase, ex. "Notre audience répond à la spécificité — les chiffres surpassent les affirmations conceptuelles"]
S'applique à : [lignes d'objet / CTA / corps de texte / tout email]
```

### Constructeur de backlog de tests A/B email

```
Construire un backlog de tests A/B sur 90 jours pour mon programme email.

Mon programme email actuel :
- Taille de liste : [X]
- Fréquence d'envoi : [X emails/semaine ou mois]
- Taux d'ouverture moyen : [X%]
- Taux de clic moyen : [X%]
- Taux de conversion moyen : [X%]
- Principale lacune : [taux d'ouverture / taux de clic / conversion — où perdez-vous le plus ?]

Générer un backlog priorisé de 10 tests, classés par :
1. Impact potentiel sur votre principale lacune
2. Facilité d'exécution
3. Valeur d'apprentissage (même si le résultat est négatif)

Pour chaque test :
- Nom du test et hypothèse
- Métrique ciblée
- Taille d'échantillon requise
- Durée d'exécution
- Ce que vous apprenez quel que soit le résultat

Règle de priorisation :
- Corriger le haut du funnel en premier (taux d'ouverture) avant d'optimiser le milieu du funnel (taux de clic)
  car une hausse de 10% du taux d'ouverture améliore automatiquement toutes les métriques en aval
- Tester une variable par envoi — ne pas mélanger changements de ligne d'objet + CTA dans le même test
- Espacer les tests d'au moins 2 semaines pour éviter la contamination des apprentissages

Résultat sous forme de calendrier :
Mois 1 (fondations) : tester les variables de taux d'ouverture
Mois 2 (engagement) : tester les variables de taux de clic
Mois 3 (conversion) : tester les variables d'atterrissage/conversion
```

### Guide de test multivarié (avancé)

```
Concevoir un test email multivarié.

IMPORTANT : les tests multivariés nécessitent une taille d'échantillon minimale 10 fois plus grande qu'un simple test A/B.
Utiliser uniquement si vous disposez d'une très grande liste (> 100k envois disponibles) et pouvez tolérer la complexité.

Variables à tester :
Variable 1 : [ex. ligne d'objet — 2 variantes]
Variable 2 : [ex. texte du CTA — 2 variantes]
Variable 3 : [ex. image hero — 2 variantes]

Nombre de combinaisons : 2³ = 8 cellules de test
Échantillon minimum par cellule : [calculé en fonction de la métrique de référence et du MDE]
Échantillon total requis : [8 × minimum par cellule]

Expliquer pourquoi la plupart des équipes NE DEVRAIENT PAS exécuter de tests multivariés :
1. L'exigence en taille d'échantillon est prohibitive pour la plupart des listes
2. Les effets d'interaction entre variables sont difficiles à interpréter
3. La cellule gagnante peut ne pas se généraliser — vous ne pouvez pas isoler ce qui a causé la victoire
4. Mieux vaut exécuter 3 tests A/B séquentiels qu'1 test multivarié
   (Les tests séquentiels perdent un peu de vitesse mais gagnent en interprétabilité)

Recommandé à la place : test A/B factoriel (séquence de 3 tests, appliquer le gagnant à chaque fois).
```

### Référence de calcul de significance statistique

```typescript
// Test z à deux proportions pour les résultats A/B email
function calculateSignificance(
  variantARate: number,   // e.g., 0.243 for 24.3%
  variantASize: number,   // e.g., 5000
  variantBRate: number,   // e.g., 0.271
  variantBSize: number    // e.g., 5000
): { zScore: number; pValue: number; significant: boolean } {

  const pCombined = (variantARate * variantASize + variantBRate * variantBSize)
    / (variantASize + variantBSize)

  const standardError = Math.sqrt(
    pCombined * (1 - pCombined) * (1/variantASize + 1/variantBSize)
  )

  const zScore = (variantBRate - variantARate) / standardError
  // Convert zScore to p-value using normal distribution
  // |z| > 1.96 = p < 0.05 = 95% confidence
  // |z| > 2.576 = p < 0.01 = 99% confidence

  return {
    zScore,
    pValue: /* normal CDF calculation */ 0,
    significant: Math.abs(zScore) > 1.96
  }
}

// Minimum detectable effect (MDE) at 95% confidence, 80% power
function minimumSampleSize(
  baselineRate: number,
  mde: number  // relative improvement as decimal, e.g., 0.10 for 10%
): number {
  const p1 = baselineRate
  const p2 = baselineRate * (1 + mde)
  // Standard formula: n = 16 * p(1-p) / (p2-p1)^2 (approximate)
  return Math.ceil(16 * p1 * (1 - p1) / Math.pow(p2 - p1, 2))
}
```

## Exemple

**Utilisateur :** Mon test de ligne d'objet avait 5 200 envois par variante. Variante A (directe) : "Vos résultats T4 sont prêts" a obtenu 24,8% de taux d'ouverture. Variante B (curiosité) : "Nous avons trouvé quelque chose de surprenant dans vos données" a obtenu 28,2%. Est-ce réel ?

**Interprétation :**

```
## Résumé des résultats
Amélioration relative : (28,2 - 24,8) / 24,8 = +13,7%
Amélioration absolue : +3,4 points de pourcentage

## Test statistique
n = 5 200 par variante
Taux combiné : (0,248 × 5200 + 0,282 × 5200) / 10400 = 0,265
Erreur standard = √(0,265 × 0,735 × (1/5200 + 1/5200)) = 0,00869
Score Z = (0,282 - 0,248) / 0,00869 = 3,91

p < 0,0001 — hautement significatif. Ce n'est pas du bruit.

## Significance pratique
À 5 200 envois : +177 ouvertures supplémentaires par campagne
Appliqué à l'ensemble de votre liste (en supposant 20k envois/campagne) : +680 ouvertures
À 2% de CTR sur les ouvertures, cela représente +14 clics supplémentaires par campagne.

## Décision
Adopter la variante B pour ce type d'email : le cadre "quelque chose d'inattendu dans vos données".
Il s'agit d'un modèle d'écart de curiosité — vous ne donnez pas la réponse dans la ligne d'objet.

## Principe à enregistrer
"Les lignes d'objet à écart de curiosité surpassent les lignes d'objet à bénéfice direct d'environ 14%
pour les emails de type données/résultats. L'audience veut savoir ce qui était surprenant —
la question sans réponse génère l'ouverture."

## Mise en garde
Il s'agissait d'un seul test. Valider avec un second test sur une campagne différente avant de traiter
cela comme une règle universelle. Les principes se généralisent ; les résultats d'un seul test peuvent ne pas le faire.
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
