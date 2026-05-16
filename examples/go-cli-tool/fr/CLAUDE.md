> 🇫🇷 Version française. [English version](../CLAUDE.md).

# CLAUDE.md — Outil CLI Go

Une application CLI Go de qualité production. Utilise Cobra pour la structure des commandes, Viper pour la configuration, et suit l'organisation standard des projets Go. Conçue pour être distribuée sous forme de binaire unique.

---

## Stack technique

| Couche | Technologie |
|-------|-----------|
| Framework CLI | Cobra |
| Configuration | Viper |
| Client HTTP | net/http + retryable-http |
| Affichage | charmbracelet/lipgloss (sortie terminal stylisée) |
| Tests | testing + testify |
| Build | GoReleaser |
| Distribution | Homebrew tap + GitHub Releases |

---

## Commandes principales

```bash
go run ./cmd/mytool help          # Lancer en développement
go build -o mytool ./cmd/mytool   # Compiler le binaire
go test ./...                     # Tous les tests
go test ./... -race               # Détecteur de races
go vet ./...                      # Analyse statique
goreleaser build --snapshot       # Tester le build de release
goreleaser release                # Release complète (nécessite un tag)
```

---

## Structure du projet

```
mytool/
├── cmd/
│   └── mytool/
│       └── main.go               # Point d'entrée — appelle root.Execute()
├── internal/
│   ├── cmd/
│   │   ├── root.go               # Commande Cobra racine + flags globaux
│   │   ├── config.go             # Sous-commande config
│   │   ├── run.go                # Sous-commande run
│   │   └── version.go            # Sous-commande version
│   ├── config/
│   │   └── config.go             # Chargeur de configuration Viper
│   ├── client/
│   │   └── client.go             # Client API
│   └── output/
│       └── output.go             # Utilitaires de sortie terminal (lipgloss)
├── .goreleaser.yml
├── go.mod
└── go.sum
```

---

## Patterns fondamentaux

### Commande racine avec flags persistants
```go
// internal/cmd/root.go
var rootCmd = &cobra.Command{
    Use:   "mytool",
    Short: "A CLI tool for...",
    PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
        return config.Load(cfgFile)  // Charger la config avant toute sous-commande
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

### Chargement de la configuration avec Viper
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

### Sous-commande avec validation des arguments
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

### Codes de sortie
```go
// cmd/mytool/main.go — ne jamais appeler os.Exit() depuis cobra RunE
// cobra gère automatiquement le code de sortie 1 en cas d'erreur
// Pour des codes de sortie spécifiques :
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

### Tests des commandes CLI
```go
// internal/cmd/run_test.go
func TestRunCommand(t *testing.T) {
    // Exécuter la commande en cours de processus — pas besoin de sous-processus
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

## Configuration GoReleaser

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

## Anti-patterns — À ne PAS faire

- **Ne jamais utiliser `os.Exit()` dans `RunE` de Cobra** — retourner une erreur à la place ; Cobra gère les codes de sortie
- **Ne jamais utiliser `panic` sur des erreurs de saisie utilisateur** — retourner une erreur descriptive avec `fmt.Errorf`
- **Ne jamais coder en dur les chemins de configuration** — toujours prendre en charge le flag `--config` + le repli sur `$XDG_CONFIG_HOME`
- **Ne jamais écrire sur stdout dans des fonctions de bibliothèque** — passer un `io.Writer` ou retourner des données ; seule la couche `cmd/` écrit la sortie
- **Ne jamais omettre `context.Context`** sur toute fonction effectuant des I/O — cela permet la gestion du timeout et l'annulation

---

## Variables d'environnement

Toutes les variables d'environnement sont préfixées par `MYTOOL_` et correspondent aux clés de configuration :

```
MYTOOL_API_KEY=...
MYTOOL_ENDPOINT=https://api.example.com
MYTOOL_TIMEOUT=30
MYTOOL_VERBOSE=true
```

---

## Ajouter une nouvelle sous-commande

1. Créer `internal/cmd/newcmd.go` avec un `var newCmd = &cobra.Command{...}`
2. Ajouter `rootCmd.AddCommand(newCmd)` dans `init()`
3. Ajouter les nouveaux champs de configuration dans `internal/config/config.go`
4. Écrire les tests dans `internal/cmd/newcmd_test.go` en utilisant le pattern `cmd.SetArgs()`
5. Mettre à jour la sortie `--help` dans les champs `Short` et `Long`
