---
name: invoice-chaser
description: "Automatiser les comptes débiteurs : rédiger des rappels de retard, des séquences d'escalade, des signaux de risque de non-paiement — pour QuickBooks, Stripe ou tout outil de facturation"
---

# Compétence Invoice Chaser

## Quand l'activer
- Vous avez des factures impayées et besoin de rédiger des messages de suivi
- Mise en place d'une séquence de rappels multi-touches pour les mauvais payeurs
- Identifier les clients à risque de non-paiement
- Rédiger des e-mails d'escalade quand un client devient silencieux
- Résumer votre position des créances clients

## Quand ne PAS l'utiliser
- Factures en retard de moins de 7 jours — trop tôt, endommage les relations
- Litiges où le client a soulevé une objection valide — résoudre d'abord
- Procédures légales/recouvrements — ceci est seulement pour la sensibilisation pré-légale

## Instructions

### Décrivez votre situation à Claude

Décrivez-la simplement en anglais courant :

```
J'ai 3 factures impayées :
- Acme Corp : 4 200 $ — 14 jours de retard
- Smith & Co : 850 $ — 32 jours de retard
- Blue Sky Ltd : 12 000 $ — 45 jours de retard, aucune réponse aux 2 derniers e-mails

Rédigez des messages de suivi appropriés pour chacun.
```

Claude va :
- Rédiger des messages appropriés au ton (rappel gentil à 14 jours, plus ferme à 32, avis formel à 45)
- Référencer le montant spécifique et les jours de retard
- Inclure un appel à l'action clairs (payer maintenant / confirmer réception / nous contacter)
- Suggérer la prochaine étape appropriée pour chaque niveau de retard

### L'échelle d'escalade

| Jours de retard | Ton | Action |
|---|---|---|
| 1–14 | Rappel amical | « Je vérifiais juste — cela a-t-il disparu ? » |
| 15–30 | Suivi courtois | « C'est maintenant X jours de retard, veuillez aviser » |
| 31–60 | Avis ferme | « Le paiement est requis dans 7 jours pour éviter les frais de retard » |
| 60+ | Demande formelle | « Avis de paiement en retard — action requise » |
| 90+ | Pré-recouvrement | « Avis final avant renvoi au recouvrement » |

### Configuration d'une séquence

```
Je veux mettre en place une séquence automatique de 4 touches pour toute facture impayée :
- Jour 3 après la date limite : rappel doux
- Jour 14 : suivi avec lien de paiement
- Jour 30 : avis ferme mentionnant la politique de frais de retard
- Jour 45 : avis final avant recouvrement

Écrivez des modèles pour les 4 étapes. Mon entreprise est un studio de design web, la facture moyenne est de 2 000 à 8 000 $.
```

### Analyser votre position des créances

```
Voici mes factures impayées depuis QuickBooks [collez ou décrivez] :
- Client A : $X, date d'échéance, dernier contact
- Client B : $X, date d'échéance, dernier contact

Catégorisez par risque (faible/moyen/élevé), total impayé, et recommandez les actions prioritaires.
```

### Extraction depuis QuickBooks

```
J'ai exporté ceci depuis QuickBooks [collez les données].
Quelles factures ont besoin d'attention immédiate ?
Rédigez des e-mails de rappel pour tout ce qui dépasse 30 jours.
```

## Exemple

**Vous dites :**
```
Client : Johnson Consulting
Facture : 6 500 $ pour refonte de site web
Due : il y a 28 jours
Contact précédent : Facture envoyée, aucune réponse depuis
Mon ton : professionnel mais ferme
```

**Claude produit :**
```
Objet : Facture #1042 — Paiement dû (6 500 $)

Bonjour [Nom],

J'espère que vous allez bien. Je vous contacte au sujet de la Facture #1042 pour 6 500 $,
qui était due le [date] et a maintenant 28 jours de retard.

Je comprends que les choses deviennent chargées — veuillez me faire savoir si vous avez des questions
sur la facture ou s'il y a un problème que je peux aider à résoudre.

Si le paiement a déjà été envoyé, veuillez ignorer ce message et partager
le numéro de référence pour que je puisse mettre à jour mes dossiers.

Vous pouvez payer en ligne ici : [lien de paiement]

Merci de votre attention rapide.
```

---
