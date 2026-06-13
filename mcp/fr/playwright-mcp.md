# MCP : Playwright

Contrôlez un vrai navigateur directement depuis Claude Code. Playwright MCP laisse Claude naviguer sur les pages, cliquer sur les éléments, remplir les formulaires, prendre des captures d'écran et extraire le contenu — transformant l'automatisation du navigateur en une conversation naturelle au lieu d'un exercice de script.

## Pourquoi vous avez besoin de ceci

Les tâches basées sur le navigateur vous forcent normalement à quitter le terminal : ouvrez un navigateur, cliquez manuellement, copiez-collez les résultats. Avec Playwright MCP :
- Claude peut tester les flux d'interface utilisateur de bout en bout sans que vous touchiez la souris
- Les captures d'écran donnent à Claude une confirmation visuelle de ce que la page ressemble réellement
- Le remplissage de formulaires, les flux de connexion et les interactions multi-étapes s'exécutent en une seule invite
- Le grattage et l'extraction de contenu deviennent des one-liners au lieu de scripts
- Fonctionne en mode headless en CI ou en mode headed localement pour le débogage

## Installation

```bash
# Installer le serveur MCP
npm install -g @playwright/mcp

# Installer le binaire du navigateur Chromium (requis)
npx playwright install chromium
```

## Configuration

Ajoutez à `~/.claude.json` ou au projet `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true"
      }
    }
  }
}
```

Pour le mode headed (fenêtre de navigateur visible, utile pour le débogage) :

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false"
      }
    }
  }
}
```

## Outils clés

- `browser_navigate` — aller à une URL
- `browser_screenshot` — capturer la page actuelle en image
- `browser_click` — cliquer sur un élément par sélecteur CSS ou coordonnées
- `browser_type` — taper du texte dans un champ d'entrée
- `browser_select_option` — choisir une valeur dans un menu déroulant
- `browser_scroll` — faire défiler la page d'une quantité de pixels ou jusqu'à un élément
- `browser_evaluate` — exécuter JavaScript dans le contexte de la page et retourner le résultat
- `browser_get_text` — extraire le texte visible de la page ou d'un élément spécifique
- `browser_wait_for` — attendre qu'un élément apparaisse, que le réseau se calme ou une expiration

## Exemples d'utilisation

```
Naviguer vers la page de connexion, remplir les identifiants de test, soumettre le formulaire,
et prendre une capture d'écran pour que je puisse vérifier que le tableau de bord se charge correctement.
```

```
Allez sur notre environnement de staging à https://staging.myapp.com/dashboard,
extrayez tout le texte des éléments de message d'erreur et retournez-les comme liste.
```

```
Testez le flux de paiement : naviguez vers la page produit, ajoutez le premier élément
au panier, procédez à la caisse et vérifiez que le résumé de la commande affiche
l'élément correct et le prix.
```

```
Grattez la page de tarification sur https://myapp.com/pricing — extrayez les noms de plan,
les prix et les listes de fonctionnalités, puis retournez tout en JSON structuré.
```

```
Prenez une capture d'écran de chaque page de la navigation principale et enregistrez-les
dans /screenshots avec des noms de fichiers correspondant aux labels de navigation.
```

## Authentification

Aucune clé API requise. Le navigateur s'exécute localement sur votre machine. Pour les sites qui nécessitent une connexion :
- Utilisez `browser_navigate` + `browser_type` + `browser_click` pour vous authentifier dans le cadre de l'invite
- Pour les sessions persistantes, utilisez `browser_evaluate` pour injecter les cookies d'authentification directement :
  ```
  Définir le cookie d'authentification : document.cookie = "session=abc123; path=/"
  ```

## Conseils

**Headless vs headed :** Par défaut, headless — plus rapide et sûr pour CI. Basculez vers `PLAYWRIGHT_HEADLESS=false` quand un flux échoue et que vous voulez regarder ce que Claude clique.

**Taille de la fenêtre d'affichage :** Si une page se comporte différemment à des largeurs mobile vs desktop, spécifiez-la dans l'invite : `« Définir la fenêtre d'affichage à 375x812 avant de prendre la capture d'écran »`.

**Attendre le contenu :** Les pages dynamiques qui chargent les données de manière asynchrone peuvent tromper `browser_get_text`. Demandez à Claude d'utiliser `browser_wait_for` avec une condition d'inactivité réseau avant d'extraire le contenu.

**Playwright MCP vs scripts de test Playwright :** Utilisez ce MCP pour l'automatisation exploratoire, unique ou conversationnelle. Écrivez un vrai script de test Playwright quand vous avez besoin de tests répétables et versionnés qui s'exécutent en CI à chaque push.

**Flux multi-étapes :** Enchaînez les outils naturellement en une seule invite. Claude séquencera `navigate → wait → type → click → screenshot` dans le bon ordre sans que vous spécifiiez chaque étape séparément.

---
