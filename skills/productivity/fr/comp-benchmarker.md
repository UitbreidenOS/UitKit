---
name: comp-benchmarker
description: "Benchmarking de rémunération : analyse des données de marché, définition des fourchettes salariales, directives sur les actions, et génération de lettres d'offre pour un recrutement compétitif"
---

# Compétence : Benchmarking de rémunération

## Quand activer
- Définir une fourchette salariale pour un nouveau poste avant de publier l'offre
- Un candidat a fait une contre-offre et vous avez besoin de savoir si elle est dans les normes du marché
- Construire ou mettre à jour vos grilles de rémunération à l'échelle de l'organisation
- Un employé actuel demande un ajustement au marché ou une revue salariale
- Générer une lettre d'offre formelle après qu'une offre verbale a été acceptée
- Concevoir un programme d'actions pour la première fois ou rafraîchir un existant
- Décider entre des structures de rémunération à forte composante cash ou à forte composante actions pour différents profils de candidats

## Quand NE PAS utiliser
- Benchmarking de rémunération pour les dirigeants (C-suite) — nécessite un consultant spécialisé en rémunération et un processus d'approbation par le conseil
- Benchmarking dans des secteurs très réglementés (finance, santé) où des réglementations salariales s'appliquent — vérifiez localement
- Revue de conformité légale sur l'équité salariale — faites appel à un avocat en droit du travail
- Benchmarking des avantages sociaux — sources de données et analyses différentes

## Instructions

### Constructeur de grilles salariales

```
Construis des grilles salariales pour [poste] dans mon entreprise.

Poste : [Intitulé du poste]
Niveaux : [liste — ex. N1 / N2 / N3 / Senior / Staff / Principal]
Lieu : [Ville, Pays / Télétravail — et si vous payez au marché local ou à un taux national unique]
Stade de l'entreprise : [Amorçage / Série A-B / Série C+ / Cotée / PME / Grande entreprise]
Secteur : [SaaS / Fintech / Santé / E-commerce / Agence / etc.]
Urgence du recrutement : [pouvez-vous attendre 90 jours pour la bonne personne, ou avez-vous besoin de quelqu'un en 30 jours ?]

Philosophie de rémunération (choisissez-en une ou décrivez la vôtre) :
- Leader du marché (75e percentile+) : nous payons au sommet du marché pour attirer les meilleurs talents
- Dans la moyenne du marché (50e percentile) : compétitif mais pas le payeur le plus élevé
- Cash en dessous du marché, actions au-dessus du marché : courant dans les startups en phase précoce
- Différenciation géographique : payer selon le coût de la vie local

Sources de données à référencer (par ordre de priorité) :
1. Levels.fyi — postes d'ingénierie logicielle et techniques
2. Radford / Mercer — enquêtes de rémunération enterprise (si vous y avez accès)
3. Glassdoor / LinkedIn Salary Insights — directionnel, auto-déclaré
4. Benchmarks entre pairs — que paient des entreprises similaires ? (demandez à votre VC, consultez AngelList)
5. Données d'offres des récentes embauches dans votre entreprise (ancre interne)

Structure de grille (pour chaque niveau) :

| Niveau | Fourchette de salaire de base | Bonus cible | Attribution d'actions | OTE (si applicable) |
|---|---|---|---|---|
| [N1] | [X] € - [Y] € | [X%] | [X actions / X% du pool] | [X] € |
| [N2] | [X] € - [Y] € | [X%] | [X actions / X% du pool] | [X] € |
[continuer]

Règles :
- Aucune grille ne doit se chevaucher de plus de 20% avec le niveau au-dessus/en dessous (prévient la compression)
- Point médian = ce qu'une personne performant pleinement à ce niveau devrait gagner
- Minimum = embauche pour quelqu'un qui débutant à ce niveau ou dans l'entreprise
- Maximum = là où quelqu'un plafonne avant la promotion au niveau suivant

Signaler les zones à risque de rémunération :
- Si [salaire d'un employé actuel] > maximum de la grille : problème de compression — à traiter de façon proactive
- Si la plupart des offres vont en haut de la grille : la grille est trop basse pour le marché actuel
- Si des candidats déclinent à cause de la rémunération : fournir des données, pas des anecdotes, à la direction

Construire la structure de grille complète pour [poste] avec le contexte de marché.
```

### Constructeur de package d'offre

