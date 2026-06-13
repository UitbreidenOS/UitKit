> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../go.md).

# Go Skill

## Wanneer te activeren
- Een Go HTTP-service of CLI-tool bouwen
- Een Go-project structureren met `cmd/`, `internal/`, `pkg/`
- HTTP-handlers schrijven met `net/http`, chi of gin
- Interfaces, embedding en compositiepatronen implementeren
- Gelijktijdige code schrijven met goroutines, kanalen en `sync`-primitieven
- Foutafhandeling, inpakking en sentinaelfouten
- Tabelgestuurde tests schrijven

## Wanneer NIET te gebruiken
- Node.js-, Python- of andere taalservices — andere ecosystemen
- Protobuf/gRPC-services zonder voorafgaande gRPC-context
- Pure scripttaken — shell of Python passen beter

## Instructies

### Projectindeling
```
myapp/
├── cmd/
│   └── server/
│       └── main.go         # Ingangspunt — slank, bedraadt en start alleen
├── internal/               # Private packages — niet van buitenaf importeerbaar
│   ├── config/
│   ├── handler/
│   ├── service/
│   └── store/
├── pkg/                    # Publieke packages — importeerbaar door andere modules
│   └── apierr/
├── go.mod
└── go.sum
```

### main.go — alleen bedrading
```go
// cmd/server/main.go
package main

import (
    "context"
    "log/slog"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "myapp/internal/config"
    "myapp/internal/handler"
    "myapp/internal/store"
)

func main() {
    cfg := config.MustLoad()
    db := store.MustConnect(cfg.DatabaseURL)
    defer db.Close()

    mux := handler.NewMux(db, cfg)

    srv := &http.Server{
        Addr:         ":" + cfg.Port,
        Handler:      mux,
        ReadTimeout:  10 * time.Second,
        WriteTimeout: 30 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    go func() {
        slog.Info("server starting", "addr", srv.Addr)
        if err := srv.ListenAndServe(); err != http.ErrServerClosed {
            slog.Error("server error", "err", err)
            os.Exit(1)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()
    srv.Shutdown(ctx)
}
```

### Foutafhandeling
```go
// Definieer sentinaelfouten voor verwachte omstandigheden
var (
    ErrNotFound   = errors.New("not found")
    ErrDuplicate  = errors.New("duplicate entry")
    ErrForbidden  = errors.New("forbidden")
)

// Wikkel fouten in met context — gebruik %w om uitpakken te behouden
func (s *UserStore) GetByID(ctx context.Context, id string) (*User, error) {
    var u User
    err := s.db.QueryRowContext(ctx, `SELECT id, email FROM users WHERE id = $1`, id).
        Scan(&u.ID, &u.Email)
    if errors.Is(err, sql.ErrNoRows) {
        return nil, fmt.Errorf("user %s: %w", id, ErrNotFound)
    }
    if err != nil {
        return nil, fmt.Errorf("user store get: %w", err)
    }
    return &u, nil
}

// Aanroeper controleert gedrag, niet berichtstrings
user, err := store.GetByID(ctx, id)
if errors.Is(err, ErrNotFound) {
    http.Error(w, "not found", http.StatusNotFound)
    return
}
```

### HTTP-handlers met chi
```go
// internal/handler/users.go
type UserHandler struct {
    svc UserService
}

func (h *UserHandler) Register(r chi.Router) {
    r.Get("/users/{id}", h.GetUser)
    r.Post("/users", h.CreateUser)
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    user, err := h.svc.GetUser(r.Context(), id)
    if err != nil {
        renderError(w, err)
        return
    }
    renderJSON(w, http.StatusOK, user)
}

func renderJSON(w http.ResponseWriter, code int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(code)
    json.NewEncoder(w).Encode(v)
}

func renderError(w http.ResponseWriter, err error) {
    switch {
    case errors.Is(err, ErrNotFound):
        http.Error(w, "not found", http.StatusNotFound)
    case errors.Is(err, ErrForbidden):
        http.Error(w, "forbidden", http.StatusForbidden)
    default:
        slog.Error("internal error", "err", err)
        http.Error(w, "internal server error", http.StatusInternalServerError)
    }
}
```

