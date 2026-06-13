> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../go.md).

# Skill de Go

## Cuándo activar
- Construir un servicio HTTP o herramienta CLI en Go
- Estructurar un proyecto Go con `cmd/`, `internal/`, `pkg/`
- Escribir manejadores HTTP con `net/http`, chi o gin
- Implementar interfaces, embedding y patrones de composición
- Escribir código concurrente con goroutines, canales y primitivas `sync`
- Manejo de errores, wrapping y errores centinela
- Escribir pruebas orientadas a tablas

## Cuándo NO usar
- Servicios en Node.js, Python u otros lenguajes — ecosistemas diferentes
- Servicios Protobuf/gRPC sin contexto previo de configuración gRPC
- Tareas puras de scripting — shell o Python son mejores opciones

## Instrucciones

### Estructura del proyecto
```
myapp/
├── cmd/
│   └── server/
│       └── main.go         # Punto de entrada — ligero, solo conecta e inicia
├── internal/               # Paquetes privados — no importables externamente
│   ├── config/
│   ├── handler/
│   ├── service/
│   └── store/
├── pkg/                    # Paquetes públicos — importables por otros módulos
│   └── apierr/
├── go.mod
└── go.sum
```

### main.go — solo conexión
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

### Manejo de errores
```go
// Definir errores centinela para condiciones esperadas
var (
    ErrNotFound   = errors.New("not found")
    ErrDuplicate  = errors.New("duplicate entry")
    ErrForbidden  = errors.New("forbidden")
)

// Envolver errores con contexto — usar %w para preservar el unwrapping
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

// El llamador verifica el comportamiento, no los strings de mensaje
user, err := store.GetByID(ctx, id)
if errors.Is(err, ErrNotFound) {
    http.Error(w, "not found", http.StatusNotFound)
    return
}
```

### Manejadores HTTP con chi
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
// Definir interfaces donde se usan (lado consumidor), no donde se implementan
// internal/handler/users.go
type UserService interface {
    GetUser(ctx context.Context, id string) (*User, error)
    CreateUser(ctx context.Context, req CreateUserRequest) (*User, error)
}

// Mantener interfaces pequeñas — preferiblemente 1-3 métodos
// io.Reader, io.Writer son los ejemplos canónicos

// Embedding para composición
type ReadWriter interface {
    io.Reader
    io.Writer
}
```

### Patrones de concurrencia
```go
// Fan-out con errgroup
import "golang.org/x/sync/errgroup"

func fetchAll(ctx context.Context, ids []string) ([]*User, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([]*User, len(ids))

    for i, id := range ids {
        i, id := i, id // capturar variables del bucle
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

### Propagación de contexto
```go
// Siempre propaga el contexto como primer argumento
func (s *Service) DoWork(ctx context.Context, id string) error {
    // Pasar ctx a todas las llamadas downstream
    user, err := s.store.GetByID(ctx, id)
    if err != nil {
        return err
    }
    return s.notifier.Send(ctx, user.Email)
}

// Almacena valores con ámbito de solicitud en el contexto solo para preocupaciones transversales
// (IDs de trazado, info de autenticación) — nunca para parámetros de función opcionales
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

### Pruebas orientadas a tablas
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

### Logging con slog
```go
// Logging estructurado — nunca fmt.Println en código de producción
slog.Info("request completed", "method", r.Method, "path", r.URL.Path, "status", 200, "duration_ms", elapsed.Milliseconds())
slog.Error("db query failed", "query", "getUserByID", "err", err)

// Configurar logger JSON en main
logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelInfo,
}))
slog.SetDefault(logger)
```

## Ejemplo

**Usuario:** Construir una API HTTP en Go para una lista de tareas: crear, listar y completar tareas. Backend PostgreSQL, router chi, logging estructurado, apagado graceful.

**Salida esperada:**
- `cmd/server/main.go` — conecta store, handler, inicia el servidor con apagado graceful
- `internal/store/task.go` — `TaskStore` con métodos `Create`, `List`, `Complete` usando `database/sql`
- `internal/handler/tasks.go` — `TaskHandler` con `Register(r chi.Router)`, respuestas JSON
- `internal/handler/tasks_test.go` — pruebas orientadas a tablas con un store mock

---