```
Construis un package de rémunération pour ce candidat.

Poste : [Titre, niveau]
Candidat : [décrire — années d'expérience, rémunération actuelle, offres concurrentes si connues]
Lieu : [Ville, Pays]
Ma grille pour ce poste : [X € - Y € base]
Cible dans la grille : [bas / point médian / haut — et pourquoi]

Situation actuelle du candidat :
- Salaire de base actuel : [X] €
- Bonus actuel (attendu) : [X] €
- Actions actuelles (valeur non acquise) : [X] € (c'est ce que vous lui demandez de quitter)
- Offre concurrente : [entreprise, X € base, X € actions — si connu]
- Préavis : [X semaines]

Votre offre :

SALAIRE DE BASE : [X] €
Justification : [pourquoi ce chiffre — X% de prime sur l'actuel, Y percentile de la grille, etc.]

BONUS / VARIABLE :
- Type : [bonus annuel cible / commission / bonus ponctuel]
- Cible : [X] € à [X%] de la base sur cible
- Structure : [comment est-il mesuré et versé ?]

ACTIONS :
- Type : [options ISO / RSUs / SAFEs en phase précoce]
- Taille de l'attribution : [X actions / X € de valeur à la 409A actuelle / X% du dilué total]
- Acquisition : [standard : 4 ans, cliff d'1 an — noter si différent]
- Valeur estimée actuelle : [X] € (409A ou FMV)
- Note si coté : valeur actuelle / noter que la valeur peut baisser
- Dispositions de cliff et d'accélération (si applicable)

AVANTAGES :
- Santé : [100% / X% de la mutuelle prise en charge par l'entreprise, dentaire, vision]
- Retraite : [participation X% jusqu'à Y%]
- Congés : [X jours / illimité / flexible]
- Équipement : [budget de X € / équipement fourni par l'entreprise]
- Télétravail/flex : [décrire la politique]
- Autre : [budget formation, congé parental, politique de rafraîchissement des actions]

DATE DE DÉBUT : [date proposée, avec flexibilité pour le préavis]

EXPIRATION DE L'OFFRE : [donner 5-7 jours ouvrables — raisonnable, sans pression]

Résumé de la rémunération totale :
- Base annuelle : [X] €
- Bonus cible : [X] €
- Actions (estimation de la valeur annuelle) : [X] €
- Cash total cible : [X] €
- Rémunération totale incluant les actions : [X] €

Analyse de l'offre concurrente (si applicable) :
S'ils ont une offre concurrente chez [concurrent] :
[Comparez votre offre sur le cash, le potentiel des actions, le risque, la qualité du poste, la croissance — pas seulement les chiffres]

Générer le package d'offre complet et un récit comparatif pour la conversation avec le candidat.
```

### Directives sur les actions

```
Conçois des directives sur les actions pour [l'entreprise / le niveau de poste].

Type d'entreprise : [Pré-amorçage / Amorçage / Série A / Série B / Série C+]
Taille du pool d'options : [X% des actions entièrement diluées]
Valorisation actuelle : [X] € (ou prix 409A : [X €/action])

Benchmarks d'attribution d'actions par niveau et par stade :

PRÉ-AMORÇAGE / AMORÇAGE (10-20 premiers employés) :
| Niveau | Fourchette (% du dilué total) |
|---|---|
| VP / C-suite | 0,5% - 2,0% |
| IC senior / Directeur | 0,2% - 0,75% |
| IC intermédiaire | 0,05% - 0,25% |
| Début de carrière / Junior | 0,01% - 0,1% |

SÉRIE A-B (20-100 employés) :
| Niveau | Fourchette (% du dilué total) |
|---|---|
| VP / C-suite (nouvelle embauche) | 0,15% - 0,75% |
| Directeur | 0,1% - 0,3% |
| IC senior | 0,05% - 0,15% |
| IC intermédiaire | 0,02% - 0,08% |
| IC junior | 0,005% - 0,025% |

SÉRIE C+ (100+ employés, pré-IPO) :
Passer aux RSUs à des cibles en valeur dollar (la volatilité du cours de l'action rend les attributions en % difficiles à comparer) :
| Niveau | Fourchette d'attribution annuelle |
|---|---|
| VP | 150 000 € - 500 000 € en RSUs |
| Directeur | 75 000 € - 200 000 € en RSUs |
| IC senior | 40 000 € - 100 000 € en RSUs |
| IC intermédiaire | 15 000 € - 50 000 € en RSUs |

Standards d'acquisition :
- Standard : 4 ans d'acquisition, cliff d'1 an
- Acquisition accélérée en cas d'acquisition (déclencheur unique) : inhabituel, mais parfois offert aux dirigeants
- Attributions de rafraîchissement : offrir après 2 ans aux hauts performants retenus (prévient l'effet de falaise non acquis à l'année 4)

Comment présenter les actions aux candidats :
Ne pas dire : "Vous obtiendrez X 000 options d'une valeur de Y € aujourd'hui."
Dire : "À notre 409A actuelle de X €/action, votre attribution vaut Y € aujourd'hui. Si nous atteignons notre cible de [Série C / IPO] de Z €/action, votre attribution vaut W €. Cela suppose [10x / 20x / étape spécifique]."
Être honnête sur le risque de dilution à chaque future levée de fonds.

Construire des directives sur les actions pour le stade de mon entreprise et le pool d'options.
```

