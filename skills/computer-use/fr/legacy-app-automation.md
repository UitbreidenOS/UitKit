---
name: legacy-app-automation
description: Automatiser les applications de bureau ou héritées sans API via l'utilisation de l'ordinateur — interaction lente, vérifiée et sécurisée avec les applications Win32, VB6, mainframe et clients lourds.
---

# Automatisation des applications héritées via l'utilisation de l'ordinateur

## Quand activer

- L'application cible n'a pas d'API, pas de CLI, pas d'interface scriptable et pas de frontend web
- L'application est une application de bureau native : Win32, MFC, VB6, Delphi, PowerBuilder, Java Swing, Electron hérité
- L'utilisateur a besoin d'extraire des données d'une application qui ne les affiche que sur l'écran
- Automatisation des saisies répétitives de formulaires dans une application ERP, CRM ou métier à client lourd
- L'utilisateur dit « il n'y a pas d'autre moyen de faire cela » ou « le fournisseur n'a pas d'API »
- Automatisation du terminal mainframe (3270/5250) où aucun connecteur moderne n'existe
- Migration de données à partir d'un système hérité qui ne peut exporter que via des dialogues orientés interface utilisateur

## Quand NE PAS utiliser

- L'application a une API, une connexion à une base de données ou une fonction d'exportation — utilisez-les plutôt ; l'utilisation de l'ordinateur est le dernier recours
- L'automatisation nécessite d'interagir avec des écrans de saisie d'identifiants (connexion avec mot de passe, codes MFA) — arrêtez et demandez à l'utilisateur de s'authentifier manuellement d'abord
- L'écran contient des dialogues de confirmation de transaction financière (virements, soumissions de paiements) — exigez une confirmation explicite par action de la part de l'utilisateur
- L'application est instable ou connue pour se bloquer — n'automatisez pas les logiciels instables ; le risque de laisser les données dans un état corrompu est trop élevé
- Vous ne pouvez pas vérifier l'issue de chaque action (l'application ne fournit aucun retour visuel) — les clics à l'aveugle ne sont pas acceptables
- La tâche nécessite de la vitesse au détriment de la sécurité — l'automatisation des applications héritées doit être lente et vérifiée ; si la vitesse est la priorité, trouvez une approche différente

## Instructions

### Évaluation de base

Avant de toucher à quoi que ce soit :

1. Prenez une capture d'écran complète de l'application dans son état de démarrage.
2. Identifiez et documentez :
   - Nom et version de l'application (visible dans la barre de titre ou la boîte de dialogue À propos)
   - Écran/vue actuelle
   - Quelles données ou action sont la cible
   - Tous les dialogues d'avertissement ou invites de confirmation qui pourraient apparaître
3. Demandez à l'utilisateur : « Êtes-vous déjà connecté ? Y a-t-il des invites de confirmation dont je dois être conscient ? »
4. Établissez un plan de récupération : que fait l'utilisateur si l'automatisation laisse l'application dans un mauvais état ?

### Le principe lent et vérifier

Les applications héritées sont fragiles. Un clic sur le mauvais élément, une frappe arrivant alors qu'une boîte de dialogue se charge toujours, ou un événement de focus sur le mauvais champ peut corrompre les données ou déclencher des actions irréversibles.

Chaque action suit cette séquence — aucune exception :

```
1. OBSERVER  — capture d'écran, confirmez que l'application est dans l'état attendu
2. LOCALISER — identifiez l'élément cible exact (par étiquette, position, ordre de tabulation)
3. NARRER   — énoncez ce que vous êtes sur le point de faire et quel devrait être le résultat
4. AGIR     — effectuez l'action unique et minimale
5. ATTENDRE — pausez pour que l'application réponde (les applications héritées sont souvent lentes ; attendez la modification visuelle)
6. VÉRIFIER — capture d'écran, confirmez que le résultat correspondait à l'attente
7. ENREGISTRER — enregistrez le résultat de l'étape avant de procéder
```

Ne chaînez jamais deux actions sans terminer l'étape de vérification pour la première.

### Modèles d'interaction pour les applications héritées

**Approche au clavier en premier** : De nombreuses applications héritées ont des cibles de clic souris peu fiables. Préférez la navigation au clavier :
- Tab pour parcourir les champs
- Entrée pour confirmer
- Alt+[lettre soulignée] pour les accélérateurs de menu
- Touches F pour les actions courantes (F3 recherche, F4 nouveau, F8 soumettre — varie selon l'application)

**Délai** : Insérez des pauses délibérées après :
- Ouverture d'un nouvel écran (attendez que l'écran soit complètement rendu)
- Sauvegarde d'un enregistrement (attendez l'indicateur de confirmation)
- Exécution d'une requête ou recherche (attendez le chargement des résultats)
- Tout appel réseau (la barre d'état affiche souvent l'activité)

**Discipline d'entrée de champ** :
1. Cliquez ou tabez vers le champ.
2. Triple-cliquez pour sélectionner le contenu existant (ne supposez pas que le champ est vide).
3. Tapez la nouvelle valeur.
4. Prenez une capture d'écran pour confirmer que la valeur a été entrée correctement avant de continuer.

