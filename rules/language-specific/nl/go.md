> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../go.md).

# Go-regels

## Van toepassing op
Alle Go-bestanden (`*.go`) in elk project.

## Regels

1. **Fouten zijn waarden — wikkel in met `%w`** — `fmt.Errorf("operation failed: %w", err)` behoudt de oorspronkelijke fout voor `errors.Is`- en `errors.As`-controles. Gooi nooit fouten weg met `_`.

2. **Tabelgestuurde tests** — gebruik `[]struct{ name, input, want, wantErr }`-patronen. Elk geval heeft een `t.Run(tt.name, ...)`-subtest. Maakt testgevallen eenvoudig toe te voegen en foutberichten beschrijvend.

3. **Context als eerste argument** — elke functie die I/O doet of blokkeert neemt `ctx context.Context` als eerste parameter. Sla nooit context op in een struct.

4. **Definieer interfaces waar ze worden verbruikt, niet waar geïmplementeerd** — zet de interface in het pakket dat het gebruikt, niet het pakket dat de implementatie biedt. Houdt pakketten ontkoppeld.

5. **Interfaces maximaal 1-3 methoden** — grotere interfaces zijn moeilijker te voldoen en te mocken. Als een interface 8 methoden heeft, overweeg dan te splitsen.

6. **`panic` alleen voor echt onherstelbare programmeursfouten** — ontbrekende vereiste configuratie bij opstarten, geschonden invarianten die nooit mogen voorkomen. Niet voor runtime-fouten zoals "record not found".

7. **Geen naakte returns** — `return x, nil` niet gewoon `return`. Benoemde retourwaarden zijn goed voor documentatie, maar naakte returns verhullen wat er wordt geretourneerd.

8. **`init()` alleen voor bijeffecten op pakketniveau zonder alternatief** — registratiepatronen, driver-init. Nooit voor het laden van configuratie of het opzetten van verbindingen — dat hoort in `main` of een constructor.

9. **`log/slog` voor gestructureerde logging** — `slog.Info("request", "method", r.Method, "path", r.URL.Path)`. `fmt.Println` is alleen voor CLI-output.

10. **`sync.Once` voor luie singleton-initialisatie** — thread-safe, nul overhead na eerste aanroep:
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

11. **Embed, niet erven** — Go heeft geen overerving. Stel typen samen via embedding: `type AdminUser struct { User; AdminLevel int }`. Gebruik interfaces voor polymorfisme.

12. **Vang loopvariabelen expliciet** — in goroutines binnen lussen: `i, v := i, v` vóór de `go func()`. In Go 1.22+ zijn loopvariabelen per iteratie; in eerdere versies zijn ze gedeeld.

13. **`errgroup` voor gelijktijdige operaties met foutpropagatie** — `golang.org/x/sync/errgroup` boven handmatige `WaitGroup` wanneer je fouten moet retourneren vanuit goroutines.

14. **Sentinaelfouten voor verwachte omstandigheden, getypeerde fouten voor gestructureerde fouten** — `var ErrNotFound = errors.New("not found")` voor eenvoudige omstandigheden. Aangepaste fouttypen (die de `error`-interface implementeren) wanneer aanroepers velden moeten inspecteren.

15. **HTTP-handlers krijgen alleen `(w http.ResponseWriter, r *http.Request)`** — bed handlers niet in in structs of gebruik closures voor eenvoudige handlers. Gebruik dependency injection via een handler-struct met een `ServeHTTP`-methode wanneer afhankelijkheden nodig zijn.


---