### Générateur de lettre d'offre

```
Génère une lettre d'offre pour [candidat] pour [poste].

Entreprise : [Nom de l'entreprise]
Candidat : [Nom complet]
Poste : [Intitulé du poste]
Département : [Département]
Responsable hiérarchique : [Nom du manager, titre]
Date de début : [date]
Lieu : [ville / état / télétravail]

Rémunération :
- Salaire de base : [X] € par [an / heure]
- Bonus : [cible X% de la base, versé [annuellement / trimestriellement], selon les performances]
- Actions : [X actions ordinaires, acquisition sur 4 ans, cliff d'1 an, sous réserve d'approbation du conseil]

Avantages : [décrire]

Type de contrat : [CDI / temps partiel / freelance]
Emploi à volonté : [oui / non — vérifier la juridiction]
Date d'expiration de l'offre : [date]

Pièces jointes requises :
- Accord de cession d'inventions et de confidentialité des employés (PIIA/CIIA)
- Formulaire de consentement à la vérification des antécédents (si applicable)
- Vérification d'éligibilité à l'emploi I-9

Produire une lettre d'offre formelle avec :
- Ton professionnel — chaleureux mais formel
- Tous les détails de rémunération clairement indiqués
- Actions décrites avec avertissement qu'elles sont sous réserve d'approbation du conseil et de la 409A
- Clause d'emploi à volonté (si applicable dans cette juridiction)
- Instructions de confirmation — comment accepter (email / lien DocuSign)
- Expiration notée
- Contact pour les questions

Note : Il s'agit d'un modèle — à revoir avec un conseiller juridique avant d'envoyer. Le droit du travail varie selon la juridiction.
```

## Exemple

**Utilisateur :** Je recrute un Senior Product Manager à Londres. Ma startup Série B, ~80 personnes. Quelle devrait être la fourchette salariale et comment structurer l'offre ?

**Benchmark de Claude :**

**Senior Product Manager — Londres — Série B**

**Contexte de marché (2025-2026) :**
Le marché des PM à Londres est tendu, en particulier pour les ICs seniors avec une expérience SaaS B2B. Les entreprises en Série B se positionnent généralement au 50e-65e percentile pour rester compétitives sans brûler le pool d'options.

**Grille salariale — Senior PM, Londres :**
| Composante | Fourchette | Notes |
|---|---|---|
| Salaire de base | 85 000 £ - 115 000 £ | Point médian ~100 000 £ pour un PM de 5-7 ans |
| Bonus (cible) | 10-15% de la base | Généralement lié aux OKRs de l'entreprise, pas individuels |
| Actions | 0,05-0,1% du dilué total | ~40-80 000 £ à la valorisation actuelle si la Série B est à 80 M£ |

**Où positionner un candidat spécifique :**
- En transition depuis un poste étroitement adjacent ou une entreprise similaire : bas de la grille (85-90 000 £)
- 5-7 ans d'expérience PM, adéquation de domaine : point médian (95-105 000 £)
- 8+ ans, a dirigé une zone produit avec responsabilité de revenus : haut de la grille (108-115 000 £)
- Ne pas dépasser la grille — défendre la philosophie de rémunération, pas la négociation individuelle

**Structure des actions pour ce niveau (Série B) :**
- 0,075% typique pour une forte embauche de Senior PM
- À la valorisation de 80 M£ : ~60 000 £ de valeur actuelle
- Acquisition : 4 ans, cliff d'1 an — standard
- Lors de la présentation : "Si nous atteignons la Série C à 250 M£, cette attribution vaut ~190 000 £"

**Concurrence avec les grandes entreprises tech :**
S'ils ont une offre Amazon/Google avec des RSUs, vous ne pouvez pas rivaliser sur le cash. Concurrencez sur : la portée (ils posséderont un domaine produit complet, pas une fonctionnalité), la vitesse (ils livreront en semaines pas en trimestres), et le potentiel (les actions peuvent valoir des multiples d'un RSU coté).

---
