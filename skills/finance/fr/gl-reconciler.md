---
name: gl-reconciler
description: "Rapprochement du grand livre : procédures de rapprochement de comptes, examen des écritures de journal, liste de contrôle de clôture de période, analyse des écarts et éliminations interentreprises — pour les équipes de finance et les administrateurs de fonds"
---

# Compétence GL Rapprocheur

## Quand l'activer
- Réaliser des procédures de clôture à la fin du mois ou du trimestre
- Rapprocher les comptes du bilan (trésorerie, créances clients, dettes fournisseurs, immobilisations, régularisations)
- Examiner les écritures de journal pour leur exactitude et complétude
- Enquêter sur les écarts inexpliqués entre les sous-registres et le grand livre
- Construire une liste de contrôle de clôture de période pour l'équipe de finance
- Éliminations interentreprises pour la consolidation de comptes

## Quand ne pas l'utiliser
- Préparation ou dépôt de taxes — compétence spécialisée en matière fiscale requise
- Travaux d'audit — les règles d'indépendance des auditeurs s'appliquent; c'est un outil de gestion
- Traitement des transactions en temps réel — c'est une compétence de rapprochement et d'examen
- Remplacer un comptable qualifié pour les retraitements importants

## Instructions

### Liste de contrôle de clôture mensuelle

```
Construire une liste de contrôle de clôture mensuelle pour [entreprise/entité].

Type d'entité : [startup / PME / fonds / filiale corporate]
Système comptable : [QuickBooks / Xero / NetSuite / Sage / Excel]
Délai cible de clôture : [X jours ouvrables après la fin du mois]
Équipe : [comptable solo / petite équipe / équipe finance avec contrôleur]
Comptes clés : [énumérer les comptes importants — trésorerie, créances clients, dettes fournisseurs, paie, revenus différés, etc.]

Liste de contrôle de clôture mensuelle :

JOUR 1-2 (après la fin du mois) :
□ Confirmer que toutes les transactions du mois sont enregistrées
□ Télécharger et rapprocher les relevés bancaires (tous les comptes)
□ Traiter les relevés de cartes de crédit et la codification
□ Confirmer que les entrées de paie sont enregistrées correctement

JOUR 2-3 :
□ Rapprocher le sous-registre des créances clients au grand livre
   - Le rapport de vieillissement correspond au solde des créances?
   - Trésorerie non appliquée apurée?
□ Rapprocher le sous-registre des dettes fournisseurs au grand livre
   - Le vieillissement des dettes correspond au solde des dettes?
   - Dettes dues non facturées enregistrées?
□ Roulement des immobilisations — acquisitions, cessions, amortissement enregistrés?

JOUR 3-4 :
□ Examiner et enregistrer les régularisations :
   □ Régularisation de paie (jours travaillés, non encore payés)
   □ Amortissement des charges payées d'avance
   □ Reconnaissance des revenus différés (SaaS : au prorata sur la période du contrat)
   □ Régularisation d'intérêts (si dette en cours)
   □ Créances non facturées (services rendus, facture non encore envoyée)
□ Éliminations interentreprises (si consolidation)

JOUR 4-5 :
□ Examen de la balance de vérification — y a-t-il des soldes inhabituels?
□ Analyse des flux du compte de résultat — les écarts importants par rapport au mois précédent sont-ils expliqués?
□ Rapprochement du bilan — tous les comptes sont-ils rapprochés?
□ Examen et approbation du contrôleur
□ États financiers préparés et distribués

CONTRÔLE D'APPROBATION :
Avant de finaliser, confirmer : [APPROBATION HUMAINE REQUISE]
Le contrôleur / CFO doit approuver avant de verrouiller la période.

Générer une liste de contrôle de clôture pour mon type d'entité et mon système comptable.
```

### Modèle de rapprochement de compte

