---
name: churn-prevention
description: "Prévention du churn : identifier les clients à risque, playbooks d'intervention, conception d'offres de sauvegarde, analyse de sondages de sortie, campagnes de récupération"
---

# Compétence Prévention du Churn

## Quand l'activer
- Identifier les clients qui risquent d'annuler
- Concevoir une intervention quand un client montre des signaux de churn
- Analyser les réponses des sondages de sortie pour trouver des motifs
- Construire une campagne de récupération pour les clients ayant churné récemment
- Calculer et réduire votre taux de churn mensuel

## Quand ne pas l'utiliser
- Prédiction de churn en temps réel — nécessite un modèle ML dédié ou un outil (ChurnZero, Gainsight)
- Gestion du succès client pour les comptes d'entreprise — utiliser plateforme CS dédiée

## Instructions

### Identifier les clients à risque

```
Aidez-moi à identifier les clients à risque à partir de ces données d'utilisation/engagement :

[collez ou décrivez les signaux auxquels vous avez accès] :
- Changements de fréquence de connexion
- Baisse d'utilisation des fonctionnalités
- Augmentation du volume de tickets de support
- Problèmes de facturation / paiements échoués
- Fonctionnalités clés inutilisées (surtout si elles ont payé)
- Score NPS faible (0-6 = détracteurs)
- Ne répond pas à l'outreach du CS

Pour chaque signal, dites-moi :
1. Comment est c'est un bon indicateur de churn ?
2. Quelle intervention dois-je déclencher ?
3. Quelle est l'urgence de l'outreach ?
```

### Playbook d'intervention par signal

```
Concevoir un playbook d'intervention au churn.

Mon produit : [SaaS / service d'abonnement / marketplace]
Segment client : [PME / mid-market / entreprise]
Valeur moyenne du contrat : $[X]/mois
Taux de churn : [X]% mensuel

Pour chaque signal de churn, que dois-je faire ?

Signal : Pas connecté depuis 14 jours
→ Déclencher : [email automatisé / appel CS / message in-app]
→ Angle du message : [réengagement / rappel de valeur / offre d'aide]
→ Escalade si pas de réponse : [après X jours → faire Y]

Signal : NPS négatif soumis (0-6)
Signal : Contacté le support 3+ fois en 30 jours
Signal : Annulé 3 des 5 sièges (annulation partielle)
Signal : Pas complété l'onboarding

Créer le playbook avec des modèles de messages spécifiques pour chaque déclencheur.
```

### Conception d'offre de sauvegarde

```
Concevoir une offre de sauvegarde pour les clients qui ont initié l'annulation.

Quand ils cliquent sur "Annuler", je veux offrir :
Prix de mon produit : $[X]/mois
Raison du churn (si demandée) : [prix / ne l'utilisant pas / concurrent / fonction manquante / coupure budgétaire]

Concevoir les offres de sauvegarde pour chaque raison :
- Préoccupation de prix : [X]% de réduction pendant [X] mois / option de réduction / option pause
- Ne l'utilisant pas : session onboarding 1:1 gratuite + coaching d'utilisation
- Concurrent : [ce qui nous rend meilleur / comparaison spécifique]
- Fonction manquante : [feuille de route / workaround / capture feedback]
- Coupure budgétaire : pause au lieu d'annuler (conserver la relation)

Pour chaque : rédigez la messagerie de l'offre de sauvegarde (< 150 mots, honnête, pas désespéré).
```

### Analyse de sondage de sortie

```
Analyser ces réponses de sondage de sortie et identifier les motifs :

[collez les réponses, ou décrivez la distribution]
Raisons principales données : [liste]
Commentaires mot-à-mot : [collez un échantillon]

De cette analyse :
1. Quelles sont les 3 principales raisons de churn évitables ?
2. Quels changements de produit ou de processus aborderaient chacun ?
3. Quels clients ayant churné sont les plus susceptibles d'être récupérés ?
4. Qu'est-ce que je devrais changer dans mon onboarding pour prévenir ce churn ?
```

### Campagne de récupération

```
Concevoir une campagne de récupération par email pour les clients qui ont churné il y a [X] mois.

Raison du churn (si connu) : [décrivez]
Ce qui a changé depuis leur départ : [nouvelles fonctionnalités / changement de prix / améliorations]
Incitatif que je peux offrir : [réduction / essai prolongé / accès à nouvelle fonction]

Écrire une séquence de récupération de 3 emails :
Email 1 (semaine 4 après churn) : Check-in — "Comment ça va ?"
Email 2 (semaine 8) : "Voici ce qui est nouveau depuis votre départ"
Email 3 (mois 6) : Offre de récupération finale avec incitatif

Chaque email devrait sembler personnel et sans pression.
```

### Analyse du taux de churn

```
Aidez-moi à comprendre et réduire mon taux de churn.

Métriques actuelles :
- Taux de churn mensuel : [X]%
- Durée de vie moyenne du client : [X] mois
- LTV client : $[X]
- CAC : $[X]

Si je réduis le churn de 1% :
- Nouveau taux de churn mensuel : [X]%
- Impact sur LTV : $[X] → $[X]
- Impact sur le revenu à [X] clients : amélioration de $[X]/mois

Quels sont les changements à plus haut effet de levier que je peux faire pour réduire le churn de 1% en 90 jours ?
```

## Exemple

**Utilisateur :** 8% de churn mensuel sur un outil SaaS de $49/mois. Les sondages de sortie montrent que 42% disent "ne l'utilisant pas assez".

**Analyse de Claude :**

Cause première : Échec d'activation, pas échec de produit. "Ne l'utilisant pas assez" = n'a pas atteint la valeur.

**Top 3 interventions :**

1. **Corriger l'onboarding (plus haut effet de levier) :** 42% de churn dû à la non-activation est un problème d'onboarding. Ajouter un "moment de première valeur" obligatoire avant la fin de l'essai gratuit — les faire compléter une action centrale montrant la valeur du produit. Cible : réduire ce segment à 20%.

2. **Outreach déclenché par l'utilisation au jour 7 :** Si un utilisateur n'a pas complété l'action centrale au jour 7 d'essai, envoyer un email automatisé "stuck?" avec une courte vidéo Loom ou offre d'appel de 15 minutes. Ne pas attendre qu'ils arrêtent d'utiliser.

3. **Option pause à l'annulation :** "Ne l'utilisant pas assez" signifie souvent occupé, pas désintéressé. Une pause d'1 mois (sans frais, souscription en attente) convertit 15-25% des churners potentiels en clients retenus.

**Impact projeté :** Ces 3 changements pourraient réduire le segment "ne l'utilisant pas assez" de 42% de moitié = ~1,6% réduction du taux de churn mensuel total.

---