### Interfaces
```go
// Definieer interfaces waar ze worden gebruikt (consumerkant), niet waar geïmplementeerd
// internal/handler/users.go
type UserService interface {
    GetUser(ctx context.Context, id string) (*User, error)
    CreateUser(ctx context.Context, req CreateUserRequest) (*User, error)
}

// Houd interfaces klein — 1-3 methoden voorkeur
// io.Reader, io.Writer zijn de canonieke voorbeelden

// Embedding voor compositie
type ReadWriter interface {
    io.Reader
    io.Writer
}
```

### Gelijktijdigheidspatronen
```go
// Fan-out met errgroup
import "golang.org/x/sync/errgroup"

func fetchAll(ctx context.Context, ids []string) ([]*User, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([]*User, len(ids))

    for i, id := range ids {
        i, id := i, id // vang loopvariabelen
        g.Go(func() error {
            u, err := store.GetByID(ctx, id)
            if err != nil {
                return err
            }
            results[i] = u
            return nil
        })
    }

    if err := g.Wait(); err != nil {
        return nil, err
    }
    return results, nil
}

// Worker-pool
func processJobs(ctx context.Context, jobs <-chan Job) {
    const workers = 10
    var wg sync.WaitGroup
    for range workers {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                if err := process(ctx, job); err != nil {
                    slog.Error("job failed", "id", job.ID, "err", err)
                }
            }
        }()
    }
    wg.Wait()
}
```

### Contextpropagatie
```go
// Geef context altijd door als eerste argument
func (s *Service) DoWork(ctx context.Context, id string) error {
    // Geef ctx door aan alle downstream-aanroepen
    user, err := s.store.GetByID(ctx, id)
    if err != nil {
        return err
    }
    return s.notifier.Send(ctx, user.Email)
}

// Sla aanvraag-scoped waarden op in context alleen voor cross-cutting concerns
// (trace-ID's, auth-info) — nooit voor optionele functieparameters
type contextKey string
const requestIDKey contextKey = "request_id"

func WithRequestID(ctx context.Context, id string) context.Context {
    return context.WithValue(ctx, requestIDKey, id)
}
func GetRequestID(ctx context.Context) string {
    id, _ := ctx.Value(requestIDKey).(string)
    return id
}
```

### Tabelgestuurde tests
```go
func TestGetUser(t *testing.T) {
    tests := []struct {
        name    string
        id      string
        want    *User
        wantErr error
    }{
        {"found", "123", &User{ID: "123", Email: "a@b.com"}, nil},
        {"not found", "999", nil, ErrNotFound},
        {"empty id", "", nil, ErrNotFound},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            svc := newTestService(t)
            got, err := svc.GetUser(context.Background(), tt.id)
            if !errors.Is(err, tt.wantErr) {
                t.Fatalf("err = %v, want %v", err, tt.wantErr)
            }
            if diff := cmp.Diff(tt.want, got); diff != "" {
                t.Errorf("mismatch (-want +got):\n%s", diff)
            }
        })
    }
}
```

### Loggen met slog
```go
// Gestructureerde logging — nooit fmt.Println in productiecode
slog.Info("request completed", "method", r.Method, "path", r.URL.Path, "status", 200, "duration_ms", elapsed.Milliseconds())
slog.Error("db query failed", "query", "getUserByID", "err", err)

// JSON-logger instellen in main
logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelInfo,
}))
slog.SetDefault(logger)
```

## Voorbeeld

**Gebruiker:** Bouw een Go HTTP API voor een takenlijst: aanmaken, ophalen en voltooien van taken. PostgreSQL-backend, chi-router, gestructureerde logging, gracieuze afsluiting.

**Verwachte output:**
- `cmd/server/main.go` — bedraadt store, handler, start server met gracieuze afsluiting
- `internal/store/task.go` — `TaskStore` met `Create`-, `List`-, `Complete`-methoden via `database/sql`
- `internal/handler/tasks.go` — `TaskHandler` met `Register(r chi.Router)`, JSON-antwoorden
- `internal/handler/tasks_test.go` — tabelgestuurde tests met een mock-store

---
