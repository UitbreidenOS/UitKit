---
name: freelancer-proposal
description: "Kit de freelance : propositions de projet, orientation des prix, séquences de suivi de facture, contrats de projet en clair et documents de départ du client"
---

# Freelancer Proposal

## When to activate
- Un prospect a demandé une proposition et vous devez en sortir une aujourd'hui
- Vous hésitez sur comment fixer un projet — horaire vs. fixe, quel tarif, combien de tampon
- Une facture client est en souffrance et vous avez besoin de relancer sans endommager la relation
- Vous terminez un projet et avez besoin d'un processus de livraison et de départ propre

## When NOT to use
- Contrats juridiques formels pour les engagements à haut rendement ou à haut risque — faites examiner par un avocat tout ce qui dépasse $25K ou avec des termes IP inhabituels
- Conseils fiscaux ou financiers — utilisez un comptable pour les estimations trimestrielles, les déductions et la structure commerciale
- Facturation ou traitement des paiements automatisés — utilisez FreshBooks, Wave ou QuickBooks pour ça

## Instructions

### Proposals (90 seconds)

Dites à Claude :
- Ce que le client veut accomplir — dans leurs mots si vous les avez
- Votre compréhension du domaine de travail : ce que vous allez livrer, ce qui n'est pas inclus
- Votre tarif (horaire ou basé sur projet) et estimation de la chronologie
- Toutes contraintes connues : leur date limite, leur gamme de budget s'ils l'ont partagé, toutes les limites techniques ou logistiques

Claude écrit un document de proposition complet :

**Résumé exécutif** — 2-3 phrases réaffirmant leur problème et votre solution. Écrit de leur perspective, pas la vôtre. Commence par leur objectif, pas vos références.

**Domaine de travail** — ce qui est explicitement inclus (livrables, tours de révisions, réunions, formats). Ensuite : ce qui n'est explicitement pas inclus. Cette section prévient la dérive de portée plus que n'importe quel clause contractuelle. Claude est rigoureux sur la liste « non incluse ».

**Chronologie** — phases avec dates d'achèvement estimées, basées sur votre estimation. Claude signale les dépendances : « La phase 2 commence après l'approbation du client des livrables de la phase 1 » — de sorte que les délais de leur part ne compressent pas votre chronologie.

**Investissement** — votre prix, le calendrier des paiements et ce qui déclenche chaque paiement. Pour les projets à forfait, Claude ajoute un tampon de 20% à votre estimation brute et vous montre comment le présenter proprement au client.

**Prochaines étapes** — une seule action claire pour le client à prendre (signer, répondre pour confirmer, payer le dépôt).

---

### Pricing guidance

Dites à Claude :
- Le type de projet (conception de logo, construction de site Web, stratégie marketing, comptabilité, rédaction de contenu, etc.)
- Votre tarif horaire cible
- Vos heures estimées pour ce projet
- Votre marché (États-Unis, Royaume-Uni, UE, etc.) et votre niveau d'expérience (1-3 ans, 5+ ans, spécialiste)
- Le client a-t-il un budget déclaré ?

Claude calcule votre tarif de projet, vérifie s'il s'aligne avec les points de référence du marché pour votre catégorie et recommande de citer un tarif horaire ou fixe pour ce type de travail.

Quand citer fixe : projets avec livrables clairs et portée définie. Quand citer horaire : consultation, stratégie ou tout ce où la portée est exploratoire.

La règle du tampon de 20% : Claude l'ajoute à votre estimation brute lors de la génération d'un prix fixe et explique comment la présenter aux clients qui demandent un détail. L'encadrement est : cela représente les cycles de révision, la surcharge de communication client et les inconnues techniques. La plupart des clients l'acceptent lorsque c'est expliqué.

---

### Invoice follow-up

Dites à Claude :
- Le montant de la facture et la date d'échéance
- Combien de jours de retard c'est
- Votre relation avec ce client (long terme vs. premier projet, amical vs. distance professionnelle)
- Quelle communication a déjà eu lieu (avez-vous envoyé la facture ? des réponses ?)

Claude rédige le message de suivi approprié à l'étape. Escalade en trois étapes :

**Étape 1 — 3 jours en retard :** Amical, suppose une erreur. Aucune mention de frais de retard. « Juste pour vérifier que cela ne s'est pas perdu dans votre boîte de réception. »

