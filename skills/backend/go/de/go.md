> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../go.md).

# Go Skill

## Wann aktivieren
- Einen Go-HTTP-Service oder ein CLI-Tool bauen
- Ein Go-Projekt mit `cmd/`, `internal/`, `pkg/` strukturieren
- HTTP-Handler mit `net/http`, chi oder gin schreiben
- Interfaces, Einbettung und Kompositionsmuster implementieren
- Parallelen Code mit Goroutines, Channels und `sync`-Primitiven schreiben
- Fehlerbehandlung, -umschließung und Sentinel-Fehler
- Tabellengetriebene Tests schreiben

## Wann NICHT verwenden
- Node.js-, Python- oder andere Sprachdienste — andere Ökosysteme
- Protobuf/gRPC-Dienste ohne vorherigen gRPC-Setup-Kontext
- Reine Skript-Aufgaben — Shell oder Python sind besser geeignet

## Anweisungen

### Projektlayout
```
myapp/
├── cmd/
│   └── server/
│       └── main.go         # Einstiegspunkt — dünn, verbindet und startet nur
├── internal/               # Private Pakete — nicht extern importierbar
│   ├── config/
│   ├── handler/
│   ├── service/
│   └── store/
├── pkg/                    # Öffentliche Pakete — von anderen Modulen importierbar
│   └── apierr/
├── go.mod
└── go.sum
```

### main.go — nur Verkabelung
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

### Fehlerbehandlung
```go
// Sentinel-Fehler für erwartete Bedingungen definieren
var (
    ErrNotFound   = errors.New("not found")
    ErrDuplicate  = errors.New("duplicate entry")
    ErrForbidden  = errors.New("forbidden")
)

// Fehler mit Kontext umschließen — %w verwenden, um das Entpacken zu erhalten
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

// Aufrufer prüft Verhalten, nicht Nachrichtenstrings
user, err := store.GetByID(ctx, id)
if errors.Is(err, ErrNotFound) {
    http.Error(w, "not found", http.StatusNotFound)
    return
}
```

### HTTP-Handler mit chi
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
// Interfaces dort definieren, wo sie verwendet werden (Verbraucherseite), nicht wo implementiert
// internal/handler/users.go
type UserService interface {
    GetUser(ctx context.Context, id string) (*User, error)
    CreateUser(ctx context.Context, req CreateUserRequest) (*User, error)
}

// Interfaces klein halten — 1-3 Methoden bevorzugen
// io.Reader, io.Writer sind die kanonischen Beispiele

// Einbettung für Komposition
type ReadWriter interface {
    io.Reader
    io.Writer
}
```

### Parallelitätsmuster
```go
// Fan-out mit errgroup
import "golang.org/x/sync/errgroup"

func fetchAll(ctx context.Context, ids []string) ([]*User, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([]*User, len(ids))

    for i, id := range ids {
        i, id := i, id // Schleifenvariablen erfassen
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

// Worker-Pool
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

### Kontext-Weitergabe
```go
// Kontext immer als erstes Argument weitergeben
func (s *Service) DoWork(ctx context.Context, id string) error {
    // ctx an alle nachgelagerten Aufrufe weitergeben
    user, err := s.store.GetByID(ctx, id)
    if err != nil {
        return err
    }
    return s.notifier.Send(ctx, user.Email)
}

// Anfragebezogene Werte im Kontext nur für übergreifende Belange speichern
// (Tracing-IDs, Auth-Info) — niemals für optionale Funktionsparameter
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

### Tabellengetriebene Tests
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

### Logging mit slog
```go
// Strukturiertes Logging — niemals fmt.Println in Produktionscode
slog.Info("request completed", "method", r.Method, "path", r.URL.Path, "status", 200, "duration_ms", elapsed.Milliseconds())
slog.Error("db query failed", "query", "getUserByID", "err", err)

// JSON-Logger in main einrichten
logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelInfo,
}))
slog.SetDefault(logger)
```

## Beispiel

**Benutzer:** Eine Go-HTTP-API für eine To-Do-Liste bauen: Aufgaben erstellen, auflisten und abschließen. PostgreSQL-Backend, chi-Router, strukturiertes Logging, graceful Shutdown.

**Erwartete Ausgabe:**
- `cmd/server/main.go` — verbindet Store, Handler, startet Server mit graceful Shutdown
- `internal/store/task.go` — `TaskStore` mit `Create`, `List`, `Complete`-Methoden, die `database/sql` verwenden
- `internal/handler/tasks.go` — `TaskHandler` mit `Register(r chi.Router)`, JSON-Antworten
- `internal/handler/tasks_test.go` — tabellengetriebene Tests mit einem Mock-Store

---
