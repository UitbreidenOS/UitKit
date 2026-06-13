# Desarrollo de CLI

## Cuándo activar
Construyendo herramientas de línea de comandos en cualquier lenguaje, o cuando el usuario menciona Commander, Click, Cobra, Typer, yargs o Inquirer.

## Cuándo NO usar
- Paneles de control web o herramientas GUI — incluso aquellas que envuelven lógica CLI
- Scripts de shell bajo 50 líneas que no necesitan análisis de argumentos
- Scripts de herramientas internas que nunca serán ejecutados por otros que no sean el autor con parámetros codificados

## Instrucciones

### Principios de Diseño de Argumentos
- Agrupar operaciones relacionadas como subcomandos (`tool deploy`, `tool rollback`) en lugar de banderas
- Banderas para comportamiento opcional; args posicionales para el sujeto primario (`tool build ./src`)
- Siempre implementar `--dry-run` — cada comando de mutación debe soportarlo
- `--quiet` suprime toda salida excepto errores; `--verbose` o `-v` agrega detalle de depuración
- Las banderas largas usan `--kebab-case`; las banderas cortas usan caracteres únicos solo para las más comunes

### Precedencia de Configuración (aplicar universalmente)
```
Bandera CLI > variable de entorno > archivo de configuración > predeterminado integrado
```
Documentar este orden en texto de ayuda. Nunca ignorar silenciosamente un valor proporcionado por el usuario.

### Códigos de Salida
- `0` — éxito
- `1` — error en tiempo de ejecución (archivo no encontrado, fallo de red, error de API)
- `2` — mal uso (argumentos malos, bandera desconocida, parámetro requerido faltante)
Evitar salidas no-cero para escenarios "sin resultados" — eso es un éxito con salida vacía.

### Node.js (Commander + Inquirer + Ora)
```ts
import { program } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';

program
  .name('mytool')
  .version('1.0.0')
  .description('Hace cosas');

program
  .command('deploy <environment>')
  .description('Desplegar en un entorno')
  .option('--dry-run', 'Vista previa sin ejecutar')
  .option('-f, --force', 'Saltar confirmación')
  .action(async (environment, opts) => {
    if (!opts.force) {
      const { confirmed } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmed', message: `¿Desplegar en ${environment}?` },
      ]);
      if (!confirmed) process.exit(0);
    }
    const spinner = ora('Desplegando...').start();
    // ...
    spinner.succeed(chalk.green('Desplegado exitosamente'));
  });

program.parse();
```

Usar `Listr2` para flujos multi-paso donde cada paso tiene su propio estado:
```ts
import { Listr } from 'listr2';
const tasks = new Listr([
  { title: 'Lint', task: () => runLint() },
  { title: 'Prueba', task: () => runTests() },
  { title: 'Compilación', task: () => runBuild() },
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
        typer.confirm(f"¿Desplegar en {environment}?", abort=True)
    for step in track(steps, description="Desplegando..."):
        run_step(step)
    console.print("[green]Desplegado exitosamente[/green]")

if __name__ == "__main__":
    app()
```

### Go (Cobra + Viper)
```go
var rootCmd = &cobra.Command{Use: "mytool"}

var deployCmd = &cobra.Command{
    Use:   "deploy [environment]",
    Short: "Desplegar en un entorno",
    Args:  cobra.ExactArgs(1),
    RunE:  runDeploy,
}

func init() {
    deployCmd.Flags().Bool("dry-run", false, "Vista previa sin ejecutar")
    viper.BindPFlag("dry_run", deployCmd.Flags().Lookup("dry-run"))
    rootCmd.AddCommand(deployCmd)
}
```
Viper lee configuración desde `~/.config/mytool/config.yaml` automáticamente cuando se configura con `viper.SetConfigName("config")`.

### Ubicación del Archivo de Configuración
Seguir especificación XDG Base Directory:
- Linux/macOS: `$XDG_CONFIG_HOME/tool/config.yaml` (predeterminado a `~/.config/tool/config.yaml`)
- Windows: `%APPDATA%\tool\config.yaml`
Nunca poner configuración en el directorio de trabajo por defecto — contamina repositorios de proyecto.

### Finalización de Shell
Siempre generar scripts de completación para bash, zsh y fish:
- Commander: `program.command('completion').action(() => program.generateCompletion())`
- Cobra: subcomando `completion` integrado genera los tres
- Typer: `app()` con banderas `--install-completion` y `--show-completion` incluidas automáticamente

### Rutas Multiplataforma
Usar `path.join()` (Node) o `os.path.join()` (Python) — nunca concatenación de cadenas. En Windows, `\` vs `/` romperá rutas codificadas. Usar `os.homedir()` / `os.path.expanduser("~")` para referencias de directorio de inicio.

## Ejemplo

Construir un CLI de despliegue con tres subcomandos: `deploy`, `rollback`, `status`.

```
mytool deploy staging --dry-run
  → Muestra qué se desplegaría, sale con 0

mytool rollback production --force
  → Salta confirmación, ejecuta reversión, sale con 0 al éxito

mytool status
  → Lee ~/.config/mytool/config.yaml para entorno predeterminado
  → Imprime tabla de estado usando Rich/Chalk, sale con 0

mytool deploy --unknown-flag
  → Imprime uso, sale con 2
```

Finalización de shell instalada con `mytool completion --shell zsh >> ~/.zshrc`.

---
