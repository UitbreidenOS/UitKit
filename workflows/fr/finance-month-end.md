# Workflow de clôture mensuelle finance

Un workflow de clôture reproductible pour les équipes FP&A et les DAF — de la réconciliation des données et de l'analyse des écarts au board pack et aux reportings investisseurs. Couvre l'intégralité du cycle de clôture mensuelle, s'étendant généralement du jour 1 au jour 15 du mois suivant.

---

## Vue d'ensemble

```
Jours 1-3 : Clôture des livres — collecte et réconciliation des données
Jours 4-5 : Comptes de gestion produits — compte de résultat, bilan, flux de trésorerie
Jours 6-8 : Analyse des écarts et commentaires de gestion
Jours 9-10 : Board pack assemblé et révisé
Jours 11-12 : Mises à jour investisseurs et reportings parties prenantes
Jours 13-15 : Re-prévision et plan du mois suivant
```

---

## Jours 1-3 : Clôture des livres

**Objectif :** Toutes les transactions du mois sont saisies, réconciliées, et la balance de vérification est propre.

### Étape 1 — Réconciliation des comptes

```
/gl-reconciler

Effectuer la réconciliation de fin de mois pour [MOIS].

Balance de vérification au [date] :
[Coller l'export de la balance de vérification depuis le système comptable]

Vérifier :
1. Trésorerie : le solde bancaire correspond-il au compte de trésorerie du GL ? Identifier les éléments en transit.
2. Comptes clients : des factures de plus de 60 jours ? Une provision est-elle nécessaire ?
3. Comptes fournisseurs : des charges à payer pour des services reçus mais non facturés ?
4. Charges constatées d'avance : une amortisation mensuelle non encore saisie ?
5. Passifs courus : masse salariale, avantages, honoraires consultants — tout est-il provisionné ?
6. Interentreprises : des soldes qui doivent s'annuler ?
7. Des transactions importantes ou inhabituelles nécessitant une explication ?

Résultat : liste de contrôle de réconciliation avec statut réussite/échec par compte.
Signaler tout élément nécessitant une écriture de journal avant la clôture.
```

### Étape 2 — Charges à payer et ajustements

```
/gl-reconciler

Saisir les charges à payer de fin de mois pour [MOIS].

Charges à payer récurrentes standard :
- Masse salariale (X jours dans le prochain cycle de paie à $[X]/jour)
- Avantages ([X]% de la masse salariale brute)
- Abonnements SaaS (fournisseur : [liste] — portion mensuelle si prépaiement annuel)
- Honoraires consultants (fournisseur : [liste] — [jours à $X/jour])
- Loyer (portion mensuelle si paiement trimestriel)
- Amortissement (tableau d'actifs immobilisés : [D&A mensuel total])

Charges à payer ponctuelles ce mois :
[Lister les charges à payer supplémentaires]

Calculer les écritures de journal nécessaires. Marquer toutes les entrées [VÉRIFIER] avant de les saisir.
```

### Étape 3 — Reconnaissance des revenus

```
/gl-reconciler

Revue de la reconnaissance des revenus pour [MOIS].

Modèle économique : [SaaS / services / produit / mixte]

Pour le SaaS :
- Solde des revenus différés : $[X]
- Reconnaissance mensuelle du différé : $[X] (= valeur du contrat annuel / 12)
- Nouveau MRR ajouté ce mois : $[X]
- MRR churné : $[X]
- Des revenus ponctuels de services professionnels à reconnaître ?

Confirmer : les revenus reconnus correspondent à la cascade ARR.
Signaler : tout contrat dont le calendrier de reconnaissance des revenus est incertain. [VÉRIFIER] avec le DAF.
```

---

## Jours 4-5 : Comptes de gestion

**Objectif :** Un compte de résultat, un bilan et un tableau de flux de trésorerie propres et précis à usage des dirigeants.

### Étape 4 — Produire le compte de résultat de gestion

```
/budget-vs-actual

Produire le compte de résultat de gestion pour [MOIS].

Données brutes (depuis l'export du système comptable) :
[Coller les données du compte de résultat]

Formater en comptes de gestion :
- Chiffre d'affaires (avec comparaison MoM)
- Coût des revenus → Marge brute → Taux de marge brute %
- Charges d'exploitation par grande catégorie (S&M, R&D, G&A, Autre)
- EBITDA / Perte d'exploitation
- Taux de consommation net (pour les entreprises en phase de croissance)

Ajouter des colonnes de comparaison :
- vs. Budget ($ et %)
- vs. Mois précédent ($ et %)
- vs. Année précédente ($ et %) [si disponible]

Marquer tous les écarts significatifs (>10 % ou >$[seuil]) pour commentaire.
[VÉRIFIER] toutes les données par rapport aux données sources avant distribution.
```

