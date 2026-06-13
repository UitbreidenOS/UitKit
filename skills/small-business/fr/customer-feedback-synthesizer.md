---
name: customer-feedback-synthesizer
description: "Transformez 50-200+ avis, réponses à des sondages ou tickets de support en points critiques, demandes de fonctionnalités, tendances de sentiment et un plan d'action concret"
---

# Customer Feedback Synthesizer

## When to activate
- Vous avez plus d'avis que vous n'avez le temps de les lire et vous avez besoin des thèmes rapidement
- Un examen commercial trimestriel s'en vient et vous avez besoin d'un résumé client appuyé par des données
- Vous venez de lancer un produit ou une fonctionnalité et vous voulez connaître comment c'est passé
- Vous préparez un rapport client pour votre équipe, vos investisseurs ou un conseil consultatif

## When NOT to use
- Vous avez moins de 10 avis — lisez-les vous-même, les tendances nécessitent du volume
- Vous avez besoin d'une analyse NPS ou CSAT statistiquement rigoureuse — utilisez un outil de sondage dédié
- Vous voulez un journal verbatim de chaque plainte — cette compétence synthétise, elle n'archive pas

## Instructions

### What to give Claude

Collez vos avis directement. Copiez depuis Google, Yelp, Trustpilot, App Store ou G2. Collez des résumés de tickets de support. Collez les réponses à des sondages ouverts. Aucune mise en forme nécessaire — simplement du texte brut, un avis après l'autre. Claude peut traiter 200+ en un seul passage.

Si vous avez exporté un CSV, collez seulement la colonne texte d'avis. Vous n'avez pas besoin de le nettoyer.

Dites à Claude :
- La période couverte par les avis (par exemple, « les 3 derniers mois » ou « depuis notre lancement en janvier »)
- Votre type d'entreprise (restaurant, SaaS, détail, service) pour que Claude ait du contexte
- Toute question spécifique que vous voulez poser (par exemple, « pourquoi nos notes baissent-elles ? » ou « qu'est-ce que les gens veulent que nous ajoutions ? »)

### What Claude produces

Claude produit cinq choses :

**1. Top 5 des points critiques** — classés par le nombre d'avis qui les mentionnent, avec un décompte de fréquence et l'intensité émotionnelle typique (frustré vs. légèrement ennuyé vs. en colère)

**2. Top 5 des demandes de fonctionnalités ou de produits** — classées par le nombre de personnes qui les ont demandées, avec le langage exact que les clients utilisent le plus souvent (utile pour votre propre texte et arguments de feuille de route)

**3. Tendance de sentiment** — améliorant, stable ou déclinant — basée sur le ton sur la période que vous avez fournie. Si vous donnez à Claude des avis de deux périodes, il les compare directement.

**4. Top 3 des points forts « ce qui fonctionne »** — ce que les clients louent le plus, ce qui est aussi important que ce qu'ils critiquent. Utile pour le texte marketing et pour savoir ce qu'il ne faut pas changer.

**5. Matrice d'urgence** — chaque point critique classé comme :
- Critique : beaucoup de gens le mentionnent, forte émotion négative, affecte l'expérience centrale
- Important : fréquent, frustration modérée, mérite d'être corrigé ce trimestre
- À surveiller : occasionnel, léger, pas encore digne d'action mais mérite d'être suivi

### Suggested fixes

Pour chaque point critique dans les catégories critique et important, demandez à Claude : « Pour chaque problème, suggérez une action concrète que je pourrais prendre. » Claude produit une action courte par élément — pas un document stratégique, juste le prochain mouvement.

### Monthly cadence

Exécutez ceci une fois par mois. Enregistrez chaque résultat (copiez-le dans un document). Après trois mois, collez tous les trois résultats et demandez à Claude : « Les problèmes critiques du mois un s'améliorent-ils ? » Cela suit si vos corrections fonctionnent réellement.

---

### Prompt template

```
Je vais coller [nombre] avis de [plateforme] couvrant [période].
Mon entreprise est un(e) [type d'entreprise].

S'il vous plaît, donnez-moi :
1. Top 5 des points critiques avec décompte de fréquence et intensité émotionnelle
2. Top 5 des demandes de fonctionnalités ou de produits classées par le nombre de personnes qui les ont demandées
3. Tendance de sentiment : améliorant, stable ou déclinant
4. Top 3 des choses que les clients louent le plus
5. Une matrice d'urgence classant chaque point critique comme critique, important ou à surveiller
6. Pour les éléments critiques et importants : une action concrète que je pourrais prendre pour chacun

Voici les avis :
[collez les avis]
```

## Example

Vous êtes propriétaire d'un restaurant et collez 80 avis Google des 3 derniers mois. Vous dites à Claude que votre entreprise est un restaurant à service assis décontracté.

Claude identifie :

Points critiques :
1. Temps d'attente (34 avis, forte frustration) — Critique
2. Portions incohérentes (18 avis, frustration modérée) — Important
3. Stationnement (11 avis, léger ennui) — À surveiller
4. Niveau sonore les fins de semaine (9 avis, modéré) — À surveiller
5. Options végétariennes limitées (7 avis, léger) — À surveiller

Demandes de fonctionnalités :
1. Commande en ligne ou réservations (22 avis)
2. Portions plus grandes au menu du déjeuner (14 avis)
3. Un programme de fidélité (8 avis)

Tendance de sentiment : En déclin — les avis des mois 1-2 avaient un ton plus chaleureux ; le mois 3 montre plus de frustration autour des temps d'attente spécifiquement, coïncidant avec vos nouveaux horaires de fin de semaine.

Ce qui fonctionne : Amabilité du personnel (mentionnée positivement dans 61 des 80 avis), qualité alimentaire des plats principaux et bon rapport qualité-prix.

Actions de la matrice d'urgence :
- Temps d'attente (Critique) : Claude suggère d'ajouter un système de notification par texte quand les tables sont prêtes et d'afficher les temps d'attente estimés à la porte
- Portions (Important) : Claude suggère de normaliser l'assiette du déjeuner avec un guide de portion documenté pour le personnel de cuisine

Temps total : moins de 2 minutes pour passer du collage brut à ce résultat.

---
