> 🇳🇱 Nederlandse versie. [Engelse versie](../CLAUDE.md).

# CLAUDE.md — Go CLI-tool

Een productieklare Go CLI-applicatie. Gebruikt Cobra voor de commandostructuur, Viper voor configuratie en volgt de standaard Go-projectindeling. Gebouwd om als één enkel binair bestand te worden verspreid.

---

## Tech Stack

| Laag | Technologie |
|-------|-----------|
| CLI-framework | Cobra |
| Configuratie | Viper |
| HTTP-client | net/http + retryable-http |
| Uitvoer | charmbracelet/lipgloss (gestileerde terminaluitvoer) |
| Testen | testing + testify |
| Bouwen | GoReleaser |
| Verspreiding | Homebrew tap + GitHub Releases |

---

## Belangrijkste commando's

```bash
go run ./cmd/mytool help          # Uitvoeren in dev
go build -o mytool ./cmd/mytool   # Binair bestand bouwen
go test ./...                     # Alle tests
go test ./... -race               # Race detector
go vet ./...                      # Statische analyse
goreleaser build --snapshot       # Test release-build
goreleaser release                # Volledige release (vereist een tag)
```

---

## Projectstructuur

```
mytool/
├── cmd/
│   └── mytool/
│       └── main.go               # Ingangspunt — roept root.Execute() aan
├── internal/
│   ├── cmd/
│   │   ├── root.go               # Root Cobra-commando + globale vlaggen
│   │   ├── config.go             # config-subcommando
│   │   ├── run.go                # run-subcommando
│   │   └── version.go            # version-subcommando
│   ├── config/
│   │   └── config.go             # Viper-configuratielader
│   ├── client/
│   │   └── client.go             # API-client
│   └── output/
│       └── output.go             # Terminaluitvoer-hulpfuncties (lipgloss)
├── .goreleaser.yml
├── go.mod
└── go.sum
```

---

## Kernpatronen

### Rootcommando met persistente vlaggen
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

### Configuratie laden met Viper
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

### Subcommando met argumentvalidatie
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

### Exitcodes
```go
// cmd/mytool/main.go — roep os.Exit() nooit aan vanuit cobra RunE
// cobra verwerkt exitcode 1 bij een fout automatisch
// Voor specifieke exitcodes:
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

### CLI-commando's testen
```go
// internal/cmd/run_test.go
func TestRunCommand(t *testing.T) {
    // Execute command in-process — no subprocess needed
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

## GoReleaser-configuratie

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

## Anti-patronen — Doe dit NIET

- **Gebruik `os.Exit()` nooit binnen Cobra `RunE`** — geef in plaats daarvan een fout terug; Cobra verwerkt de exitcodes
- **Gebruik `panic` nooit bij gebruikersinvoerfouten** — geef een beschrijvende fout terug met `fmt.Errorf`
- **Codeer configuratiepaden nooit hard** — ondersteuning voor de `--config`-vlag + terugval op `$XDG_CONFIG_HOME` is altijd vereist
- **Schrijf nooit naar stdout in bibliotheekfuncties** — geef een `io.Writer` door of retourneer data; alleen de `cmd/`-laag schrijft uitvoer
- **Sla `context.Context` nooit over** bij functies die I/O uitvoeren — dit maakt time-outs en annulering mogelijk

---

## Omgevingsvariabelen

Alle omgevingsvariabelen beginnen met het voorvoegsel `MYTOOL_` en worden gekoppeld aan configuratiesleutels:

```
MYTOOL_API_KEY=...
MYTOOL_ENDPOINT=https://api.example.com
MYTOOL_TIMEOUT=30
MYTOOL_VERBOSE=true
```

---

## Een nieuw subcommando toevoegen

1. Maak `internal/cmd/newcmd.go` aan met een `var newCmd = &cobra.Command{...}`
2. Voeg `rootCmd.AddCommand(newCmd)` toe in `init()`
3. Voeg nieuwe configuratievelden toe aan `internal/config/config.go`
4. Schrijf tests in `internal/cmd/newcmd_test.go` met het `cmd.SetArgs()`-patroon
5. Werk de `--help`-uitvoer bij in de velden `Short` en `Long`
