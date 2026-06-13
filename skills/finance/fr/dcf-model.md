---
name: dcf-model
description: "DCF valuation: gather inputs from filings, build WACC, project FCF, terminal value, sensitivity table — patterns from Anthropic financial-services"
---

> 🇫🇷 Version française. [English version](../dcf-model.md).

# Compétence Modèle DCF

## Quand activer
- Construction d'une valorisation par Discounted Cash Flow (DCF) pour une entreprise
- Calcul du WACC à partir du coût des capitaux propres et du coût de la dette
- Projection du free cash flow à partir des comptes de résultat et du bilan
- Analyse de sensibilité sur les hypothèses clés
- Révision ou audit d'un modèle DCF existant

## Quand NE PAS utiliser
- Valorisations rapides de back-of-envelope (utilisez plutôt les comparables EV/EBITDA)
- Entreprises micro-cap ou pré-revenus (DCF peu fiable sans cash flows stables)
- Soumissions formelles aux prêteurs ou aux tribunaux — ces dernières nécessitent un professionnel de valorisation agréé

## Avertissement important

Tous les résultats du modèle doivent comporter un marqueur `[VERIFY]` avant utilisation. Les résultats DCF sont très sensibles aux hypothèses — une variation de 0,5% du WACC peut modifier la valorisation de 20-30%. Exprimez toujours vos hypothèses explicitement et faites-les réviser par un analyste senior.

## Instructions

### Étape 1 — Collecte des données

```
Avant de construire le DCF, recueillez ces données :

COMPTE DE RÉSULTAT (3-5 dernières années + estimations des analystes) :
- Chiffre d'affaires
- Marge EBITDA
- D&A (dotations aux amortissements)
- Dépenses d'investissement (CapEx)
- Variations du besoin en fonds de roulement (BFR)
- Taux d'imposition

BILAN :
- Dette totale
- Trésorerie et équivalents
- Actions en circulation

DONNÉES DE MARCHÉ :
- Cours de bourse actuel
- Capitalisation boursière
- Bêta (5 ans mensuel, vs S&P 500)
- Taux sans risque (rendement des obligations du Trésor à 10 ans)
- Prime de risque des actions (ERP) (utilisez l'estimation actuelle de Damodaran : ~5,5%)
- Coût de la dette (taux d'intérêt moyen pondéré sur la dette existante)

Sources : déclarations 10-K/10-Q, Bloomberg, FactSet ou relations investisseurs de l'entreprise.
```

### Étape 2 — Calcul du WACC

```
Formule WACC :
WACC = (E/V × Ke) + (D/V × Kd × (1 - Taux d'imposition))

Où :
- E = valeur de marché des capitaux propres
- D = valeur de marché de la dette
- V = E + D (capital total)
- Ke = coût des capitaux propres (CAPM : Rf + β × ERP)
- Kd = coût de la dette avant impôt
- Taux d'imposition = taux marginal d'imposition

Exemple de calcul :
- Rf (sans risque) : 4,3% (T à 10 ans actuel)
- β (bêta) : 1,2
- ERP (prime de risque des actions) : 5,5%
- Ke = 4,3% + (1,2 × 5,5%) = 10,9%
- Kd (avant impôt) : 5,2%, Taux d'imposition : 25%
- Kd après impôt = 5,2% × (1 - 0,25) = 3,9%
- Structure du capital : 80% capitaux propres, 20% dette
- WACC = (0,80 × 10,9%) + (0,20 × 3,9%) = 9,5%

[VERIFY] le WACC avant de l'utiliser dans les projections.
```

### Étape 3 — Projection du Free Cash Flow (5 ans)

