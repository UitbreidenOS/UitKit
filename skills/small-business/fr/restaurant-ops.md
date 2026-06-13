---
name: restaurant-ops
description: "Opérations de restaurant : texte de menu, analyse du coût alimentaire, prévision des stocks, réponses aux avis, spécialités saisonnières, postes d'embauche et documentation de formation"
---

# Restaurant Operations

## When to activate
- Rédaction ou réécriture de descriptions de menu, nommage d'une nouvelle spécialité ou lancement d'un menu saisonnier
- Votre pourcentage de coût alimentaire est plus élevé que prévu et vous devez trouver où la marge fuit
- Vous avez une pile d'avis Google ou Yelp à traiter et vous voulez que chaque réponse soit personnelle
- Embauche pour une saison chargée et vous avez besoin de descriptions de postes et d'un document de formation

## When NOT to use
- Comptabilité complète ou paie — utilisez votre comptable et processeur de paie pour ça
- Documentation de conformité au code sanitaire — consultez directement votre autorité sanitaire locale
- Négociations de baux ou révision de contrats fournisseurs — utilisez un avocat

## Instructions

### Menu engineering

Dites à Claude : le nom du plat, les ingrédients principaux, la méthode de cuisson, le point de prix et l'atmosphère du restaurant — haut de gamme, décontracté, casual, bistro de quartier ou similaire.

Claude écrit des descriptions qui vendent. Spécifiques, sensorielles et exactes — pas du texte générique qui pourrait s'appliquer à n'importe quel restaurant. « Pâtes faites maison » devient « rigatoni roulé à la main fini dans un beurre chili Calabrais de 30 minutes. » La description justifie le prix.

Pour une réécriture de menu complète, collez votre texte de menu actuel. Dites à Claude la voix que vous voulez : chaleureuse et accessible, sophistiquée et minimaliste, familiale, ou un restaurant de référence que vous admirez. Claude réécrit le menu complet dans cette voix tout en gardant chaque description exacte du plat réel.

Pour les spécialités saisonnières : dites à Claude l'ingrédient héros, la saison et le niveau de prix de votre menu. Claude nomme le plat, écrit la description et suggère un point de prix qui convient à votre architecture de menu existante.

---

### Food cost analysis

