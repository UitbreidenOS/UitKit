> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../go.md).

# Reglas de Go

## Aplicar a
Todos los archivos Go (`*.go`) en cualquier proyecto.

## Reglas

1. **Los errores son valores — envuelve con `%w`** — `fmt.Errorf("operation failed: %w", err)` preserva el error original para verificaciones con `errors.Is` y `errors.As`. Nunca descartes errores con `_`.

2. **Pruebas orientadas a tablas** — usa patrones `[]struct{ name, input, want, wantErr }`. Cada caso tiene una sub-prueba `t.Run(tt.name, ...)`. Facilita agregar casos de prueba y hace los mensajes de fallo descriptivos.

3. **Contexto como primer argumento** — cada función que hace I/O o bloquea toma `ctx context.Context` como su primer parámetro. Nunca almacenes el contexto en una estructura.

4. **Define interfaces donde se consumen, no donde se implementan** — pon la interfaz en el paquete que la usa, no en el paquete que proporciona la implementación. Mantiene los paquetes desacoplados.

5. **Máximo 1-3 métodos en las interfaces** — las interfaces más grandes son más difíciles de satisfacer y mockear. Si una interfaz tiene 8 métodos, considera dividirla.

6. **`panic` solo para errores de programador verdaderamente irrecuperables** — configuración requerida faltante al inicio, invariantes violados que nunca deberían ocurrir. No para errores en tiempo de ejecución como "registro no encontrado".

7. **Sin retornos desnudos** — `return x, nil` no solo `return`. Los valores de retorno nombrados están bien para documentación, pero los retornos desnudos oscurecen lo que se devuelve.

8. **`init()` solo para efectos secundarios a nivel de paquete sin alternativa** — patrones de registro, inicialización de drivers. Nunca para cargar configuración o establecer conexiones — eso pertenece a `main` o un constructor.

9. **`log/slog` para logging estructurado** — `slog.Info("request", "method", r.Method, "path", r.URL.Path)`. `fmt.Println` es solo para salida CLI.

10. **`sync.Once` para inicialización lazy de singleton** — seguro para hilos, sin sobrecarga después de la primera llamada:
    ```go
    var (
        instance *DB
        once     sync.Once
    )
    func GetDB() *DB {
        once.Do(func() { instance = newDB() })
        return instance
    }
    ```

11. **Embedding en lugar de herencia** — Go no tiene herencia. Compón tipos mediante embedding: `type AdminUser struct { User; AdminLevel int }`. Usa interfaces para polimorfismo.

12. **Captura las variables del bucle explícitamente** — en goroutines dentro de bucles: `i, v := i, v` antes de `go func()`. En Go 1.22+, las variables del bucle son por iteración; en versiones anteriores son compartidas.

13. **`errgroup` para operaciones concurrentes con propagación de errores** — `golang.org/x/sync/errgroup` sobre `WaitGroup` manual cuando necesitas devolver errores de goroutines.

14. **Errores centinela para condiciones esperadas, errores tipados para errores estructurados** — `var ErrNotFound = errors.New("not found")` para condiciones simples. Tipos de error personalizados (implementando la interfaz `error`) cuando los llamadores necesitan inspeccionar campos.

15. **Los manejadores HTTP obtienen solo `(w http.ResponseWriter, r *http.Request)`** — no embutes manejadores en structs ni uses closures para manejadores simples. Usa inyección de dependencias mediante un struct de manejador con un método `ServeHTTP` cuando se necesitan dependencias.
