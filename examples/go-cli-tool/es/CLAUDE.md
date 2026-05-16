> 🇪🇸 Versión en español. [Versión en inglés](../CLAUDE.md).

# CLAUDE.md — Herramienta CLI en Go

Una aplicación CLI de Go con calidad de producción. Usa Cobra para la estructura de comandos, Viper para la configuración y sigue el diseño estándar de proyectos Go. Construida para distribuirse como un único binario.

---

## Stack tecnológico

| Capa | Tecnología |
|-------|-----------|
| Framework CLI | Cobra |
| Configuración | Viper |
| Cliente HTTP | net/http + retryable-http |
| Salida | charmbracelet/lipgloss (salida de terminal con estilo) |
| Pruebas | testing + testify |
| Compilación | GoReleaser |
| Distribución | Homebrew tap + GitHub Releases |

---

## Comandos principales

```bash
go run ./cmd/mytool help          # Ejecutar en desarrollo
go build -o mytool ./cmd/mytool   # Compilar binario
go test ./...                     # Todas las pruebas
go test ./... -race               # Detector de condiciones de carrera
go vet ./...                      # Análisis estático
goreleaser build --snapshot       # Probar compilación de release
goreleaser release                # Release completo (requiere tag)
```

---

## Estructura del proyecto

```
mytool/
├── cmd/
│   └── mytool/
│       └── main.go               # Punto de entrada — llama a root.Execute()
├── internal/
│   ├── cmd/
│   │   ├── root.go               # Comando raíz de Cobra + flags globales
│   │   ├── config.go             # Subcomando config
│   │   ├── run.go                # Subcomando run
│   │   └── version.go            # Subcomando version
│   ├── config/
│   │   └── config.go             # Cargador de configuración con Viper
│   ├── client/
│   │   └── client.go             # Cliente API
│   └── output/
│       └── output.go             # Utilidades de salida de terminal (lipgloss)
├── .goreleaser.yml
├── go.mod
└── go.sum
```

---

## Patrones fundamentales

### Comando raíz con flags persistentes
```go
// internal/cmd/root.go
var rootCmd = &cobra.Command{
    Use:   "mytool",
    Short: "A CLI tool for...",
    PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
        return config.Load(cfgFile)  // Cargar config antes de cualquier subcomando
    },
}

func Execute() {
    if err := rootCmd.Execute(); err != nil {
        fmt.Fprintln(os.Stderr, err)
        os.Exit(1)
    }
}

func init() {
    rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default: ~/.mytool.yaml)")
    rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "verbose output")
    viper.BindPFlag("verbose", rootCmd.PersistentFlags().Lookup("verbose"))
}
```

### Carga de configuración con Viper
```go
// internal/config/config.go
type Config struct {
    APIKey   string `mapstructure:"api_key"`
    Endpoint string `mapstructure:"endpoint"`
    Timeout  int    `mapstructure:"timeout"`
}

func Load(cfgFile string) error {
    if cfgFile != "" {
        viper.SetConfigFile(cfgFile)
    } else {
        home, _ := os.UserHomeDir()
        viper.AddConfigPath(home)
        viper.SetConfigName(".mytool")
        viper.SetConfigType("yaml")
    }
    viper.SetEnvPrefix("MYTOOL")
    viper.AutomaticEnv()             // MYTOOL_API_KEY → api_key
    viper.SetDefault("timeout", 30)

    if err := viper.ReadInConfig(); err != nil {
        if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
            return fmt.Errorf("config: %w", err)
        }
    }
    return nil
}

func Get() (*Config, error) {
    var cfg Config
    return &cfg, viper.Unmarshal(&cfg)
}
```

### Subcomando con validación de argumentos
```go
// internal/cmd/run.go
var runCmd = &cobra.Command{
    Use:   "run [target]",
    Short: "Run the tool against a target",
    Args:  cobra.ExactArgs(1),
    RunE: func(cmd *cobra.Command, args []string) error {
        cfg, err := config.Get()
        if err != nil {
            return err
        }
        return runAction(args[0], cfg)
    },
}

func runAction(target string, cfg *config.Config) error {
    client := client.New(cfg)
    result, err := client.Process(context.Background(), target)
    if err != nil {
        return fmt.Errorf("processing %s: %w", target, err)
    }
    output.PrintResult(result)
    return nil
}

func init() {
    rootCmd.AddCommand(runCmd)
    runCmd.Flags().IntP("count", "n", 10, "number of results")
}
```

### Códigos de salida
```go
// cmd/mytool/main.go — nunca llamar os.Exit() desde Cobra RunE
// Cobra gestiona el código de salida 1 en caso de error automáticamente
// Para códigos de salida específicos:
func main() {
    if err := cmd.Execute(); err != nil {
        var exitErr *ExitError
        if errors.As(err, &exitErr) {
            os.Exit(exitErr.Code)
        }
        os.Exit(1)
    }
}
```

### Pruebas de comandos CLI
```go
// internal/cmd/run_test.go
func TestRunCommand(t *testing.T) {
    // Ejecutar comando en proceso — no se necesita subproceso
    cmd := NewRootCmd()
    buf := new(bytes.Buffer)
    cmd.SetOut(buf)
    cmd.SetErr(buf)
    cmd.SetArgs([]string{"run", "test-target", "--count", "5"})

    err := cmd.Execute()
    assert.NoError(t, err)
    assert.Contains(t, buf.String(), "test-target")
}
```

---

## Configuración de GoReleaser

```yaml
# .goreleaser.yml
builds:
  - main: ./cmd/mytool
    binary: mytool
    env: [CGO_ENABLED=0]
    goos: [linux, darwin, windows]
    goarch: [amd64, arm64]
    ldflags:
      - -s -w
      - -X main.version={{.Version}}
      - -X main.commit={{.Commit}}

archives:
  - format: tar.gz
    format_overrides:
      - goos: windows
        format: zip

brews:
  - repository:
      owner: YourOrg
      name: homebrew-tap
    homepage: https://github.com/YourOrg/mytool
    description: "A CLI tool for..."
```

---

## Antipatrones — NO hacer

- **Nunca usar `os.Exit()` dentro de `RunE` de Cobra** — devolver un error en su lugar; Cobra gestiona los códigos de salida
- **Nunca usar `panic` ante errores de entrada del usuario** — devolver un error descriptivo con `fmt.Errorf`
- **Nunca codificar rutas de configuración de forma fija** — siempre admitir el flag `--config` + fallback a `$XDG_CONFIG_HOME`
- **Nunca escribir en stdout desde funciones de biblioteca** — pasar `io.Writer` o devolver datos; solo la capa `cmd/` escribe en la salida
- **Nunca omitir `context.Context`** en ninguna función que realice E/S — permite timeout y cancelación

---

## Variables de entorno

Todas las variables de entorno tienen el prefijo `MYTOOL_` y se mapean a claves de configuración:

```
MYTOOL_API_KEY=...
MYTOOL_ENDPOINT=https://api.example.com
MYTOOL_TIMEOUT=30
MYTOOL_VERBOSE=true
```

---

## Agregar un nuevo subcomando

1. Crear `internal/cmd/newcmd.go` con `var newCmd = &cobra.Command{...}`
2. Agregar `rootCmd.AddCommand(newCmd)` en `init()`
3. Agregar los nuevos campos de configuración necesarios en `internal/config/config.go`
4. Escribir pruebas en `internal/cmd/newcmd_test.go` usando el patrón `cmd.SetArgs()`
5. Actualizar la salida de `--help` en los campos `Short` y `Long`
