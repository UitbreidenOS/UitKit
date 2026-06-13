---
name: onboarding-cro
description: "Optimisation de l'intégration utilisateur: flux d'activation, identification du moment aha, états vides, séquences e-mail, listes de contrôle in-app — réduire le temps d'accès à la valeur et améliorer la conversion d'essai"
---

# Onboarding CRO Skill

## Quand activer
- Améliorer la conversion essai-payant en corrigeant le flux d'intégration
- Identifier et accélérer le "moment aha" pour les nouveaux utilisateurs
- Concevoir des états vides, des listes de contrôle et des nudges in-app
- Rédiger des séquences d'e-mail d'intégration (activation drip)
- Auditer un entonnoir inscription-à-activation pour trouver les abandons

## Quand NE PAS utiliser
- Configuration générale des analyses d'entonnoir — utilisez la compétence analytics-tracking
- Conception du cadre de test A/B — utilisez la compétence experiment-designer
- Pages d'accueil marketing — utilisez la compétence copywriting
- Acquisition payante — utilisez la compétence paid-ads

## Instructions

### Identifier le moment aha

```
Aidez-moi à identifier le moment aha pour [produit].

Produit: [décrire ce qu'il fait]
Proposition de valeur principale: [quel problème résout-il?]
Type d'utilisateur: [qui sont vos meilleurs clients?]
Événement d'activation actuel suivi: [l'événement que vous appelez "activé" — ou aucun]

Cadre pour trouver le moment aha:

1. Méthode de corrélation (si vous avez des données):
   Regardez les utilisateurs qui ont converti en payant par rapport à ceux qui ont quitté.
   Quelle action les convertisseurs ont-ils entreprise que les abandonnistes n'ont pas?
   Exécutez dans Mixpanel/Amplitude: "Les utilisateurs qui ont fait X dans les 7 jours ont Y% de rétention supérieure"

2. Méthode d'entrevue (qualitative):
   Demandez à 5-10 utilisateurs puissants: "Parlez-moi du moment où vous avez su que ce produit valait la peine de payer."
   Cherchez une action spécifique, pas un sentiment.

3. Méthode de logique de produit (si pas de données):
   Cartographiez le parcours de l'utilisateur: inscription → [étape 1] → [étape 2] → ... → valeur
   Le moment aha = la première étape où l'utilisateur expérimente VOTRE valeur principale, pas seulement la configuration.

Modèles courants du moment aha:
- Slack: a envoyé le premier message dans un canal (équipe présente)
- Dropbox: a sauvegardé le premier fichier à partir de plusieurs appareils (synchronisation fonctionnelle)
- Loom: a reçu une réponse sur une vidéo enregistrée (boucle de valeur complète)

Pour mon produit, le moment aha est probablement: [identifier l'action spécifique]

Définissez l'événement d'activation: [l'utilisateur complète X dans Y jours suivant l'inscription]
```

### Conception du flux d'intégration

