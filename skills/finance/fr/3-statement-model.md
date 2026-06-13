---
name: 3-statement-model
description: "Modèle financier trois états : compte de résultat, bilan, tableau de flux de trésorerie — construire des modèles intégrés, lier les états, projeter les données financières et test de stress des hypothèses"
---

# Compétence Modèle 3 États

## Quand l'activer
- Construire un modèle financier qui intègre le compte de résultat, le bilan et le flux de trésorerie
- Lier les états financiers pour que les changements se propagent automatiquement
- Projeter les données financières 3-5 ans pour la planification ou la levée de fonds
- Construire un modèle de fonds de roulement et de flux de trésorerie
- Test de stress des hypothèses financières (scénarios haussier/baissier/de base)

## Quand ne pas l'utiliser
- Évaluation DCF — utiliser la compétence dcf-model (qui s'appuie sur celle-ci)
- Résumé financier de deck pitch — utiliser la compétence pitch-deck
- Comptabilité mensuelle ou rapprochement — utiliser la compétence quickbooks-workflow
- Projections de chiffre d'affaires simples sans bilan complet — un modèle plus simple suffit

## Instructions

### Architecture du modèle

```
Construire un modèle financier 3 états pour [entreprise].

Type d'entreprise : [SaaS / commerce électronique / services / fabrication]
Période : [projection 3 ans / 5 ans]
Données historiques disponibles : [X ans de réalisés ou aucune]
Objectif : [levée de fonds / rapports au conseil / planification interne / M&A]

Structure du modèle :

ONGLET 1 — Hypothèses (toutes les entrées ici, rien codé en dur dans les formules) :
  Moteurs de chiffre d'affaires : [taux de croissance / volume unitaire / prix par unité / nombre de clients]
  Moteurs de coûts : [% COGS, plan effectifs, dépenses marketing en % du chiffre d'affaires]
  Hypothèses du bilan : [DSO, DPO, jours d'inventaire, calendrier capex]
  Taux fiscal : [X%]

ONGLET 2 — Compte de Résultat (P&L) :
  Chiffre d'affaires
    Moins : Coût des marchandises vendues (COGS)
  = Profit brut
    Moins : Frais opérationnels
      Ventes et marketing
      Recherche et développement
      Général et administratif
  = EBITDA
    Moins : Amortissements et dépréciations
  = EBIT (Revenu d'exploitation)
    Moins : Charge d'intérêts
  = Revenu avant impôts (EBT)
    Moins : Provision fiscale
  = Revenu net

ONGLET 3 — Bilan :
  Actifs :
    Courants : Trésorerie, Créances clients, Inventaire, Charges payées d'avance
    Non-courants : Immobilisations corporelles (nettes de dépréciations), Actifs incorporels
  Passifs :
    Courants : Dettes fournisseurs, Frais à payer, Revenus différés
    Non-courants : Dettes à long terme
  Capitaux propres : Résultats accumulés, Capital versé
  VÉRIFICATION : Actifs = Passifs + Capitaux propres (doit être équilibré)

ONGLET 4 — Tableau de Flux de Trésorerie :
  Activités opérationnelles (méthode indirecte) :
    Revenu net
    + Amortissements et dépréciations
    ± Changements du fonds de roulement (créances clients, dettes, inventaire)
  = Flux de trésorerie d'exploitation
  
  Activités d'investissement :
    - Dépenses en capital
    ± Acquisitions / cessions
  = Flux de trésorerie d'investissement
  
  Activités de financement :
    + Émission / remboursement de dettes
    + Émission d'actions
    - Dividendes
  = Flux de trésorerie de financement
  
  Variation nette de la trésorerie = Opérationnel + Investissement + Financement
  Trésorerie finale = Trésorerie initiale + Variation nette (doit correspondre à la trésorerie du bilan)

Construire cette structure de modèle avec mes entrées spécifiques.
```

### Liaisons d'états

```
Expliquez et configurez les liaisons critiques dans le modèle 3 états.

Les 3 états sont intégrés — un changement dans l'un se propage à travers les trois.

Liaisons clés à mettre en œuvre :

P&L → Bilan :
  Revenu net → Résultats accumulés (section capitaux propres)
  Formule : Résultats accumulés (fin) = Résultats accumulés (début) + Revenu net - Dividendes
  
  Amortissements (dépense P&L) → réduction des immobilisations (bilan)
  Formule : Immobilisations (fin) = Immobilisations (début) + Capex - Amortissements

P&L → Flux de trésorerie :
  Revenu net est le point de départ du flux de trésorerie d'exploitation
  Amortissements ajoutés (dépense non-trésorerie)
  
Bilan → Flux de trésorerie (changements du fonds de roulement) :
  Si créances clients augmentent → utilise de la trésorerie (flux d'exploitation diminue)
  Si dettes fournisseurs augmentent → fournit de la trésorerie (flux d'exploitation augmente)
  Formule : ΔAR = AR(fin) - AR(début) → soustraire du flux d'exploitation
  Formule : ΔAP = AP(fin) - AP(début) → ajouter au flux d'exploitation

Flux de trésorerie → Bilan :
  Trésorerie finale du flux de trésorerie = Trésorerie du bilan
  C'est la « vérification circulaire » — s'ils ne correspondent pas, le modèle est cassé

Liaison capex :
  Capex du flux de trésorerie → augmente les immobilisations du bilan
  Amortissements du P&L → réduit les immobilisations du bilan

Formule de vérification du solde :
  =SI(Actifs = Passifs + Capitaux propres, « ÉQUILIBRÉ », « VÉRIFIER L'ERREUR »)
  Ajouter ceci à chaque colonne d'année — si c'est jamais une erreur, trouver la rupture.

Mettre en œuvre ces liaisons pour mon modèle dans [Excel / Google Sheets].
```

### Modèle de fonds de roulement

```
Construire la section du fonds de roulement pour [entreprise].

Fonds de roulement = Actifs courants - Passifs courants
Moteurs clés : DSO (créances), DIO (inventaire), DPO (dettes)

Métriques du fonds de roulement :
DSO (Jours de ventes en suspens) :
  Formule : (Créances clients / Chiffre d'affaires) × 365
  Points de référence : SaaS : 30-45 jours / Services B2B : 45-60 jours / Entreprise : 60-90 jours
  Modèle : Créances clients = (DSO / 365) × Chiffre d'affaires

DIO (Jours d'inventaire en suspens) — fabrication/commerce électronique uniquement :
  Formule : (Inventaire / COGS) × 365
  Modèle : Inventaire = (DIO / 365) × COGS

DPO (Jours à payer en suspens) :
  Formule : (Dettes fournisseurs / COGS) × 365
  DPO plus élevé = meilleure conversion de trésorerie (payer les fournisseurs plus tard)
  Modèle : Dettes fournisseurs = (DPO / 365) × COGS

Cycle de conversion de trésorerie = DSO + DIO - DPO
  Positif = trésorerie bloquée dans les opérations (nécessite du financement du fonds de roulement)
  Négatif = les fournisseurs financent vos opérations (style Amazon, cycle de conversion négatif)

Changement du fonds de roulement (pour le tableau de flux de trésorerie) :
  ΔFonds de roulement = FR(fin) - FR(début)
  Augmentation du FR = sortie de trésorerie (utilise de la trésorerie)
  Diminution du FR = entrée de trésorerie (fournit de la trésorerie)

Construire le calendrier du fonds de roulement avec mes entrées du secteur.
```

### Analyse de scénario

```
Construire l'analyse de scénario pour [modèle financier].

Hypothèses de base : [modèle actuel]
Scénarios à modéliser : [haussier / base / baissier] ou [haut / bas / stress]

Principes de conception de scénario :
- Changer 1-3 hypothèses clés par scénario (pas tout)
- Ancrer à des événements réels : « cas baissier = récession + 20% de pression tarifaire »
- Chaque scénario doit être cohérent en interne (pas seulement couper le chiffre d'affaires)

Pour une entreprise SaaS :
Cas haussier : croissance de 40 % YoY, NRR de 120 %, CAC stable
  → Chiffre d'affaires : $Xm (haussier) vs $Xm (base)

Cas de base : croissance de 25 % YoY, NRR de 110 %
  → Chiffre d'affaires : $Xm

Cas baissier : croissance de 15 % YoY, NRR de 100 %, CAC augmente 20%
  → Chiffre d'affaires : $Xm, seuil de rentabilité de trésorerie retardé de X mois

Test de stress : 0 % de croissance pendant 12 mois (choc de type COVID)
  → Combien de mois de piste au brûlage actuel ?
  → Quelles réductions d'effectifs sont nécessaires pour survivre 18 mois ?

Structure de modèle utilisant le sélecteur de scénario INDEX/CORRESPONDANCE :
  Cellule A1 : Sélecteur de scénario [Haussier / Base / Baissier]
  Formule de chiffre d'affaires : =INDEX(table_scénario, MATCH(A1, noms_scénario, 0), MATCH(année, ligne_année, 0))
  
Ou utilisez des plages nommées dans des onglets de scénario séparés et liez à l'onglet de sortie.

Construire la structure d'analyse de scénario pour mon modèle.
```

## Exemple

**Utilisateur :** Je construis un modèle 3 ans pour une entreprise SaaS B2B. Année 1 ARR : $800K, croissance à 80% YoY. Marge brute : 72%. Burn : $200K/mois. Comment je configure le P&L ?

**Structure P&L de Claude :**

```
                    Année 1     Année 2     Année 3
Chiffre d'affaires (ARR)  $800K      $1,440K     $2,592K     [+80% chaque année]
  MRR moyen      $667K      $1,200K     $2,160K     [ARR ÷ 12, simplifié]

Chiffre d'affaires        $800K      $1,440K     $2,592K

COGS
  Infrastructure         $96K       $158K       $259K       [12% du chiffre d'affaires]
  Service client         $128K      $202K       $311K       [16% du chiffre d'affaires]
Total COGS               $224K      $360K       $570K       [28% du chiffre d'affaires]

Profit brut              $576K      $1,080K     $2,022K     [marge brute 72%]

Frais opérationnels
  Ventes et marketing    $600K      $900K       $1,200K     [déclinant en % du chiffre d'affaires]
  R&D                    $480K      $600K       $720K       [basé sur les effectifs]
  G&A                    $240K      $288K       $346K       [croissance de 30%, plus lente]
Total frais opérationnels $1,320K    $1,788K     $2,266K

EBITDA                   ($744K)    ($708K)     ($244K)     [approche du seuil de rentabilité Année 3]

Brûlage mensuel implicite : $62K/mois (Année 1), $59K/mois (Année 2), $20K/mois (Année 3)
Épuisement de la trésorerie au brûlage actuel : [calculer en fonction du solde de trésorerie actuel]

Observations clés :
- Vous atteindrez le seuil de rentabilité EBITDA entre l'année 3 et l'année 4 à ces taux de croissance
- Les dépenses en ventes et marketing sont votre plus grand levier — modéliser les scénarios à 50% et 75% du chiffre d'affaires
- Construire l'onglet effectifs → conduit R&D et G&A plus précisément que % du chiffre d'affaires
```

---
