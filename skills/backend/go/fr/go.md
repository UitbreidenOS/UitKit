> 🇫🇷 This is the French translation. [English version](../go.md).

# Compétence Go

## Quand activer
- Construire un service HTTP Go ou un outil CLI
- Structurer un projet Go avec `cmd/`, `internal/`, `pkg/`
- Rédiger des handlers HTTP avec `net/http`, chi, ou gin
- Implémenter des interfaces, de l'embedding et des patterns de composition
- Rédiger du code concurrent avec des goroutines, des channels et des primitives `sync`
- Gestion des erreurs, wrapping et erreurs sentinelles
- Rédiger des tests table-driven

## Quand NE PAS utiliser
- Services Node.js, Python ou autres langages — écosystèmes différents
- Services Protobuf/gRPC sans contexte de configuration gRPC préalable
- Tâches de scripting pur — shell ou Python sont de meilleurs choix

## Instructions

### Structure du projet
```
myapp/
├── cmd/
│   └── server/
│       └── main.go         # Point d'entrée — minimal, câble et démarre seulement
├── internal/               # Packages privés — non importables de l'extérieur
│   ├── config/
│   ├── handler/
│   ├── service/
│   └── store/
├── pkg/                    # Packages publics — importables par d'autres modules
│   └── apierr/
├── go.mod
└── go.sum
```

### main.go — câblage uniquement
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

### Gestion des erreurs
```go
// Définir des erreurs sentinelles pour les conditions attendues
var (
    ErrNotFound   = errors.New("not found")
    ErrDuplicate  = errors.New("duplicate entry")
    ErrForbidden  = errors.New("forbidden")
)

// Envelopper les erreurs avec du contexte — utiliser %w pour préserver le désenveloppement
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

// L'appelant vérifie le comportement, pas les chaînes de message
user, err := store.GetByID(ctx, id)
if errors.Is(err, ErrNotFound) {
    http.Error(w, "not found", http.StatusNotFound)
    return
}
```

### Handlers HTTP avec chi
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
// Définir les interfaces là où elles sont utilisées (côté consommateur), pas là où elles sont implémentées
// internal/handler/users.go
type UserService interface {
    GetUser(ctx context.Context, id string) (*User, error)
    CreateUser(ctx context.Context, req CreateUserRequest) (*User, error)
}

// Garder les interfaces petites — 1-3 méthodes préférées
// io.Reader, io.Writer sont les exemples canoniques

// Embedding pour la composition
type ReadWriter interface {
    io.Reader
    io.Writer
}
```

### Patterns de concurrence
```go
// Fan-out avec errgroup
import "golang.org/x/sync/errgroup"

func fetchAll(ctx context.Context, ids []string) ([]*User, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([]*User, len(ids))

    for i, id := range ids {
        i, id := i, id // capturer les variables de boucle
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

// Pool de workers
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

### Propagation du contexte
```go
// Toujours propaguer le contexte comme premier argument
func (s *Service) DoWork(ctx context.Context, id string) error {
    // Passer ctx à tous les appels en aval
    user, err := s.store.GetByID(ctx, id)
    if err != nil {
        return err
    }
    return s.notifier.Send(ctx, user.Email)
}

// Stocker les valeurs de portée de requête dans le contexte uniquement pour les préoccupations transversales
// (IDs de traçage, informations d'auth) — jamais pour des paramètres de fonction optionnels
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

### Tests table-driven
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

### Logging avec slog
```go
// Logging structuré — jamais fmt.Println dans le code de production
slog.Info("request completed", "method", r.Method, "path", r.URL.Path, "status", 200, "duration_ms", elapsed.Milliseconds())
slog.Error("db query failed", "query", "getUserByID", "err", err)

// Configurer le logger JSON dans main
logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelInfo,
}))
slog.SetDefault(logger)
```

## Exemple

**Utilisateur :** Construire une API HTTP Go pour une liste de tâches : créer, lister et compléter des tâches. Backend PostgreSQL, router chi, logging structuré, arrêt gracieux.

**Sortie attendue :**
- `cmd/server/main.go` — câble le store, le handler, démarre le serveur avec arrêt gracieux
- `internal/store/task.go` — `TaskStore` avec méthodes `Create`, `List`, `Complete` utilisant `database/sql`
- `internal/handler/tasks.go` — `TaskHandler` avec `Register(r chi.Router)`, réponses JSON
- `internal/handler/tasks_test.go` — tests table-driven avec un mock store

---
