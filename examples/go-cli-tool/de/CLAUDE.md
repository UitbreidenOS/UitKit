> 🇩🇪 Deutsche Version. [Englische Version](../CLAUDE.md).

# CLAUDE.md — Go CLI-Tool

Eine produktionsreife Go CLI-Anwendung. Verwendet Cobra für die Befehlsstruktur, Viper für die Konfiguration und folgt dem Standard-Go-Projektlayout. Entwickelt zur Verteilung als einzelne Binärdatei.

---

## Tech-Stack

| Schicht | Technologie |
|---------|------------|
| CLI-Framework | Cobra |
| Konfiguration | Viper |
| HTTP-Client | net/http + retryable-http |
| Ausgabe | charmbracelet/lipgloss (gestaltete Terminal-Ausgabe) |
| Testing | testing + testify |
| Build | GoReleaser |
| Verteilung | Homebrew tap + GitHub Releases |

---

## Wichtige Befehle

```bash
go run ./cmd/mytool help          # Im Entwicklungsmodus ausführen
go build -o mytool ./cmd/mytool   # Binärdatei erstellen
go test ./...                     # Alle Tests
go test ./... -race               # Race-Detector
go vet ./...                      # Statische Analyse
goreleaser build --snapshot       # Release-Build testen
goreleaser release                # Vollständiger Release (erfordert Tag)
```

---

## Projektstruktur

```
mytool/
├── cmd/
│   └── mytool/
│       └── main.go               # Einstiegspunkt — ruft root.Execute() auf
├── internal/
│   ├── cmd/
│   │   ├── root.go               # Root Cobra-Befehl + globale Flags
│   │   ├── config.go             # config-Unterbefehl
│   │   ├── run.go                # run-Unterbefehl
│   │   └── version.go            # version-Unterbefehl
│   ├── config/
│   │   └── config.go             # Viper-Konfigurations-Loader
│   ├── client/
│   │   └── client.go             # API-Client
│   └── output/
│       └── output.go             # Terminal-Ausgabe-Hilfsfunktionen (lipgloss)
├── .goreleaser.yml
├── go.mod
└── go.sum
```

---

## Kernmuster

### Root-Befehl mit persistenten Flags
```go
// internal/cmd/root.go
var rootCmd = &cobra.Command{
    Use:   "mytool",
    Short: "A CLI tool for...",
    PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
        return config.Load(cfgFile)  // Load config before any subcommand
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

### Konfiguration laden mit Viper
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

### Unterbefehl mit Argumentvalidierung
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

### Exit-Codes
```go
// cmd/mytool/main.go — niemals os.Exit() aus cobra RunE aufrufen
// cobra verwaltet Exit-Code 1 bei Fehlern automatisch
// Für spezifische Exit-Codes:
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

### CLI-Befehle testen
```go
// internal/cmd/run_test.go
func TestRunCommand(t *testing.T) {
    // Befehl im gleichen Prozess ausführen — kein Subprocess benötigt
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

## GoReleaser-Konfiguration

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

## Anti-Muster — NICHT tun

- **Niemals `os.Exit()` innerhalb von Cobra `RunE` verwenden** — stattdessen einen Fehler zurückgeben; Cobra verwaltet Exit-Codes
- **Niemals bei Benutzereingabe-Fehlern `panic`** — einen beschreibenden Fehler mit `fmt.Errorf` zurückgeben
- **Niemals Konfigurationspfade hardcoden** — immer `--config`-Flag + `$XDG_CONFIG_HOME`-Fallback unterstützen
- **Niemals in Bibliotheksfunktionen auf stdout schreiben** — `io.Writer` übergeben oder Daten zurückgeben; nur die `cmd/`-Schicht schreibt Ausgaben
- **Niemals `context.Context` weglassen** bei Funktionen, die I/O durchführen — ermöglicht Timeout und Abbruch

---

## Umgebungsvariablen

Alle Umgebungsvariablen tragen das Präfix `MYTOOL_` und werden auf Konfigurationsschlüssel abgebildet:

```
MYTOOL_API_KEY=...
MYTOOL_ENDPOINT=https://api.example.com
MYTOOL_TIMEOUT=30
MYTOOL_VERBOSE=true
```

---

## Einen neuen Unterbefehl hinzufügen

1. `internal/cmd/newcmd.go` mit `var newCmd = &cobra.Command{...}` erstellen
2. `rootCmd.AddCommand(newCmd)` in `init()` hinzufügen
3. Neue Konfigurationsfelder zu `internal/config/config.go` hinzufügen
4. Tests in `internal/cmd/newcmd_test.go` mit dem `cmd.SetArgs()`-Muster schreiben
5. `--help`-Ausgabe in den `Short`- und `Long`-Feldern aktualisieren
