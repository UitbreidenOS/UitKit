# CLI Development

## Wanneer activeren
Opdrachtregelhulpmiddelen bouwen in elke taal, of wanneer de gebruiker Commander, Click, Cobra, Typer, yargs of Inquirer noemt.

## Wanneer NIET gebruiken
- Webdashboards of GUI-hulpmiddelen — zelfs die welke CLI-logica verpakken
- Shell-scripts onder 50 regels die geen argument-parsing nodig hebben
- Interne tooling-scripts die alleen ooit door de auteur met hardcoded params worden uitgevoerd

## Instructies

### Argumentontwerp Principes
- Groepeer gerelateerde bewerkingen als subcommando's (`tool deploy`, `tool rollback`) in plaats van vlaggen
- Vlaggen voor optioneel gedrag; positionele args voor het primaire onderwerp (`tool build ./src`)
- Implementeer altijd `--dry-run` — elke mutatiecommando moet dit ondersteunen
- `--quiet` onderdrukt alle output behalve fouten; `--verbose` of `-v` voegt debug-detail toe
- Lange vlaggen gebruiken `--kebab-case`; korte vlaggen gebruiken enkele karakters voor de meest voorkomende slechts

### Config Precedentie (universeel toepassen)
```
CLI flag > environment variable > config file > built-in default
```
Documenteer deze volgorde in help-tekst. Negeer nooit stilletjes een door de gebruiker geleverde waarde.

### Exit Codes
- `0` — succes
- `1` — runtime-fout (bestand niet gevonden, netwerkfout, API-fout)
- `2` — misbruik (slechte argumenten, onbekende vlag, ontbrekende vereiste param)
Vermijd non-nul exits voor "geen resultaten"-scenario's — dat is succes met lege output.

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
  .description('Deploy to an environment')
  .option('--dry-run', 'Preview without executing')
  .option('-f, --force', 'Skip confirmation')
  .action(async (environment, opts) => {
    if (!opts.force) {
      const { confirmed } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmed', message: `Deploy to ${environment}?` },
      ]);
      if (!confirmed) process.exit(0);
    }
    const spinner = ora('Deploying...').start();
    // ...
    spinner.succeed(chalk.green('Deployed successfully'));
  });

program.parse();
```

Gebruik `Listr2` voor multi-stap workflows waarbij elke stap zijn eigen status heeft:
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
        typer.confirm(f"Deploy to {environment}?", abort=True)
    for step in track(steps, description="Deploying..."):
        run_step(step)
    console.print("[green]Deployed successfully[/green]")

if __name__ == "__main__":
    app()
```

### Go (Cobra + Viper)
```go
var rootCmd = &cobra.Command{Use: "mytool"}

var deployCmd = &cobra.Command{
    Use:   "deploy [environment]",
    Short: "Deploy to an environment",
    Args:  cobra.ExactArgs(1),
    RunE:  runDeploy,
}

func init() {
    deployCmd.Flags().Bool("dry-run", false, "Preview without executing")
    viper.BindPFlag("dry_run", deployCmd.Flags().Lookup("dry-run"))
    rootCmd.AddCommand(deployCmd)
}
```
Viper leest config van `~/.config/mytool/config.yaml` automatisch wanneer geconfigureerd met `viper.SetConfigName("config")`.

### Config-bestandslocatie
Volg XDG Base Directory spec:
- Linux/macOS: `$XDG_CONFIG_HOME/tool/config.yaml` (standaardwaarde naar `~/.config/tool/config.yaml`)
- Windows: `%APPDATA%\tool\config.yaml`
Zet config nooit in de werkmap — dit vervuilt projectrepo's.

### Shell Completion
Genereer altijd completion scripts voor bash, zsh en fish:
- Commander: `program.command('completion').action(() => program.generateCompletion())`
- Cobra: ingebouwde `completion`-subcommando genereert alle drie
- Typer: `app()` met `--install-completion` en `--show-completion` vlaggen automatisch inbegrepen

### Cross-Platform Paden
Gebruik `path.join()` (Node) of `os.path.join()` (Python) — nooit string-samenvoeging. Op Windows breekt `\` vs `/` hardcoded paden. Gebruik `os.homedir()` / `os.path.expanduser("~")` voor home directory-referenties.

## Voorbeeld

Het bouwen van een implementatie-CLI met drie subcommando's: `deploy`, `rollback`, `status`.

```
mytool deploy staging --dry-run
  → Shows what would be deployed, exits 0

mytool rollback production --force
  → Skips confirmation, executes rollback, exits 0 on success

mytool status
  → Reads ~/.config/mytool/config.yaml for default environment
  → Prints status table using Rich/Chalk, exits 0

mytool deploy --unknown-flag
  → Prints usage, exits 2
```

Shell completion geïnstalleerd met `mytool completion --shell zsh >> ~/.zshrc`.

---