```
Concevez un flux d'intégration pour [produit].

Type d'utilisateur: [solo / équipe / entreprise]
Temps pour le moment aha actuellement: [inconnu / X jours / X minutes]
Objectif: atteindre le moment aha en < [X] minutes pour [X]% des utilisateurs
Méthode d'inscription: [e-mail / Google OAuth / invitation uniquement]
Intégration actuelle: [aucune / e-mail uniquement / liste de contrôle in-app / visite guidée]

Plan directeur du flux d'intégration:

Étape 1 — Inscription sans friction:
□ Connexion sociale préférée (supprime la friction e-mail/mot de passe)
□ Collectez uniquement ce qui est nécessaire pour la personnalisation (pas la taille de l'entreprise pour un outil solo)
□ Indicateur de progression claire si multi-étapes

Étape 2 — Question de personnalisation (1-2 questions maximum):
"Pour quoi utiliserez-vous principalement [produit]?" → routes vers l'état vide pertinent
Pourquoi: cela rend le produit pertinent avant qu'ils n'aient rien fait

Étape 3 — Invitation d'action initiale (état vide):
□ Montrez UNE chose à faire, pas cinq
□ Utilisez des verbes d'action: "Créez votre premier X" pas "Bienvenue sur [produit]"
□ Pré-remplissez avec un exemple pour qu'ils voient ce qui est bon
□ Offrez une "démo rapide" ou un exemple de projet pour les utilisateurs hésitants

Étape 4 — Livraison du moment aha:
□ L'écran/moment où la valeur principale est expérimentée
□ Célébrez-le avec une animation de micro-victoire ou une confirmation
□ Surfacez l'action suivante immédiatement (ne laissez pas la dynamique mourir)

Étape 5 — Formation d'habitude:
□ Invitez un coéquipier (si produit d'équipe)
□ Connectez l'intégration (Slack, GitHub, etc. — le crochet "collant")
□ Définissez un rappel récurrent ou un workflow

Anti-patterns à éviter:
- Visites de fonctionnalités (les utilisateurs les ignorent — demandez-leur de faire, pas de regarder)
- Demander une carte de crédit avant l'expérience de valeur
- Longs assistants de configuration avant toute livraison de valeur

Concevez le flux pour mon produit avec une copie spécifique pour chaque étape.
```

### Séquence d'e-mail d'intégration

```
Écrivez une séquence d'e-mail d'intégration pour [produit].

Durée d'essai: [X jours / pas d'expiration]
Définition d'activation: [l'utilisateur complète X]
Taux de conversion des utilisateurs activés: [X%]
Taux de conversion des utilisateurs non activés: [X%]
Nom d'expéditeur: [fondateur / équipe produit / support]

Séquence d'e-mail:

E-mail 1 — Bienvenue (envoyer: immédiatement après l'inscription):
Sujet: [Accédez rapidement au moment aha — pas "Bienvenue sur [Produit]"]
Objectif: impulser la première connexion et la première action
Contenu: 1 phrase sur ce qu'ils peuvent faire aujourd'hui + un bouton CTA
Longueur: < 100 mots

E-mail 2 — Nudge d'activation (envoyer: Jour 2, si non activé):
Sujet: [Avez-vous essayé X?]
Objectif: supprimer le obstacle qui empêche la première action
Contenu: nommez la #1 chose sur laquelle la plupart des utilisateurs buttent + comment la résoudre
CTA: lien direct vers l'étape qu'ils n'ont pas complétée

E-mail 3 — Preuve sociale (envoyer: Jour 3, si non activé):
Sujet: [Comment [entreprise] a économisé [X] en utilisant [produit]]
Objectif: redynamiser l'intention avec une étude de cas pertinente
Contenu: histoire de 3 phrases sur les résultats d'un utilisateur similaire
CTA: "Voir comment ils l'ont fait" → lien vers le produit

E-mail 4 — Mise en évidence des fonctionnalités (envoyer: Jour 5, si activé):
Sujet: [Vous avez fait X. Voici ce qu'il faut essayer ensuite.]
Objectif: approfondir l'engagement vers le moment aha ou l'intention de mise à niveau
Contenu: l'une des fonctionnalités qui convertit les utilisateurs gratuits en payants
CTA: essayez la fonctionnalité avec un lien profond

E-mail 5 — Avertissement d'expiration d'essai (envoyer: Jour [trial_length - 3]):
Sujet: [3 jours restants — voici ce que vous perdrez]
Objectif: convertir ou prolonger
Contenu: nommez spécifiquement ce à quoi ils perdront accès
CTA: mettre à niveau maintenant + option "Besoin de plus de temps?" d'extension

E-mail 6 — Dernier jour (envoyer: Jour [trial_length]):
Sujet: [Dernière chance — votre essai [produit] se termine ce soir]
Objectif: dernier coup de conversion
Contenu: offre la plus difficile (rabais si le budget permet), ou prolonger de 7 jours
CTA: mettre à niveau + option "pas maintenant" qui demande des commentaires

Écrivez chaque e-mail pour mon produit. Incluez le sujet, le texte d'aperçu et le corps.
```