```
FCF = EBIT × (1 - Taux d'imposition) + D&A - CapEx - ΔBesoin en fonds de roulement

Années 1-3 : Cas de base (consensus des analystes ou guidance de la direction)
Années 4-5 : Déclin conservateur vers le taux de croissance à long terme

Exemple de pont FCF :
Chiffre d'affaires : 1 000M$ → 1 080M$ → 1 160M$ → 1 230M$ → 1 290M$
Marge EBIT : 18% → 18,5% → 19% → 19% → 19%
EBIT : 180M$ → 200M$ → 220M$ → 234M$ → 245M$
Impôts (25%) : 45M$ → 50M$ → 55M$ → 58,5M$ → 61M$
NOPAT : 135M$ → 150M$ → 165M$ → 175M$ → 184M$
+ D&A : 40M$ → 42M$ → 44M$ → 45M$ → 46M$
- CapEx : 60M$ → 65M$ → 70M$ → 72M$ → 74M$
- ΔBesoin en fonds de roulement : 8M$ → 9M$ → 10M$ → 10M$ → 10M$
= FCF : 107M$ → 118M$ → 129M$ → 138M$ → 146M$

[VERIFY] le FCF de chaque année avant de continuer.
```

### Étape 4 — Valeur terminale

```
Valeur terminale (Modèle de Gordon-Shapiro) :
VT = FCF_année5 × (1 + g) / (WACC - g)

Où g = taux de croissance à long terme (utilisez la croissance du PIB : 2-3% pour les entreprises matures)

Exemple :
VT = 146M$ × (1 + 2,5%) / (9,5% - 2,5%)
VT = 149,65M$ / 7%
VT = 2 138M$

[VERIFY] la valeur terminale représente un multiple raisonnable du FCF de l'année 5
(typiquement 15-25x pour les entreprises matures).
```

### Étape 5 — Actualisation à la valeur présente

```
VAN de chaque année de FCF :
Année 1 : 107M$ / (1,095)^1 = 97,7M$
Année 2 : 118M$ / (1,095)^2 = 98,4M$
Année 3 : 129M$ / (1,095)^3 = 98,1M$
Année 4 : 138M$ / (1,095)^4 = 95,6M$
Année 5 : 146M$ / (1,095)^5 = 92,2M$
VAN des FCFs : 482M$

VAN de la valeur terminale : 2 138M$ / (1,095)^5 = 1 352M$

Valeur d'entreprise (VE) : 482M$ + 1 352M$ = 1 834M$

Valeur des capitaux propres = VE - Dette nette (Dette - Trésorerie)
Dette nette = 300M$ - 150M$ = 150M$
Valeur des capitaux propres = 1 834M$ - 150M$ = 1 684M$

Par action = 1 684M$ / 85M actions = 19,81$

[VERIFY] le multiple EV/EBITDA implicite (devrait être dans la plage des comparables).
```

### Étape 6 — Table de sensibilité

```
Analyse de sensibilité WACC × taux de croissance terminal :

          g=1,5%  g=2,0%  g=2,5%  g=3,0%  g=3,5%
WACC=8,5% 22,4$   24,1$   26,2$   28,9$   32,6$
WACC=9,0% 20,8$   22,3$   24,0$   26,2$   29,2$
WACC=9,5% 19,4$   20,7$   21,8$*  23,4$   25,8$  ← cas de base
WACC=10,0% 18,1$  19,2$   20,4$   21,7$   23,5$
WACC=10,5% 17,0$  18,0$   19,0$   20,1$   21,6$

[VERIFY] le cours de bourse actuel par rapport à la fourchette de valorisation implicite.
```

## Exemple

**Utilisateur :** Construire un DCF pour une entreprise SaaS : 200M$ d'ARR, 75% de marge brute, croissance de 25% par an, cash flow positif.

**Résultat attendu :**
- Données collectées : ARR, churn, MRR d'expansion, marge brute, S&M en % du chiffre d'affaires
- Calcul du WACC : bêta ajusté pour le SaaS (typiquement 1,1-1,4), ERP plus élevé pour le stade de croissance
- Projection FCF : ARR × taux de rétention net des revenus, vérification de la règle des 40, trajectoire d'expansion de la marge FCF
- Valeur terminale : croissance terminale plus faible (2%) en raison de la maturation du marché
- Sensibilité : WACC 9-13% × croissance 1,5-3,5%
- Résultat clairement marqué `[VERIFY]` avec divulgation des hypothèses clés

---