### Étape 5 — Tableau de flux de trésorerie

```
/3-statement-model

Produire le tableau de flux de trésorerie mensuel.

Solde de trésorerie d'ouverture : $[X]
Solde de trésorerie de clôture selon la banque : $[X]

Activités opérationnelles :
- Encaissements clients : $[X]
- Paiements fournisseurs : $[X]
- Masse salariale : $[X]
- Autres opérations : $[X]

Activités d'investissement :
- Acquisitions d'équipements : $[X]
- Logiciels/PI : $[X]

Activités de financement :
- Produits/remboursements d'emprunts : $[X]
- Capitaux reçus : $[X]

Réconcilier : Ouverture + flux de trésorerie nets = Clôture.
En cas d'échec de la réconciliation, identifier l'écart.
[VÉRIFIER] par rapport aux relevés bancaires.
```

### Étape 6 — Mise à jour du tableau de bord KPI

```
/revenue-operations

Mettre à jour le tableau de bord KPI pour [MOIS].

Métriques SaaS (coller les données réelles) :
- MRR d'ouverture : $[X]
- Nouveau MRR : $[X]
- MRR d'expansion : $[X]
- MRR churné : $[X]
- MRR de clôture : $[X]
- ARR : $[MRR de clôture × 12]

Calculer :
- Croissance MRR MoM : [%]
- Rétention brute des revenus (GRR) : [(Ouverture - Churné) / Ouverture]
- Rétention nette des revenus (NRR) : [(Ouverture + Expansion - Churné) / Ouverture]
- Taux de churn (par nombre) : [clients churnés / clients en ouverture]
- Multiple de consommation : [consommation nette / nouvel ARR net]

Signaler tout KPI [À RISQUE] vs. la cible.
[VÉRIFIER] tous les calculs par rapport aux données CRM et du système de facturation.
```

---

## Jours 6-8 : Analyse des écarts et commentaires

**Objectif :** Chaque écart significatif a une explication précise et honnête. Pas de commentaire générique.

### Étape 7 — Analyse approfondie des écarts de revenus

```
/budget-vs-actual

Analyse des écarts de revenus pour [MOIS].

Budget : $[X] | Réel : $[X] | Écart : $[X] ([X]%)

Décomposer l'écart :
1. Effet volume : plus ou moins de clients / contrats que prévu au budget
2. Effet prix : taille moyenne des transactions supérieure ou inférieure aux hypothèses
3. Effet mix : mix produit/segment différent de celui prévu au budget
4. Effet calendrier : des transactions budgétées ce mois mais conclues plus tôt/tard ?

Quantifier chaque facteur :
- "Le manque de revenus de $[X]K se décompose en : [X]K volume, [X]K calendrier, [X]K mix"

Implication prévisionnelle :
- Cet écart est-il structurel (se répétera) ou temporel (s'inversera le mois prochain) ?
- Nécessite-t-il une re-prévision, ou est-il dans une plage acceptable ?
```

### Étape 8 — Analyse approfondie des écarts de charges

```
/budget-vs-actual

Analyse des écarts de charges pour [MOIS].

Pour chaque ligne de charges avec >10 % ou >$[X]K d'écart :

S&M : Budget $[X] | Réel $[X] | Écart $[X]
Contexte : [ex. : 2 postes ouverts, conférence annulée, dépenses publicitaires avancées]

R&D : Budget $[X] | Réel $[X] | Écart $[X]
Contexte : [ex. : prestataire retardé, coûts AWS supérieurs aux prévisions]

G&A : Budget $[X] | Réel $[X] | Écart $[X]
Contexte : [ex. : honoraires juridiques plus élevés — due diligence nouveau fournisseur, non récurrent]

Pour chaque écart :
- Cause première : [précise, pas vague]
- Ponctuel vs. récurrent : [classifier]
- Action : [si récurrent et défavorable — que fait-on ?]
- Implication prévisionnelle : [cela persiste-t-il le mois prochain ?]

[VÉRIFIER] toutes les explications d'écarts par rapport aux factures réelles ou aux registres de paie lorsque disponibles.
```

### Étape 9 — Rédiger le commentaire de gestion

```
/budget-vs-actual

Rédiger le commentaire de gestion pour [MOIS].

Ce commentaire accompagne les comptes de gestion distribués au PDG et au conseil.

Structure :
1. Titre (1 phrase) : dans les clous / en avance / en retard — et de combien globalement
2. Commentaire sur les revenus (3-4 phrases) : ce qui s'est passé et pourquoi
3. Commentaire sur la marge brute : tendance, anomalies éventuelles dans le coût des ventes
4. Commentaire sur les charges : points saillants — où on a sous-dépensé/sur-dépensé et pourquoi
5. Trésorerie et piste : position actuelle et ce qui pilote la consommation
6. Signal de re-prévision : ce mois change-t-il la vision de l'année entière ?

Ton : Direct. Factuel. Sans habillage. S'il y a de mauvaises nouvelles, commencez par elles.
Longueur : 200-350 mots.

[VÉRIFIER] tous les chiffres dans le commentaire par rapport aux comptes de gestion.
```