```
Rapprocher [nom du compte] pour [période].

Compte : [par exemple Trésorerie, Créances clients, Charges à payer, Revenus différés]
Solde GL selon la balance de vérification : $[X]
Solde du sous-registre ou externe : $[X]
Éléments de rapprochement (différences) : [décrire ou inconnu]

Format de rapprochement :

COMPTE : [Nom]
PÉRIODE : [Mois/Année]
Préparateur : [Nom] | Date : [Date]
Examinateur : [Nom — EXAMEN HUMAIN REQUIS] | Date : ___

| | Montant |
|---|---|
| Solde GL selon la balance de vérification | $[X] |
| Moins : Éléments au GL non au sous-registre | ($[X]) |
| Plus : Éléments au sous-registre non au GL | $[X] |
| Solde GL ajusté | $[X] |
| Solde du sous-registre / Externe | $[X] |
| **Écart inexpliqué** | **$[X]** |

ÉLÉMENTS DE RAPPROCHEMENT :
| Article | Description | Montant | Statut |
|---|---|---|---|
| [1] | [par exemple Chèque en circulation #1234 — pas encore compensé] | ($[X]) | S'attend à être compensé [date] |
| [2] | [par exemple Dépôt en transit — enregistré [date], pas encore compensé] | $[X] | S'attend à être compensé [date] |
| [3] | [par exemple Frais bancaires non encore enregistrés au GL] | ($[X]) | Enregistrer une écriture |

APPROBATION :
□ Tous les éléments de rapprochement identifiés et expliqués
□ Écritures de journal préparées pour les éléments nécessitant un enregistrement
□ Aucun écart inexpliqué ne subsiste
□ APPROUVÉ PAR : ______________ DATE : ______________

Éléments de rapprochement courants par type de compte :
- Trésorerie : chèques en circulation, dépôts en transit, frais bancaires, articles RFS
- Créances clients : trésorerie non appliquée, avoirs non encore appliqués, différences de timing
- Dettes fournisseurs : régularisations non facturées, bons de commande non rapprochés, différences de timing
- Revenus différés : nouveaux contrats, revenus reconnus, résiliations anticipées
- Charges à payer : timing de paie, services non facturés

Générer le modèle de rapprochement pour mon compte spécifique.
```

### Examen des écritures de journal

```
Examinez ces écritures de journal pour leur exactitude et complétude.

Période : [mois/année]
Écritures à examiner : [décrire ou énumérer — peuvent être des descriptions textuelles d'écritures]
Norme comptable : [GAAP / IFRS / base de trésorerie]

Liste de contrôle d'examen des écritures de journal :

Pour chaque écriture :
□ Débits = Crédits (vérification d'équilibre de base)
□ Les codes de compte sont corrects pour la nature de la transaction
□ La description est suffisamment claire pour qu'un auditeur la comprenne sans demander
□ Documentation justificative jointe ou référencée
□ Période correcte — enregistrée au bon mois?
□ Approuvée par une personne autorisée (selon la matrice d'approbation)
□ Pour les écritures de contrepassation — la contrepassation existe-t-elle au cours de la période suivante?

Types d'écritures à haut risque à examiner attentivement :
🔴 Écritures enregistrées directement par le personnel financier senior (contournant le flux normal)
🔴 Écritures de montants ronds sans support détaillé
🔴 Écritures enregistrées le dernier jour de la période (risque de manipulation des résultats)
🔴 Écritures entre parties liées ou interentreprises
🔴 Écritures qui compensent une écriture antérieure inhabituelle
🔴 Ajustements importants avec la description « selon la direction » ou « selon le contrôleur »

Pour chaque écriture signalée :
Écriture : [numéro d'écriture / description]
Problème : [ce qui est inhabituel ou manquant]
Requis : [support supplémentaire / approbation / explication]
Statut : [Réglé / Escalade au contrôleur / Demande au préparateur]

Examinez mes écritures de journal et signalez celles qui nécessitent un examen supplémentaire.
[EXAMEN HUMAIN REQUIS avant le verrouillage de la période]
```

### Analyse des écarts

```
Expliquez l'écart dans [compte / ligne du compte de résultat] pour [période].

Compte : [nom]
Budget / Période antérieure : $[X]
Réel : $[X]
Écart : $[X] ([X]% défavorable / favorable)

Cadre d'analyse des écarts :

Étape 1 — Quantifier par facteur :
Écart de prix/taux : [même volume, prix ou coût unitaire différent]
Écart de volume : [même taux, quantité différente]
Écart de mix : [changement de composition — par exemple plus de clients d'entreprise par rapport aux PME]
Écart de timing : [article ponctuel ou décalage de période]

Étape 2 — Enquêter sur chaque facteur :
- Extraire les détails des transactions pour le compte
- Identifier les 3-5 principales transactions entraînant l'écart
- Classer chacune : récurrente / ponctuelle / erreur / timing

Étape 3 — Rédiger l'explication de l'écart :
Format pour les rapports de direction/conseil :
« [Compte] était $[X] par rapport au budget de $[X], un écart défavorable de $[X]. Facteurs principaux :
1. [Facteur 1] — impact de $[X] — [brève explication]
2. [Facteur 2] — impact de $[X] — [brève explication]
[X] de l'écart s'attend à [inverser/persister] dans [prochain mois/trimestre]. »

Signaux d'alerte dans l'analyse des écarts :
- Écart qui « s'annule » entre les comptes (erreurs de compensation)
- Écart dans la même direction de manière constante pendant 3+ mois (problème structurel, pas de timing)
- Écart sans explication commerciale claire (enquêter sur les erreurs ou la fraude)

[VÉRIFIER tous les chiffres avec les données source avant d'inclure dans les rapports de direction]
Analysez mon écart et rédigez l'explication de la direction.
```

### Rapprochement interentreprises

