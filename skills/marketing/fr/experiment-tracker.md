---
name: experiment-tracker
description: "Suivi des tests A/B : rédaction d'hypothèses, calculateur de taille d'échantillon, analyse des résultats et interprétation de la significance statistique pour les expériences de croissance"
---

# Compétence Suivi des Expériences

## Quand l'activer
- Exécution d'un test A/B avec besoin d'une hypothèse structurée et de métriques de succès avant le lancement
- Calcul de la taille d'échantillon et de la durée du test avant de démarrer une expérience
- Analyse des résultats d'un test et détermination si la significance statistique est atteinte
- Documentation des apprentissages d'expériences pour l'équipe ou le journal des expériences
- Priorisation des prochaines expériences à lancer selon le scoring ICE ou RICE
- Un test est terminé et vous devez décider : lancer, abandonner ou itérer

## Quand NE PAS utiliser
- Conception complète d'expérience à partir de zéro — utiliser `/experiment-designer` pour cela
- Configuration analytics et tracking des événements — utiliser `/analytics-tracking`
- Interprétation de recherches qualitatives ou d'entretiens utilisateurs — méthodologie différente
- Quand la taille d'échantillon est trop petite pour exécuter un test valide (< 100 conversions par variante attendues)

## Instructions

### Framework de rédaction d'hypothèse

```
Rédiger une hypothèse d'expérience structurée pour mon test A/B.

Idée de test : [décrire le changement que vous souhaitez faire]
Page / fonctionnalité : [où dans le produit ou le funnel]
État actuel : [ce qui existe aujourd'hui]
Changement proposé : [ce que vous souhaitez tester]

Produire une hypothèse dans ce format :

Nous croyons que [CHANGEMENT]
pour [SEGMENT D'AUDIENCE]
résultera en [RÉSULTAT ATTENDU]
parce que [MÉCANISME / RAISONNEMENT]
Nous saurons que c'est vrai quand [CRITÈRES DE SUCCÈS MESURABLES]
et que le test aura atteint [TAILLE D'ÉCHANTILLON MINIMUM] conversions par variante
avec [95%] de confiance statistique.

Également produire :
- Métrique principale : [la seule métrique qui détermine victoire/défaite]
- Métriques secondaires : [métriques de protection — ne doivent pas régresser]
- Effet minimum détectable (MDE) : [plus petite amélioration qui vaut la peine d'être livrée]
- Risque : [ce qui pourrait mal tourner — effet de nouveauté, interaction de segment, etc.]
```

### Calculateur de taille d'échantillon

```
Calculer la taille d'échantillon requise pour mon test A/B.

Type de test : [taux de conversion / revenu par utilisateur / rétention / engagement]
Taux de référence actuel : [X%] (ex. taux de conversion actuel)
Effet minimum détectable (MDE) : [X%] (amélioration relative qui vaut la peine d'être détectée)
  — Conservateur : hausse relative de 5-10% (grand échantillon nécessaire)
  — Modéré : hausse relative de 15-20% (typique)
  — Agressif : hausse relative de 30%+ (petit échantillon, détecter uniquement les grands changements)
Significance statistique : [95%] (standard) ou [90%] (acceptable pour les tests à faibles enjeux)
Puissance statistique : [80%] (standard) ou [90%] (tests à forts enjeux)
Nombre de variantes : [2] (A vs. B) ou [3+] (multi-variante — diviser par n-1)

Calcul :

Pour les tests de taux de conversion, utiliser le test z à deux proportions :

n requis par variante = (z_α/2 + z_β)² × [p1(1-p1) + p2(1-p2)] / (p1 - p2)²

Où :
- p1 = taux de référence
- p2 = taux de référence × (1 + MDE)
- z_α/2 = 1,96 (significance à 95%)
- z_β = 0,842 (puissance à 80%)

Fournir :
- Conversions requises par variante : [N]
- Visiteurs requis par variante (au taux de conversion actuel) : [N]
- Durée de test prévue à [trafic actuel] par jour : [X jours / semaines]
- Avertissement si la durée > 8 semaines (les effets saisonniers vont contaminer les résultats)
- Avertissement si les conversions par variante < 100 (le test est sous-dimensionné — augmenter le MDE ou attendre)

Me montrer les chiffres pour mon test.
```

### Checklist pré-lancement

