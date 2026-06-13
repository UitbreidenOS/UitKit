---
name: cash-flow-forecast
description: "Prévisions de flux de trésorerie 30-90 jours pour les petites entreprises : modéliser les revenus et dépenses, identifier les lacunes, la piste de masse salariale et les déclencheurs d'alerte précoce"
---

# Compétence Cash Flow Forecast

## Quand l'activer
- Vous n'êtes pas sûr d'avoir assez de trésorerie pour couvrir la masse salariale du mois prochain
- Planifier un achat majeur et avoir besoin de savoir si le timing fonctionne
- La saison creuse arrive et vous voulez planifier à l'avance
- Vous voulez une simple projection de trésorerie 30/60/90 jours
- Votre comptable a demandé une prévision de flux de trésorerie

## Quand ne PAS l'utiliser
- Soumissions formelles au prêteur — utilisez votre comptable pour cela
- Comptes de résultats auditées
- Projections multi-années pour les présentations des investisseurs — nécessite une modélisation professionnelle

## Instructions

### Prévision rapide de 30 jours

Décrivez simplement votre situation :

```
Aidez-moi à construire une prévision de flux de trésorerie de 30 jours.

Solde bancaire actuel : $[X]
Revenu attendu ce mois :
- [Facture/client] : $[montant], attendu [date]
- [Revenu récurrent] : $[montant], arrive [date]
- Autre : $[montant]

Dépenses fixes ce mois :
- Loyer : $[montant], dû [date]
- Masse salariale : $[montant], dû [date]
- Abonnements logiciels : ~$[montant]

Dépenses variables que j'attends :
- [Paiement du fournisseur] : $[montant]
- [Autre] : $[montant]

Aurai-je assez ? Quel est mon point le plus bas ?
```

### Vérification de la piste de masse salariale

```
J'ai $[X] dans mon compte professionnel.
Ma masse salariale mensuelle est $[Y] (payée le [Nth] de chaque mois).
Mon revenu mensuel moyen est $[Z] mais c'est variable.
Mes coûts mensuels fixes excluant la masse salariale sont $[W].

Combien de mois de piste ai-je ?
A quel solde bancaire devrais-je commencer à m'inquiéter ?
Quel est le minimum que je dois garder dans le compte comme tampon ?
```

### Repérer les lacunes de flux de trésorerie

```
Voici ma prévision pour les 3 prochains mois :

Mois 1 : Revenu attendu $[X], dépenses $[Y]
Mois 2 : Revenu attendu $[X], dépenses $[Y] (inclut assurance annuelle $Z)
Mois 3 : Revenu attendu $[X], dépenses $[Y]

Où sont les lacunes ? Que devrais-je faire avant qu'elles se produisent ?
```

### Planification de scénarios

```
Mon plus grand client ($8 000/mois) vient de me dire qu'il fait une pause de 3 mois.
Mon solde bancaire actuel est de 14 000 $.
Mes coûts mensuels fixes sont 6 200 $.

Guidez-moi à travers :
1. Combien de temps puis-je fonctionner sans remplacer ce revenu ?
2. Quelles dépenses puis-je retarder ou réduire ?
3. Quelles options de revenus devrais-je poursuivre en premier ?
```

### Planification d'entreprise saisonnière

```
Mon entreprise est saisonnière :
- Mois de pointe (juin–août) : ~25 000 $/mois de revenu
- Mois creux (novembre–février) : ~6 000 $/mois de revenu
- Coûts mensuels fixes : 8 000 $

Je suis actuellement en saison de pointe avec 22 000 $ en banque.
Combien dois-je mettre de côté chaque mois de pointe pour survivre à la saison creuse ?
```

### Signaux d'alerte précoce

Demandez à Claude de vous aider à mettre en place la surveillance :

```
Sur la base de mes finances, quels sont les signaux d'alerte précoce sur lesquels je dois
me concentrer qui indiquent qu'un problème de flux de trésorerie approche ?
Quels chiffres hebdomadaires/mensuels devrais-je vérifier ?
```

## Exemple

**Vous dites :**
```
Solde bancaire : 18 000 $
30 prochains jours :
- Retenue client : 5 000 $ arrive le 5
- Facture de projet : 3 200 $, le client paie généralement en 21 jours
- Incertain : nouvelle devis d'une valeur de 8 000 $ pourrait se fermer

Coûts fixes : Loyer 2 800 $, salaires 9 500 $, logiciel/outils 400 $
Variable : paiement du fournisseur 1 200 $ dû 15
```

**Claude répond :**
- Trésorerie confirmée : 23 000 $ (solde + retenue)
- Trésorerie potentielle : 34 200 $ (si facture paie à temps + nouvelle affaire se ferme)
- Pire cas à la fin du mois : +9 100 $ (si rien d'extra ne rentre)
- Drapeau de risque : la masse salariale tombe le 15 — le jour où le paiement du fournisseur est également dû. Confirmez que la facture de 3 200 $ sera compensée en premier.
- Recommandation : Poursuivez activement la facture de 3 200 $. Ne comptez pas sur la devis de 8 000 $ dans la planification pour l'instant.

---