---

## Jours 9-10 : Board Pack

**Objectif :** Un board pack complet et révisé, prêt à distribuer 48-72 heures avant la réunion du conseil.

### Étape 10 — Assembler le board pack

```
/board-pack-builder

Construire le board pack mensuel pour [MOIS].

[Fournir les données pour les 7 sections sur la base du travail de clôture effectué aux étapes 1-9]

Contexte de l'entreprise : [stade, secteur, composition du conseil]
Comptes de gestion : [coller le résumé du compte de résultat de l'étape 4]
Tableau de bord KPI : [coller de l'étape 6]
Résumé des écarts : [coller des étapes 7-8]
Commentaire de gestion : [coller de l'étape 9]
Mise à jour des initiatives stratégiques : [décrire l'avancement de chaque initiative approuvée par le conseil]
Mise à jour du registre des risques : [nouveaux risques ou risques modifiés vs. le mois dernier]
Demandes au conseil : [décisions spécifiques, introductions, approbations nécessaires]
```

### Étape 11 — Révision du board pack

```
/board-pack-builder

Réviser ce brouillon de board pack avant distribution :
[Coller le board pack complet]

Vérifier :
1. Tous les chiffres sont-ils cohérents entre les sections ?
2. Le récit est-il cohérent — le résumé exécutif correspond-il aux sections détaillées ?
3. Les demandes au conseil sont-elles spécifiques et actionnables ?
4. Y a-t-il des écarts expliqués dans les données financières mais non signalés dans le résumé exécutif ?
5. Y a-t-il quelque chose qu'un membre du conseil posera comme question qui n'est pas traitée ?
6. Ton : est-il candide, ou semble-t-il habiller les résultats négatifs ?

Résultat : liste des modifications à apporter avant la distribution.
```

### Étape 12 — Distribuer

- Exporter en PDF
- Distribuer via un portail conseil sécurisé (Diligent, Boardvantage, ou e-mail avec mot de passe) — au minimum 48 heures avant la réunion
- Confirmer la réception de tous les membres du conseil
- Préparer un résumé verbal de 15 minutes pour l'ouverture de la réunion

---

## Jours 11-12 : Reporting investisseurs et parties prenantes

**Objectif :** Les investisseurs et les parties prenantes clés reçoivent des informations précises et en temps voulu.

### Étape 13 — Mise à jour investisseurs

```
/cfo-advisor

Rédiger la mise à jour mensuelle investisseurs pour [MOIS].

Audience : [VC / business angel / stratégique — brève description de qui ils sont]
Format : [e-mail / pièce jointe PDF / publication sur portail investisseurs]
Nombre de mots cible : 300-500 mots (les investisseurs en lisent beaucoup)

Inclure :
- Métriques phares : [ARR, croissance, consommation, piste — 4 chiffres max]
- 3 victoires : [précises — pas vagues]
- 2-3 défis : [honnêtes, avec ce qui est fait]
- Pipeline/demandes : [introductions, conseils ou approbations nécessaires]
- Une décision ou étape clé dans les 30 prochains jours

Ton : Confiant. Transparent. Sans habillage. Les investisseurs qui vous ont financé sont déjà de votre côté.
Ne dissimulez pas les mauvaises nouvelles.
```

### Étape 14 — Rapports aux parties prenantes internes

```
Pour chaque responsable de fonction (Ventes, Produit, Succès client, Ingénierie) :

/budget-vs-actual

Générer le rapport budgétaire [fonction] pour [MOIS].

[Section pertinente du compte de résultat pour cette fonction]

Inclure :
- Budget vs. réel pour leurs coûts contrôlables
- KPI pertinents pour leur fonction
- Ce qui est dans les clous / à risque
- Les décisions qu'ils doivent prendre sur la base de ces données

Limiter à 1 page — les responsables de fonction ont besoin des données pertinentes, pas du board pack complet.
```

---

## Jours 13-15 : Re-prévision et mois suivant

**Objectif :** Mettre à jour la prévision annuelle sur la base des résultats réels. Planifier le mois suivant.

### Étape 15 — Re-prévision