```
Effectuer une vérification pré-lancement de mon test A/B avant de le démarrer.

Nom du test : [nom]
Outil : [Optimizely / VWO / LaunchDarkly / GrowthBook / personnalisé]
Hypothèse : [du framework d'hypothèse ci-dessus]
Taille d'échantillon nécessaire : [N par variante]
Trafic prévu par jour : [N visiteurs]
Durée prévue du test : [X jours]

Checklist pré-lancement :

TRACKING
□ La métrique principale est correctement trackée (l'événement se déclenche à la conversion, pas au chargement de page)
□ Les métriques secondaires/de protection sont trackées (revenu, durée de session, taux d'erreur)
□ L'événement d'affectation au test est tracké (afin que vous puissiez segmenter par variante dans les analytics)
□ Pas de bugs ou de ruptures dans le funnel existant sur le contrôle — tester une baseline cassée = résultats invalides
□ QA en staging : confirmer que la variante s'affiche correctement sur tous les navigateurs + mobile

CONFIGURATION
□ Répartition du trafic confirmée : [50/50 ou X/Y — documenter la répartition]
□ Règles de ciblage documentées : [qui est inclus / exclu]
□ Exclusion mutuelle : ce test entre-t-il en conflit avec un autre test en cours ?
□ Groupe de retenue si nécessaire : si le test affecte significativement le revenu, garder 5-10% hors de tous les tests

DURÉE
□ Exécuter au moins 2 cycles business complets (minimum 2 semaines — ne jamais arrêter à la première significance)
□ Ne pas consulter les résultats quotidiennement et arrêter prématurément — cela gonfle le taux de faux positifs
□ Définir une date d'arrêt fixe : [date] — ne pas prolonger sans raison documentée

RISQUE
□ Pouvez-vous faire un rollback de la variante instantanément si une métrique de protection s'effondre ?
□ Y a-t-il un risque d'effet de nouveauté ? (nouvelle UI = hausse à court terme qui ne persiste pas)
□ Ce segment de test va-t-il interagir avec un autre test ? Cartographier votre matrice de tests.

Valider quand toutes les cases sont cochées.
```

### Analyse des résultats

```
Analyser les résultats de mon test A/B et me dire quoi faire.

Test : [nom]
Durée : [X jours]
Outil : [plateforme analytics]

Résultats :
Contrôle (A) :
- Visiteurs : [N]
- Conversions : [N]
- Taux de conversion : [X%]
- Revenu par visiteur (si applicable) : [X] €

Variante (B) :
- Visiteurs : [N]
- Conversions : [N]
- Taux de conversion : [X%]
- Revenu par visiteur (si applicable) : [X] €

Hausse relative : [(B-A)/A × 100]%
P-valeur : [X] (de votre outil de test)
Confiance : [X%]
Significance statistique atteinte : [Oui / Non]

Analyse :

FRAMEWORK DE DÉCISION :
1. Le résultat est-il statistiquement significatif à 95% ?
   OUI → procéder à l'analyse de l'impact business
   NON → vérifier : avez-vous atteint la taille d'échantillon requise ?
     - Si oui + pas de significance : l'effet est plus petit que le MDE → probablement pas rentable à livrer
     - Si non : étendre le test ou accepter que vous ne pouvez pas détecter un effet aussi petit

2. La hausse est-elle significative en euros ?
   Impact annuel sur le revenu de cette hausse = [calcul] :
   Hausse × conversions quotidiennes × valeur moyenne de commande × 365 = [X] €/an
   Si l'impact annuel < coût de mise en œuvre permanente, reconsidérer.

3. Des métriques de protection ont-elles régressé ?
   Revenu par visiteur, durée de session, taux d'erreur, contacts support ?
   Si oui : NE PAS livrer même si la métrique principale est positive. Une hausse des inscriptions qui double les contacts support n'est pas une victoire.

4. Analyse par segment — la hausse tient-elle sur :
   - Mobile vs. bureau ?
   - Nouveaux vs. utilisateurs récurrents ?
   - Source de trafic (payant vs. organique) ?
   - Géographie ?
   Des effets d'interaction significatifs suggèrent que la variante fonctionne pour un segment, pas universellement.

DÉCISION : [LIVRER / ABANDONNER / LIVRER PAR SEGMENT / ITÉRER]
Raisonnement : [spécifique, basé sur les chiffres]
Prochaine expérience : [quoi tester ensuite en fonction de ces résultats]
```

### Modèle de journal des expériences

