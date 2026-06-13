---
description: Générer un échafaudage de tests end-to-end pour une page, une route ou un flux utilisateur
argument-hint: "[description de la page ou du flux]"
---
Vous générez un échafaudage de tests end-to-end pour : $ARGUMENTS

Suivez ces étapes :

1. Détectez le framework E2E utilisé en vérifiant les fichiers de configuration et les dépendances :
   - Playwright : `playwright.config.ts`, `@playwright/test`
   - Cypress : `cypress.config.ts`, `cypress/`
   - Puppeteer : `puppeteer` dans package.json
   - Si aucun n'est trouvé, utilisez par défaut Playwright et notez cette hypothèse.

2. Identifiez la cible — une page, une route ou un flux utilisateur nommé — à partir de l'argument. Si ambiguë, déduisez-la à partir de la structure des répertoires et des fichiers de test existants.

3. Lisez les tests E2E existants du projet pour correspondre à :
   - Les conventions de localisation de fichiers (par exemple, `e2e/`, `tests/`, `cypress/e2e/`)
   - Les modèles d'assistants/fixtures déjà utilisés
   - La configuration de l'URL de base et la configuration de l'authentification si présentes

4. Générez un fichier de test contenant :
   - Au moins un bloc `describe` nommé d'après la cible
   - Un test happy-path couvrant l'action principale (charger, soumettre, naviguer)
   - Un test pour les cas d'erreur/limite (entrée invalide, 404, état vide)
   - Un test pour tout élément interactif critique visible dans la cible
   - Une configuration appropriée de `beforeEach` (naviguer vers la page, simuler l'authentification si nécessaire)

5. Utilisez les sélecteurs idiomatiques du framework :
   - Playwright/Cypress : préférez `getByRole`, `getByLabel`, `getByTestId` aux sélecteurs CSS
   - Puppeteer : utilisez `waitForSelector` avec des attributs sémantiques

6. Ne simulez pas les requêtes réseau sauf si l'argument inclut explicitement "mock" ou si le projet utilise déjà des intercepteurs de manière généralisée.

7. Ajoutez un commentaire `// TODO:` pour toute assertion qui nécessite une valeur connue seulement à l'exécution (par exemple, IDs dynamiques, horodatages).

8. Placez le fichier dans le bon répertoire. Ne créez pas de nouveaux répertoires sauf si aucun répertoire E2E n'existe.

9. Résultat :
   - Le chemin du fichier créé
   - Une brève liste de ce que chaque test couvre
   - Toutes les hypothèses formulées (choix du framework, URL de base, authentification)
