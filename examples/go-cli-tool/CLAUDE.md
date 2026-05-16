# CLAUDE.md — Go CLI Tool

A production-quality Go CLI application. Uses Cobra for command structure, Viper for configuration, and follows the standard Go project layout. Built to be distributed as a single binary.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| CLI framework | Cobra |
| Configuration | Viper |
| HTTP client | net/http + retryable-http |
| Output | charmbracelet/lipgloss (styled terminal output) |
| Testing | testing + testify |
| Build | GoReleaser |
| Distribution | Homebrew tap + GitHub Releases |

---

## Key Commands

```bash
go run ./cmd/mytool help          # Run in dev
go build -o mytool ./cmd/mytool   # Build binary
go test ./...                     # All tests
go test ./... -race               # Race detector
go vet ./...                      # Static analysis
goreleaser build --snapshot       # Test release build
goreleaser release                # Full release (requires tag)
```

---

## Project Structure

```
mytool/
├── cmd/
│   └── mytool/
│       └── main.go               # Entry point — calls root.Execute()
├── internal/
│   ├── cmd/
│   │   ├── root.go               # Root Cobra command + global flags
│   │   ├── config.go             # config subcommand
│   │   ├── run.go                # run subcommand
│   │   └── version.go            # version subcommand
│   ├── config/
│   │   └── config.go             # Viper config loader
│   ├── client/
│   │   └── client.go             # API client
│   └── output/
│       └── output.go             # Terminal output helpers (lipgloss)
├── .goreleaser.yml
├── go.mod
└── go.sum
```

---

## Core Patterns

### Root command with persistent flags
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

### Config loading with Viper
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

### Subcommand with args validation
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

### Exit codes
```go
// cmd/mytool/main.go — never call os.Exit() from cobra RunE
// cobra handles exit code 1 on error automatically
// For specific exit codes:
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

### Testing CLI commands
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

## GoReleaser config

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

## Anti-Patterns — Do NOT

- **Never use `os.Exit()` inside Cobra `RunE`** — return an error instead; Cobra handles exit codes
- **Never `panic` on user input errors** — return a descriptive error with `fmt.Errorf`
- **Never hardcode config paths** — always support `--config` flag + `$XDG_CONFIG_HOME` fallback
- **Never write to stdout in library functions** — pass `io.Writer` or return data; only `cmd/` layer writes output
- **Never skip `context.Context`** on any function that does I/O — it enables timeout and cancellation

---

## Environment Variables

All environment variables are prefixed with `MYTOOL_` and map to config keys:

```
MYTOOL_API_KEY=...
MYTOOL_ENDPOINT=https://api.example.com
MYTOOL_TIMEOUT=30
MYTOOL_VERBOSE=true
```

---

## Adding a New Subcommand

1. Create `internal/cmd/newcmd.go` with a `var newCmd = &cobra.Command{...}`
2. Add `rootCmd.AddCommand(newCmd)` in `init()`
3. Add any new config fields to `internal/config/config.go`
4. Write tests in `internal/cmd/newcmd_test.go` using `cmd.SetArgs()` pattern
5. Update `--help` output in the `Short` and `Long` fields