**Dialogues de confirmation** : Lorsqu'une boîte de dialogue de confirmation apparaît :
- Prenez une capture d'écran immédiatement.
- Lisez le texte exact de la boîte de dialogue — ne supposez pas.
- Si la boîte de dialogue concerne une action destructive ou irréversible, arrêtez et demandez à l'utilisateur de confirmer avant de cliquer sur OK.

### Règles de sécurité — obligatoires

- **Ne jamais automatiser les transactions financières** (paiements, virements, écritures comptables, factures) sans que l'utilisateur confirme explicitement chaque transaction avant de cliquer sur OK/Soumettre.
- **Ne jamais entrer ou interagir avec des champs d'identifiants** (mots de passe, jetons, codes PIN). Demandez à l'utilisateur de se connecter manuellement avant de commencer.
- **Ne jamais interagir avec les écrans contenant des données de santé** (dossiers patients, résultats de laboratoire, ordonnances) sans confirmer que l'utilisateur a l'autorisation appropriée et que l'environnement est approprié.
- **Arrêtez sur les écrans inattendus** : si un écran apparaît qui n'a pas fait partie du flux prévu (erreur, boîte de dialogue inattendue, mauvaise vue), arrêtez complètement, prenez une capture d'écran et signalez à l'utilisateur avant de faire quoi que ce soit d'autre.
- **Pas d'actions en masse irréversibles** : n'automatisez pas les suppressions en masse, les mises à jour en masse ou les soumissions par lot sans un point de contrôle d'examen par l'homme après un petit lot pilote.

### Modèle d'extraction de données

Lorsque l'objectif est de lire/exporter des données à partir d'une application héritée :

1. Accédez à la vue des données.
2. Prenez une capture d'écran de chaque écran de données.
3. Si l'application a une fonction d'impression ou d'exportation (même vers une boîte de dialogue d'imprimante), utilisez-la — une exportation PDF est plus sûre que la transcription manuelle.
4. Si la transcription est inévitable, transcrivez les champs visibles un enregistrement à la fois, prenez une capture d'écran de chaque enregistrement comme preuve.
5. Après l'extraction, validez un échantillon de valeurs extraites par rapport à la source à l'écran.

### Modèle d'entrée de formulaire

Lorsque l'objectif est d'entrer des données dans l'application héritée :

1. L'utilisateur fournit les données dans un format structuré (CSV, liste, JSON) avant le début de l'automatisation.
2. Traitez un enregistrement à la fois.
3. Après chaque enregistrement enregistré, prenez une capture d'écran de la confirmation et enregistrez l'ID d'enregistrement ou le message de confirmation.
4. Si un enregistrement échoue, arrêtez le lot, signalez l'échec et attendez les instructions de l'utilisateur avant de continuer.

### Récupération et gestion des erreurs

Si l'application entre dans un état inattendu :

1. Ne cliquez sur rien. Prenez d'abord une capture d'écran.
2. Cherchez une touche d'échappement ou un bouton Annuler pour quitter en toute sécurité l'opération actuelle.
3. Vérifiez si l'opération a déjà été validée (cherchez un message d'état de réussite/échec).
4. Signalez l'état exact de l'écran à l'utilisateur et demandez des conseils.
5. Ne tentez pas de « corriger » un état inconnu en devinant — arrêtez et signalez.

## Exemple

**Scénario** : Exporter 50 dossiers clients d'un CRM VB6 hérité qui n'a pas de fonction d'exportation. Chaque dossier doit être ouvert individuellement et les champs clés transcris.

**Application** : « CustomerBase 2.4 » — application VB6, la vue liste affiche les ID clients, double-cliquez pour ouvrir l'écran de détail.

**Exécution** :

1. Capture d'écran : Confirmez que l'application est ouverte dans la vue liste client. 50 enregistrements visibles.
2. Double-cliquez sur le premier enregistrement (ID client : 10042). Attendez l'écran de détail.
3. Capture d'écran : L'écran de détail est chargé — Nom, Téléphone, E-mail, Type de compte visibles.
4. Transcrivez : `{"id": "10042", "name": "Acme Corp", "phone": "555-0192", "email": "billing@acme.com", "type": "Enterprise"}`.
5. Capture d'écran : Confirmez que les valeurs transcrites correspondent aux valeurs à l'écran.
6. Appuyez sur Échap pour revenir à la liste. Capture d'écran : Vue liste restaurée.
7. Répétez pour l'enregistrement 10043.

Après 5 enregistrements, validez les données extraites par rapport aux captures d'écran — vérifiez les erreurs de transcription avant de continuer le lot.

Après les 50 enregistrements :
- Fournissez les données structurées à l'utilisateur.
- Joignez un échantillon de captures d'écran comme preuve de précision.
- Notez tous les enregistrements où les données n'étaient pas claires ou les champs étaient vides.

**Ce qui causerait un arrêt** :
- L'écran de détail s'ouvre sur un onglet « Historique des paiements » affichant les montants des factures — arrêtez, signalez, demandez si cet écran est dans le périmètre.
- Une boîte de dialogue « Supprimer l'enregistrement » apparaît de manière inattendue — arrêtez immédiatement, ne cliquez sur rien, prenez une capture d'écran et signalez.
- L'application devient sans réponse après l'ouverture de l'enregistrement 23 — arrêtez, signalez l'état, ne recommencez pas sans confirmation de l'utilisateur.