### Conception de liste de contrôle in-app

```
Concevez une liste de contrôle d'intégration pour [produit].

Objectif de la liste de contrôle: atteindre le moment aha / accéder à la première valeur / compléter la configuration
Persona utilisateur: [décrire]
Éléments à compléter: [liste les étapes que vous voulez que les utilisateurs suivent]
Mécanisme de récompense: [barre de progression / célébration / déverrouiller une fonctionnalité]

Principes de conception de liste de contrôle:
1. Maximum 5 éléments — plus de 5 ressemble à du travail scolaire
2. Premier élément: complétable en < 2 minutes (génère de la dynamique)
3. Afficher les coche-marks au fur et à mesure que les éléments sont terminés (psychologie d'accomplissement)
4. Le "déverrouillage" se produit à l'élément 3-4, pas au dernier élément (maintenez-les engagés)
5. Effondrez une fois complété, ne disparaissez pas (valeur de référence)

Liste de contrôle pour mon produit:
□ [Élément 1] — [X mins] — complète quand: [événement déclenché]
□ [Élément 2] — [X mins] — complète quand: [événement déclenché]
□ [Élément 3] — [X mins] — déverrouille: [récompense de fonctionnalité ou de contenu]
□ [Élément 4] — [X mins] — complète quand: [événement déclenché]
□ [Élément 5] — [X mins] — achèvement: [célébration + invite d'étape suivante]

Messages de progression à 0%, 40%, 80%, 100%:
[Écrivez 4 messages qui motivent l'accomplissement]

Copie pour chaque élément de liste de contrôle (titre de tâche + description 1 ligne).
```

## Exemple

**Utilisateur:** Notre SaaS de gestion de projet pour les équipes d'ingénierie a une conversion d'essai à payant de 18%. Le moment aha est quand une équipe termine son premier sprint. Seuls 31% des essais y parviennent jamais. Corrigez l'intégration.

**Diagnostic de Claude:**

31% atteignant le moment aha est le vrai problème — pas la conversion de 18%. Corrigez d'abord l'activation; la conversion suit.

**Cause profonde:** "Compléter un sprint" nécessite trop de prérequis — invitations d'équipe, configuration du projet, tickets créés, sprint démarré, sprint complété. C'est 5 étapes, probablement étalées sur plusieurs jours. La plupart des initiateurs d'essai solo n'invitent jamais leur équipe.

**3 changements avec l'impact attendu le plus élevé:**

1. **Changez temporairement l'événement d'activation:** Définissez "moment aha" comme "premier sprint démarré avec 3+ tickets" au lieu de "sprint complété." C'est réalisable en 30 minutes, pas 2 semaines. Mesurez la conversion d'essai à partir de ce point antérieur.

2. **Ajoutez une barrière d'invitation d'équipe au début:** Le jour 1, après le premier projet créé, invitez: "Les équipes d'ingénierie se déplacent 3x plus vite ensemble — invitez votre équipe maintenant." Rendez-le facile (partage de lien, pas juste e-mail). Les non-invitants sont 4x moins susceptibles de convertir.

3. **Modèle de sprint pré-construit:** Au lieu de projet vide → créer des tickets → démarrer sprint, offrez: "Commencez avec notre modèle de sprint 2 semaines" → 5 exemple de tickets pré-remplís pour une équipe d'ingénierie typique. Les utilisateurs peuvent modifier, pas construire à partir de zéro. Réduit le délai jusqu'au premier sprint démarré d'environ 3 jours à environ 15 minutes.

Résultat attendu: élever l'activation de 31% à 50% → amélioration estimée de conversion d'essai à payant de 18% à environ 28%.

---