```
Documenter cette expérience pour le journal des expériences de l'équipe.

Expérience : [nom — consultable, descriptif]
Date : [début] → [fin]
Responsable : [nom]
Équipe : [croissance / produit / marketing]
Statut : [en cours / terminé]

## Hypothèse
[Du framework d'hypothèse]

## Configuration
- Outil : [Optimizely / VWO / personnalisé]
- Répartition du trafic : [50/50]
- Audience : [tous les utilisateurs / nouveaux utilisateurs / mobile / etc.]
- Ciblage : [URL, segment, feature flag]

## Résultats
| Métrique | Contrôle | Variante | Hausse | Significance |
|---|---|---|---|---|
| Principale : [métrique] | [X%] | [X%] | [+X%] | [95%] |
| Protection : [métrique] | [X] | [X] | [+/-X%] | [N/A] |
| Protection : [métrique] | [X] | [X] | [+/-X%] | [N/A] |

Échantillon : [N] par variante | Durée : [X jours] | P-valeur : [X]

## Décision
[LIVRÉ / ABANDONNÉ / ITÉRÉ]
Justification : [pourquoi]

## Apprentissage
[Ce que cela nous dit sur le comportement des utilisateurs — pas seulement "la variante a gagné"]
[Quoi tester ensuite]

## Impact annuel (si livré)
[X] € de revenu incrémental ou [X%] d'amélioration de la métrique
```

### Priorisation des expériences

```
Prioriser mon backlog d'expériences avec le scoring ICE.

Mes idées d'expériences :
1. [Idée 1]
2. [Idée 2]
3. [Idée 3]
[ajouter autant que nécessaire]

Scorer chacune sur ICE :

IMPACT (1-10) : Si ça fonctionne à la hausse attendue, quel est l'impact sur le revenu/la métrique ?
- 10 : > 100K € d'impact annuel ou > 20% de hausse sur une métrique clé
- 7 : 20-100K € ou hausse de 10-20%
- 4 : 5-20K € ou hausse de 5-10%
- 1 : < 5K € ou < 5% de hausse

CONFIANCE (1-10) : Dans quelle mesure sommes-nous sûrs que ça va fonctionner ?
- 10 : Données préalables, recherche utilisateur et preuve ailleurs pointent tous dans ce sens
- 7 : Signal qualitatif fort ou test similaire fonctionné dans un domaine adjacent
- 4 : Basé sur la théorie, aucune preuve directe
- 1 : Pure intuition

FACILITÉ (1-10) : Dans combien de temps pouvons-nous exécuter ce test ?
- 10 : Changement de texte uniquement, aucun dev nécessaire, en ligne en 1 jour
- 7 : Changement frontend mineur, 1-2 jours de dev
- 4 : Changement backend ou logique, 1 semaine de dev
- 1 : Changement d'architecture, 4+ semaines de dev

Score ICE = (Impact + Confiance + Facilité) / 3

Classer toutes les idées par score ICE. Signaler celles qui nécessitent > 2 semaines d'ingénierie comme Effort Élevé — évaluer si elles devraient aller dans le backlog produit à la place.

Produire un calendrier d'expériences classé pour les 4 prochaines semaines.
```

## Exemple

**Utilisateur :** Je veux tester le changement du CTA de notre page de tarification de "Commencer l'essai gratuit" à "Voir les tarifs" parce que je pense que les utilisateurs veulent voir les chiffres avant de s'engager. La conversion de référence est de 3,2%. Quelle taille d'échantillon me faut-il et comment configurer ça ?

**Résultat de Claude :**

**Hypothèse :**
Nous croyons que changer le CTA principal de "Commencer l'essai gratuit" à "Voir les tarifs"
pour tous les visiteurs atterrissant sur /pricing
résultera en un taux de clic plus élevé vers la page de paiement ou de sélection de plan
parce que les utilisateurs dans un état d'esprit de comparaison de prix veulent voir les chiffres avant de s'engager dans un cadre "essai".
Nous saurons que c'est vrai quand le taux de clic sur le CTA augmentera de ≥ 15% (relatif)
avec 95% de confiance statistique et 80% de puissance.

**Calcul de la taille d'échantillon :**
- Référence : 3,2% de taux de clic sur le CTA
- MDE : 15% relatif = 3,68% de taux cible
- Requis : **2 843 visiteurs par variante** (5 686 au total)
- À 500 visiteurs/jour sur la page de tarification : **test de 12 jours**
- À 200 visiteurs/jour : **test de 29 jours** — le faire, ça vaut l'attente

**Pré-lancement :**
- Confirmer que l'événement de clic sur le CTA se déclenche dans les analytics (pas au chargement de page)
- Tracker : vues de la page de sélection de plan (protection — ne doit pas chuter)
- Tracker : inscriptions à l'essai (la vraie métrique en aval — segmenter par variante dans votre outil analytics)
- Ne pas arrêter prématurément — même si vous atteignez la significance en semaine 1, exécuter les 2 semaines complètes

**Ce qu'il faut observer :**
Si "Voir les tarifs" gagne sur les clics mais que les inscriptions à l'essai n'augmentent pas, les utilisateurs sont plus curieux mais pas plus engagés. C'est un problème de clarté des tarifs, pas un problème de CTA — le prochain test porte sur la page de tarification elle-même.

---
