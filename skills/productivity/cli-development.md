---
name: cli-development
updated: 2026-06-13
---

# CLI Development

## When to activate
Building command-line tools in any language, or when the user mentions Commander, Click, Cobra, Typer, yargs, or Inquirer.

## When NOT to use
- Web dashboards or GUI tools — even those that wrap CLI logic
- Shell scripts under 50 lines that don't need argument parsing
- Internal tooling scripts that will only ever be run by the author with hardcoded params

## Instructions

### Argument Design Principles
- Group related operations as subcommands (`tool deploy`, `tool rollback`) rather than flags
- Flags for optional behavior; positional args for the primary subject (`tool build ./src`)
- Always implement `--dry-run` — every mutation command should support it
- `--quiet` suppresses all output except errors; `--verbose` or `-v` adds debug detail
- Long flags use `--kebab-case`; short flags use single characters for the most common ones only

### Config Precedence (apply universally)
```
CLI flag > environment variable > config file > built-in default
```
Document this order in help text. Never silently ignore a user-supplied value.

### Exit Codes
- `0` — success
- `1` — runtime error (file not found, network failure, API error)
- `2` — misuse (bad arguments, unknown flag, missing required param)
Avoid non-zero exits for "no results" scenarios — that is a success with empty output.

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

Use `Listr2` for multi-step workflows where each step has its own status:
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
Viper reads config from `~/.config/mytool/config.yaml` automatically when configured with `viper.SetConfigName("config")`.

### Config File Location
Follow XDG Base Directory spec:
- Linux/macOS: `$XDG_CONFIG_HOME/tool/config.yaml` (defaults to `~/.config/tool/config.yaml`)
- Windows: `%APPDATA%\tool\config.yaml`
Never put config in the working directory by default — it pollutes project repos.

### Shell Completion
Always generate completion scripts for bash, zsh, and fish:
- Commander: `program.command('completion').action(() => program.generateCompletion())`
- Cobra: built-in `completion` subcommand generates all three
- Typer: `app()` with `--install-completion` and `--show-completion` flags included automatically

### Cross-Platform Paths
Use `path.join()` (Node) or `os.path.join()` (Python) — never string concatenation. On Windows, `\` vs `/` will break hardcoded paths. Use `os.homedir()` / `os.path.expanduser("~")` for home directory references.

## Example

Building a deployment CLI with three subcommands: `deploy`, `rollback`, `status`.

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

Shell completion installed with `mytool completion --shell zsh >> ~/.zshrc`.

---
