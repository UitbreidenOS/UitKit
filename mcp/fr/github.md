# MCP : GitHub

Interagissez avec GitHub directement depuis Claude Code. Lisez les problèmes, ouvrez des PRs, examinez le code, recherchez les référentiels et gérez les versions — tout sans quitter le terminal ni basculer vers un navigateur.

## Pourquoi vous avez besoin de ceci

L'interface CLI `gh` couvre la plupart des opérations Git locales, mais la surface API de GitHub est beaucoup plus grande. Avec GitHub MCP :
- Claude peut rechercher du code dans toute votre organisation, pas seulement le référentiel actuel
- Le triage des problèmes, l'étiquetage et les commentaires se font dans la même session que vos modifications de code
- La création et l'examen des PR font partie du flux de travail, pas une tâche de navigateur séparée
- Les métadonnées du référentiel, l'historique des commits et les contenus de fichiers de toute branche peuvent être interrogés
- Les tâches multi-référentiels (audits de dépendances, recherches à l'échelle de l'organisation) deviennent des invites uniques

## Installation

```bash
npm install -g @modelcontextprotocol/server-github
```

## Configuration

Ajoutez à `~/.claude.json` ou au projet `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-pat-here"
      }
    }
  }
}
```

## Outils clés

- `create_or_update_file` — créer ou mettre à jour un fichier dans un référentiel
- `search_repositories` — rechercher GitHub pour les référentiels par mot-clé ou sujet
- `create_repository` — créer un nouveau référentiel sous votre compte ou organisation
- `get_file_contents` — lire un fichier de n'importe quelle branche de n'importe quel référentiel accessible
- `push_files` — pousser plusieurs modifications de fichiers en tant que commit unique
- `create_issue` — ouvrir un nouveau problème avec titre, corps, étiquettes et assignés
- `create_pull_request` — ouvrir une PR avec titre, corps, base et branche principale
- `fork_repository` — forcer un référentiel sur votre compte
- `create_branch` — créer une nouvelle branche à partir de n'importe quelle référence
- `list_commits` — obtenir l'historique des commits pour une branche ou un chemin de fichier
- `list_issues` / `get_issue` — interroger les problèmes par état, étiquette, assigné ou jalon
- `add_issue_comment` — ajouter un commentaire à n'importe quel problème ou PR
- `search_code` — rechercher du code sur GitHub en utilisant la syntaxe de recherche de code
- `search_issues` — rechercher les problèmes et PRs avec la syntaxe de requête complète de GitHub

## Exemples d'utilisation

```
Listez tous les problèmes ouverts dans ce référentiel étiquetés « bug », triés par nombre de commentaires,
et donnez-moi un résumé prioritaire de ce qui doit être corrigé en premier.
```

```
Lisez la description de la PR #123 et écrivez un commentaire détaillé d'examen de code
sur les modifications d'authentification — concentrez-vous sur la sécurité et les cas limites.
```

```
Recherchez tous les commentaires TODO et FIXME dans le code source en utilisant search_code,
puis créez un problème GitHub pour chacun dans le projet TECH,
assigné à moi avec l'étiquette « tech-debt ».
```

```
Créez une branche de version appelée release/2.4.0 à partir de main, puis ouvrez une PR
vers main avec le journal des modifications pour tout ce qui a été fusionné dans les deux dernières semaines.
```

```
Recherchez tous les référentiels de notre organisation pour les fichiers package.json qui dépendent de
la version lodash 4.17.20 ou antérieure et listez les référentiels affectés.
```

## Authentification

1. Allez sur **GitHub → Paramètres → Paramètres développeur → Tokens d'accès personnels**
2. Choisissez **Tokens granulaires** (recommandé) ou **Tokens (classique)**
3. Pour les tokens classiques, sélectionnez ces portées : `repo`, `read:org`, `read:user`
4. Pour les tokens granulaires, accordez les permissions **Contents**, **Issues**, **Pull requests** et **Metadata** sur les référentiels dont vous avez besoin
5. Copiez le token et définissez-le comme `GITHUB_PERSONAL_ACCESS_TOKEN` dans le bloc de configuration ci-dessus

## Conseils

**Utilisez des tokens granulaires :** Limitez le token à des référentiels spécifiques plutôt qu'à tout votre compte. Si le token fuit, le rayon de dégât est contenu.

**Limites de débit :** L'API GitHub permet 5 000 requêtes par heure pour les requêtes authentifiées. Les recherches de code à l'échelle de l'organisation ont un compte séparé (30 requêtes par minute) — mettez en cache les résultats lors de l'exécution d'opérations en masse.

**Combinaison avec git local :** GitHub MCP gère la surface API distante ; utilisez vos commandes `git` locales pour la préparation, la validation et le push. Les deux se complètent dans la même session.

**Syntaxe de recherche de code :** `search_code` prend en charge la syntaxe de requête complète de GitHub — `language:typescript repo:myorg/myrepo "TODO"` fonctionne exactement comme dans l'interface utilisateur GitHub. Utilisez-le pour des requêtes ciblées plutôt que de récupérer des fichiers entiers.

**Qualité du corps de la PR :** Lors de l'utilisation de `create_pull_request`, donnez à Claude le diff et le contexte du problème et demandez-lui de rédiger le corps de la PR. Le résultat sera plus utile qu'un placeholder rempli de modèle.

---