```
/budget-vs-actual

Effectuer la re-prévision annuelle suite à la clôture de [MOIS].

Budget annuel initial : [coller ou décrire]
Réels YTD ([X] mois) : [coller]

Changements d'hypothèses clés :
- Revenus : [ce qui a changé vs. les hypothèses budgétaires et pourquoi]
- Effectifs : [recrutements réels vs. planifiés — changements de calendrier]
- Éléments ponctuels : [tout ce qui n'était pas dans le budget initial]
- Conditions de marché : [tout changement dans les hypothèses de croissance]

Produire :
- Prévision annuelle révisée du compte de résultat par trimestre
- Écart par rapport au budget initial ($ et %)
- 3 scénarios : base / optimiste / pessimiste
- Piste de trésorerie dans chaque scénario
- Niveau de confiance : qu'est-ce qui devrait être vrai pour chaque scénario ?

[VÉRIFIER] tous les résultats de re-prévision par rapport au modèle financier.
```

### Étape 16 — Planification du mois suivant

```
/commercial-forecaster

Fixer l'objectif de revenus et le besoin en pipeline pour [MOIS SUIVANT].

Cible annuelle re-prévue (de l'étape 15) : $[X] ARR
Réels YTD : $[X] ARR
Mois restants : [X]
Nouvel ARR mensuel moyen requis pour atteindre l'objectif annuel : $[X]

Capacité de l'équipe commerciale :
- Nombre d'AE : [X]
- Quota moyen par AE : $[X]/mois
- Pipeline actuel : $[X] à [X]% de taux de succès
- Couverture de pipeline requise (à [X]% de taux de succès) : $[X]

Questions :
1. Avons-nous suffisamment de pipeline pour atteindre le chiffre du mois prochain ?
2. Quels deals doivent se conclure pour tenir le plan ?
3. Quelle est la prévision ajustée au risque (pipeline × taux de succès par stade) ?
4. Sur quoi les ventes doivent-elles se concentrer : nouveaux logos / expansion / réactivation ?
```

### Étape 17 — Calendrier de clôture du mois suivant

```
Mettre en place le calendrier de clôture du mois suivant :

Cible de date de clôture : [date]
Étapes clés :
- Réconciliations bancaires complètes : [date]
- Date limite comptes fournisseurs : [date]
- Charge à payer masse salariale confirmée : [date]
- Reconnaissance des revenus révisée : [date]
- Balance de vérification au DAF pour révision : [date]
- Comptes de gestion distribués : [date]
- Brouillon board pack diffusé en interne : [date]
- Board pack distribué au conseil : [date — 48 heures avant la réunion]
- Réunion du conseil : [date]
- Mise à jour investisseurs envoyée : [date]

Attribuer les responsables pour chaque étape clé.
```

---

## Liste de contrôle maîtresse de fin de mois

```markdown
# Clôture de fin de mois : [MOIS ANNÉE]
Date cible de clôture : [date]

## Réconciliation (Jours 1-3)
- [ ] Balance de vérification exportée depuis le système comptable
- [ ] Trésorerie réconciliée avec le relevé bancaire
- [ ] Comptes clients réconciliés — provision pour tout solde >60 jours
- [ ] Comptes fournisseurs réconciliés — toutes les factures fournisseurs saisies
- [ ] Toutes les charges à payer saisies (masse salariale, avantages, fournisseurs, loyer, D&A)
- [ ] Reconnaissance des revenus révisée et confirmée
- [ ] Soldes interentreprises annulés

## Comptes de gestion (Jours 4-5)
- [ ] Compte de résultat produit avec comparaison budgétaire
- [ ] Tableau de flux de trésorerie réconcilié
- [ ] Bilan révisé pour éléments inhabituels
- [ ] Tableau de bord KPI mis à jour avec les réels
- [ ] Tous les chiffres marqués [VÉRIFIER] jusqu'à validation par le DAF

## Analyse des écarts (Jours 6-8)
- [ ] Écart de revenus décomposé (volume / prix / mix / calendrier)
- [ ] Tous les écarts de charges >10 % expliqués avec cause première
- [ ] Éléments ponctuels identifiés et signalés
- [ ] Commentaire de gestion rédigé (200-350 mots)
- [ ] Implications prévisionnelles notées pour chaque écart significatif

## Board Pack (Jours 9-10)
- [ ] Les 7 sections rédigées
- [ ] Chiffres cohérents entre toutes les sections
- [ ] Demandes au conseil précises et prêtes pour décision
- [ ] Révision interne complète
- [ ] Distribué au conseil (48+ heures avant la réunion)

## Reporting parties prenantes (Jours 11-12)
- [ ] Mise à jour investisseurs envoyée
- [ ] Rapports aux responsables de fonction distribués
- [ ] Tout problème critique escaladé au PDG immédiatement (pas mis de côté pour le board pack)

## Re-prévision (Jours 13-15)
- [ ] Prévision annuelle mise à jour avec les réels de [MOIS]
- [ ] 3 scénarios (base / optimiste / pessimiste) avec piste de trésorerie
- [ ] Pipeline et objectif de revenus du mois suivant fixés
- [ ] Calendrier de clôture du mois suivant confirmé avec responsables
```

---