Pour chaque plat, donnez à Claude trois nombres : le prix du menu, le coût de chaque ingrédient dans une portion (soyez spécifique — incluez l'huile, les garnitures, la sauce et toute protéine exactement), et tout coût variable par assiette (conteneur de plats à emporter, serviettes si pertinent).

Claude calcule le pourcentage du coût alimentaire : coût divisé par prix de menu. Gamme cible pour la plupart des catégories :
- Protéines (viande, poisson) : 28-35%
- Pâtes, plats à base de grains : 18-25%
- Desserts : 20-28%
- Boissons (sans alcool) : 15-22%
- Cocktails : 18-24%

Claude signale tout plat au-dessus de votre seuil et suggère trois options : augmenter le prix, réduire légèrement la portion, remplacer un ingrédient ou supprimer le plat. Claude ne suggère pas les trois simultanément — il classe quelle approche convient au plat en fonction de son rôle de menu.

Pour l'examen hebdomadaire des achats : collez vos factures de fournisseurs des deux dernières semaines. Claude identifie quels coûts des ingrédients ont augmenté et quels plats sont maintenant au-dessus du seuil en conséquence.

---

### Inventory forecasting

Dites à Claude :
- Les portions servies par jour au cours des 4 dernières semaines (ou les totaux hebdomadaires)
- Quels plats ont été vendus et dans quel volume (votre POS peut exporter ça)
- Les réservations à venir ou les événements cette semaine
- Les vacances ou événements locaux qui affectent typiquement votre volume

Claude estime la quantité de chaque ingrédient clé à commander pour la semaine. Il base les estimations sur votre utilisation réelle par portion, pas sur des points de référence génériques. Il signale également les articles que vous avez historiquement surcommandés (courant avec les fruits et les poissons frais) et suggère de commander un peu moins pour réduire les déchets.

Pour la préparation d'événement : dites à Claude le type d'événement, le nombre de portions attendu et votre menu prévu. Claude produit une liste de matières premières avec des quantités.

---

### Review responses

Collez vos avis — positifs et négatifs ensemble. Dites à Claude le nom de votre restaurant et votre voix générale (chaleureuse et personnelle, professionnelle, détente et décontractée).

Pour chaque avis, Claude rédige une réponse. Les avis négatifs obtiennent : reconnaissance du problème spécifique, pas de déflexion ou d'excuse, et une résolution concrète (« veuillez nous contacter directement — nous voulons arranger ça »). Le ton reste calme et professionnel même pour les avis déloyaux ou hostiles.

Les avis positifs obtiennent des réponses chaleureuses et spécifiques. Claude lit ce que le critique a loué et le reflète — pas un « Merci de votre visite ! » générique copié neuf fois. Chaque réponse référence quelque chose de spécifique de cet avis.

Vous modifiez et personnalisez avant de publier. Claude gère le premier brouillon ; vous ajoutez la touche humaine.

---

### Hiring posts

Dites à Claude : le rôle, les responsabilités quotidiennes clés, ce qui fait de votre restaurant un bon endroit pour travailler (culture, horaire, dynamique d'équipe, avantages) et la gamme de salaires.

Claude rédige un affiche d'emploi qui décrit le travail réel clairement et honnêtement. Il n'utilise pas des phrases creuses comme « passionné par l'hospitalité » ou « joueur d'équipe » sans substance. Il dit aux candidats exactement à quoi ressemblent leurs journées et pourquoi quelqu'un de bien voudrait travailler là.

---

### Training documentation

Dites à Claude : le rôle que vous entraînez (cuisinier de ligne, serveur, hôte, barista), la compétence ou le processus spécifique à documenter, et les normes ou préférences de la maison.

Claude produit un document de formation clair et étape par étape écrit pour quelqu'un de nouveau à votre opération — pas générique, mais spécifique à ce que vous lui dites. Utile pour l'intégration et pour normaliser l'exécution dans votre équipe.

---

### Prompt template — food cost

```
S'il vous plaît, analysez le coût alimentaire pour mes plats.

Type de restaurant : [casual/upscale/fast-casual]
Cible de coût alimentaire : [X]%

Plat 1 : [nom]
- Prix du menu : $[X]
- Coût des ingrédients par assiette : $[Y] (répartition : protéine $X, légume $X, sauce $X, amidon $X, garniture $X)
- Portions mensuelles vendues : [nombre]

Plat 2 : [nom]
- Prix du menu : $[X]
- Coût des ingrédients par assiette : $[Y]

Pour chaque plat au-dessus de ma cible : suggérez le meilleur ajustement unique (prix, portion, remplacement ou suppression).
```

## Example

Vous collez 12 avis Google : 9 positifs et 3 négatifs. Vous dites à Claude que votre restaurant est un endroit à pâtes décontracté avec une voix de quartier chaude.

Claude produit 12 brouillons de réponses.

Les 3 négatifs obtiennent chacun une réponse spécifique et directe :
- Une plainte sur une attente de 40 minutes samedi : « Les soirs de samedi ont fonctionné plus longtemps que nous l'aurions souhaité — nous sommes désolés du vôtre. Nous avons ajouté une notification texte quand votre table est prête. Si vous revenez, demandez [nom du gérant] et nous nous occupons de vous. »
- Une plainte sur un plat de pâtes froid : « Cela ne devrait pas quitter la cuisine de cette façon. S'il vous plaît, envoyez-nous un email directement — nous aimerions vous l'envoyer correctement. »
- Une plainte sur le bruit : « Nous savons que les vendredi soirs deviennent bruyants — c'est l'énergie, mais nous vous entendons. Nous avons ajouté des panneaux acoustiques sur le mur est ce mois-ci et nous sommes curieux si vous remarquez une différence. »

Les 9 positifs obtiennent chacun une réponse différente, chacune reflétant quelque chose de spécifique que le critique a mentionné — le tiramisu, un serveur particulier, un souper d'anniversaire. Aucune ne répète la même ligne d'ouverture.

---
