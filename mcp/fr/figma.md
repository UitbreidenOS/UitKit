# MCP : Figma

Lisez les conceptions Figma directement à l'intérieur de Claude Code. Extrayez les spécifications de composants, les tokens de couleur, les échelles de typographie, la structure des couches et exportez les ressources — puis générez immédiatement du code qui correspond à la conception, sans basculer entre les onglets du navigateur et le terminal.

## Pourquoi vous avez besoin de ceci

L'écart entre la conception et la mise en œuvre est l'endroit où la cohérence s'effondre. Avec Figma MCP :
- Claude lit la spécification réelle au lieu de s'appuyer sur votre description de celle-ci
- Les tokens de couleur, les valeurs d'espacement et les échelles de type proviennent directement de la source de vérité
- Les composants sont générés avec les dimensions correctes, pas des approximations
- Les commentaires de conception (questions ouvertes, notes de redéfinition) sont accessibles par programme
- Vous pouvez comparer une implémentation active par rapport à la spécification Figma en une seule invite

## Installation

```bash
npm install -g figma-mcp
```

## Configuration

Ajoutez à `~/.claude.json` ou au projet `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["figma-mcp"],
      "env": {
        "FIGMA_API_TOKEN": "your-figma-personal-access-token"
      }
    }
  }
}
```

## Outils clés

- `get_file` — récupérer la structure complète d'un fichier Figma (tous les frames, composants et couches)
- `get_node` — obtenir un frame, composant ou couche spécifique par ID de nœud
- `get_styles` — extraire tous les styles de couleur, typographie et effet définis dans le fichier
- `get_components` — lister tous les composants du fichier avec ses propriétés
- `get_comments` — lire les commentaires de conception, utiles pour signaler les questions ouvertes ou les décisions en attente
- `export_node` — exporter n'importe quel nœud en PNG, SVG ou PDF à une échelle spécifiée
- `get_file_versions` — afficher l'historique des versions d'un fichier

## Exemples d'utilisation

```
Lisez la conception de la page de paiement (ID de nœud : 123:456) et générez
le composant React avec les classes Tailwind qui correspondent exactement à l'espacement,
les couleurs et la typographie dans la spécification.
```

```
Extrayez tous les styles de couleur de notre fichier de système de conception
(clé de fichier : aBcDeFgHiJkL) et générez une configuration de thème Tailwind
avec les valeurs hexadécimales correctes et les noms de token.
```

```
Obtenir l'échelle de typographie de notre fichier de conception Figma et créer
une feuille de propriétés CSS personnalisées avec --font-size-xs jusqu'à --font-size-4xl.
```

```
Listez tous les commentaires de conception ouverts dans le fichier et créez un problème GitHub
pour chacun, étiqueté avec le label « design-feedback ».
```

```
Comparez le composant Button dans le fichier Figma à notre implémentation actuelle
dans src/components/Button.tsx et listez les divergences visuelles dans l'espacement,
la couleur ou le poids de la police.
```

## Authentification

1. Connectez-vous à Figma et ouvrez **Paramètres du compte** (cliquez sur votre avatar → Paramètres)
2. Accédez à **Sécurité** → **Tokens d'accès personnels**
3. Cliquez sur **Générer un nouveau token**, donnez-lui un nom et copiez la valeur
4. Un token en lecture seule est suffisant pour toutes les opérations de lecture/export — aucune portée d'écriture requise sauf si vous souhaitez créer des commentaires

Définissez le token en tant que `FIGMA_API_TOKEN` dans le bloc de configuration ci-dessus. Ne le commité pas au contrôle de version.

## Conseils

**Trouver les clés de fichier et les ID de nœud :** La clé de fichier est la chaîne entre `/file/` et le `/` suivant dans l'URL Figma. L'ID de nœud est la valeur du paramètre de requête `node-id` (par exemple, `node-id=123-456` → utilisez `123:456` avec deux-points).

**Limites de débit :** L'API REST Figma permet 600 requêtes par minute. Pour les grands systèmes de conception avec des centaines de composants, regroupez vos requêtes plutôt que de boucler sur chaque nœud individuellement.

**Export des ressources :** `export_node` retourne des données binaires. Dites à Claude où écrire le fichier : `« Exportez le nœud 123:456 en SVG et enregistrez-le dans src/assets/icons/arrow.svg »`.

**Combinaison d'outils :** Utilisez `get_styles` d'abord pour créer votre carte de tokens, puis `get_node` pour les composants individuels. Cela évite les appels API redondants lors de la génération d'un système de conception complet.

**Flux de travail de comparaison visuelle :** Prenez une capture d'écran du composant implémenté avec Playwright MCP, puis récupérez la spécification Figma avec ce serveur. Demandez à Claude de comparer les deux côte à côte et de lister les différences.

---
