---
name: margin-analyzer
description: "Calculez la marge brute par ligne de produits, segment de clients et canal ; signalez les articles à marge fine ; trouvez où vous gagnez vraiment de l'argent"
---

# Margin Analyzer

## When to activate
- Vous envisagez un changement de prix et voulez connaître l'impact avant de vous engager
- Vous décidez quels produits promouvoir dans une campagne et vous voulez pousser les plus rentables
- Examen commercial trimestriel et vous soupçonnez que certains produits ou types de clients vous font perdre de l'argent
- Vos revenus augmentent mais votre profit ne l'est pas — vous devez trouver la fuite

## When NOT to use
- Analyse complète du compte de résultat incluant l'allocation des frais généraux — utilisez votre comptable pour ça
- Projections financières multi-années pour investisseurs ou prêteurs
- Suivi des marges dans le temps automatiquement — c'est une analyse ponctuelle, pas un tableau de bord en direct

## Instructions

### What to give Claude

Pour chaque produit ou service, fournissez trois nombres :
1. Prix de vente (ce que vous facturez au client)
2. Coût de livraison (tout ce qu'il faut pour produire ou remplir une unité)
3. Volume (combien vous vendez par mois)

Le coût de livraison doit être spécifique pour être utile. Incluez : matériaux, emballage, coût fournisseur, travail par unité (heures × votre coût de travail par heure), frais de plateforme ou de marché, frais de traitement des paiements, expédition si vous l'absorbez. Si vous vendez un service, estimez les heures par engagement × votre coût horaire mixte.

Si vous vendez via plusieurs canaux — votre propre site Web, Amazon, un compte grossiste — donnez à Claude le prix et le coût par canal séparément. Les frais de plateforme et l'expédition varient assez pour que la marge du canal soit souvent très différente de votre marge de titre.

### What Claude computes

Marge brute par produit : (prix de vente moins coût de livraison) divisé par prix de vente, exprimé en pourcentage.

Claude classe tous les produits du plus haut au plus bas rendement et signale tout ce qui dépasse le plancher que vous avez défini. Si vous ne définissez pas de plancher, Claude utilise 20% comme minimum par défaut — en dessous, la plupart des entreprises ne couvrent pas la contribution aux frais généraux.

Claude produit également :
- Votre marge moyenne pondérée par les revenus (pas seulement la moyenne simple — pondérée par combien vous vendez réellement de chaque article)
- Quels produits génèrent le plus de profit brut en dollars, pas seulement en pourcentage (un produit à 70% de marge que vous vendez 5 fois vaut moins qu'un produit à 35% de marge que vous vendez 200 fois)
- Où la tarification n'a pas suivi les augmentations de coûts (si vous dites à Claude quels étaient vos coûts il y a un an par rapport à maintenant)

### Customer segment analysis

Si vous avez différents types de clients — individuels vs. entreprises, petits vs. entreprises, ponctuel vs. récurrent — dites à Claude le revenu et le coût de service par segment. Le coût de service inclut : temps passé sur le support, intégration, gestion de compte, retours ou révisions.

Les petits clients coûtent souvent plus par dollar de revenus que les grands. Claude vous montrera où cela se produit et quantifiera la différence.

### Channel analysis

Collez vos numéros par canal. Claude vous montre ce que vous gagnez net après les frais de plateforme sur chaque canal :

- Ventes directes (votre site Web) : pas de frais de marché, mais vous payez pour le trafic
- Marché (Amazon, Etsy, eBay) : frais de 8-15% au-dessus plus réalisations
- Gros : remise de 40-50% au détail, mais pas de coût de service client
- App stores : frais de plateforme de 15-30%

Le canal qui génère le plus de revenus n'est souvent pas le canal le plus rentable. Claude rend cela visible.

### Pricing gap check

Dites à Claude vos coûts actuels et votre prix actuel. Puis dites à Claude quels étaient ces coûts il y a 12 mois. Claude calcule combien de marge vous avez perdue en inflation des coûts et quelle augmentation de prix la restaurerait — exprimée en montant en dollars, pas seulement en pourcentage, pour que vous puissiez voir si c'est un changement de prix défendable.

---

### Prompt template

```
S'il vous plaît, analysez mes marges. Voici mes produits/services :

Produit 1 : [nom]
- Prix de vente : $[X]
- Coût de livraison : $[Y] (répartition : matériaux $X, travail $X, frais de plateforme $X)
- Volume mensuel : [unités]

Produit 2 : [nom]
- Prix de vente : $[X]
- Coût de livraison : $[Y]
- Volume mensuel : [unités]

[répéter pour chaque produit]

Mon plancher de marge est [X]% — signalez tout ce qui dépasse ça.

Aussi : je vends via [canaux]. Voici les numéros spécifiques aux canaux : [détails]

Questions :
1. Quel produit devrais-je prioriser dans ma prochaine campagne marketing ?
2. Quels produits sont candidats à une augmentation de prix ?
3. Quel est ma marge moyenne pondérée par les revenus ?
```

## Example

Vous gérez une boutique Shopify avec trois lignes de produits. Vous donnez à Claude les prix, les coûts (incluant les frais de paiement Shopify de 2,9% + $0,30 par transaction) et le volume de ventes mensuel.

Claude sort :

| Produit | Prix de vente | COGS | Marge brute | Unités mensuels | Profit brut mensuel |
|---|---|---|---|---|---|
| Bougies faites à la main | $42 | $13,50 | 68% | 90 unités | $2 565 |
| Diffuseurs marque blanche | $65 | $46,80 | 28% | 140 unités | $2 548 |
| Guides numériques de parfum | $12 | $1,05 | 91% | 55 unités | $598 |

Marge moyenne pondérée par les revenus : 51%

Claude signale : les diffuseurs marque blanche sont au-dessus du plancher de 20% mais bien en dessous de votre marge de bougie faite à la main. À 140 unités par mois, elles génèrent presque le même profit brut que votre produit à 68% de marge — mais elles immobilisent le capital d'inventaire et demandent du travail de réalisation. Si les coûts du fournisseur augmentent de 5%, les diffuseurs tombent à 22% de marge et une augmentation de coût de plus les fait tomber sous le plancher.

Recommandation : déplacez les dépenses publicitaires payantes vers les bougies faites à la main (marge % la plus élevée) et les guides numériques (marge % la plus élevée, sans réalisation). Révisez la tarification des diffuseurs — une augmentation de prix de $7 porte la marge à 37% et il est peu probable qu'elle réduise le volume de manière significative compte tenu de votre position de prix actuelle.

---
