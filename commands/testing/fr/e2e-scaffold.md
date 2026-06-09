---
description: Générer des tests de bout en bout pour une page, une route ou un flux utilisateur
argument-hint: "[page or flow description]"
---
Vous générez des tests de bout en bout pour: $ARGUMENTS

Suivez ces étapes:

1. Détectez le framework E2E utilisé en vérifiant les fichiers de configuration et les dépendances:
   - Playwright: `playwright.config.ts`, `@playwright/test`
   - Cypress: `cypress.config.ts`, `cypress/`
   - Puppeteer: `puppeteer` in package.json
   - Si aucun n'est trouvé, défaut à Playwright et notez cette hypothèse.

2. Identifiez la cible — une page, une route ou un flux utilisateur nommé — à partir de l'argument. En cas d'ambiguïté, déduisez à partir de la structure des répertoires et des fichiers de test existants.

3. Lisez les tests E2E existants du projet pour correspondre à:
   - Les conventions d'emplacement des fichiers (par exemple, `e2e/`, `tests/`, `cypress/e2e/`)
   - Les motifs d'assistant/fixture déjà utilisés
   - La configuration de l'URL de base et la configuration d'authentification si présentes

4. Générez un fichier de test contenant:
   - Au moins un bloc `describe` nommé d'après la cible
   - Un test de chemin heureux couvrant l'action principale (charger, soumettre, naviguer)
   - Un test d'erreur/cas limites (entrée invalide, 404, état vide)
   - Un test pour tout élément interactif critique visible dans la cible
   - Configuration appropriée de `beforeEach` (naviguer vers la page, simuler l'authentification si nécessaire)

5. Utilisez les sélecteurs idiomatiques du framework:
   - Playwright/Cypress: préférez `getByRole`, `getByLabel`, `getByTestId` aux sélecteurs CSS
   - Puppeteer: utilisez `waitForSelector` avec des attributs sémantiques

6. Ne simulez pas les demandes réseau sauf si l'argument inclut explicitement "mock" ou si le projet utilise déjà les intercepteurs de manière généralisée.

7. Ajoutez un commentaire `// TODO:` pour toute assertion qui nécessite une valeur connue uniquement à l'exécution (par exemple, IDs dynamiques, horodatages).

8. Placez le fichier dans le bon répertoire. Ne créez pas de nouveaux répertoires sauf si aucun répertoire E2E n'existe.

9. Résultat:
   - Le chemin du fichier créé
   - Une brève liste de ce que chaque test couvre
   - Toutes les hypothèses faites (choix du framework, URL de base, authentification)
