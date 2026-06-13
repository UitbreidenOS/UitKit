---
name: comps-analysis
description: "Analyse de comparables : bâtir un univers de sociétés comparables, tableau EV/EBITDA et P/E, appliquer à la cible, valuation benchmark"
---

# Compétence Analyse de Comparables

## Quand activer

- Valoriser une entreprise à partir de multiples de marché (comparables boursiers)
- Benchmarker une valorisation par rapport à des transactions M&A récentes (comparables transactionnels)
- Construire le "terrain de football" de fourchettes de valorisation pour un pitch ou une analyse
- Dépister les actions sous-évaluées ou surévaluées par rapport à leurs pairs

## Quand NE PAS utiliser

- Quand l'univers de comparables est trop petit (< 4 entreprises) — le DCF est plus fiable
- Entreprises sans revenus ou en phase initiale — les multiples n'ont pas de sens
- Opinions d'équité formelles — nécessitent un professionnel de la valorisation agréé

## ⚠️ Important

Tous les résultats d'analyse de comparables doivent porter un `[VERIFY]` avant utilisation. La sélection et l'ajustement des multiples sont basés sur le jugement — toujours documenter explicitement pourquoi chaque comparable a été inclus ou exclu.

## Instructions

### Étape 1 — Construire l'univers de comparables

```
Construire un univers de sociétés comparables pour [entreprise cible].

Description de la cible :
- Activité : [ce que l'entreprise fait]
- Chiffre d'affaires : $[X]M, marge EBITDA : [X]%
- Géographie : [marchés primaires]
- Taux de croissance : [X]% YoY

Dépister les comparables en utilisant ces critères (commencer large, puis affiner) :
1. Même industrie/sous-secteur (code SIC ou secteur GICS)
2. Taille similaire : chiffre d'affaires dans la fourchette 0,5x à 2x de la cible
3. Modèle commercial similaire (SaaS vs. on-premise ; B2B vs. B2C)
4. Profil de croissance similaire (haute croissance vs. mature)
5. Même géographie ou dynamiques de marché comparables

Exclure :
- Entreprises en processus M&A (multiples distordus)
- Conglomérats avec mix commercial différent
- Entreprises avec EBITDA négatif (sauf si la cible aussi)

Lister 6-10 sociétés comparables avec justification inclusion/exclusion.
[VERIFY] chaque inclusion est défendable auprès d'un CFO ou comité d'investissement.
```

### Étape 2 — Tableau des multiples

```
Pour chaque entreprise comparable, collecter :
- Valeur d'Entreprise (VE) = Capitalisation boursière + Endettement net
- Chiffre d'affaires (LTM et NTM)
- EBITDA (LTM et NTM)
- Résultat net / BPA (pour P/E)
- Taux de croissance du chiffre d'affaires

Calculer :
- VE / Chiffre d'affaires (LTM et NTM)
- VE / EBITDA (LTM et NTM)
- P/E (LTM et NTM)

Puis résumer :
- Moyenne, médiane, 25e percentile, 75e percentile pour chaque multiple
- Signaler les valeurs aberrantes (> 2 écarts-types de la moyenne)
- Noter quels comparables sont les plus similaires à la cible

[VERIFY] toutes les données de marché par rapport à une source en direct (Bloomberg, FactSet, ou dossiers de l'entreprise).
```

### Étape 3 — Appliquer à la cible

```
Appliquer les multiples de comparables à l'entreprise cible :

Métriques de la cible : Chiffre d'affaires $[X]M, EBITDA $[Y]M (LTM)

Fourchettes de VE implicites :
- En utilisant le ratio médian EV/Chiffre d'affaires ([X]x) : VE = $[X]M × [X]x = $[résultat]M
- En utilisant le ratio médian EV/EBITDA ([X]x) : VE = $[Y]M × [X]x = $[résultat]M

Valeur des capitaux propres implicite :
- Déduire l'endettement net : VE - Endettement net = Valeur capitaux propres
- Par action : Valeur capitaux propres / Actions en circulation

[VERIFY] valorisation implicite par rapport au DCF et tout benchmark transactionnel récent.
```

### Étape 4 — Comparables transactionnels (Précédents M&A)

```
Pour les transactions M&A récentes dans le même secteur (dernières 3-5 années) :

Rechercher les transactions où :
- La cible est dans [secteur/industrie]
- Taille de la transaction : $[X]M à $[Y]M VE
- Acquéreur stratégique ou sponsor financier

Pour chaque transaction, collecter :
- Date d'annonce
- Acquéreur et cible
- Valeur de la transaction (VE)
- VE/Chiffre d'affaires et VE/EBITDA à l'annonce
- Logique de la transaction (synergies stratégiques, sponsor financier, détresse)
- Prime de contrôle payée par rapport au cours de bourse (si cible publique)

Les multiples transactionnels sont généralement à une prime de 20-40% sur les comparables boursiers
(la "prime de contrôle"). Appliquer ceci pour obtenir une valorisation "changement de contrôle".

[VERIFY] chaque transaction est vraiment comparable (pas en détresse, mix commercial similaire).
```

### Terrain de football (résumé de valorisation)

```
Consolider toutes les méthodologies de valorisation en une fourchette résumée :

                     Bas      Milieu   Haut
DCF :                $18,5    $21,8    $27,4   ← cas de base
Comparables boursiers : $17,2  $20,3    $24,8
Comparables transactionnels: $22,0  $26,1  $31,5  ← généralement plus élevé (prime de contrôle)
Fourchette 52 semaines : $14,2  --     $23,5  ← référence marché

Cours actuel de l'action : $19,81 → situé près du milieu de fourchette toutes méthodologies

[VERIFY] toutes les entrées avant présentation au comité d'investissement ou client.
```

## Exemple

**Utilisateur :** Construire les comparables boursiers pour une entreprise B2B SaaS ($80M ARR, 110% NRR, 70% marge brute).

**Univers de comparables attendu :** 6-8 entreprises B2B SaaS de milieu de marché à l'échelle ARR et profil de croissance similaires. Tableau de multiples avec EV/ARR (LTM + NTM), EV/Profit brut, P/E NTM le cas échéant. Fourchette de valorisation implicite. Note sur la prime que les comparables méritent étant donné le NRR de 110%.

---
