---
name: cli-development
description: "Développement de CLI : construire des outils de ligne de commande en Node.js, Python, Go avec argument parsing, config files, shell completion et UX interactive"
---

# CLI Development Skill

## Quand activer
Construire des outils de ligne de commande dans n'importe quel langage, ou quand l'utilisateur mentionne Commander, Click, Cobra, Typer, yargs ou Inquirer.

## Quand ne PAS utiliser
- Tableaux de bord Web ou outils GUI — même ceux qui enveloppent la logique CLI
- Scripts shell sous 50 lignes qui ne nécessitent pas d'analyse d'arguments
- Scripts d'outils internes qui ne seront jamais exécutés que par l'auteur avec des params codés en dur

## Instructions

### Principes de conception des arguments
- Grouper les opérations connexes en tant que sous-commandes (`tool deploy`, `tool rollback`) plutôt que des flags
- Flags pour le comportement optionnel ; args positionnels pour le sujet principal (`tool build ./src`)
- Toujours implémenter `--dry-run` — chaque commande de mutation doit le supporter
- `--quiet` supprime toute sortie sauf les erreurs ; `--verbose` ou `-v` ajoute le détail de débogage
- Les longs flags utilisent `--kebab-case` ; les courts flags utilisent des caractères uniques seulement pour les plus communs

### Précédence de config (appliquer universellement)
```
CLI flag > environment variable > config file > built-in default
```
Documenter cet ordre dans le texte d'aide. Ne jamais ignorer silencieusement une valeur fournie par l'utilisateur.

### Codes de sortie
- `0` — succès
- `1` — erreur d'exécution (fichier introuvable, défaillance réseau, erreur API)
- `2` — mauvais usage (arguments incorrects, flag inconnue, param requis manquant)
Éviter les sorties non-zéro pour les scénarios « aucun résultat » — c'est un succès avec sortie vide.

### Node.js (Commander + Inquirer + Ora)
```ts
import { program } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';

program
  .name('mytool')
  .version('1.0.0')
  .description('Does things');

program
  .command('deploy <environment>')
  .description('Déployer vers un environnement')
  .option('--dry-run', 'Aperçu sans exécuter')
  .option('-f, --force', 'Ignorer la confirmation')
  .action(async (environment, opts) => {
    if (!opts.force) {
      const { confirmed } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmed', message: `Déployer vers ${environment}?` },
      ]);
      if (!confirmed) process.exit(0);
    }
    const spinner = ora('Déploiement...').start();
    // ...
    spinner.succeed(chalk.green('Déployé avec succès'));
  });

program.parse();
```

Utiliser `Listr2` pour les flux de travail multi-étapes où chaque étape a son propre statut :
```ts
import { Listr } from 'listr2';
const tasks = new Listr([
  { title: 'Lint', task: () => runLint() },
  { title: 'Test', task: () => runTests() },
  { title: 'Build', task: () => runBuild() },
]);
await tasks.run();
```

### Python (Typer + Rich)
```python
import typer
from rich.console import Console
from rich.progress import track

app = typer.Typer()
console = Console()

@app.command()
def deploy(
    environment: str,
    dry_run: bool = typer.Option(False, "--dry-run"),
    force: bool = typer.Option(False, "--force", "-f"),
):
    if not force:
        typer.confirm(f"Déployer vers {environment}?", abort=True)
    for step in track(steps, description="Déploiement..."):
        run_step(step)
    console.print("[green]Déployé avec succès[/green]")

if __name__ == "__main__":
    app()
```

### Go (Cobra + Viper)
```go
var rootCmd = &cobra.Command{Use: "mytool"}

var deployCmd = &cobra.Command{
    Use:   "deploy [environment]",
    Short: "Déployer vers un environnement",
    Args:  cobra.ExactArgs(1),
    RunE:  runDeploy,
}

func init() {
    deployCmd.Flags().Bool("dry-run", false, "Aperçu sans exécuter")
    viper.BindPFlag("dry_run", deployCmd.Flags().Lookup("dry-run"))
    rootCmd.AddCommand(deployCmd)
}
```
Viper lit la config depuis `~/.config/mytool/config.yaml` automatiquement quand configuré avec `viper.SetConfigName("config")`.

### Localisation du fichier de config
Suivre la spécification XDG Base Directory :
- Linux/macOS: `$XDG_CONFIG_HOME/tool/config.yaml` (par défaut `~/.config/tool/config.yaml`)
- Windows: `%APPDATA%\tool\config.yaml`
Ne jamais mettre la config dans le répertoire de travail par défaut — cela pollue les repos du projet.

### Complément de shell
Toujours générer des scripts de completion pour bash, zsh et fish :
- Commander: `program.command('completion').action(() => program.generateCompletion())`
- Cobra: la sous-commande `completion` intégrée génère tous les trois
- Typer: `app()` avec les flags `--install-completion` et `--show-completion` inclus automatiquement

### Chemins multi-plateformes
Utiliser `path.join()` (Node) ou `os.path.join()` (Python) — ne jamais concaténation de chaînes. Sur Windows, `\` vs `/` cassera les chemins codés en dur. Utiliser `os.homedir()` / `os.path.expanduser("~")` pour les références au répertoire personnel.

## Exemple

Construire une CLI de déploiement avec trois sous-commandes : `deploy`, `rollback`, `status`.

```
mytool deploy staging --dry-run
  → Montre ce qui serait déployé, quitte 0

mytool rollback production --force
  → Saute la confirmation, exécute le rollback, quitte 0 en cas de succès

mytool status
  → Lit ~/.config/mytool/config.yaml pour l'environnement par défaut
  → Imprime le tableau de statut en utilisant Rich/Chalk, quitte 0

mytool deploy --unknown-flag
  → Imprime l'utilisation, quitte 2
```

Completion de shell installée avec `mytool completion --shell zsh >> ~/.zshrc`.

---
