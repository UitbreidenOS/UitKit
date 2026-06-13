> 🇫🇷 This is the French translation. [English version](../go.md).

# Règles Go

## S'applique à
Tous les fichiers Go (`*.go`) dans n'importe quel projet.

## Règles

1. **Les erreurs sont des valeurs — envelopper avec `%w`** — `fmt.Errorf("operation failed: %w", err)` préserve l'erreur originale pour les vérifications `errors.Is` et `errors.As`. Ne jamais ignorer les erreurs avec `_`.

2. **Tests table-driven** — utiliser des patterns `[]struct{ name, input, want, wantErr }`. Chaque cas a un sous-test `t.Run(tt.name, ...)`. Facilite l'ajout de cas de test et rend les messages d'échec descriptifs.

3. **Context comme premier argument** — chaque fonction qui fait des I/O ou qui bloque prend `ctx context.Context` comme premier paramètre. Ne jamais stocker le context dans une struct.

4. **Définir les interfaces là où elles sont consommées, pas là où elles sont implémentées** — placer l'interface dans le package qui l'utilise, pas dans le package qui fournit l'implémentation. Garde les packages découplés.

5. **Interfaces de 1-3 méthodes maximum** — les interfaces plus grandes sont plus difficiles à satisfaire et à mocker. Si une interface a 8 méthodes, envisager de la diviser.

6. **`panic` uniquement pour les erreurs de programmeur vraiment irrécupérables** — configuration requise manquante au démarrage, invariants violés qui ne devraient jamais arriver. Pas pour les erreurs runtime comme "record not found".

7. **Pas de retours nus** — `return x, nil` pas juste `return`. Les valeurs de retour nommées sont acceptables pour la documentation, mais les retours nus obscurcissent ce qui est retourné.

8. **`init()` uniquement pour les effets secondaires au niveau package sans alternative** — patterns d'enregistrement, init de driver. Jamais pour charger la config ou établir des connexions — ça appartient à `main` ou un constructeur.

9. **`log/slog` pour le logging structuré** — `slog.Info("request", "method", r.Method, "path", r.URL.Path)`. `fmt.Println` est uniquement pour la sortie CLI.

10. **`sync.Once` pour l'initialisation paresseuse de singleton** — thread-safe, zéro surcoût après le premier appel :
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

11. **Embed plutôt qu'héritage** — Go n'a pas d'héritage. Composer les types via embedding : `type AdminUser struct { User; AdminLevel int }`. Utiliser les interfaces pour le polymorphisme.

12. **Capturer les variables de boucle explicitement** — dans les goroutines à l'intérieur des boucles : `i, v := i, v` avant le `go func()`. En Go 1.22+, les variables de boucle sont par itération ; dans les versions antérieures elles sont partagées.

13. **`errgroup` pour les opérations concurrentes avec propagation d'erreurs** — `golang.org/x/sync/errgroup` plutôt que `WaitGroup` manuel quand vous devez retourner des erreurs depuis des goroutines.

14. **Erreurs sentinelles pour les conditions attendues, erreurs typées pour les erreurs structurées** — `var ErrNotFound = errors.New("not found")` pour les conditions simples. Types d'erreur personnalisés (implémentant l'interface `error`) quand les appelants doivent inspecter des champs.

15. **Les handlers HTTP reçoivent uniquement `(w http.ResponseWriter, r *http.Request)`** — ne pas imbriquer les handlers dans des structs ou utiliser des fermetures pour les handlers simples. Utiliser l'injection de dépendances via une struct handler avec une méthode `ServeHTTP` quand des dépendances sont nécessaires.


---