**Étape 2 — 14 jours en retard :** Direct. Références la facture originale. Note votre politique de frais de retard si vous en avez un. Propose une date de paiement spécifique. Toujours professionnel, pas menaçant.

**Étape 3 — 30 jours en retard :** Avis final. Énoncé clair des prochaines étapes si le paiement n'est pas reçu d'ici une date spécifique. Si vous avez des frais de retard dans votre contrat, ce message les applique. Ton : factuel, pas émotionnel.

---

### Project contracts

Dites à Claude :
- Type de travail et livrables
- Durée du projet et calendrier des paiements (dépôt + jalons, ou dépôt + final)
- Votre politique de révision (combien de tours sont inclus avant frais supplémentaires)
- Propriété IP : le client possède-t-il le travail après le paiement final, ou retenez-vous quelque chose ?
- Frais d'interruption : ce que vous facturez si le client annule en milieu de projet (généralement 25-50% du solde restant)
- Votre juridiction (état ou pays, pour la clause de droit applicable)

Claude produit un accord de projet en clair. Pas de jargon — des phrases complètes que les deux parties comprennent réellement. Couvre : portée, chronologie, paiement, révisions, transfert IP, frais d'interruption, ce qui se passe si l'une ou l'autre partie a besoin de faire une pause, et un processus de différend basique.

C'est un point de départ, pas un conseil juridique. Pour les contrats plus de $25K, les situations complexes d'IP ou tout client dans une juridiction juridique différente, faites examiner par un avocat.

---

### Client offboarding

Dites à Claude :
- Nom du projet et ce qui a été livré
- Toute relation en cours (forfait, période d'appui, arrangement de renvoi)
- Voulez-vous demander un témoignage ou un renvoi ?

Claude produit un paquet de départ propre :
- Email de livraison avec un résumé de transmission — ce qui a été livré, où vivent les fichiers, tous les identifiants ou accès en cours de transfert
- Facture finale (si pas déjà envoyée)
- Langage d'offre de soutien de 30 jours (si vous voulez en inclure un)
- Demande de témoignage — une demande spécifique et à faible friction qui dit au client exactement ce que vous voulez qu'il parle

---

### Prompt template — proposal

```
S'il vous plaît, écrivez une proposition client.

Objectif du client : [ce qu'ils veulent accomplir]
Domaine de travail :
- Inclus : [livrables, tours de révisions, réunions]
- Non inclus : [explicitement hors de portée]

Mon tarif : $[X] [horaire/basé sur projet]
Estimation de la chronologie : [X] semaines
Conditions de paiement : [dépôt % + structure de jalon]
Date limite : [date limite déclarée du client, le cas échéant]

S'il vous plaît, incluez un tampon de 20% dans le prix fixe et montrez-moi comment le présenter.
Écrivez dans un ton [professionnel/chaud/direct].
```

## Example

Un web designer reçoit une demande vague : « Pouvez-vous nous construire un site Web ? Budget autour de $5K. »

Le designer dit à Claude : le client est un comptable local qui a besoin d'un site de 5 pages avec un formulaire de contact, leurs actifs de marque actuelle existent (logo, couleurs), ils veulent lancer avant la saison d'impôt, et le designer estime 40 heures de travail à $120/heure.

Claude produit :

Estimation brute : 40 heures x $120 = $4 800. Avec tampon de 20% : $5 760. Claude arrondit à $6 200 et rédige la présentation : « Ce projet est devisé à $6 200 forfaitaire. Cela inclut jusqu'à deux tours de révisions sur chaque page, tout optimisation mobile et une fenêtre d'appui de 30 jours après le lancement. Cela n'inclut pas la rédaction, la photographie ou l'hébergement en cours — ceux-ci peuvent être ajoutés si nécessaire. »

Le domaine de travail inclut exactement : 5 pages (Accueil, À propos, Services, FAQ, Contact), formulaire de contact avec notification par email, configuration SEO basique sur la page, conception réactive mobile, 2 tours de révisions par page.

Non inclus : illustrations personnalisées, système de gestion de contenu ou blog, configuration de Google Ads, intégration des médias sociaux au-delà de la liaison des icônes, achat ou hébergement du domaine.

Chronologie : 4 semaines à partir de la signature de l'accord et de la réception du dépôt.

---
