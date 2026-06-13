# Marqueur d'Escalade

## Quand activer

- Après qu'un examen de contrat identifie des problèmes qui peuvent dépasser l'autorité du relecteur
- Toute clause de contrat déclenche une condition d'escalade automatique (voir l'étape 1 ci-dessous)
- Incertitude quant à savoir si un terme nécessite une approbation supérieure avant de poursuivre

## Quand NE PAS utiliser

- Comme substitut à la lecture du contrat — cette compétence signale les problèmes dans un contrat révisé, pas un substitut à la lecture d'un
- Pour des conseils juridiques — cette compétence achemine les problèmes au bon niveau d'autorité ; elle ne fournit pas de conseil juridique sur les avantages d'un terme

## Instructions

Appliquez l'arbre de décision d'escalade dans l'ordre. Arrêtez au premier déclencheur qui s'active — les étapes antérieures remplacent les étapes ultérieures.

---

**Étape 1 — Déclencheurs automatiques (toujours escalade indépendamment de la valeur de la transaction ou de l'ancienneté du relecteur)**

Les termes suivants nécessitent une escalade au directeur juridique ou au partenaire principal indépendamment de la valeur du contrat ou de l'ancienneté du relecteur :

- Clause de responsabilité illimitée (sous quelque forme que ce soit)
- Attribution de la PI à la contrepartie, y compris les clauses de travail pour embauche couvrant la PI du produit principal
- Licence exclusive perpétuelle à la technologie ou aux données de l'organisation
- Tout terme sur la liste documentée « jamais accepter » de l'organisation (du profil de stratégie)
- Contact confirmé de sanctions contre la contrepartie

Si un déclencheur automatique s'active → définir `Escalade requise : OUI` et `Escalade vers : Directeur juridique / Partenaire principal`.

---

**Étape 2 — Vérification d'autorité en dollars**

La valeur du contrat dépasse-t-elle la limite d'autorité du relecteur ?

Seuils par défaut (remplacez par le profil d'organisation si disponible) :

```
Assistant juridique :  <50 000 $, termes standards uniquement
Counsel :    <500 000 $, termes standards + alternatives documentées
Directeur juridique :         illimité, tous les termes y compris non-standards
```

Si la valeur du contrat dépasse l'autorité du relecteur → escalade au prochain niveau d'autorité.

---

**Étape 3 — Termes non-standards**

Un terme négocié quelconque sort-il des positions alternatives documentées dans la stratégie de l'organisation ?

Si oui → escalade au niveau d'autorité défini pour les termes non-standards dans la stratégie. Documentez quel terme et comment il s'écarte.

---

**Étape 4 — Silence de la Stratégie**

Un terme matériel apparaît-il que la stratégie n'aborde pas du tout ?

Si oui → présenter comme JAUNE. Ne procédez pas. Demandez à l'équipe de définir une position pour ce type de terme avant que ce contrat ne progresse. Les termes matériels non abordés ne sont pas sûrs d'approuver par défaut.

---

**Format de sortie :**

```
ÉVALUATION D'ESCALADE — [Nom du Contrat]
Contrepartie : [nom]
Valeur du contrat : [X] $
Relecteur : [rôle]

Déclencheurs automatiques :   [aucun / liste chaque déclencheur trouvé]
Autorité en dollars :     $[valeur du contrat] vs $[limite du relecteur] → [dans la limite / DÉPASSE]
Termes non-standards :   [aucun / liste chaque écart de la stratégie]
Lacunes de la stratégie :        [aucune / liste chaque terme matériel non abordé]

Escalade requise :  [OUI / NON]
Escalade vers :          [rôle et nom du profil org]
Canal :              [Slack / email]

---
Projet de message d'escalade :

Bonjour [nom],

Je révise [nom du contrat] avec [contrepartie]. J'ai besoin de votre approbation avant de procéder sur :

1. [Terme 1] — [ce qu'il dit] — [pourquoi il nécessite votre approbation]
2. [Terme 2] — [ce qu'il dit] — [pourquoi il nécessite votre approbation]

Valeur du contrat : $[X]. Contrepartie : [nom]. Échéance : [si connue, sinon « non spécifiée »].

Pouvez-vous revoir et conseiller ?
```

**Règle coût-bénéfice :** Le coût d'une escalade inutile (environ 30 secondes d'attention d'un relecteur senior) est toujours inférieur au coût de poursuivre avec des termes non-standards non approuvés. En cas de doute, signalez.

**Remarque :** Cette compétence rédige le message d'escalade. Elle ne l'envoie pas — le relecteur lit le projet, confirme l'exactitude et envoie.

## Exemple

**Entrée :** « Un contrat de fournisseur a une section NDA mutuelle, limitation de responsabilité plafonnée à 1× honoraires (notre position acceptable standard), mais inclut une clause attribuant toute la PI développée lors de l'engagement au fournisseur. Signalez de manière appropriée. »

**Sortie attendue :**

```
ÉVALUATION D'ESCALADE — Accord de Services de Fournisseur (Acme Corp)
Contrepartie : Acme Corp
Valeur du contrat : 120 000 $
Relecteur : Counsel

Déclencheurs automatiques :   ATTRIBUTION DE PI — La section 8.3 attribue tous les produits de travail et la PI développés lors de l'engagement au Fournisseur. C'est un déclencheur d'escalade automatique indépendamment de la taille de la transaction.
Autorité en dollars :     120 000 $ vs 500 000 $ (limite Counsel) → dans la limite
Termes non-standards :   L'attribution de PI est sur la liste de non-acceptation
Lacunes de la stratégie :        aucune

Escalade requise :  OUI
Escalade vers :          Directeur Juridique
Canal :              Slack (#legal-escalations)

---
Projet de message d'escalade :

Bonjour [nom du GC],

Je révise l'Accord de Services de Fournisseur avec Acme Corp (engagement de 120 000 $). J'ai besoin de votre approbation avant de procéder sur :

1. Section 8.3 — Attribution de PI — attribue tous les produits de travail et la PI développés lors de l'engagement à Acme Corp. Cela déclenche une escalade automatique selon notre stratégie (élément de la liste de non-acceptation).

Valeur du contrat : 120 000 $. Contrepartie : Acme Corp. Échéance : non spécifiée.

Pouvez-vous revoir et conseiller ?
```

---
