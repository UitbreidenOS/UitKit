> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../go.md).

# Go Regeln

## Anwenden auf
Alle Go-Dateien (`*.go`) in jedem Projekt.

## Regeln

1. **Fehler sind Werte — mit `%w` umschließen** — `fmt.Errorf("operation failed: %w", err)` erhält den ursprünglichen Fehler für `errors.Is`- und `errors.As`-Prüfungen. Fehler niemals mit `_` verwerfen.

2. **Tabellengetriebene Tests** — `[]struct{ name, input, want, wantErr }`-Muster verwenden. Jeder Fall hat einen `t.Run(tt.name, ...)`-Untertest. Macht Testfälle leicht erweiterbar und Fehlermeldungen beschreibend.

3. **Context als erstes Argument** — jede Funktion, die I/O durchführt oder blockiert, nimmt `ctx context.Context` als erstes Parameter. Kontext niemals in einer Struct speichern.

4. **Interfaces dort definieren, wo sie konsumiert werden, nicht wo implementiert** — das Interface in das Paket legen, das es verwendet, nicht in das Paket, das die Implementierung bereitstellt. Hält Pakete entkoppelt.

5. **Interfaces maximal 1-3 Methoden** — größere Interfaces sind schwieriger zu erfüllen und zu mocken. Wenn ein Interface 8 Methoden hat, überlegem, es aufzuteilen.

6. **`panic` nur für wirklich nicht behebbare Programmierfehler** — fehlende erforderliche Konfiguration beim Start, verletzte Invarianten, die nie auftreten sollten. Nicht für Laufzeitfehler wie "record not found".

7. **Keine nackten Returns** — `return x, nil` nicht nur `return`. Benannte Rückgabewerte sind für die Dokumentation in Ordnung, aber nackte Returns verschleiern, was zurückgegeben wird.

8. **`init()` nur für Paket-Level-Nebeneffekte ohne Alternative** — Registrierungsmuster, Treiber-Init. Niemals zum Laden von Konfigurationen oder zum Aufbauen von Verbindungen — das gehört in `main` oder einen Konstruktor.

9. **`log/slog` für strukturiertes Logging** — `slog.Info("request", "method", r.Method, "path", r.URL.Path)`. `fmt.Println` nur für CLI-Ausgabe.

10. **`sync.Once` für lazy Singleton-Initialisierung** — threadsicher, null Overhead nach dem ersten Aufruf:
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

11. **Einbetten statt Erben** — Go hat keine Vererbung. Typen durch Einbettung zusammensetzen: `type AdminUser struct { User; AdminLevel int }`. Interfaces für Polymorphismus verwenden.

12. **Schleifenvariablen explizit erfassen** — in Goroutines innerhalb von Schleifen: `i, v := i, v` vor dem `go func()`. In Go 1.22+ sind Schleifenvariablen pro Iteration; in früheren Versionen werden sie geteilt.

13. **`errgroup` für parallele Operationen mit Fehler-Propagierung** — `golang.org/x/sync/errgroup` statt manuellem `WaitGroup`, wenn Fehler von Goroutines zurückgegeben werden müssen.

14. **Sentinel-Fehler für erwartete Bedingungen, typisierte Fehler für strukturierte Fehler** — `var ErrNotFound = errors.New("not found")` für einfache Bedingungen. Benutzerdefinierte Fehlertypen (die das `error`-Interface implementieren), wenn Aufrufer Felder inspizieren müssen.

15. **HTTP-Handler erhalten nur `(w http.ResponseWriter, r *http.Request)`** — Handler nicht in Structs einbetten oder Closures für einfache Handler verwenden. Dependency Injection über eine Handler-Struct mit einer `ServeHTTP`-Methode verwenden, wenn Abhängigkeiten benötigt werden.


---