```
Rapprochez les comptes interentreprises pour [entité consolidée].

Entité mère : [nom]
Filiales : [énumérer]
Système comptable : [identique pour tous / systèmes distincts]
Période : [mois/année]
Transactions interentreprises cette période : [décrire — prêts, frais de gestion, services partagés, ventes]

Processus de rapprochement interentreprises :

Étape 1 — Mapper les soldes interentreprises :
Pour chaque paire d'entités, confirmer :
Entité A → Entité B : $[X] (Entité A : dette ou créance?)
Entité B → Entité A : $[X] (doit être le miroir de ce qui précède)

Étape 2 — Identifier les incompatibilités :
| Entité A | Entité B | Solde A | Solde B | Différence | Raison |
|---|---|---|---|---|---|
| Mère | Filiale 1 | $[X] | $[X] | $[X] | [timing / erreur / FX] |

Causes d'incompatibilité courantes :
- Timing : une entité a enregistré au cours de la période, l'autre pas encore
- FX : entités dans différentes devises — noter le taux utilisé
- Écriture manquante : un côté de la transaction non encore enregistré
- Montant contesté : les entités ne sont pas d'accord sur le montant de la transaction

Étape 3 — Écritures d'élimination :
Pour la consolidation, éliminer tous les soldes interentreprises :
Dr. Dette interentreprises $[X] (à la Mère)
Cr. Créance interentreprises $[X] (à la Filiale 1)
[EXAMEN HUMAIN REQUIS avant d'enregistrer les écritures d'élimination]

Étape 4 — Confirmer l'exhaustivité de l'élimination :
Après les éliminations, les créances et dettes interentreprises doivent s'annuler.
Résidu = erreur ou article non rapproché → enquêter avant la clôture.

Générer le modèle de rapprochement interentreprises pour ma structure d'entité.
```

## Exemple

**Utilisateur :** Notre clôture mensuelle prend 12 jours ouvrables, ce qui est trop lent. Équipe financière : 1 contrôleur, 2 comptables. Système comptable : NetSuite. Comment puis-je atteindre 5 jours?

**Plan d'accélération de la clôture de Claude :**

12 jours → 5 jours sont réalisables dans NetSuite avec des changements de processus. Le coupable est presque toujours les dépendances séquentielles qui pourraient fonctionner en parallèle, et les tâches manuelles qui pourraient être automatisées.

**Diagnostic — où vont les jours :**
- Jours 1-3 : attendre les relevés bancaires, les téléchargements de cartes de crédit, les rapports de paie (dépendances externes)
- Jours 4-6 : rapprochement manuel des créances clients et dettes fournisseurs (pas de correspondance automatique)
- Jours 7-9 : régularisations et écritures d'ajustement (goulot d'étranglement de l'examen séquentiel)
- Jours 10-12 : examen et cycles de révision par le contrôleur

**Plan de clôture en 5 jours :**

*Avant la fin du mois (2 derniers jours du mois) :*
- Pré-clôture : régulariser la paie, enregistrer l'amortissement, contrepasser les régularisations du mois précédent — tous automatisés dans NetSuite via des modèles d'écritures récurrentes
- Pré-rapprochement des créances clients : générer le rapport de vieillissement des créances quotidiennement, signaler les articles ouverts, ne pas attendre le jour 1

*Jour 1 :*
- Flux bancaires auto-importés dans NetSuite → les règles de correspondance automatique gèrent >80% des transactions
- Transactions de cartes de crédit importées via CSV — 1 comptable est responsable, 2-3 heures
- Écriture de paie enregistrée à partir de l'export du fournisseur de paie

*Jour 2 :*
- Rapprochement du sous-registre des créances clients (correspondance automatique dans NetSuite)
- Éléments ouverts des dettes fournisseurs apurés
- Amortissement des immobilisations confirmé (NetSuite calcule automatiquement)

*Jour 3 :*
- Toutes les régularisations enregistrées (utiliser les modèles d'écritures — identique chaque mois, il suffit de mettre à jour les montants)
- Éliminations interentreprises (le cas échéant)

*Jour 4 :*
- Examen du flux de la balance de vérification — le contrôleur examine les écarts >5% et >$5K
- Ajustements enregistrés

*Jour 5 :*
- Approbation finale du contrôleur
- États financiers distribués

**Enablers clés :**
1. Flux bancaire NetSuite + règles de correspondance automatique (réduit le jour 1 de 2 jours à 2 heures)
2. Modèles d'écritures récurrentes pour toutes les régularisations standard (pas de saisie manuelle = pas d'erreurs à corriger)
3. Pistes parallèles : le comptable des créances clients et le comptable des dettes fournisseurs travaillent simultanément le jour 2
4. Culture « correct dès la première fois » : le contrôleur examine pendant le mois, pas seulement à la clôture

---
