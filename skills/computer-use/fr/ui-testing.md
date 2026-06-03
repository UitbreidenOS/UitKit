---
name: ui-testing
description: Pilotez l'interface utilisateur native ou web pour tester les parcours utilisateur de bout en bout via la saisie informatique — capture d'écran, clic, assertion et rapport.
---

# Test d'interface utilisateur via la saisie informatique

## Quand activer

- L'utilisateur demande de tester un parcours utilisateur dans une application en cours d'exécution (web ou native) sans infrastructure de test existante
- L'application n'a pas de surface API testable et l'interface utilisateur est la seule interface
- Une suite Playwright ou Cypress existe mais l'utilisateur veut une vérification rapide sans exécuter la suite complète
- L'utilisateur dit « teste ce parcours manuellement », « clique pour parcourir et vérifier », ou « assure-toi que l'interface fonctionne »
- Vous devez vérifier qu'une version nouvellement déployée se comporte correctement pour un parcours spécifique
- L'application utilise un framework difficile à instrumenter (Electron, Tauri, Qt, applications macOS/Windows natives)
- L'utilisateur demande explicitement de préférer la saisie informatique à Playwright pour une raison spécifique (vitesse, pas d'infra de test, CI non disponible)

## Quand ne pas utiliser

- Une suite Playwright, Cypress ou Selenium couvre déjà le parcours — exécutez d'abord les tests existants
- L'application nécessite une connexion avec des identifiants réels stockés dans un gestionnaire de mots de passe — ne cliquez pas sur les écrans d'identifiants
- Le parcours touche à des formulaires de paiement, des dossiers de santé ou tout écran contenant des informations personnelles — arrêtez et demandez à l'utilisateur
- Vous êtes dans un environnement de production — la saisie informatique en prod est à haut risque ; confirmez d'abord l'environnement
- L'écran n'est pas visible ou l'application n'est pas en cours d'exécution — ne tentez pas d'actions à l'aveugle
- L'utilisateur veut un artefact de test persistant et reproductible — écrivez plutôt un test Playwright

## Instructions

### Liste de contrôle de pré-vol

1. Confirmez que l'application cible est en cours d'exécution et visible à l'écran avant toute action.
2. Demandez quel environnement (local dev, staging, prod). Si prod, avertissez et exigez une confirmation explicite.
3. Identifiez le parcours utilisateur à tester : état initial, séquence d'actions, condition de succès.
4. Prenez une capture d'écran initiale pour établir l'état de base.

### Règles de sécurité

- N'interagissez jamais avec des écrans affichant : mots de passe, clés API, champs de carte de crédit, champs SSN, dossiers médicaux, soldes bancaires.
- Avant chaque clic, décrivez ce que vous êtes sur le point de faire et ce que vous vous attendez à voir.
- Après chaque action, prenez une capture d'écran et vérifiez que l'écran a changé comme prévu avant de continuer.
- Si l'écran affiche un état inattendu (erreur, mauvaise page, modal), arrêtez et signalez — ne continuez pas à cliquer à l'aveugle.
- Limitez chaque session de test à un seul parcours clairement délimité. Ne chaînez pas des parcours non liés.

### Boucle de test

Pour chaque étape du parcours utilisateur :

1. **Décrire** — Énoncez l'action que vous êtes sur le point d'effectuer et le résultat attendu.
2. **Agir** — Effectuez l'action unique (clic, saisie, défilement, appui sur une touche).
3. **Capture d'écran** — Capturez l'écran immédiatement après l'action.
4. **Assertion** — Vérifiez la capture d'écran pour l'état attendu :
   - Page/vue correcte chargée
   - Les éléments d'interface attendus sont visibles (étiquette de bouton, texte d'en-tête, champ de formulaire)
   - Pas de bannières d'erreur, messages de toast avec copie d'échec ou mises en page cassées
5. **Enregistrement** — Notez réussite/échec pour cette étape avec la référence de capture d'écran.

Répétez jusqu'à ce que la condition de succès soit atteinte ou qu'un échec soit détecté.

### Quand préférer la saisie informatique à Playwright

| Situation | Préférer |
|---|---|
| Pas d'infra de test existante, vérification rapide unique | Saisie informatique |
| Application Electron / native / pas d'accès DOM | Saisie informatique |
| Reproduction d'un bug de mise en page signalé par un utilisateur | Saisie informatique |
| Besoin d'un fichier de test partageable et exécutable | Playwright |
| Le parcours sera testé à chaque déploiement | Playwright |
| Pipeline CI disponible | Playwright |

### Résultats des rapports

Après avoir terminé le parcours, produisez un rapport concis :

```
Flow: [name]
Environment: [local/staging/prod]
Steps tested: [n]
Pass: [n]
Fail: [n]

Step-by-step:
1. [action] → PASS — [what was observed]
2. [action] → FAIL — [what was observed vs expected]

Screenshots: [list of captured screenshots]
Recommendation: [fix X on step 2 / all clear]
```

### Pièges courants

- Cliquer sur les coordonnées qui changent lors du défilement — faites d'abord défiler jusqu'à l'élément, puis cliquez
- Les animations retardant l'apparition d'un élément — attendez que l'élément se stabilise avant d'affirmer
- Les éléments Shadow DOM ou canvas qui semblent interactifs mais ne le sont pas — traitez comme des vérifications visuelles en lecture seule
- Les modales bloquant l'interface utilisateur sous-jacente — fermez ou rejetez toujours les modales avant d'affirmer l'état de la page

## Exemple

**Scénario** : Testez le parcours d'inscription pour une application Next.js locale à `http://localhost:3000`.

**Parcours défini par l'utilisateur** : Accédez à /signup, entrez l'e-mail et le mot de passe, cliquez sur « Créer un compte », vérifiez la redirection vers /dashboard avec un message de bienvenue.

**Exécution** :

1. Prenez une capture d'écran — confirmez que le navigateur est sur `/signup`, le formulaire est visible.
2. Cliquez sur le champ d'entrée d'e-mail. Tapez `testuser@example.com`. Capture d'écran — le champ contient l'e-mail.
3. Cliquez sur le champ de mot de passe. Tapez `TestPass123!`. Capture d'écran — le champ affiche les caractères masqués.
4. Cliquez sur le bouton « Créer un compte ». Capture d'écran — vérifiez l'état de chargement.
5. Attendez la redirection. Capture d'écran — la barre d'adresse affiche `/dashboard`.
6. Assertion : le titre « Welcome, testuser » est visible à l'écran. PASS.

**Rapport** :
```
Flow: Signup → Dashboard
Environment: local
Steps tested: 5
Pass: 5 / Fail: 0

All steps passed. User can complete signup and reach the dashboard.
```

Si l'étape 5 affichait plutôt un toast « Something went wrong », le rapport marquait FAIL à l'étape 5 avec la capture d'écran et s'arrêtait — pas d'autres clics.
