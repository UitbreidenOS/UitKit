---
name: nda-review
description: "NDA triage and review: classify type, flag playbook deviations (GREEN/YELLOW/RED), identify scope issues, missing exclusions, hidden obligations — attorney review gate"
---

> 🇫🇷 Version française. [English version](../nda-review.md).

# Compétence Révision d'Accord de Confidentialité (NDA)

## Quand activer
- Révision d'un accord de confidentialité (NDA) avant signature
- Tri d'un lot d'accords NDA pour identifier ceux nécessitant l'attention d'un avocat
- Comprendre ce que signifie une clause NDA spécifique en langage simple
- Vérifier si un NDA contient les exclusions et protections standards
- Comparer les conditions d'un NDA avec les positions standards du playbook de votre entreprise

## Quand NE PAS utiliser
- Signer au nom de votre organisation — cela requiert un signataire autorisé
- Interpréter les conditions d'un NDA dans un litige actif — consultez votre avocat
- Accords NDA multi-juridictionnels avec des obligations transfrontalières complexes — nécessite un spécialiste

## Avertissement important

Claude peut identifier des problèmes et expliquer des clauses. Il ne peut pas donner de conseils juridiques, interpréter le droit spécifique à une juridiction, ni garantir qu'il a détecté tous les problèmes. **Faites réviser tout NDA par un avocat avant de signer si la relation est significative.**

## Instructions

### D'abord — classifier le NDA

```
Examinez ce NDA et dites-moi :
1. Est-il mutuel (les deux parties protégées) ou unilatéral (une seule partie) ?
2. Qui est la partie divulgatrice et qui est la partie réceptrice ?
3. Quelle est la durée ?
4. Quelle juridiction le gouverne ?

Texte du NDA : [coller]
```

### Révision complète selon le playbook

```
Révisez ce NDA par rapport à nos positions standards :

Nos positions standards :
- Préférence pour les NDA mutuels ; unilatéral acceptable si nous sommes la partie réceptrice
- Durée maximale du NDA : 3 ans
- Définition des Informations Confidentielles : doit être marquée ou confirmée par écrit dans les 30 jours
- Exclusions standards requises : domaine public, connaissance préalable, développement indépendant, divulgation contrainte
- Droit applicable : [votre juridiction préférée]
- Pas de clause de non-sollicitation ou de non-concurrence cachée dans le NDA

Texte du NDA : [coller]

Marquez chaque problème comme VERT (acceptable), JAUNE (à négocier), ou ROUGE (bloquant).
```

### Vérification des exclusions standards

Tout NDA devrait comporter ces 4 exclusions. Claude les vérifie :

```
Vérifiez si ce NDA contient les 4 exclusions standards :
1. Les informations déjà dans le domaine public (pas suite à une violation)
2. Les informations que la partie réceptrice connaissait déjà avant la divulgation
3. Les informations développées indépendamment par la partie réceptrice
4. Les informations devant être divulguées par la loi ou ordonnance judiciaire (divulgation contrainte)

Texte du NDA : [coller]

Si l'une manque, marquez comme JAUNE et rédigez le langage manquant.
```

### Analyse des obligations cachées

```
Analysez ce NDA pour détecter toute obligation au-delà de la confidentialité standard :
- Clauses de non-sollicitation (restrictions d'embauche)
- Dispositions de non-concurrence
- Langage de cession de propriété intellectuelle
- Obligations d'exclusivité
- Dispositions de standstill (limites sur les activités de fusion-acquisition)

Texte du NDA : [coller]

Marquez tout ce qui dépasse la confidentialité standard comme ROUGE — ces éléments n'ont pas leur place dans un NDA.
```

### Explication en langage simple

```
Expliquez cette clause NDA en langage simple :
"[coller la clause]"

Dites-moi : que signifie cela concrètement pour mon activité ? Quelle est l'implication pratique ?
```

### Suggestions de révision

```
Ce NDA présente les problèmes suivants sur lesquels je souhaite négocier :
[lister les problèmes de la révision ci-dessus]

Rédigez le langage de révision pour chaque problème — ce que je veux qu'il dise à la place.
Format : Texte original → Révision proposée → Raison
```

## Exemple

**Un NDA unilatéral où vous êtes la partie réceptrice :**

```
ROUGE — Définition trop large des Informations Confidentielles
Section 1 : "Toutes les informations divulguées par la Partie Divulgatrice, sous quelque forme que ce soit"
Problème : Pas d'exigence de marquage ni d'exclusion pour les divulgations verbales.
           Vous pourriez être tenu par inadvertance par tout ce qui a été dit dans n'importe quelle réunion.
Correction : Ajouter "...à condition que les divulgations verbales soient confirmées par écrit dans
     les 30 jours suivant la divulgation comme étant confidentielles."

JAUNE — La durée de 5 ans dépasse le standard
Section 8 : "Cet accord restera en vigueur pendant cinq (5) ans"
Problème : 5 ans est plus long que le standard de 3 ans. Gérable mais mérite d'être négocié.
Correction : Proposer 2-3 ans pour la plupart des NDA commerciaux.

ROUGE — Exclusion de "développement indépendant" manquante
Section 2 ne contient que 3 des 4 exclusions standards — le développement indépendant est absent.
Correction : Ajouter : "(d) les informations développées indépendamment par la Partie Réceptrice sans
     utilisation ni référence aux Informations Confidentielles de la Partie Divulgatrice."

VERT — Droit applicable (Californie) : acceptable si vous opérez là-bas.
VERT — Exceptions mutuelles pour la divulgation contrainte : présentes et standards.

RECOMMANDATION : Ne pas signer tel quel. Les éléments ROUGES doivent être corrigés avant exécution.
Révision par un avocat : Recommandée si ce NDA accompagne une relation commerciale significative.
```

---
